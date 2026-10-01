-- ============================================================
-- PUJIVERSE — BigQuery analytics views
-- Run in BigQuery console AFTER the first sync (tables must exist).
-- Replace `your-gcp-project` with your project id.
-- ============================================================

-- Channel overview: playlists, videos, views, popular videos
CREATE OR REPLACE VIEW `your-gcp-project.pujiverse.v_channel_summary` AS
SELECT
  c.sno, c.name, c.handle, c.group_name, c.category, c.status, c.viral_score,
  (SELECT COUNT(*) FROM `your-gcp-project.pujiverse.playlists` p WHERE p.channel_sno = c.sno) AS playlists,
  COUNT(v.id) AS videos,
  SUM(IFNULL(v.views, 0)) AS total_views,
  COUNTIF(v.is_popular) AS popular_videos,
  MAX(v.created_at) AS last_video_added
FROM `your-gcp-project.pujiverse.channels` c
LEFT JOIN `your-gcp-project.pujiverse.videos` v ON v.channel_sno = c.sno
GROUP BY 1, 2, 3, 4, 5, 6, 7;

-- Category roll-up across the 7 channel groups
CREATE OR REPLACE VIEW `your-gcp-project.pujiverse.v_group_summary` AS
SELECT group_name, COUNT(*) AS channels, SUM(videos) AS videos, SUM(total_views) AS total_views
FROM `your-gcp-project.pujiverse.v_channel_summary`
GROUP BY group_name;

-- Websites by category and host
CREATE OR REPLACE VIEW `your-gcp-project.pujiverse.v_websites` AS
SELECT category, host, COUNT(*) AS sites, COUNTIF(is_live) AS live
FROM `your-gcp-project.pujiverse.websites`
GROUP BY category, host;

-- Lottery: entries and winners per channel
CREATE OR REPLACE VIEW `your-gcp-project.pujiverse.v_lottery` AS
SELECT channel_sno, COUNT(*) AS entries, COUNTIF(is_winner) AS winners
FROM `your-gcp-project.pujiverse.lottery_entries`
GROUP BY channel_sno;
