(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ================= AUDIO ================= */
  let ctx, master, analyser;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      master.connect(analyser);
      analyser.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  document.addEventListener('pointerdown', audio, { capture: true });
  document.addEventListener('keydown', audio, { capture: true });

  let uiSound = store.get('rahulos-sound') === 'on';
  const soundBtn = $('#soundBtn');
  soundBtn.setAttribute('aria-pressed', uiSound);
  soundBtn.addEventListener('click', () => {
    uiSound = !uiSound;
    soundBtn.setAttribute('aria-pressed', uiSound);
    store.set('rahulos-sound', uiSound ? 'on' : 'off');
    blip(880, .08);
  });

  function blip(freq = 660, dur = .05, vol = .05) {
    if (!uiSound || !audio() || ctx.state !== 'running') return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + dur + .05);
    o.connect(g).connect(master);
    o.start(); o.stop(ctx.currentTime + dur + .06);
  }

  /* ================= BOOT ================= */
  const boot = $('#boot');
  const bootLines = [
    ['Powering up', ''],
    ['Product systems · 30M+ users', 'ONLINE'],
    ['AI consulting core', 'ONLINE'],
    ['Author module · Agentic Product Playbook', 'LOADED'],
    ['Guitar', 'TUNED'],
    ['Peace protocol', 'STANDBY'],
  ];
  let bootDone = false;
  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    boot.classList.add('done');
    try { sessionStorage.setItem('rahulos-booted', '1'); } catch (e) {}
    setTimeout(() => { boot.hidden = true; }, 900);
    route();
  }
  let seen = false;
  try { seen = sessionStorage.getItem('rahulos-booted') === '1'; } catch (e) {}
  if (reduced || seen || location.hash.length > 1) {
    boot.hidden = true; bootDone = true;
  } else {
    const box = $('#bootLines'), bar = $('#bootBar');
    bootLines.forEach(([t, ok], i) => setTimeout(() => {
      if (bootDone) return;
      const d = document.createElement('div');
      d.innerHTML = `${t}${ok ? `<span class="ok">${ok}</span>` : ''}`;
      box.appendChild(d);
      bar.style.width = ((i + 1) / bootLines.length * 100) + '%';
    }, 350 + i * 380));
    setTimeout(finishBoot, 350 + bootLines.length * 380 + 700);
    $('#bootSkip').addEventListener('click', finishBoot);
    boot.addEventListener('click', finishBoot);
    addEventListener('keydown', e => { if (!bootDone && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) finishBoot(); });
  }

  /* ================= PARTICLE FIELD ================= */
  const cv = $('#field'), cx2 = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(140, Math.round(W * H / 11000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.4 + .3,
    }));
  }
  size();
  addEventListener('resize', size);
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function cssVar(n) { return getComputedStyle(document.body).getPropertyValue(n).trim(); }
  let c1 = cssVar('--c1');
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }
  function frame() {
    const peace = document.body.classList.contains('peace');
    const sp = peace ? .25 : 1;
    cx2.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx * sp; p.y += p.vy * sp;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140 && !peace) { p.x += dx / d * .6; p.y += dy / d * .6; }
      cx2.fillStyle = hexA(c1, .55);
      cx2.beginPath(); cx2.arc(p.x, p.y, p.r, 0, 6.283); cx2.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 110) {
        cx2.strokeStyle = hexA(c1, (1 - d / 110) * .14);
        cx2.beginPath(); cx2.moveTo(a.x, a.y); cx2.lineTo(b.x, b.y); cx2.stroke();
      }
    }
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();

  /* ================= HUB ================= */
  const ticks = $('.ring-ticks');
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, r1 = 128, r2 = i % 5 ? 132 : 138;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', 150 + Math.cos(a) * r1); l.setAttribute('y1', 150 + Math.sin(a) * r1);
    l.setAttribute('x2', 150 + Math.cos(a) * r2); l.setAttribute('y2', 150 + Math.sin(a) * r2);
    ticks.appendChild(l);
  }

  const stage = $('#hubStage'), links = $('#links');
  function drawLinks() {
    const sr = stage.getBoundingClientRect();
    links.innerHTML = '';
    links.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    const cxp = sr.width / 2, cyp = sr.height / 2;
    $$('.node').forEach(n => {
      const r = $('.node-ring', n).getBoundingClientRect();
      const x = r.left + r.width / 2 - sr.left, y = r.top + r.height / 2 - sr.top;
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const ang = Math.atan2(y - cyp, x - cxp), inner = sr.width * .21;
      l.setAttribute('x1', cxp + Math.cos(ang) * inner); l.setAttribute('y1', cyp + Math.sin(ang) * inner);
      l.setAttribute('x2', x - Math.cos(ang) * 32); l.setAttribute('y2', y - Math.sin(ang) * 32);
      l.dataset.module = n.dataset.module;
      links.appendChild(l);
    });
  }
  addEventListener('resize', drawLinks);
  addEventListener('load', drawLinks);
  setTimeout(drawLinks, 50);

  $$('.node').forEach(n => {
    n.addEventListener('pointerenter', () => {
      blip(520 + Math.random() * 200, .04, .03);
      const l = $(`line[data-module="${n.dataset.module}"]`, links); if (l) l.classList.add('hot');
    });
    n.addEventListener('pointerleave', () => $$('line.hot', links).forEach(l => l.classList.remove('hot')));
    n.addEventListener('click', () => go(n.dataset.module));
  });
  $('#core').addEventListener('click', () => go('about'));

  if (!reduced && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', e => {
      if (document.body.classList.contains('panel-open') || innerWidth <= 600) return;
      const rx = (e.clientY / innerHeight - .5) * -8, ry = (e.clientX / innerWidth - .5) * 10;
      stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }

  const clock = $('#clock');
  function tick() {
    clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick(); setInterval(tick, 1000);

  /* ================= ROUTING / PANELS ================= */
  const modules = ['product', 'consulting', 'music', 'peace', 'author', 'about'];
  let current = null, lastFocus = null;
  function go(m) { if (location.hash === '#' + m) route(); else location.hash = m; }
  function home() { history.pushState('', document.title, location.pathname + location.search); route(); }
  function route() {
    const m = location.hash.slice(1);
    if (current) { $('#panel-' + current).hidden = true; onClose(current); }
    if (modules.includes(m)) {
      lastFocus = lastFocus || document.activeElement;
      const p = $('#panel-' + m);
      p.hidden = false;
      document.body.classList.add('panel-open');
      current = m;
      blip(440, .12, .05);
      $('.close', p).focus({ preventScroll: true });
      p.querySelector('.panel-frame').scrollTop = 0;
      onOpen(m);
    } else {
      current = null;
      document.body.classList.remove('panel-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }
  }
  addEventListener('hashchange', route);
  $$('[data-close]').forEach(b => b.addEventListener('click', home));
  $$('.panel').forEach(p => p.addEventListener('click', e => { if (e.target === p) home(); }));
  $$('[data-home]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); home(); }));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#cmd').hidden) return closeCmd();
    if (e.key === 'Escape' && current) home();
  });

  function onOpen(m) {
    if (m === 'product') countUp();
    if (m === 'music') { buildStrings(); startScope(); }
  }
  function onClose(m) {
    if (m === 'music') stopScope();
  }

  /* ================= PRODUCT ================= */
  function countUp() {
    $$('#panel-product [data-count]').forEach(el => {
      const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      if (reduced) { el.textContent = pre + end + suf; return; }
      const t0 = performance.now(), dur = 1200;
      const step = t => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + Math.round(end * e) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  $$('.mission-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.mission-tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    $$('.mission').forEach(x => x.hidden = x.dataset.m !== b.dataset.m);
    blip(700, .04, .03);
  }));

  const suits = [
    { org: 'John Deere', role: 'Graduate Engineer Trainee', when: '2014 – 2015', cap: 'Engineering core',
      text: 'Built IoT machine-monitoring apps for intelligent tractor displays and GPS integration for autonomous tractors. Named "Star of the Sprint" twice.' },
    { org: 'Wipro Technologies', role: 'Product Manager · Way2Go', when: '2017 – 2018', cap: 'Product from zero',
      text: 'Took a B2B travel SaaS from inception to launch on Azure. Added 50% more content through an OTA partnership, removed about 16 FTEs of operational overhead, and handled $10M a month in transactions.' },
    { org: 'Accenture Strategy', role: 'Management Consultant · Digital Travel', when: '2018 – 2022', cap: 'Strategy & scale',
      text: 'Led digital transformation for Malaysia Airlines and Qatar Airways: app and web strategy, loyalty transformation, and an 11% DAU lift.' },
    { org: 'JSW One Platforms', role: 'Senior Product Manager · Salesforce Web + Mobile', when: '2022 – 2024', cap: 'Marketplace at $1B',
      text: 'Built a B2B commerce platform for 30K+ MSMEs from scratch, owned its $1B GMV enablement, and set up a 9-member engineering and design team.' },
    { org: 'Vodafone Idea', role: 'GM – Product Manager · Vi App', when: '2024 – Present', cap: 'AI at 30M-user scale',
      text: 'Lead the AI and prepaid portfolio with a 40-member team owning 70% of app revenue. Launched telecom\'s first LLM recharge agent (50K+ recharges a month) and won the Best Use of AI award.' },
  ];
  function showSuit(i) {
    const s = suits[i];
    $$('.suit').forEach((b, j) => b.classList.toggle('active', j === i));
    $('#suitDetail').innerHTML = `<h4>${s.org}<small>${s.role} · ${s.when}</small></h4><p>${s.text}</p><div class="cap">Capability unlocked · ${s.cap}</div>`;
    $('#suitDetail').style.animation = 'none'; void $('#suitDetail').offsetWidth; $('#suitDetail').style.animation = '';
  }
  $$('.suit').forEach((b, i) => b.addEventListener('click', () => { showSuit(i); blip(500 + i * 90, .06, .04); }));
  showSuit(4);

  /* ================= CONSULTING SCAN ================= */
  const pick = { industry: null, goal: null, g: null };
  $$('.opts').forEach(group => group.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', group).forEach(x => x.classList.toggle('sel', x === b));
    pick[group.dataset.key] = b.textContent;
    if (b.dataset.g) pick.g = b.dataset.g;
    $('#scanRun').disabled = !(pick.industry && pick.goal);
    blip(760, .04, .03);
  }));
  const plays = {
    revenue: [
      ['Conversational commerce', 'An agent that understands intent and completes the purchase in chat, the same pattern behind 50K+ monthly recharges at Vi.'],
      ['Next-best-offer engine', 'LLM-ranked offers built from usage signals, personalised per user and tested against your control group.'],
      ['Churn-save agent', 'Spots at-risk users early and gives them a tailored offer before they leave.'],
    ],
    support: [
      ['Self-serve resolution agent', 'Handle the top 20 intents end to end, with guardrails and handoff to a human.'],
      ['Omnichannel triage', 'Route IVR, WhatsApp and email by intent and urgency. This cut response time 80% at JSW One.'],
      ['Agent-assist copilot', 'Live summaries and suggested replies for your human team.'],
    ],
    engage: [
      ['Gamification loops', 'Streaks, rewards and missions tied to business KPIs. Each program added 2–5M MAU at Vi.'],
      ['Personalised home', 'AI-ranked surfaces so every user sees their most relevant next action first.'],
      ['Review intelligence', 'Turn app-store and support feedback into a ranked roadmap automatically.'],
    ],
    ship: [
      ['Build vs. buy vs. rent call', 'Choose between API, open-weight or fine-tuned models based on the unit economics.'],
      ['Two-week prototype', 'n8n, Supabase and an LLM wired to a real user flow to validate before you scale.'],
      ['Production readiness', 'Evals, guardrails, payments and monitoring, so the prototype becomes a product.'],
    ],
  };
  const flavour = {
    'Telecom': 'recharges, plans and roaming',
    'E-commerce / D2C': 'catalogue, cart and repeat purchase',
    'Fintech': 'onboarding, KYC and payments',
    'SaaS': 'activation, expansion and support',
    'Travel': 'booking, loyalty and disruption handling',
    'Other': 'your highest-volume user journeys',
  };
  $('#scanRun').addEventListener('click', () => {
    const con = $('#scanConsole'), res = $('#scanResult');
    con.hidden = false; res.hidden = true;
    con.innerHTML = '';
    const steps = [`Target sector · ${pick.industry}`, `Objective · ${pick.goal}`, `Mapping journeys · ${flavour[pick.industry]}`, 'Scoring AI leverage vs. effort'];
    steps.forEach((s, i) => setTimeout(() => {
      const d = document.createElement('div'); d.textContent = s; con.appendChild(d); blip(600 + i * 80, .03, .03);
    }, i * (reduced ? 0 : 380)));
    const bar = document.createElement('div'); bar.className = 'bar'; bar.innerHTML = '<i></i>';
    setTimeout(() => { con.appendChild(bar); requestAnimationFrame(() => $('i', bar).style.width = '100%'); }, reduced ? 0 : 1500);
    setTimeout(() => {
      const ps = plays[pick.g];
      res.innerHTML = `<h4>Scan complete · 3 opportunities for ${pick.industry}</h4>
        <div class="opps">${ps.map((p, i) => `<div class="opp"><i>OPPORTUNITY 0${i + 1}</i><b>${p[0]}</b><p>${p[1]}</p></div>`).join('')}</div>`;
      res.hidden = false;
      const subj = encodeURIComponent(`AI consulting · ${pick.industry} · ${pick.goal}`);
      $('#consultMail').href = `mailto:rahultirmale@gmail.com?subject=${subj}`;
      $('#consultMail').textContent = 'Discuss these with Rahul →';
      blip(990, .15, .05);
    }, reduced ? 50 : 3300);
  });

  /* ================= BUILDER'S LAB ================= */
  const LABEL = { live: 'LIVE', proto: 'PROTOTYPE', soon: 'LAUNCHING SOON' };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const projects = window.PROJECTS || [];
  $('#systems').innerHTML = projects.map(p => {
    const inner = `<i></i><div class="top"><b>${esc(p.name)}</b><em>${LABEL[p.status]}</em></div><span>${esc(p.desc)}</span><small>${esc(p.domain)}${p.status === 'soon' ? '' : ' ↗'}${p.next ? ` · moving to ${esc(p.next)}` : ''}</small>`;
    return p.status === 'soon'
      ? `<div class="soon">${inner}</div>`
      : `<a class="${p.status}" href="${esc(p.url)}" target="_blank" rel="noopener">${inner}</a>`;
  }).join('');
  const n = s => projects.filter(p => p.status === s).length;
  $('#labCount').textContent = [[n('live'), 'live'], [n('proto'), 'prototypes'], [n('soon'), 'launching soon']].filter(x => x[0]).map(x => x.join(' ')).join(' · ');

  /* ================= GUITAR ================= */
  // Strings listed high → low (tab order). Open-string frequencies in Hz.
  const OPEN = [329.63, 246.94, 196.0, 146.83, 110.0, 82.41];
  const NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
  const CHORDS = {
    open: [0, 0, 0, 0, 0, 0],
    Em: [0, 0, 0, 2, 2, 0],
    G: [3, 0, 0, 0, 2, 3],
    C: [0, 1, 0, 2, 3, null],
    D: [2, 3, 2, 0, null, null],
    Am: [0, 1, 2, 2, 0, null],
  };
  let chord = 'open';
  const bufCache = new Map();

  function pluckBuffer(freq) {
    const key = freq.toFixed(2);
    if (bufCache.has(key)) return bufCache.get(key);
    const sr = ctx.sampleRate, len = Math.floor(sr * 2.6), N = Math.round(sr / freq);
    const buf = ctx.createBuffer(1, len, sr), out = buf.getChannelData(0);
    const ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    // soften the initial burst for a warmer pick attack
    for (let p = 0; p < 2; p++) for (let i = 1; i < N; i++) ring[i] = (ring[i] + ring[i - 1]) / 2;
    const decay = freq < 120 ? .9965 : .9952;
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const nxt = (idx + 1) % N;
      const v = ring[idx];
      out[i] = v;
      ring[idx] = (v + ring[nxt]) * .5 * decay;
      idx = nxt;
    }
    bufCache.set(key, buf);
    return buf;
  }
  function pluck(i, vel = 1) {
    const fret = CHORDS[chord][i];
    const el = $$('.string')[i];
    if (el) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
    if (fret === null) return;
    if (!audio() || ctx.state !== 'running') return;
    const f = OPEN[i] * Math.pow(2, fret / 12);
    const src = ctx.createBufferSource(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    src.buffer = pluckBuffer(f);
    lp.type = 'lowpass'; lp.frequency.value = 3200 + vel * 1800;
    g.gain.value = .55 * vel;
    src.connect(lp).connect(g).connect(master);
    src.start();
  }
  function strum(down = true) {
    const order = down ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
    order.forEach((s, k) => setTimeout(() => pluck(s, .85), k * 28));
  }

  const fb = $('#fretboard');
  let built = false, lastY = null;
  function buildStrings() {
    if (built) return; built = true;
    OPEN.forEach((_, i) => {
      const s = document.createElement('div');
      s.className = 'string';
      s.style.top = (14 + i * 14.4) + '%';
      s.style.setProperty('--th', (1 + i * .55).toFixed(2) + 'px');
      s.innerHTML = `<label>${NAMES[i]}</label>`;
      fb.appendChild(s);
    });
  }
  function stringYs() {
    const r = fb.getBoundingClientRect();
    return $$('.string', fb).map(s => { const b = s.getBoundingClientRect(); return b.top + b.height / 2 - r.top; });
  }
  fb.addEventListener('pointerdown', e => {
    audio();
    fb.setPointerCapture(e.pointerId);
    const y = e.clientY - fb.getBoundingClientRect().top;
    const ys = stringYs();
    let best = -1, bd = 14;
    ys.forEach((sy, i) => { const d = Math.abs(sy - y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) pluck(best);
    lastY = y;
  });
  fb.addEventListener('pointermove', e => {
    const y = e.clientY - fb.getBoundingClientRect().top;
    if (lastY === null) { lastY = y; return; }
    const lo = Math.min(lastY, y), hi = Math.max(lastY, y);
    const ys = stringYs();
    const crossed = ys.map((sy, i) => [sy, i]).filter(([sy]) => sy > lo && sy <= hi);
    if (y < lastY) crossed.reverse();
    const vel = Math.min(1, .5 + Math.abs(y - lastY) / 60);
    crossed.forEach(([, i], k) => setTimeout(() => pluck(i, vel), k * 8));
    lastY = y;
  });
  fb.addEventListener('pointerleave', () => { lastY = null; });

  $('#chords').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'strumBtn') return strum(true);
    chord = b.dataset.chord;
    $$('#chords [data-chord]').forEach(x => x.classList.toggle('on', x === b));
    strum(true);
  });
  addEventListener('keydown', e => {
    if (current !== 'music' || e.target.tagName === 'INPUT') return;
    const k = +e.key;
    if (k >= 1 && k <= 6) pluck(k - 1);
    if (e.key === ' ') { e.preventDefault(); strum(true); }
  });

  // oscilloscope
  const scope = $('#scope'), sc = scope.getContext('2d');
  let scopeOn = false;
  function startScope() { scopeOn = true; drawScope(); }
  function stopScope() { scopeOn = false; }
  function drawScope() {
    if (!scopeOn) return;
    const w = scope.clientWidth, h = scope.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    if (scope.width !== w * dpr) { scope.width = w * dpr; scope.height = h * dpr; }
    sc.setTransform(dpr, 0, 0, dpr, 0, 0);
    sc.clearRect(0, 0, w, h);
    sc.strokeStyle = c1; sc.lineWidth = 1.5; sc.shadowColor = c1; sc.shadowBlur = 8;
    sc.beginPath();
    if (analyser) {
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);
      for (let i = 0; i < data.length; i++) {
        const x = i / (data.length - 1) * w, y = h / 2 + (data[i] - 128) / 128 * h * 1.4;
        i ? sc.lineTo(x, y) : sc.moveTo(x, y);
      }
    } else { sc.moveTo(0, h / 2); sc.lineTo(w, h / 2); }
    sc.stroke();
    requestAnimationFrame(drawScope);
  }

  // video (load the embed only on demand)
  $('#videoPlay').addEventListener('click', () => {
    $('#video').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/c7MWCOf640A?autoplay=1&rel=0" title="Hotel California guitar solo cover by Rahul Tirmale" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  });

  /* ================= PEACE ================= */
  const powerBtn = $('#powerBtn');
  function setPeace(on) {
    document.body.classList.toggle('peace', on);
    c1 = cssVar('--c1');
    powerBtn.textContent = on ? 'Power the suit back up' : 'Power down the suit';
    $('#hudStatus').innerHTML = on ? '<span class="pulse"></span>PEACE PROTOCOL ACTIVE' : '<span class="pulse"></span>ALL SYSTEMS NOMINAL';
    blip(on ? 330 : 660, .3, .04);
  }
  powerBtn.addEventListener('click', () => setPeace(!document.body.classList.contains('peace')));

  let breathing = false;
  $('#breathBtn').addEventListener('click', async () => {
    if (breathing) return;
    breathing = true;
    if (!document.body.classList.contains('peace')) setPeace(true);
    const c = $('.breath-circle'), t = $('#breathText');
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 3; i++) {
      c.className = 'breath-circle in'; t.textContent = 'Breathe in'; await wait(4000);
      t.textContent = 'Hold'; await wait(3000);
      c.className = 'breath-circle out'; t.textContent = 'Breathe out'; await wait(6000);
    }
    c.className = 'breath-circle'; t.textContent = 'Peace'; breathing = false;
  });

  /* ================= BOOK ================= */
  const book = $('.book'), b3 = $('#book3d');
  let rotY = -28, rotX = 6, drag = null;
  b3.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX }; b3.setPointerCapture(e.pointerId); b3.style.cursor = 'grabbing'; });
  b3.addEventListener('pointermove', e => {
    if (!drag) return;
    rotY = drag.ry + (e.clientX - drag.x) * .6;
    rotX = Math.max(-25, Math.min(25, drag.rx - (e.clientY - drag.y) * .3));
    book.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  });
  b3.addEventListener('pointerup', () => { drag = null; b3.style.cursor = ''; });

  /* ================= COMMAND BAR ================= */
  const cmds = [
    { t: 'Product leadership & case studies', k: 'product leader work career 1b gmv 30m vi jsw experience missions hire', run: () => go('product') },
    { t: "Builder's lab: everything I've shipped", k: 'projects lab side built shipped vibe code apps portfolio saas', run: () => { go('consulting'); setTimeout(() => $('#lab').scrollIntoView({ behavior: 'smooth' }), 400); } },
    { t: 'Run AI opportunity scan', k: 'ai consulting consult scan advisory hire help', run: () => go('consulting') },
    { t: 'Play the guitar', k: 'guitar music musician play song solo hotel california', run: () => go('music') },
    { t: 'Enter peace mode', k: 'peace calm breathe relax power down', run: () => { go('peace'); } },
    { t: 'The Agentic Product Playbook', k: 'book author writing read amazon playbook posts', run: () => go('author') },
    { t: 'Recruiter mode (one-page résumé)', k: 'recruiter resume cv hire one page simple', run: () => { location.href = 'recruiter.html'; } },
    { t: 'Download résumé (PDF)', k: 'resume cv pdf download', run: () => { const a = document.createElement('a'); a.href = 'resume.pdf'; a.download = ''; a.click(); } },
    { t: 'Email Rahul', k: 'email contact mail hire reach', run: () => { location.href = 'mailto:rahultirmale@gmail.com'; } },
    { t: 'LinkedIn', k: 'linkedin social profile', run: () => window.open('https://www.linkedin.com/in/rahultirmale', '_blank', 'noopener') },
    { t: 'Toggle interface sounds', k: 'sound audio mute', run: () => soundBtn.click() },
  ];
  const cmd = $('#cmd'), input = $('#cmdInput'), list = $('#cmdList');
  let filtered = cmds, act = 0;
  function renderCmd() {
    const q = input.value.toLowerCase().trim();
    filtered = q ? cmds.filter(c => (c.t + ' ' + c.k).toLowerCase().includes(q) || q.split(/\s+/).every(w => (c.t + ' ' + c.k).toLowerCase().includes(w))) : cmds;
    act = Math.min(act, Math.max(0, filtered.length - 1));
    list.innerHTML = filtered.length
      ? filtered.map((c, i) => `<li role="option" class="${i === act ? 'act' : ''}" data-i="${i}">${c.t}<small>↵</small></li>`).join('')
      : '<li><small>No match. Try “guitar”, “book” or “hire”.</small></li>';
  }
  function openCmd() { cmd.hidden = false; input.value = ''; act = 0; renderCmd(); input.focus(); blip(800, .05, .04); }
  function closeCmd() { cmd.hidden = true; }
  function runCmd(i) { const c = filtered[i]; if (!c) return; closeCmd(); c.run(); }
  $('#cmdBtn').addEventListener('click', openCmd);
  cmd.addEventListener('click', e => { if (e.target === cmd) closeCmd(); });
  input.addEventListener('input', () => { act = 0; renderCmd(); });
  list.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) runCmd(+li.dataset.i); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); act = (act + 1) % filtered.length; renderCmd(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); act = (act - 1 + filtered.length) % filtered.length; renderCmd(); }
    if (e.key === 'Enter') runCmd(act);
  });
  addEventListener('keydown', e => {
    if (!bootDone) return;
    const typing = /INPUT|TEXTAREA/.test(e.target.tagName);
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); openCmd(); }
  });

  if (bootDone) route();
})();
