// ============================================================
// PUJIVERSE NETWORK — Supabase Service Layer
// Centralises all DB reads/writes + Excel import.
// Falls back to localStorage when Supabase is unavailable.
// ============================================================

const PVDB = (function () {
  let client = null;

  function setClient(c) { client = c; }
  function ready() { return !!client; }

  // ---- generic helpers ----
  async function selectAll(table, opts = {}) {
    if (!client) return { data: lsGet(table), error: null, local: true };
    let q = client.from(table).select('*');
    if (opts.eq) for (const [k, v] of Object.entries(opts.eq)) q = q.eq(k, v);
    if (opts.order) q = q.order(opts.order, { ascending: opts.asc !== false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) return { data: lsGet(table), error, local: true };
    if (data) lsSet(table, data);
    return { data: data || [], error: null, local: false };
  }

  async function insert(table, rows) {
    if (!client) { lsAppend(table, rows); return { error: null, local: true }; }
    const { data, error } = await client.from(table).insert(rows).select();
    return { data, error, local: false };
  }

  async function upsert(table, rows, onConflict) {
    if (!client) { lsAppend(table, rows); return { error: null, local: true }; }
    const { data, error } = await client.from(table).upsert(rows, onConflict ? { onConflict } : undefined).select();
    return { data, error, local: false };
  }

  async function update(table, id, patch) {
    if (!client) return { error: null, local: true };
    const { data, error } = await client.from(table).update(patch).eq('id', id).select();
    return { data, error };
  }

  async function remove(table, id) {
    if (!client) return { error: null, local: true };
    const { error } = await client.from(table).delete().eq('id', id);
    return { error };
  }

  // ---- localStorage fallback ----
  function lsKey(t) { return 'pvdb_' + t; }
  function lsGet(t) { try { return JSON.parse(localStorage.getItem(lsKey(t)) || '[]'); } catch { return []; } }
  function lsSet(t, arr) { try { localStorage.setItem(lsKey(t), JSON.stringify(arr)); } catch {} }
  function lsAppend(t, rows) {
    const cur = lsGet(t);
    const list = Array.isArray(rows) ? rows : [rows];
    list.forEach(r => cur.push({ id: 'local_' + Math.random().toString(36).slice(2), created_at: new Date().toISOString(), ...r }));
    lsSet(t, cur);
  }

  // ---- Excel import (expects SheetJS `XLSX` global) ----
  // Returns { summary: {table: count}, errors: [] }
  async function importWorkbook(arrayBuffer) {
    if (typeof XLSX === 'undefined') throw new Error('SheetJS (XLSX) not loaded');
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetMap = {
      Channels:      { table: 'channels',        conflict: 'sno',
        map: r => ({ sno: s(r.sno), name: s(r.name), handle: s(r.handle), category: s(r.category) }) },
      Videos:        { table: 'videos',
        map: r => ({ channel_sno: s(r.channel_sno), playlist: s(r.playlist), title: s(r.title),
          description: s(r.description), url: s(r.url), status: s(r.status) || 'upcoming',
          scheduled_at: dt(r.scheduled_at), views: n(r.views), likes: n(r.likes),
          comments: n(r.comments), is_popular: b(r.is_popular), thumbnail_url: s(r.thumbnail_url) }) },
      Subscribers:   { table: 'subscribers',
        map: r => ({ channel_sno: s(r.channel_sno), name: s(r.name), email: s(r.email),
          source: s(r.source), joined_at: dt(r.joined_at), is_member: b(r.is_member), notes: s(r.notes) }) },
      Announcements: { table: 'announcements',
        map: r => ({ channel_sno: s(r.channel_sno) || null, title: s(r.title), body: s(r.body),
          link: s(r.link), pinned: b(r.pinned), published_at: dt(r.published_at) }) },
      Posts:         { table: 'posts',
        map: r => ({ channel_sno: s(r.channel_sno) || null, platform: s(r.platform), title: s(r.title),
          body: s(r.body), link: s(r.link), posted_at: dt(r.posted_at) }) },
      Lottery:       { table: 'lottery_entries',
        map: r => ({ channel_sno: s(r.channel_sno), name: s(r.name), email: s(r.email),
          ticket: s(r.ticket), numbers: s(r.numbers), entered_at: dt(r.entered_at),
          is_winner: b(r.is_winner), prize: s(r.prize) }) },
    };
    const summary = {}; const errors = [];
    for (const [sheetName, cfg] of Object.entries(sheetMap)) {
      if (!wb.SheetNames.includes(sheetName)) continue;
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });
      const clean = rows.map(cfg.map).filter(r => {
        // require a meaningful field
        return r.title || r.name || r.sno || r.email || r.link;
      });
      if (!clean.length) { summary[cfg.table] = 0; continue; }
      let res;
      if (cfg.conflict) res = await upsert(cfg.table, clean, cfg.conflict);
      else res = await insert(cfg.table, clean);
      if (res.error) errors.push(`${sheetName}: ${res.error.message || res.error}`);
      summary[cfg.table] = clean.length;
    }
    return { summary, errors };
  }

  // coercion helpers
  function s(v) { return v == null ? '' : String(v).trim(); }
  function n(v) { const x = Number(v); return isNaN(x) ? 0 : x; }
  function b(v) { return v === true || /^(true|yes|1)$/i.test(String(v).trim()); }
  function dt(v) {
    if (!v) return null;
    if (v instanceof Date) return v.toISOString();
    const d = new Date(v);
    return isNaN(d) ? null : d.toISOString();
  }

  return { setClient, ready, selectAll, insert, upsert, update, remove, importWorkbook, lsGet };
})();
