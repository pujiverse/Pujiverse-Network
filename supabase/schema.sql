-- ============================================================
-- PUJIVERSE — COMPLETE SUPABASE SETUP (v2026-10)
-- Run the WHOLE script once in Supabase -> SQL Editor. Safe to re-run.
-- Creates every table the site uses, keeps all columns the admin panel,
-- Excel import and Sheets sync write, and locks writes to YOUR admin login.
-- ============================================================

-- 0. ADMIN ALLOW-LIST — only these emails can change data.
--    1) Authentication -> Users -> Add user (email + password)
--    2) Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up"
CREATE TABLE IF NOT EXISTS admin_users (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);
INSERT INTO admin_users (email) VALUES ('pujiverse@gmail.com') ON CONFLICT DO NOTHING;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- shared trigger: keep updated_at fresh (used for BigQuery sync)
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 1. CHANNELS (39) ---------------------------------------------
CREATE TABLE IF NOT EXISTS channels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sno text UNIQUE NOT NULL,
  channel_name text,
  name text,
  handle text,
  category text,
  group_name text,
  youtube_url text,
  viral_score integer DEFAULT 0,
  score integer,
  cpm_tier text DEFAULT 'Medium',
  team_size integer DEFAULT 1,
  status text DEFAULT 'LIVE',
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE channels ALTER COLUMN channel_name DROP NOT NULL;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS group_name text;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS score integer;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
-- keep name / channel_name and score / viral_score in step (admin and Excel use different names)
CREATE OR REPLACE FUNCTION public.channels_sync_cols() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.channel_name := coalesce(NEW.channel_name, NEW.name);
  NEW.name := coalesce(NEW.name, NEW.channel_name);
  NEW.viral_score := coalesce(NEW.viral_score, NEW.score, 0);
  NEW.score := coalesce(NEW.score, NEW.viral_score);
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS channels_sync ON channels;
CREATE TRIGGER channels_sync BEFORE INSERT OR UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION channels_sync_cols();

-- 2. PLAYLISTS -------------------------------------------------
CREATE TABLE IF NOT EXISTS playlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_sno text REFERENCES channels(sno) ON UPDATE CASCADE ON DELETE CASCADE,
  playlist_name text NOT NULL,
  description text,
  playlist_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS playlists_channel_name_uq ON playlists (channel_sno, playlist_name);

-- 3. VIDEOS (admin form + Excel import columns) ----------------
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id uuid REFERENCES playlists(id) ON DELETE SET NULL,
  channel_sno text,
  playlist_index integer,
  playlist_name text,
  playlist text,
  title text NOT NULL,
  video_url text,
  url text,
  thumbnail_url text,
  description text,
  status text DEFAULT 'published',
  scheduled_at timestamptz,
  views bigint DEFAULT 0,
  likes bigint DEFAULT 0,
  comments bigint DEFAULT 0,
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS playlist text;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS views bigint DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes bigint DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS comments bigint DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
CREATE OR REPLACE FUNCTION public.videos_sync_cols() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.url := coalesce(NEW.url, NEW.video_url);
  NEW.video_url := coalesce(NEW.video_url, NEW.url);
  NEW.playlist := coalesce(NEW.playlist, NEW.playlist_name);
  NEW.playlist_name := coalesce(NEW.playlist_name, NEW.playlist);
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS videos_sync ON videos;
CREATE TRIGGER videos_sync BEFORE INSERT OR UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION videos_sync_cols();
CREATE INDEX IF NOT EXISTS videos_channel_idx ON videos (channel_sno);

