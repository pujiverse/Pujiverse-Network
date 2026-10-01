// ============================================================
// PUJIVERSE — Supabase Edge Function: bigquery-sync
// Copies every Supabase table into Google BigQuery (one table each,
// full refresh per run) using free BigQuery load jobs.
//
// Deploy:   supabase functions deploy bigquery-sync --no-verify-jwt
// Secrets:  supabase secrets set GCP_SA_KEY="$(cat service-account.json)" \
//             BQ_PROJECT_ID=your-gcp-project BQ_DATASET=pujiverse BQ_LOCATION=US \
//             CRON_SECRET=some-long-random-string
// Call:     POST /functions/v1/bigquery-sync
//           - from the admin panel (signed-in admin's token), or
//           - from pg_cron with header  x-cron-secret: <CRON_SECRET>
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const TABLES = [
  "channels", "playlists", "videos", "social_links", "websites", "posts",
  "announcements", "site_settings", "subscribers", "lottery_entries",
  "lottery_subscribers", "lottery_history", "messages",
];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// ---------- Google auth (service-account JWT -> access token) ----------
function b64url(data: ArrayBuffer | string) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  let s = ""; bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function googleToken(sa: { client_email: string; private_key: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email, scope: "https://www.googleapis.com/auth/bigquery",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claim}.${b64url(sig)}` }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error("Google auth failed: " + JSON.stringify(j));
  return j.access_token as string;
}

// ---------- BigQuery helpers ----------
async function ensureDataset(token: string, project: string, dataset: string, location: string) {
  const r = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${project}/datasets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ datasetReference: { projectId: project, datasetId: dataset }, location, description: "Pujiverse data mirrored from Supabase" }),
  });
  if (!r.ok && r.status !== 409) throw new Error(`dataset: ${r.status} ${await r.text()}`);
}

// objects / arrays become JSON strings so BigQuery schema detection never breaks
function flatten(row: Record<string, unknown>, syncedAt: string) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = v !== null && typeof v === "object" ? JSON.stringify(v) : v;
  out._synced_at = syncedAt;
  return out;
}

async function loadTable(token: string, project: string, dataset: string, location: string, table: string, rows: Record<string, unknown>[]) {
  const boundary = "pv" + crypto.randomUUID().replace(/-/g, "");
  const meta = {
    configuration: {
      load: {
        destinationTable: { projectId: project, datasetId: dataset, tableId: table },
        sourceFormat: "NEWLINE_DELIMITED_JSON",
        writeDisposition: "WRITE_TRUNCATE",
        createDisposition: "CREATE_IF_NEEDED",
        autodetect: true,
        schemaUpdateOptions: [],
      },
    },
    jobReference: { projectId: project, location },
  };
  const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n${rows.map((r) => JSON.stringify(r)).join("\n")}\r\n--${boundary}--`;
  const r = await fetch(`https://bigquery.googleapis.com/upload/bigquery/v2/projects/${project}/jobs?uploadType=multipart`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
  const job = await r.json();
  if (!r.ok) throw new Error(job.error?.message || r.statusText);
  const id = job.jobReference.jobId;
  for (let i = 0; i < 30; i++) {
    const s = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${project}/jobs/${id}?location=${location}`, { headers: { Authorization: `Bearer ${token}` } });
    const st = await s.json();
    if (st.status?.state === "DONE") {
      if (st.status.errorResult) throw new Error(st.status.errorResult.message);
      return Number(st.statistics?.load?.outputRows || rows.length);
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
  throw new Error("load job timed out (it may still finish in BigQuery)");
}

// ---------- handler ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const cronSecret = Deno.env.get("CRON_SECRET") || "";
  const admin = createClient(url, service, { auth: { persistSession: false } });

  // Who is calling? Either pg_cron with the secret, or the signed-in admin.
  let trigger = "";
  if (cronSecret && req.headers.get("x-cron-secret") === cronSecret) trigger = "cron";
  else {
    const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const { data } = await admin.auth.getUser(jwt);
    const email = data?.user?.email?.toLowerCase();
    if (!email) return json({ error: "Sign in as the admin first" }, 401);
    const { data: ok } = await admin.from("admin_users").select("email").ilike("email", email).maybeSingle();
    if (!ok) return json({ error: "Not an admin" }, 403);
    trigger = "admin:" + email;
  }

  const project = Deno.env.get("BQ_PROJECT_ID");
  const dataset = Deno.env.get("BQ_DATASET") || "pujiverse";
  const location = Deno.env.get("BQ_LOCATION") || "US";
  const saRaw = Deno.env.get("GCP_SA_KEY");
  if (!project || !saRaw) return json({ error: "Missing secrets BQ_PROJECT_ID / GCP_SA_KEY" }, 500);

  let only: string[] | null = null;
  try { const b = await req.json(); if (Array.isArray(b?.tables)) only = b.tables.filter((t: string) => TABLES.includes(t)); } catch { /* no body */ }

  const { data: run } = await admin.from("bq_sync_runs").insert({ trigger }).select("id").single();
  const results: Record<string, { rows?: number; skipped?: string; error?: string }> = {};
  let allOk = true;
  try {
    const token = await googleToken(JSON.parse(saRaw));
    await ensureDataset(token, project, dataset, location);
    const syncedAt = new Date().toISOString();
    for (const t of only || TABLES) {
      try {
        const rows: Record<string, unknown>[] = [];
        for (let from = 0; ; from += 1000) {
          const { data, error } = await admin.from(t).select("*").range(from, from + 999);
          if (error) throw error;
          rows.push(...(data || []));
          if (!data || data.length < 1000) break;
        }
        if (!rows.length) { results[t] = { rows: 0, skipped: "empty table" }; continue; }
        results[t] = { rows: await loadTable(token, project, dataset, location, t, rows.map((r) => flatten(r, syncedAt))) };
      } catch (e) { allOk = false; results[t] = { error: String((e as Error).message || e) }; }
    }
  } catch (e) {
    allOk = false; results._fatal = { error: String((e as Error).message || e) };
  }
  if (run?.id) await admin.from("bq_sync_runs").update({ finished_at: new Date().toISOString(), ok: allOk, summary: results }).eq("id", run.id);
  return json({ ok: allOk, dataset: `${project}.${dataset}`, results }, allOk ? 200 : 207);
});
