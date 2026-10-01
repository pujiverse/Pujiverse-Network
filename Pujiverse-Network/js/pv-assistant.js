// ============================================================
// PUJIVERSE GUIDE — shared AI assistant for every page.
// Answers from the site's own data (profile, channels, playlists,
// social accounts, websites, lottery), so it works fully OFFLINE.
// Load after js/profile.js (and js/data.js where channels are needed):
//   <script src="js/pv-assistant.js" data-z="8600"></script>
// ============================================================
(function () {
  if (window.__pvAssistant) return;
  window.__pvAssistant = true;
  var Z = (document.currentScript && document.currentScript.getAttribute('data-z')) || '8600';
  var P = window.PV_PROFILE || {};
  var L = P.links || {};
  var SOCIAL = window.PV_SOCIAL || [];
  var SITES = window.PV_WEBSITES || [];
  var UPCOMING = window.PV_WEBSITES_UPCOMING || [];
  var EMAIL = P.email || 'pujiverse@gmail.com';
  var OFF = P.officialChannel || { name: 'Pujith Sakhamuri', handle: '@PujithSakhamuri', url: 'https://www.youtube.com/@PujithSakhamuri' };
  var PAGE = /channels\.html/i.test(location.pathname) ? 'channels' : /lottery\.html/i.test(location.pathname) ? 'lottery' : 'home';

  function channels() {
    try { if (typeof CHANNELS !== 'undefined' && Array.isArray(CHANNELS)) return CHANNELS; } catch (e) {}
    return window.PV_CHANNELS || [];
  }
  var GROUPS = [
    ['Tech & Science', 'ai tech future space gadgets science', 'tech science technology'],
    ['Mystery & Mind', 'mystery truecrime psychology conspiracy paranormal mind', 'mystery mind crime psychology paranormal'],
    ['Money & Career', 'finance business crypto realestate luxury jobs', 'money career finance business'],
    ['Entertainment', 'gaming movies sports celebrity beatz music shorts talk', 'entertainment fun'],
    ['Learning & Culture', 'history languages kids devotional motivation', 'learning culture education'],
    ['Lifestyle', 'fitness recipes lifestyle lifehacks', 'lifestyle health food'],
    ['World & Transport', 'ocean aviation agriculture transport', 'world transport travel']
  ];
  function groupOf(ch) {
    if (ch.group) return ch.group;
    var k = String(ch.handle || '').toLowerCase().replace('@pujiverse', '');
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i][1].split(' ').indexOf(k) >= 0) return GROUPS[i][0];
    return 'Entertainment';
  }
  function shortName(ch) { return String(ch.name || '').replace(/^pujiverse\s*/i, '').trim(); }

  // ---------- text helpers ----------
  function norm(s) { return String(s || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9@#&+.\s-]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var STOP = 'a an the is are was were be to of in on for and or with about me my your you i do does did can could tell show give has have had covers cover any what whats which who whom how many much list all any some please pujith pujiverse sakhamuri his he her their there this that it its from at by as get find want know need see channel channels video videos playlist playlists'.split(' ');
  var SYN = { cooking: 'recipe recipes cook food kitchen', cook: 'recipe recipes food', food: 'recipe recipes', money: 'finance invest', investing: 'finance invest stock', stocks: 'finance stock', cars: 'vehicle auto transport car', car: 'vehicle auto car', movies: 'cine film movie cinema', movie: 'cine film cinema', films: 'cine film', workout: 'fitness gym exercise', gym: 'fitness exercise', health: 'fitness', songs: 'music song', song: 'music', games: 'gaming game', game: 'gaming', planes: 'aviation flight', flights: 'aviation flight', farming: 'agriculture farm', crime: 'crime murder', ghosts: 'paranormal ghost', religion: 'devotional', god: 'devotional', career: 'jobs job interview', kids: 'kids children', bitcoin: 'crypto', houses: 'real estate property' };
  function terms(q) { return norm(q).split(' ').filter(function (w) { return w.length > 1 && STOP.indexOf(w) < 0; }); }
  function expand(tt) { var out = tt.slice(); tt.forEach(function (w) { if (SYN[w]) SYN[w].split(' ').forEach(function (s) { if (out.indexOf(s) < 0) out.push(s); }); }); return out; }
  function has(q, words) { for (var i = 0; i < words.length; i++) { var w = words[i]; if (w.indexOf(' ') >= 0 ? q.indexOf(w) >= 0 : new RegExp('(^|\\s)' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(s)?(\\s|$)').test(q)) return true; } return false; }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
  function hubHref(tab) { return PAGE === 'home' ? '#' + (tab || 'social') : 'index.html#' + (tab || 'social'); }

  // ---------- knowledge answers ----------
  var A = {
    help: function () {
      return { t: "I'm the Pujiverse guide. I know everything on this site and I work even when you're offline. Ask me about:\n• Pujith — profile, experience, education, skills, resume\n• The " + channels().length + " YouTube channels and their playlists\n• " + SOCIAL.length + " social accounts and how to contact Pujith\n• " + SITES.length + " live websites and apps\n• The lucky draw lottery", chips: ['Who is Pujith?', 'List the channel groups', 'How do I contact you?', 'Show the AI apps'] };
    },
    contact: function () {
      var wa = SOCIAL.filter(function (s) { return /whatsapp/i.test(s.platform); })[0];
      return { t: 'You can reach Pujith here:\n• Email: ' + EMAIL + (wa ? '\n• WhatsApp: ' + wa.handle : '') + '\n• LinkedIn: Pujith Sakhamuri\n\nFor everything else, the Social Hub lists all ' + SOCIAL.length + ' accounts.', links: [['✉️ Email ' + EMAIL, 'mailto:' + EMAIL], ['🌐 Open the Social Hub', hubHref('social')], L.linkedin ? ['LinkedIn', L.linkedin] : null, wa ? ['WhatsApp', wa.url] : null] };
    },
    about: function () {
      return { t: (P.name || 'Pujith Sakhamuri') + '\n' + (P.headline || '') + '\n📍 ' + (P.location || '') + '\n\n' + (P.about || ''), links: [['🧑‍🚀 About Me page', hubHref('about')], L.resume ? ['📄 Resume', L.resume] : null, L.portfolio ? ['🪪 Portfolio', L.portfolio] : null], chips: ['Work experience', 'Education', 'Skills'] };
    },
    experience: function (only) {
      var list = only ? [only] : (P.experience || []);
      return { t: (only ? '' : 'Work experience (' + list.length + '):\n') + list.map(function (j) { return '• ' + j.title + ' — ' + j.company + ' (' + j.start + ' – ' + j.end + ', ' + j.type + ')\n   ' + j.location + '. ' + j.text; }).join('\n'), links: [['🧑‍🚀 Full profile', hubHref('about')], L.linkedin ? ['LinkedIn', L.linkedin] : null], chips: only ? ['All experience'] : ['Education', 'Skills'] };
    },
    education: function (only) {
      var list = only ? [only] : (P.education || []);
      return { t: 'Education:\n' + list.map(function (e) { return '• ' + e.degree + ', ' + e.field + ' — ' + e.school + ' (' + e.start + ' – ' + e.end + ')' + (e.notes ? '\n   ' + e.notes : ''); }).join('\n'), chips: ['Skills', 'Work experience'] };
    },
    skills: function (q) {
      var tt = terms(q), hits = [];
      (P.skills || []).forEach(function (s) {
        var items = s.items.split(/,\s*/);
        var m = items.filter(function (it) { var n = norm(it); return tt.some(function (w) { return w.length > 2 && n.indexOf(w) >= 0; }); });
        if (m.length) hits.push(s.area + ': ' + m.join(', '));
      });
      if (hits.length && !has(norm(q), ['skills', 'skill', 'tech stack', 'stack'])) return { t: 'Yes — Pujith works with:\n• ' + hits.join('\n• '), chips: ['All skills', 'Work experience'] };
      return { t: 'Skills:\n' + (P.skills || []).map(function (s) { return '• ' + s.area + ': ' + s.items; }).join('\n'), chips: ['Work experience', 'Projects'] };
    },
    resume: function () { return { t: 'Here are Pujith’s resume and portfolio links.', links: [L.resume ? ['📄 Resume (PDF)', L.resume] : null, L.portfolio ? ['🪪 Portfolio', L.portfolio] : null, L.github ? ['GitHub', L.github] : null, L.linkedin ? ['LinkedIn', L.linkedin] : null] }; },
    stats: function () {
      var S = P.stats || {};
      return { t: 'Pujiverse at a glance:\n• ' + channels().length + ' YouTube channels in 7 groups\n• ' + plCount() + ' playlists\n• ' + (S.projects || SITES.length) + ' projects, ' + SITES.length + ' live websites (' + (S.aiStudio || '') + ' Google AI Studio apps)\n• ' + SOCIAL.length + ' social & creator platforms\n• ' + (P.experience || []).length + ' work experience entries' };
    },
    official: function () { return { t: 'Pujith’s official YouTube channel is ' + OFF.name + ' (' + OFF.handle + '). The Pujiverse Network adds ' + channels().length + ' topic channels on top of it.', links: [['▶ ' + OFF.handle, OFF.url], [PAGE === 'channels' ? '🪐 You are on the channels page' : '🪐 See all channels', 'channels.html']] }; },
    channelsOverview: function () {
      var chs = channels();
      var by = {}; chs.forEach(function (c) { var g = groupOf(c); (by[g] = by[g] || []).push(shortName(c) || c.name); });
      return { t: chs.length + ' YouTube channels in 7 groups:\n' + GROUPS.map(function (g) { return by[g[0]] ? '• ' + g[0] + ' (' + by[g[0]].length + '): ' + by[g[0]].join(', ') : null; }).filter(Boolean).join('\n'), links: [['🪐 Open the channel solar system', 'channels.html'], ['▶ Official channel ' + OFF.handle, OFF.url]], chips: ['Tech & Science channels', 'Which channel has cooking?'] };
    },
    group: function (g) {
      var list = channels().filter(function (c) { return groupOf(c) === g; });
      return { t: g + ' — ' + list.length + ' channels:\n' + list.map(function (c) { return '• ' + c.name + ' (' + c.handle + ') — ' + (c.playlists || []).length + ' playlists'; }).join('\n'), links: list.slice(0, 4).map(function (c) { return ['▶ ' + shortName(c), c.url]; }) };
    },
    channel: function (c) {
      var pl = c.playlists || [];
      return { t: c.name + ' (' + c.handle + ')\nGroup: ' + groupOf(c) + (c.cat ? ' · YouTube category: ' + c.cat : '') + '\n' + (pl.length ? 'Playlists (' + pl.length + '):\n' + pl.map(function (p) { return '• ' + p; }).join('\n') : 'Playlists are coming soon.'), links: [['▶ Open on YouTube', c.url], [PAGE === 'channels' ? '🪐 Find it in the solar system above' : '🪐 Channel solar system', 'channels.html']] };
    },
    playlists: function (q) {
      var tt = expand(terms(q.replace(/playlists?|videos?|about|on|channel/gi, ' ')));
      if (!tt.length) return { t: 'There are ' + plCount() + ' playlists across ' + channels().length + ' channels. Tell me a topic, for example “playlist about space” or “videos on cooking”.' };
      var hits = [];
      channels().forEach(function (c) { (c.playlists || []).forEach(function (p) { var n = norm(p + ' ' + c.name); var sc = tt.filter(function (w) { return n.indexOf(w) >= 0; }).length; if (sc) hits.push([sc, c, p]); }); });
      hits.sort(function (a, b) { return b[0] - a[0]; });
      if (!hits.length) return null;
      return { t: 'Playlists about “' + terms(q.replace(/playlists?|videos?|about|on|channel/gi, ' ')).join(' ') + '”:\n' + hits.slice(0, 8).map(function (h) { return '• ' + h[2] + ' — ' + h[1].name; }).join('\n'), links: uniq(hits.slice(0, 4).map(function (h) { return ['▶ ' + shortName(h[1]), h[1].url]; })) };
    },
    socialAll: function () {
      var by = {}; SOCIAL.forEach(function (s) { (by[s.group] = by[s.group] || []).push(s.platform.replace(/\s*\(.*\)/, '')); });
      return { t: 'Pujith is on ' + SOCIAL.length + ' platforms:\n' + Object.keys(by).map(function (g) { return '• ' + g + ': ' + uniqStr(by[g]).join(', '); }).join('\n'), links: [['🌐 Open the Social Hub', hubHref('social')], ['▶ ' + OFF.handle, OFF.url]] };
    },
    social: function (list) {
      return { t: list.map(function (s) { return s.platform + ': ' + s.handle; }).join('\n'), links: list.map(function (s) { return ['Open ' + s.platform, s.url]; }).concat([['🌐 All accounts', hubHref('social')]]) };
    },
    websitesAll: function () {
      var by = {}; SITES.forEach(function (w) { (by[w.cat] = by[w.cat] || []).push(w.title); });
      return { t: SITES.length + ' live websites and apps:\n' + Object.keys(by).map(function (g) { return '• ' + g + ' (' + by[g].length + '): ' + by[g].slice(0, 6).join(', ') + (by[g].length > 6 ? '…' : ''); }).join('\n') + (UPCOMING.length ? '\nIn progress: ' + UPCOMING.map(function (w) { return w.title; }).join(', ') : ''), links: [['💻 Open the Websites page', hubHref('websites')]], chips: ['Show the AI apps', 'Data platforms'] };
    },
    websiteCat: function (cat) {
      var list = SITES.filter(function (w) { return w.cat === cat; });
      return { t: cat + ' (' + list.length + '):\n' + list.map(function (w) { return '• ' + w.title + ' — ' + w.description; }).join('\n'), links: list.slice(0, 4).map(function (w) { return [w.title, w.url]; }).concat([['💻 All websites', hubHref('websites')]]) };
    },
    website: function (w) {
      return { t: w.title + '\n' + w.description + '\nBuilt with: ' + w.tech + ' · Hosted on ' + w.host + '\n' + (w.url ? host(w.url) : 'Not live yet'), links: [w.url ? ['Visit ↗', w.url] : null, w.repo ? ['Source code', w.repo] : null] };
    },
    lottery: function () {
      return { t: 'The Pujiverse lucky draw:\n• Each channel has its own subscriber pool, managed by Pujith.\n• Draws run live on the Lottery page, with a countdown and a winner reveal.\n• Winners are announced in the welcome announcement and the channel’s Lottery moon.\nTo take part, subscribe to the channel and watch for draw announcements.', links: [['🎰 Open the Lottery page', 'Lottery.html'], ['▶ Subscribe ' + OFF.handle, OFF.url]] };
    },
    navigate: function () {
      return { t: 'How to explore Pujiverse:\n• Home: 5 planets orbit the sun — YouTube, About Me, Personal Info, Social Hub, Websites. Click one to zoom in.\n• Channels page: every channel is a planet; open one to see its moons (videos, posts, announcements, lottery). Use “Grid view” for a searchable list and “Social & websites” for the hub.\n• Lottery: live lucky draws.\n• Every page has an Explore list under the orbits.', links: [['🏠 Home', 'index.html'], ['🪐 Channels', 'channels.html'], ['🎰 Lottery', 'Lottery.html']] };
    },
    location: function () { return { t: 'Pujith is based in ' + (P.location || 'Texas, United States') + '.' }; },
    greet: function () { return { t: 'Hi! 👋 I’m the Pujiverse guide. Ask me anything about Pujith, the channels, websites, social accounts or the lottery.', chips: ['Who is Pujith?', 'How many channels?', 'Contact info'] }; },
    thanks: function () { return { t: 'You’re welcome! 🚀 Anything else?', chips: ['Contact info', 'Show the websites'] }; }
  };
  function plCount() { return channels().reduce(function (s, c) { return s + (c.playlists || []).length; }, 0); }
  function uniq(links) { var seen = {}; return links.filter(function (l) { if (!l || seen[l[1]]) return false; seen[l[1]] = 1; return true; }); }
  function uniqStr(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  // ---------- intent routing ----------
  function answer(raw) {
    var q = norm(raw);
    if (!q) return A.help();
    if (/^(hi|hello|hey|hii+|namaste|yo|good (morning|evening|afternoon))\b/.test(q) && q.split(' ').length <= 4) return A.greet();
    if (/^(thanks|thank you|thx|ty|great|awesome|cool|ok|okay)\b/.test(q) && q.split(' ').length <= 4) return A.thanks();
    if (has(q, ['help', 'what can you do', 'who are you', 'menu', 'options'])) return A.help();
    if (has(q, ['contact', 'email', 'mail', 'reach', 'hire', 'collab', 'collaborate', 'collaboration', 'sponsor', 'business inquiry', 'phone', 'number', 'get in touch', 'message him', 'connect with'])) return A.contact();

    // specific social platform
    var plat = SOCIAL.filter(function (s) {
      var base = norm(s.platform.replace(/\s*\(.*\)/, ''));
      if (base === 'x' || base === 'x twitter') return has(q, ['twitter', 'x account', 'on x', 'x handle', 'tweet']);
      if (base === 'youtube') return false;
      return has(q, [base]);
    });
    if (plat.length && !has(q, ['website', 'project', 'app', 'built'])) return A.social(plat);

    // specific website / project
    var site = null, best = 0;
    SITES.concat(UPCOMING).forEach(function (w) {
      var key = norm(w.title.replace(/\(.*?\)/g, '').replace(/^pujiverse\s+/i, ''));
      if (key.length >= 4 && q.indexOf(key) >= 0 && key.length > best) { best = key.length; site = w; }
    });
    if (site) return A.website(site);

    // specific channel
    var chs = channels(), ch = null; best = 0;
    chs.forEach(function (c) {
      var full = norm(c.name), handle = norm(c.handle), sn = norm(shortName(c));
      var ctx = has(q, ['channel', 'channels', 'youtube', 'playlist', 'playlists', 'videos', 'subscribe']);
      var hit = q.indexOf(handle) >= 0 ? 99 : q.indexOf(full) >= 0 ? 90 : (sn && ctx && has(q, [sn])) ? sn.length : 0;
      if (hit > best) { best = hit; ch = c; }
    });
    if (ch && !has(q, ['apps', 'app', 'websites', 'website', 'skills', 'skill', 'stack', 'experience', 'education'])) return A.channel(ch);

    // experience: company named
    if (has(q, ['lottery', 'lucky draw', 'draw', 'giveaway', 'winner', 'winners', 'prize', 'raffle'])) return A.lottery();
    var school0 = (P.education || []).filter(function (e) { return q.indexOf(norm(e.school.replace(/\b(university|college)\b/gi, ''))) >= 0; })[0];
    if (school0 && !has(q, ['work', 'worked', 'job', 'assistant'])) return A.education(school0);
    var job = (P.experience || []).filter(function (j) { var n = norm(j.company + ' ' + j.location); return terms(q).some(function (w) { return w.length > 2 && has(n, [w]); }); })[0];
    if (job && has(q, ['work', 'worked', 'job', 'role', 'company', 'at', 'do', 'did', 'experience', 'telka', 'tmobile', 't-mobile', 'cvs', 'cleveland', 'clinic', 'alignerr', 'upwork', 'ivynova', 'sr systems'])) return A.experience(job);
    var school = (P.education || []).filter(function (e) { var n = norm(e.school); return terms(q).some(function (w) { return w.length > 3 && has(n, [w]); }); })[0];
    if (school && has(q, ['study', 'studied', 'school', 'university', 'college', 'degree', 'masters', 'master', 'education', 'wesleyan', 'jntuh'])) return A.education(school);

    // playlists by topic
    if (has(q, ['playlist', 'playlists', 'videos on', 'videos about', 'video about', 'watch', 'topic', 'content about', 'which channel has', 'which channel covers'])) { var pa = A.playlists(raw) || search(raw); if (pa) return pa; }
    if (has(q, ['experience', 'work history', 'career', 'jobs', 'job', 'worked', 'working', 'employer', 'company', 'companies', 'current role', 'profession', 'what does he do'])) return A.experience();
    if (has(q, ['education', 'degree', 'study', 'studied', 'university', 'college', 'masters', 'school', 'qualification'])) return A.education();
    if (has(q, ['skill', 'skills', 'tech stack', 'stack', 'technologies', 'tools', 'languages he', 'know python', 'bigquery', 'gcp', 'python', 'sql', 'react', 'gemini', 'vertex', 'terraform', 'docker', 'power bi', 'tableau', 'airflow', 'dataflow', 'supabase', 'firebase', 'typescript', 'javascript', 'machine learning', 'llm'])) return A.skills(raw);
    if (has(q, ['resume', 'cv', 'portfolio', 'github', 'linkedin'])) return A.resume();
    if (has(q, ['where does he live', 'where is he', 'location', 'based', 'live', 'city', 'country'])) return A.location();
    if (has(q, ['who is', 'about', 'bio', 'introduce', 'profile', 'tell me about him', 'yourself', 'founder', 'creator', 'owner'])) return A.about();
    if (has(q, ['lottery', 'lucky draw', 'draw', 'giveaway', 'winner', 'winners', 'prize', 'raffle'])) return A.lottery();
    if (has(q, ['official channel', 'main channel', 'personal channel', 'pujithsakhamuri', '@pujithsakhamuri', 'subscribe'])) return A.official();

    // website categories / all websites
    if (has(q, ['ai studio', 'ai apps', 'ai app', 'gemini apps', 'ai tools'])) return A.websiteCat('Google AI Studio app');
    if (has(q, ['data platform', 'data platforms', 'data projects', 'featured'])) return A.websiteCat('Featured data platform');
    if (has(q, ['tools', 'web apps', 'expense', 'manager apps', 'business apps'])) return A.websiteCat('Web app & tool');
    if (has(q, ['website', 'websites', 'site', 'sites', 'projects', 'project', 'apps', 'app', 'built', 'portfolio projects', 'repos', 'repositories'])) return A.websitesAll();


    // channel groups
    for (var i = 0; i < GROUPS.length; i++) if (has(q, [norm(GROUPS[i][0])].concat(GROUPS[i][2].split(' ').map(function (w) { return w + ' channels'; })))) return A.group(GROUPS[i][0]);
    if (has(q, ['channels', 'channel', 'youtube', 'how many channels', 'network', 'groups'])) return A.channelsOverview();
    if (has(q, ['social', 'socials', 'follow', 'accounts', 'platforms', 'social media', 'hub'])) return A.socialAll();
    if (has(q, ['how many', 'stats', 'numbers', 'overview', 'summary', 'at a glance'])) return A.stats();
    if (has(q, ['how to use', 'navigate', 'navigation', 'where is', 'how do i', 'site map', 'pages', 'solar', 'grid view', 'planets'])) return A.navigate();

    // last resort: search everything
    return search(raw);
  }

  function search(raw) {
    var tt = expand(terms(raw)); if (!tt.length) return null;
    var hits = [];
    function score(text) { var n = norm(text); return tt.filter(function (w) { return w.length > 2 && n.indexOf(w) >= 0; }).length; }
    channels().forEach(function (c) { var s = score(c.name + ' ' + c.handle + ' ' + (c.playlists || []).join(' ')); if (s) hits.push([s + 0.5, 'Channel: ' + c.name + ' (' + c.handle + ')', c.url]); });
    SITES.forEach(function (w) { var s = score(w.title + ' ' + w.description + ' ' + w.tech); if (s) hits.push([s, 'Website: ' + w.title + ' — ' + w.description, w.url]); });
    SOCIAL.forEach(function (x) { var s = score(x.platform + ' ' + x.handle); if (s) hits.push([s, x.platform + ': ' + x.handle, x.url]); });
    (P.experience || []).forEach(function (j) { var s = score(j.title + ' ' + j.company + ' ' + j.text); if (s) hits.push([s, 'Experience: ' + j.title + ' at ' + j.company, null]); });
    (P.skills || []).forEach(function (k) { var s = score(k.items); if (s) hits.push([s, 'Skills — ' + k.area, null]); });
    hits.sort(function (a, b) { return b[0] - a[0]; });
    if (!hits.length) return null;
    return { t: 'Here’s what I found on the site:\n' + hits.slice(0, 6).map(function (h) { return '• ' + h[1]; }).join('\n'), links: uniq(hits.filter(function (h) { return h[2]; }).slice(0, 3).map(function (h) { return [h[1].split(' — ')[0].replace(/^(Channel|Website): /, ''), h[2]]; })) };
  }
  function unknown() {
    return { t: 'I couldn’t find that on the site. Try asking about Pujith’s experience, a channel or topic, a website, social accounts, or contact info. You can also email ' + EMAIL + '.', links: [['✉️ Email Pujith', 'mailto:' + EMAIL], ['🌐 Social Hub', hubHref('social')]], chips: ['What can you do?', 'List the channel groups', 'Show the websites'] };
  }

  // ---------- optional online fallback (only when the site has no answer) ----------
  var SB_URL = (function () { try { return localStorage.getItem('pv_sb_url') || 'https://kykkbramlsychystjqba.supabase.co'; } catch (e) { return ''; } })();
  var SB_KEY = (function () { try { return localStorage.getItem('pv_sb_key') || 'sb_publishable_OcsI13nc3Xy5ak_BHAhJMA_lFhAf8EO'; } catch (e) { return ''; } })();
  function sid() { try { var s = sessionStorage.getItem('pv_chat_sid'); if (!s) { s = Math.random().toString(36).slice(2); sessionStorage.setItem('pv_chat_sid', s); } return s; } catch (e) { return 'anon'; } }
  function online(q) {
    if (!navigator.onLine || !SB_URL) return Promise.resolve(null);
    var ctl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 7000);
    return fetch(SB_URL.replace(/\/$/, '') + '/functions/v1/chat-agent', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY }, body: JSON.stringify({ message: q, session_id: sid() }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { clearTimeout(timer); return j && j.reply ? { t: String(j.reply) } : null; })
      .catch(function () { clearTimeout(timer); return null; });
  }
  function logMsg(role, content) {
    if (!navigator.onLine || !SB_URL) return;
    try { fetch(SB_URL + '/rest/v1/messages', { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ session_id: sid(), role: role, content: String(content).slice(0, 3900) }) }).catch(function () {}); } catch (e) {}
  }

  // ---------- UI ----------
  var css = '.pvg-btn{position:fixed;right:22px;bottom:22px;z-index:' + Z + ';width:58px;height:58px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:radial-gradient(circle at 32% 28%,#ffffffcc,#22d3ee 40%,#7c3aed 95%);box-shadow:0 0 24px 4px rgba(34,211,238,.45);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:27px;transition:transform .2s}' +
    '.pvg-btn:hover{transform:scale(1.08)}.pvg-btn .pvg-dot{position:absolute;top:4px;right:4px;width:12px;height:12px;border-radius:50%;background:#4ade80;border:2px solid #07070f}' +
    '.pvg-panel{position:fixed;right:22px;bottom:92px;z-index:' + Z + ';width:min(380px,calc(100vw - 28px));height:min(580px,calc(100vh - 120px));display:none;flex-direction:column;border-radius:20px;overflow:hidden;background:rgba(10,10,24,.97);border:1px solid rgba(255,255,255,.12);box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:"DM Sans","Inter",system-ui,sans-serif;color:#e8e8f8}' +
    '.pvg-panel.on{display:flex;animation:pvgIn .22s ease}@keyframes pvgIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '.pvg-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,rgba(34,211,238,.16),rgba(124,58,237,.18));border-bottom:1px solid rgba(255,255,255,.08)}' +
    '.pvg-head b{display:block;font-family:"Space Grotesk",sans-serif;font-size:15px}.pvg-head small{display:block;font-size:11px;color:rgba(255,255,255,.6)}.pvg-head .pvg-x{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.6);font-size:20px;cursor:pointer;padding:4px 8px}' +
    '.pvg-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}' +
    '.pvg-m{max-width:88%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;word-wrap:break-word}' +
    '.pvg-m.bot{align-self:flex-start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-bottom-left-radius:4px}' +
    '.pvg-m.me{align-self:flex-end;background:linear-gradient(135deg,#0891b2,#7c3aed);color:#fff;border-bottom-right-radius:4px}' +
    '.pvg-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.pvg-links a{font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px;background:rgba(34,211,238,.14);border:1px solid rgba(34,211,238,.4);color:#a5f3fc;text-decoration:none;white-space:normal}.pvg-links a:hover{background:rgba(34,211,238,.25);color:#fff}' +
    '.pvg-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}.pvg-chips button{font-size:12px;padding:6px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#e8e8f8;cursor:pointer;font-family:inherit}.pvg-chips button:hover{border-color:#c084fc}' +
    '.pvg-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08)}.pvg-form input{flex:1;min-width:0;padding:11px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#e8e8f8;font-size:14px;outline:none;font-family:inherit}.pvg-form input:focus{border-color:#22d3ee}' +
    '.pvg-form button{padding:0 16px;border-radius:12px;border:none;background:linear-gradient(135deg,#22d3ee,#c084fc);color:#07070f;font-weight:800;cursor:pointer}' +
    '.pvg-typing{align-self:flex-start;font-size:12px;color:rgba(255,255,255,.5);padding:2px 4px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var btn = el('button', 'pvg-btn'); btn.type = 'button'; btn.setAttribute('aria-label', 'Open the Pujiverse guide'); btn.title = 'Ask the Pujiverse guide'; btn.append('🤖', el('span', 'pvg-dot'));
  var panel = el('div', 'pvg-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Pujiverse guide');
  var head = el('div', 'pvg-head'); var hTxt = el('div'); var status = el('small');
  hTxt.append(el('b', null, '🤖 Pujiverse Guide'), status);
  var x = el('button', 'pvg-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close');
  head.append(el('span', null, ''), hTxt, x);
  var log = el('div', 'pvg-log'); var chips = el('div', 'pvg-chips');
  var form = el('form', 'pvg-form'); var input = el('input'); input.placeholder = 'Ask about Pujith, channels, websites…'; input.setAttribute('aria-label', 'Your question');
  var send = el('button', null, 'Send'); send.type = 'submit';
  form.append(input, send);
  panel.append(head, log, chips, form);
  function mount() { document.body.append(panel, btn); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function setStatus() { status.textContent = navigator.onLine ? 'Online · answers from site data' : 'Offline mode · still knows everything on this site'; }
  addEventListener('online', setStatus); addEventListener('offline', setStatus); setStatus();

  function safe(u) { var s = String(u || ''); if (/^(https?:|mailto:|tel:)/i.test(s) || /^(#|[\w-]+\.html)/i.test(s)) return s; return '#'; }
  function render(m) {
    var b = el('div', 'pvg-m ' + (m.r === 'me' ? 'me' : 'bot'), m.t);
    if (m.links && m.links.length) {
      var lk = el('div', 'pvg-links');
      m.links.filter(Boolean).forEach(function (l) {
        var a = el('a', null, l[0]); a.href = safe(l[1]);
        if (/^https?:/i.test(l[1])) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        else if (/^#/.test(l[1])) a.addEventListener('click', function () { if (PAGE === 'home') panel.classList.remove('on'); });
        if (PAGE === 'channels' && /index\.html#social$/.test(l[1]) && window.pvGoHub) a.addEventListener('click', function (e) { e.preventDefault(); window.pvGoHub(); panel.classList.remove('on'); });
        lk.append(a);
      });
      b.append(lk);
    }
    log.append(b); log.scrollTop = log.scrollHeight;
  }
  function setChips(list) {
    chips.replaceChildren();
    (list || []).forEach(function (c) { var bt = el('button', null, c); bt.type = 'button'; bt.addEventListener('click', function () { ask(c); }); chips.append(bt); });
  }
  var hist = []; try { hist = JSON.parse(sessionStorage.getItem('pv_chat_hist') || '[]'); } catch (e) {}
  function save() { try { sessionStorage.setItem('pv_chat_hist', JSON.stringify(hist.slice(-30))); } catch (e) {} }
  function push(m) { hist.push(m); save(); render(m); }
  function start() {
    if (hist.length) { hist.forEach(render); setChips(['What can you do?', 'Contact info']); return; }
    var hi = A.greet();
    if (PAGE === 'lottery') hi = { t: 'Hi! 👋 I’m the Pujiverse guide. Ask me how the lucky draw works, or anything about Pujith, his channels and websites.', chips: ['How does the lottery work?', 'Contact info', 'List the channel groups'] };
    if (PAGE === 'channels') hi = { t: 'Hi! 👋 I know all ' + channels().length + ' channels and their playlists. Ask me about a channel, a topic, or anything about Pujith.', chips: ['List the channel groups', 'Which channel has cooking?', 'Official channel'] };
    push({ r: 'bot', t: hi.t, links: hi.links }); setChips(hi.chips);
  }
  var busy = false;
  function ask(text) {
    var q = String(text || '').trim(); if (!q || busy) return;
    push({ r: 'me', t: q }); logMsg('user', q); input.value = '';
    busy = true;
    var typing = el('div', 'pvg-typing', 'Guide is typing…'); log.append(typing); log.scrollTop = log.scrollHeight;
    var local = null; try { local = answer(q); } catch (e) { local = null; }
    var go = local ? Promise.resolve(local) : online(q).then(function (r) { return r || unknown(); });
    go.then(function (a) {
      setTimeout(function () {
        typing.remove();
        push({ r: 'bot', t: a.t, links: (a.links || []).filter(Boolean) });
        setChips(a.chips || []); logMsg('assistant', a.t); busy = false;
      }, local ? 280 : 0);
    });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  var started = false;
  btn.addEventListener('click', function () { panel.classList.toggle('on'); if (!started) { started = true; start(); } if (panel.classList.contains('on')) setTimeout(function () { input.focus(); }, 50); });
  x.addEventListener('click', function () { panel.classList.remove('on'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') panel.classList.remove('on'); });

  window.pvAskGuide = function (q) { panel.classList.add('on'); if (!started) { started = true; start(); } ask(q); };
  window.pvGuideAnswer = answer;
})();