-- 4. SOCIAL LINKS (36) -----------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  handle text,
  url text,
  icon_key text,
  brand_color text,
  group_name text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS group_name text;
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 5. WEBSITES (29 live) ----------------------------------------
CREATE TABLE IF NOT EXISTS websites (
  id text PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  category text,
  tech text,
  host text,
  repo text,
  mirrors text[],
  tags text[],
  accent text,
  is_live boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE websites ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS tech text;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS host text;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS repo text;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS mirrors text[];
ALTER TABLE websites ADD COLUMN IF NOT EXISTS is_live boolean DEFAULT true;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 6. POSTS (admin posts + Excel import) ------------------------
CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  channel_sno text,
  title text NOT NULL,
  url text,
  link text,
  platform text,
  cover text,
  summary text,
  body text,
  post_date date,
  posted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE posts ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE posts ALTER COLUMN url DROP NOT NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS channel_sno text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS body text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS posted_at timestamptz;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 7. ANNOUNCEMENTS (moon: Announcements) -----------------------
CREATE TABLE IF NOT EXISTS announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_sno text,
  title text NOT NULL,
  body text,
  link text,
  pinned boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. SUBSCRIBERS (private) -------------------------------------
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_sno text,
  name text,
  email text,
  source text,
  joined_at timestamptz,
  is_member boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. LOTTERY ENTRIES (private; only winners are shown publicly via a view)
CREATE TABLE IF NOT EXISTS lottery_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_sno text,
  name text,
  email text,
  ticket text,
  numbers text,
  entered_at timestamptz DEFAULT now(),
  is_winner boolean DEFAULT false,
  prize text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. LOTTERY SUBSCRIBERS (private, per-channel draw pool) -----
CREATE TABLE IF NOT EXISTS lottery_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_id text,
  channel_sno text,
  name text NOT NULL,
  handle text,
  email text,
  subscriber_id text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE lottery_subscribers ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 11. LOTTERY HISTORY (private) --------------------------------
CREATE TABLE IF NOT EXISTS lottery_history (
  history_id text PRIMARY KEY,
  channel_name text,
  channel_sno text,
  draw_date text,
  pool_size integer,
  winner_count integer,
  winners jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE lottery_history ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 12. SITE SETTINGS (welcome popup, home page planets) ---------
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 13. AI GUIDE CHAT LOG (visitors may add, nobody public may read)
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text,
  role text CHECK (role IN ('user', 'assistant')),
  content text CHECK (char_length(content) <= 4000),
  created_at timestamptz DEFAULT now()
);

-- 14. BIGQUERY SYNC LOG ----------------------------------------
CREATE TABLE IF NOT EXISTS bq_sync_runs (
  id bigserial PRIMARY KEY,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  trigger text,
  ok boolean,
  summary jsonb
);

-- updated_at triggers for tables without a custom trigger
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['playlists','social_links','websites','posts','announcements','subscribers','lottery_entries','lottery_subscribers','lottery_history','site_settings']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_touch ON %I', t, t);
    EXECUTE format('CREATE TRIGGER %I_touch BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION touch_updated_at()', t, t);
  END LOOP;
END $$;

-- 15. ROW LEVEL SECURITY ---------------------------------------
-- Remove every old policy on these tables first (old wide-open ones included)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
    AND tablename IN ('channels','playlists','videos','social_links','websites','posts','announcements','subscribers','lottery_entries','lottery_subscribers','lottery_history','site_settings','messages','bq_sync_runs','admin_users')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['channels','playlists','videos','social_links','websites','posts','announcements','subscribers','lottery_entries','lottery_subscribers','lottery_history','site_settings','messages','bq_sync_runs','admin_users']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    -- the admin can do everything
    EXECUTE format('CREATE POLICY "admin all" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
  -- public display data: anyone can READ
  FOREACH t IN ARRAY ARRAY['channels','playlists','videos','social_links','websites','posts','announcements','site_settings']
  LOOP
    EXECUTE format('CREATE POLICY "public read" ON %I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;
END $$;
-- visitors may only ADD chat messages (no read, no edit)
CREATE POLICY "visitor insert" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- public lottery winners only (no emails / phones)
CREATE OR REPLACE VIEW public.lottery_winners WITH (security_invoker = false) AS
  SELECT channel_sno, name, prize, entered_at FROM lottery_entries WHERE is_winner;
GRANT SELECT ON public.lottery_winners TO anon, authenticated;

-- 16. LOGO IMAGE STORAGE ---------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
DROP POLICY IF EXISTS "Auth write logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin write logos" ON storage.objects;
CREATE POLICY "Admin write logos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'logos' AND public.is_admin()) WITH CHECK (bucket_id = 'logos' AND public.is_admin());

-- Done. Next: run supabase/seed.sql to load your 39 channels, playlists,
-- 36 social accounts, 29 websites and the home page settings.
