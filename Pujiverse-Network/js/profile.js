// ============================================================
// PUJIVERSE — shared profile, social and website data
// Source: Pujith_Sakhamuri_Pujiverse_Portfolio.xlsx (Oct 2026)
// Loaded by index.html and channels.html. Edit here to update every page.
// ============================================================
(function () {
  var PV_DATA_VERSION = '2026-10-domains';

  var PV_PROFILE = {
    name: 'Pujith Chowdary Sakhamuri',
    short: 'Pujith Sakhamuri',
    headline: 'Full Stack Data & AI Engineer | GCP · BigQuery · Dataflow · Vertex AI · Gemini API | Network Data Analyst @ Telka (T-Mobile) | Pujiverse Creator',
    tagline: 'Full Stack Data & AI Engineer · Network Data Analyst · Pujiverse Creator',
    location: 'Celina, Texas, United States',
    email: 'pujiverse@gmail.com',
    officialChannel: { name: 'Pujith Sakhamuri', handle: '@PujithSakhamuri', url: 'https://www.youtube.com/@PujithSakhamuri' },
    links: {
      home: 'https://www.pujiverse.com/',
      portfolio: 'https://pujith-sakhamuri-portfolio.vercel.app/',
      github: 'https://github.com/pujiverse',
      resume: 'https://github.com/pujiverse/pujiverse/blob/main/resume.pdf',
      linkedin: 'https://www.linkedin.com/in/pujith-sakhamuri-06b69a137/'
    },
    about: 'I build data platforms and AI tools, from pipelines and semantic models on Google Cloud to web apps people use. Network Data Analyst at Telka supporting T-Mobile; previously Full Stack Data & AI Engineer for CVS Pharmacy (SR Systems) and Data Engineer for Cleveland Clinic (IvyNova). Creator of Pujiverse: 39 YouTube channels plus interactive projects like The AI Timeline, Vehicle Universe and the Pujiverse World Atlas.',
    stats: { projects: 32, live: 29, githubPages: 11, vercel: 18, aiStudio: 19, channels: 39, platforms: 37, experience: 8 },
    experience: [
      { company: 'Pujiverse Network', title: 'Creator & Founder', type: 'Self-employed', location: 'Remote', start: 'Mar 2025', end: 'Present', text: 'Built and run a network of 39 YouTube channels, interactive data projects (The AI Timeline, Vehicle Universe, World Atlas) and 18+ Gemini-powered apps.', link: 'https://www.pujiverse.com/' },
      { company: 'Telka LLC', title: 'Network Data Analyst', type: 'Full-time', location: 'Prosper, TX (client: T-Mobile, Central Region)', start: 'Aug 2026', end: 'Present', text: '5G/LTE drive-test data and RF metrics (RSRP, RSRQ, SINR, throughput); Python/SQL log validation; FCC compliance audits; weekly KPI dashboards.' },
      { company: 'Alignerr', title: 'AI & LLM Evaluation Specialist', type: 'Contract', location: 'Remote', start: 'Jan 2025', end: 'Present', text: 'Evaluate LLM outputs on Python, SQL and multi-step reasoning under RLHF guidelines; build tool-calling validation datasets.' },
      { company: 'Upwork', title: 'Full Stack & Generative AI Developer', type: 'Freelance', location: 'Remote', start: 'Jan 2024', end: 'Present', text: 'Web apps and AI tools for small businesses with React, TypeScript, Python and the Gemini API on Vercel and Cloud Run.' },
      { company: 'SR Systems LLC', title: 'Full Stack Data & AI Engineer', type: 'Full-time', location: 'Texas (client: CVS Pharmacy)', start: 'Jul 2024', end: 'Jul 2026', text: 'BigQuery semantic models for Vertex AI; Dataflow, Pub/Sub, Cloud Composer pipelines; Cloud Run APIs; Terraform and GitHub Actions; HIPAA data governance.' },
      { company: 'Ivynova Solutions, Inc.', title: 'Data Engineer', type: 'Full-time', location: 'Cleveland, OH (client: Cleveland Clinic)', start: 'Jun 2023', end: 'Jul 2024', text: 'GCS ingestion of clinical feeds; Cloud Functions and Airflow DAGs (99.8% data accuracy); star-schema models in BigQuery for BI.' },
      { company: 'Cleveland State University', title: 'Graduate Assistant, Data Analytics & Infrastructure Support', type: 'Part-time', location: 'Cleveland, OH', start: 'Mar 2022', end: 'May 2023', text: 'SQL reporting datasets, automated ETL workflows, Power BI and Tableau dashboards, data validation checks.' },
      { company: 'Self-employed', title: 'Freelance Developer / Data Analyst', type: 'Freelance', location: 'Hyderabad, India', start: 'Oct 2020', end: 'Jan 2022', text: 'Mentored engineering students on academic projects; built web applications; debugging and project documentation.' }
    ],
    education: [
      { school: 'Indiana Wesleyan University', degree: 'Master of Science', field: 'Artificial Intelligence & Machine Learning', start: 'Jul 2026', end: 'Dec 2027 (expected)', notes: 'Coursework: AIML-500 Machine Learning Fundamentals, DTAN-500 Foundations of Data Analytics, DTAN-505 Data Visualization (R)' },
      { school: 'Cleveland State University', degree: 'Master of Science', field: 'Computer and Information Sciences', start: 'Jan 2022', end: 'May 2023', notes: 'Graduate Assistant, Data Analytics & Infrastructure Support' },
      { school: 'JNTUH', degree: 'Bachelor of Technology', field: 'Computer Science and Engineering', start: '2016', end: '2020', notes: '' }
    ],
    skills: [
      { area: 'Cloud & Data Platform', items: 'Google Cloud Platform (GCP), Google BigQuery, Vertex AI, Cloud Dataflow, Pub/Sub, Cloud Composer, Apache Airflow, Cloud Run, Cloud Functions, Cloud Storage' },
      { area: 'AI & Machine Learning', items: 'Generative AI, Gemini API, Large Language Models, AI Agents, Google ADK, Prompt Engineering, Machine Learning, RLHF evaluation' },
      { area: 'Data Engineering & Analytics', items: 'Data Engineering, Data Modeling, Dimensional Modeling, Semantic Modeling, ETL, Data Pipelines, Data Governance, Data Quality, HIPAA Compliance, KPI Analysis, RF Analytics (5G/LTE)' },
      { area: 'Programming', items: 'Python, SQL, PySpark, R, TypeScript, JavaScript, HTML, CSS' },
      { area: 'Web & App Development', items: 'React, FastAPI, REST APIs, Firebase, Supabase, PostgreSQL, MySQL, Vercel, GitHub Pages' },
      { area: 'DevOps', items: 'Terraform, Docker, GitHub Actions, CI/CD, Git, Linux' },
      { area: 'BI & Visualization', items: 'Power BI, Tableau, Data Visualization, Dashboard Design' },
      { area: 'Creative', items: 'Content Creation, Video Production, YouTube, Brand Identity, Web Design, UI/UX Design' }
    ]
  };

  // icon: short key used by the channels page SVG set, or a simpleicons.org slug
  var PV_SOCIAL = [
    { group: 'Video & audio', platform: 'YouTube (official)', icon: 'yt', handle: '@PujithSakhamuri', url: 'https://www.youtube.com/@PujithSakhamuri', color: '#ff0000' },
    { group: 'Professional', platform: 'LinkedIn (personal)', icon: 'li', handle: 'pujith-sakhamuri-06b69a137', url: 'https://www.linkedin.com/in/pujith-sakhamuri-06b69a137/', color: '#0a66c2' },
    { group: 'Professional', platform: 'LinkedIn (Pujiverse)', icon: 'li', handle: 'pujiverse-pujith', url: 'https://www.linkedin.com/in/pujiverse-pujith-700819392/', color: '#0a66c2' },
    { group: 'Professional', platform: 'GitHub', icon: 'github', handle: 'pujiverse', url: 'https://github.com/pujiverse', color: '#6e7681' },
    { group: 'Professional', platform: 'Product Hunt', icon: 'producthunt', handle: '@pujiverse', url: 'https://www.producthunt.com/@pujiverse', color: '#da552f' },
    { group: 'Design', platform: 'Behance', icon: 'behance', handle: 'pujiverse', url: 'https://www.behance.net/pujiverse', color: '#1769ff' },
    { group: 'Design', platform: 'Dribbble', icon: 'dribbble', handle: 'pujiverse', url: 'https://dribbble.com/pujiverse', color: '#ea4c89' },
    { group: 'Design', platform: 'Sketchfab', icon: 'sketchfab', handle: 'Pujiverse', url: 'https://sketchfab.com/Pujiverse', color: '#1caad9' },
    { group: 'Social', platform: 'Instagram', icon: 'ig', handle: '@pujiverseofficial', url: 'https://www.instagram.com/pujiverseofficial/', color: '#e1306c' },
    { group: 'Social', platform: 'Facebook', icon: 'fb', handle: 'pujiverseofficial', url: 'https://www.facebook.com/pujiverseofficial/', color: '#1877f2' },
    { group: 'Social', platform: 'Threads', icon: 'threads', handle: '@pujiverseofficial', url: 'https://www.threads.net/@pujiverseofficial', color: '#4b5563' },
    { group: 'Social', platform: 'X (Twitter)', icon: 'x', handle: '@pujiverse', url: 'https://x.com/pujiverse', color: '#6b7280' },
    { group: 'Social', platform: 'Bluesky', icon: 'bluesky', handle: 'pujiverse.bsky.social', url: 'https://bsky.app/profile/pujiverse.bsky.social', color: '#0085ff' },
    { group: 'Social', platform: 'Pinterest', icon: 'pi', handle: 'pujiverse', url: 'https://in.pinterest.com/pujiverse/', color: '#e60023' },
    { group: 'Social', platform: 'Reddit', icon: 'reddit', handle: 'u/pujiverse', url: 'https://www.reddit.com/user/pujiverse/', color: '#ff4500' },
    { group: 'Social', platform: 'Telegram', icon: 'telegram', handle: '@pujiverse', url: 'https://t.me/pujiverse', color: '#26a5e4' },
    { group: 'Social', platform: 'WhatsApp', icon: 'wa', handle: 'Pujith Sakhamuri', url: 'https://wa.me/message/HPIAGRGKO23SM1', color: '#25d366' },
    { group: 'Video & audio', platform: 'TikTok', icon: 'tt', handle: '@pujiverse', url: 'https://www.tiktok.com/@pujiverse', color: '#25b8c0' },
    { group: 'Video & audio', platform: 'Twitch', icon: 'twitch', handle: 'pujiverse_ai', url: 'https://www.twitch.tv/pujiverse_ai', color: '#9146ff' },
    { group: 'Video & audio', platform: 'Rumble', icon: 'rumble', handle: 'pujiverse', url: 'https://rumble.com/user/pujiverse', color: '#85c742' },
    { group: 'Video & audio', platform: 'Vimeo', icon: 'vimeo', handle: 'pujiverse', url: 'https://vimeo.com/pujiverse', color: '#1ab7ea' },
    { group: 'Video & audio', platform: 'Dailymotion', icon: 'dm', handle: 'PUJIVERSE', url: 'https://www.dailymotion.com/PUJIVERSE', color: '#00aaff' },
    { group: 'Video & audio', platform: 'SoundCloud', icon: 'soundcloud', handle: 'pujiverse', url: 'https://soundcloud.com/pujiverse', color: '#ff5500' },
    { group: 'Video & audio', platform: 'Snapchat Spotlight', icon: 'snapchat', handle: 'pujiverse official', url: 'https://snapchat.com/t/bprrYRF8', color: '#e6b800' },
    { group: 'Video & audio', platform: 'Likee', icon: 'likee', handle: 'pujiverse', url: 'https://l.likee.video/p/h1YdV', color: '#ff3c7e' },
    { group: 'Video & audio', platform: 'Kwai', icon: 'kwai', handle: '@Pujiverse', url: 'https://k.kwai.com/u/@Pujiverse/2sGeerCN', color: '#ff7a00' },
    { group: 'Video & audio', platform: 'Moj', icon: 'moj', handle: '@pujiverse', url: 'https://mojapp.in/@pujiverse', color: '#f9a825' },
    { group: 'Video & audio', platform: 'Trendo', icon: 'trendo', handle: 'pujiverse', url: 'https://s.trendo.vip/Jjoq', color: '#8b5cf6' },
    { group: 'Video & audio', platform: 'IMDb', icon: 'imdb', handle: 'Pujiverse', url: 'https://www.imdb.com/user/p.aclcmdbqqkrtmxcppzezlcxolq/', color: '#d4a90c' },
    { group: 'Writing', platform: 'Substack', icon: 'ss', handle: '@pujiverse', url: 'https://substack.com/@pujiverse', color: '#ff6719' },
    { group: 'Writing', platform: 'Medium', icon: 'me', handle: '@pujiverse', url: 'https://medium.com/@pujiverse', color: '#02b875' },
    { group: 'Writing', platform: 'Blogger', icon: 'blogger', handle: 'pujiverse.blogspot.com', url: 'https://pujiverse.blogspot.com/', color: '#ff5722' },
    { group: 'Writing', platform: 'Tumblr', icon: 'tumblr', handle: 'pujiverse', url: 'https://www.tumblr.com/pujiverse', color: '#36465d' },
    { group: 'Writing', platform: 'Quora', icon: 'qu', handle: 'Pujiverse', url: 'https://www.quora.com/profile/Pujiverse', color: '#b92b27' },
    { group: 'Support & shop', platform: 'Patreon', icon: 'patreon', handle: 'pujithchowdarysakhamuri', url: 'https://www.patreon.com/cw/pujithchowdarysakhamuri', color: '#ff424d' },
    { group: 'Support & shop', platform: 'Etsy', icon: 'etsy', handle: 'pujiverse', url: 'https://www.etsy.com/people/jqo8bz5apmta83y3', color: '#f1641e' }
  ];

  var CAT = {
    'Home': '#f59e0b', 'Featured data platform': '#22d3ee', 'Web app & tool': '#4ade80',
    'Google AI Studio app': '#c084fc', 'Academic': '#f472b6', 'Profile': '#94a3b8'
  };
  function w(id, cat, title, description, tech, host, url, repo, mirrors) {
    return { mirrors: mirrors || [], id: id, cat: cat, title: title, description: description, tech: tech, host: host, url: url, repo: repo, tags: [cat, host], accent: CAT[cat] || '#22d3ee' };
  }
  var PV_WEBSITES = [
    w('pujiverse-home', 'Home', 'Pujiverse Home (Network Hub)', 'Main home page for the Pujiverse Network: channels, projects and apps in one place', 'HTML/JS', 'GitHub Pages', 'https://www.pujiverse.com/', 'https://github.com/pujiverse/Pujiverse-Network', ['https://pujiverse.github.io/Pujiverse-Network/']),
    w('ai-timeline', 'Featured data platform', 'The AI Timeline', 'Interactive history of AI from 1843 to today: era timeline, release tracker, model library with side-by-side comparison and a built-in AI guide', 'HTML/JS', 'GitHub Pages', 'https://aitimeline.pujiverse.com/', 'https://github.com/pujiverse/The-AI-Timeline', ['https://ai-timeline.pujiverse.com/', 'https://pujiverse.github.io/The-AI-Timeline/']),
    w('vehicle-universe', 'Featured data platform', 'Vehicle Universe', 'Explorer for every kind of vehicle, from bicycles to rockets: 57 types, 3,400+ brands, 59,000+ models with brand histories and specs', 'HTML/JS, BigQuery', 'GitHub Pages', 'https://vehicles.pujiverse.com/', 'https://github.com/pujiverse/Vehicle-Universe', ['https://pujiverse.github.io/Vehicle-Universe/']),
    w('world-atlas', 'Featured data platform', 'Pujiverse World Atlas', '3D globe population explorer with drill-down from world to city, 2015–2025 trends, density and 1,400+ water bodies', 'HTML/JS, BigQuery', 'GitHub Pages', 'https://world.pujiverse.com/', 'https://github.com/pujiverse/pujiverse-world-atlas', ['https://pujiverse.github.io/pujiverse-world-atlas/']),
    w('film-database', 'Featured data platform', 'Pujiverse Film Database', 'IMDb-style database of movies, short films, anime and TV across world film industries, organized by year', 'HTML/JS', 'GitHub Pages', 'https://cinema.pujiverse.com/', 'https://github.com/pujiverse/Pujiverse-Film-Database', ['https://movies.pujiverse.com/', 'https://pujiverse.github.io/Pujiverse-Film-Database/']),
    w('bizmanager-lite', 'Web app & tool', 'BizManager Lite', 'Dependency-free business, chit, loan and household expense manager', 'HTML/CSS/JS', 'GitHub Pages', 'https://pujiverse.github.io/ledger/', 'https://github.com/pujiverse/ledger'),
    w('household-firebase', 'Web app & tool', 'Household Expense Manager (Firebase)', 'Multi-page expense, business and chit manager with Firebase Authentication', 'JavaScript, Firebase', 'GitHub Pages', 'https://pujiverse.github.io/HouseholdExpenseManager/', 'https://github.com/pujiverse/HouseholdExpenseManager'),
    w('expense-sheets', 'Web app & tool', 'Expense Manager (Google Sheets)', 'Household expense, business, chit and loan tracker backed by Google Sheets', 'JavaScript, Google Sheets API', 'GitHub Pages', 'https://pujiverse.github.io/Expense-Manager/', 'https://github.com/pujiverse/Expense-Manager'),
    w('auto-portfolio', 'Web app & tool', 'Auto-Updating Portfolio', 'Portfolio that pulls its content live from a Google Sheet', 'JavaScript, Google Sheets', 'GitHub Pages', 'https://pujiverse.github.io/pujith-portfolio/', 'https://github.com/pujiverse/pujith-portfolio'),
    w('network-master-data', 'Web app & tool', 'Pujiverse Network Master Data', 'Master data for the channels in the Pujiverse Network', 'HTML/JS', 'GitHub Pages', 'https://pujiverse.github.io/PujiverseNetwork/', 'https://github.com/pujiverse/PujiverseNetwork'),
    w('voice-studio', 'Google AI Studio app', 'Pujiverse Voice Studio', 'Text-to-speech voice-overs with selectable age, gender and emotion', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-voice-studio.vercel.app/', 'https://github.com/pujiverse/Pujiverse-Voice-Studio'),
    w('video-creator', 'Google AI Studio app', 'YouTube Video Creator', 'Scripts, voice-overs and background music for YouTube videos', 'TypeScript, React, Gemini API', 'Vercel', 'https://puji-verse-video-content-creator.vercel.app/', 'https://github.com/pujiverse/PujiVerse-Video-Content-Creator'),
    w('creation-spark', 'Google AI Studio app', 'Pujiverse Creation Spark', 'Turns an idea into songs, stories or narrations in multiple languages', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-creative-spark.vercel.app/', 'https://github.com/pujiverse/Creative-Spark'),
    w('recipe-voiceover', 'Google AI Studio app', 'Recipe Voice-over Generator', 'Multilingual cooking voice-overs from recipe steps', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-recipe-voice-over-generat.vercel.app/', 'https://github.com/pujiverse/Recipe-Voice-over-Generator'),
    w('cinema-storyteller', 'Google AI Studio app', 'Pujiverse Cinema Storyteller', 'Movie scripts and voice-overs in Telugu–English', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-cinema.vercel.app/', 'https://github.com/pujiverse/pujiverse-cinema'),
    w('subtitle-to-story', 'Google AI Studio app', 'Movie Storyteller & Live AI', 'Stories from subtitles, transcript analysis and live voice chat', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-subtitle-to-story.vercel.app/', 'https://github.com/pujiverse/movie-subtitle-to-story'),
    w('text-to-audio', 'Google AI Studio app', 'Text to Audio', 'Simple text-to-audio generator', 'TypeScript, React, Gemini API', 'Vercel', 'https://voice-three-blush.vercel.app/', 'https://github.com/pujiverse/voice'),
    w('vidprompt-studio', 'Google AI Studio app', 'VidPrompt Studio', 'Prompt-driven video trimming, narration and in-browser editing', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-vid-prompt-studio-new.vercel.app/', 'https://github.com/pujiverse/VidPrompt-Studio_new'),
    w('smart-scene-cutter', 'Google AI Studio app', 'SmartSceneCutter', 'Cuts and merges clips from prompts and timestamps; generates FFmpeg commands', 'TypeScript, React, Gemini API, FFmpeg.wasm', 'Vercel', 'https://smart-scene-cutter.vercel.app/', 'https://github.com/pujiverse/SmartSceneCutter'),
    w('text-to-video', 'Google AI Studio app', 'Text-to-Video Generator', 'Prompt-to-video with aspect-ratio and resolution control', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-text-to-video.vercel.app/', 'https://github.com/pujiverse/text-to-video'),
    w('presentation-generator', 'Google AI Studio app', 'Presentation Generator', 'Animated PPTX slides with voice-over from a single topic', 'TypeScript, React, Gemini API', 'Vercel', 'https://ai-animated-presentation-generator.vercel.app/', 'https://github.com/pujiverse/AI-Animated-Presentation-Generator'),
    w('ppt-voiceover', 'Google AI Studio app', 'PPT Voiceover Generator', 'Per-slide voice-overs with playback and download', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse-ppt-voiceover-generator.vercel.app/', 'https://github.com/pujiverse/PPT-Voiceover-Generator'),
    w('resume-builder', 'Google AI Studio app', 'Pujiverse Resume Builder', 'Tailors a resume to a job description', 'TypeScript, React, Gemini API', 'Vercel', 'https://resume-builder-azure-omega.vercel.app/', 'https://github.com/pujiverse/resume-builder'),
    w('sai-indian', 'Google AI Studio app', 'Sai Indian Cuisine Digital Concierge', 'Mobile-first restaurant landing page with an AI concierge', 'TypeScript, React, Gemini API', 'Vercel', 'https://sai-indian.vercel.app/', 'https://github.com/pujiverse/SAI-INDIAN'),
    w('business-manager-pro', 'Google AI Studio app', 'Business Manager Pro', 'Business, chit, expense and loan tracking with reports', 'TypeScript, React, Supabase, Recharts', 'Vercel', 'https://biz-manager-eight.vercel.app/', 'https://github.com/pujiverse/biz-manager'),
    w('pujiverse-hub-v1', 'Google AI Studio app', 'Pujiverse Hub (earlier version)', 'First version of the personal hub for socials, projects and contact', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujiverse.vercel.app/', 'https://github.com/pujiverse/pujiverse-hub'),
    w('live-sync-portfolio', 'Google AI Studio app', 'Live-Sync Portfolio', 'Google-Sheet-synced portfolio with a Gemini assistant', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujithsakhamuri.vercel.app/', 'https://github.com/pujiverse/New-Portfolio'),
    w('professional-portfolio', 'Google AI Studio app', 'Professional Portfolio', 'Career portfolio', 'TypeScript, React, Gemini API', 'Vercel', 'https://pujith-sakhamuri-portfolio.vercel.app/', 'https://github.com/pujiverse/my-protfolio'),
    w('aiml-500-portfolio', 'Academic', 'AIML-500 Professional Portfolio', 'Professional portfolio for AIML-500 (Indiana Wesleyan University)', 'HTML', 'GitHub Pages', 'https://pujiverse.github.io/pujith_portfolio/', 'https://github.com/pujiverse/pujith_portfolio'),
    w('github-profile', 'Profile', 'GitHub Profile README', 'Profile page with projects, channels and links', 'Markdown', 'GitHub', 'https://github.com/pujiverse', 'https://github.com/pujiverse/pujiverse')
  ];
  // In progress / code only (shown in lists, not as live sites)
  var PV_WEBSITES_UPCOMING = [
    w('flypal', 'Web app & tool', 'FlyPal', 'Concept: real-time social matching app for airport layovers', '—', '—', '', 'https://github.com/pujiverse/FlyPal'),
    w('vidprompt-v1', 'Google AI Studio app', 'VidPrompt Studio (earlier version)', 'Earlier offline-first version of VidPrompt Studio', 'TypeScript, React, Gemini API', '—', '', 'https://github.com/pujiverse/VidPrompt-Studio')
  ];

  // One-time refresh: drop stale cached social/website lists saved by older versions.
  try {
    if (localStorage.getItem('pv_data_ver') !== PV_DATA_VERSION) {
      localStorage.removeItem('pv_social');
      localStorage.removeItem('pv_websites');
      localStorage.setItem('pv_data_ver', PV_DATA_VERSION);
    }
  } catch (e) {}

  window.PV_DATA_VERSION = PV_DATA_VERSION;
  window.PV_PROFILE = PV_PROFILE;
  window.PV_SOCIAL = PV_SOCIAL;
  window.PV_WEBSITES = PV_WEBSITES;
  window.PV_WEBSITES_UPCOMING = PV_WEBSITES_UPCOMING;
  window.PV_WEB_CAT_COLORS = CAT;
})();
