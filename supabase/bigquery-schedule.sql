-- ============================================================
-- PUJIVERSE — OPTIONAL: push to BigQuery automatically every day
-- Run in Supabase -> SQL Editor AFTER the bigquery-sync function is deployed.
-- Replace the two placeholders first.
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('pujiverse-bigquery-sync') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'pujiverse-bigquery-sync');

-- every day at 06:00 UTC
SELECT cron.schedule(
  'pujiverse-bigquery-sync',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://kykkbramlsychystjqba.supabase.co/functions/v1/bigquery-sync',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', 'PASTE_YOUR_CRON_SECRET'),
    body := '{}'::jsonb
  );
  $$
);

-- check runs:  SELECT * FROM bq_sync_runs ORDER BY id DESC LIMIT 10;
