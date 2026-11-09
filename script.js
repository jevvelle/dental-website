const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const icons = () => window.lucide && lucide.createIcons();
const lockScroll = on => (document.body.style.overflow = on ? 'hidden' : '');
const page = document.body.dataset.page || '';

/* ---------- Shared layout (header, footer, booking, chat) ---------- */
const NAV = [
  ['index.html', 'Home', 'home'], ['treatments.html', 'Treatments', 'treatments'],
  ['simulator.html', 'Care Simulator', 'simulator'], ['results.html', 'Results', 'results'],
  ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']
];
const HEADER = `
<header class="nav glass" id="nav">
  <a class="logo" href="index.html" aria-label="Aurel Dental Studio, home"><span class="logo-mark"></span>Aurel<small>Dental</small></a>
  <nav class="links" aria-label="Main">${NAV.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <button class="btn btn-primary sm" data-book>Book Consultation</button>
  <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i data-lucide="menu"></i></button>
</header>`;

const FOOTER = `
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div><a class="logo" href="index.html"><span class="logo-mark"></span>Aurel<small>Dental</small></a><p>Boutique dentistry for implants, aligners and aesthetic work. One clinician, one plan.</p></div>
      <div><h4>Explore</h4><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Treatments</h4><ul>
        <li><a href="treatments.html#all4">All-on-4 Implants</a></li><li><a href="treatments.html#implants">Dental Implants</a></li>
        <li><a href="treatments.html#aligners">Clear Aligners</a></li><li><a href="treatments.html#veneers">Aesthetic Veneers</a></li>
        <li><a href="treatments.html#whitening">Whitening</a></li></ul></div>
      <div><h4>Visit</h4><ul><li>18 Linden Row, Suite 4</li><li>Mon to Sat, 9:00 to 18:00</li><li>+1 (555) 014 2290</li><li>hello@aureldental.example</li></ul></div>
    </div>
    <div class="foot-base"><span>&copy; 2026 Aurel Dental Studio</span><span>Demo website. Chat answers, prices and images are placeholders.</span></div>
  </div>
</footer>`;

const BOOKING = `
<div class="modal" id="book" role="dialog" aria-modal="true" aria-labelledby="bookTitle" hidden>
  <div class="modal-card">
    <button class="x" data-close aria-label="Close"><i data-lucide="x"></i></button>
    <p class="eyebrow">Step <span id="stepNo">1</span> of 4</p>
    <div class="bar"><i id="stepBar"></i></div>
    <h3 id="bookTitle">Choose a treatment</h3>
    <form id="bookForm" novalidate>
      <fieldset class="chips" data-step="1">
        ${['General consultation', 'All-on-4 Implants', 'Dental implants', 'Clear aligners', 'Aesthetic veneers', 'Whitening']
          .map(t => `<label class="chip"><input type="radio" name="treat" value="${t}"><span>${t}</span></label>`).join('')}
      </fieldset>
      <fieldset data-step="2" hidden>
        <label class="field">Preferred date <input type="date" name="date" id="dateIn"></label>
        <div class="chips">${['09:00', '11:00', '14:00', '16:30'].map(t => `<label class="chip"><input type="radio" name="time" value="${t}"><span>${t}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset data-step="3" hidden>
        <label class="field">Full name <input type="text" name="name" autocomplete="name"></label>
        <label class="field">Email <input type="email" name="email" autocomplete="email"></label>
        <label class="field">Phone (optional) <input type="tel" name="phone" autocomplete="tel"></label>
      </fieldset>
      <fieldset data-step="4" hidden><dl class="summary" id="summary"></dl></fieldset>
      <div class="success" id="success" hidden>
        <span class="ok"><i data-lucide="check"></i></span>
        <h3>You are booked in.</h3>
        <p id="successMsg"></p>
        <button type="button" class="btn btn-primary" data-close>Close</button>
      </div>
      <p class="err" id="err" role="alert"></p>
      <div class="modal-actions" id="actions">
        <button type="button" class="btn btn-line sm" id="back">Back</button>
        <button type="submit" class="btn btn-primary sm" id="next">Next</button>
      </div>
    </form>
  </div>
</div>`;

const CHAT = `
<section class="chat" id="chat" aria-label="Dental AI Assistant">
  <header><span class="av"><i data-lucide="sparkles"></i></span><div><b>Ask Dental AI Assistant</b><small>Typically replies instantly</small></div><button id="chatX" aria-label="Close chat"><i data-lucide="x"></i></button></header>
  <div class="log" id="log" aria-live="polite"></div>
  <div class="qp" id="qp"><button>Estimate Whitening Cost</button><button>Emergency Care Steps</button><button>Book Appointment</button><button>Do implants hurt?</button></div>
  <form id="chatForm" autocomplete="off"><input id="chatIn" placeholder="Type your question" aria-label="Message"><button aria-label="Send"><i data-lucide="send"></i></button></form>
</section>
<button class="fab" id="fab" aria-label="Open Dental AI Assistant" aria-expanded="false"><i data-lucide="message-circle"></i><span class="ping"></span></button>`;

document.body.insertAdjacentHTML('afterbegin', HEADER);
document.body.insertAdjacentHTML('beforeend', FOOTER + BOOKING + CHAT);

/* ---------- Nav ---------- */
const nav = $('#nav'), burger = $('#burger');
burger.onclick = () => burger.setAttribute('aria-expanded', nav.classList.toggle('open'));
$$('.links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .1 });
$$('.rv').forEach(el => io.observe(el));

/* ---------- Tabs (treatments page) ---------- */
const tabWrap = $('[data-tabs]');
if (tabWrap) {
  const tabBtns = $$('[data-tab]', tabWrap), panels = $$('.tpanel', tabWrap);
  const open = (k, push = true) => {
    if (!panels.some(p => p.id === k)) k = tabBtns[0].dataset.tab;
    tabBtns.forEach(b => { const on = b.dataset.tab === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    panels.forEach(p => { p.hidden = p.id !== k; });
    if (push) history.replaceState(null, '', '#' + k);
  };
  tabBtns.forEach(b => b.addEventListener('click', () => open(b.dataset.tab)));
  addEventListener('hashchange', () => open(location.hash.slice(1), false));
  open(location.hash.slice(1), false);
  if (location.hash) setTimeout(() => scrollTo({ top: tabWrap.getBoundingClientRect().top + scrollY - 110 }), 60);
}

/* ---------- Before / after sliders ---------- */
$$('.ba').forEach(ba => {
  const r = $('input', ba);
  r.addEventListener('input', () => ba.style.setProperty('--pos', r.value + '%'));
});

/* ---------- Care Simulator ---------- */
const cv = $('#tooth');
if (cv) {
  $$('.seg button').forEach(b => b.onclick = () => {
    $$('.seg button').forEach(x => x.classList.toggle('on', x === b));
    const clean = b.dataset.view === 'clean';
    $('#view-clean').hidden = !clean; $('#ctl-clean').hidden = !clean;
    $('#view-implant').hidden = clean; $('#ctl-implant').hidden = clean;
  });

  const ctx = cv.getContext('2d');
  const dirt = document.createElement('canvas');
  dirt.width = cv.width; dirt.height = cv.height;
  const dctx = dirt.getContext('2d', { willReadFrequently: true });
  const TOOTH = new Path2D('M60 40C60 15 90 20 100 32C110 20 140 15 140 40C150 80 140 110 135 150C132 190 128 215 115 215C105 215 105 170 100 170C95 170 95 215 85 215C72 215 68 190 65 150C60 110 50 80 60 40Z');
  const place = c => c.setTransform(1.9, 0, 0, 1.9, 10, 10);
  let tool = 'scaler', total = 1, drawing = false, last = null, finished = false, sparkT = 0, raf = 0;

  const render = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    place(ctx);
    const g = ctx.createLinearGradient(50, 20, 150, 215);
    g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#E3ECF6');
    ctx.shadowColor = finished ? 'rgba(125,167,217,.7)' : 'rgba(47,72,96,.18)';
    ctx.shadowBlur = finished ? 36 : 16; ctx.shadowOffsetY = finished ? 0 : 6;
    ctx.fillStyle = g; ctx.fill(TOOTH);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.lineWidth = 2; ctx.strokeStyle = '#C3D3E6'; ctx.stroke(TOOTH);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(dirt, 0, 0);
  };
  const measure = () => {
    const d = dctx.getImageData(0, 0, dirt.width, dirt.height).data; let n = 0;
    for (let i = 3; i < d.length; i += 16) if (d[i] > 40) n++;
    return n;
  };
  const setPct = p => { $('#pct').textContent = p + '%'; $('#pbar').style.width = p + '%'; };
  const resetTooth = () => {
    finished = false; $('#done').hidden = true; $('#hint').style.opacity = 1;
    dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.globalCompositeOperation = 'source-over'; dctx.clearRect(0, 0, dirt.width, dirt.height);
    dctx.save(); place(dctx); dctx.clip(TOOTH);
    dctx.fillStyle = 'rgba(214,190,120,.4)'; dctx.fillRect(0, 0, 200, 230);
    for (let i = 0; i < 46; i++) {
      const x = 50 + Math.random() * 100, y = 22 + Math.random() * 190, r = 4 + Math.random() * 13;
      dctx.fillStyle = i % 3 ? 'rgba(168,124,40,.6)' : 'rgba(226,208,150,.9)';
      dctx.beginPath(); dctx.arc(x, y, r, 0, 7); dctx.fill();
    }
    dctx.restore();
    total = Math.max(measure(), 1); setPct(0); render();
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height, px: e.clientX - r.left, py: e.clientY - r.top }; };
  const sparkle = (px, py) => {
    const s = document.createElement('span'); s.className = 'spark';
    s.style.left = px - 8 + (Math.random() * 24 - 12) + 'px'; s.style.top = py - 8 + (Math.random() * 24 - 12) + 'px';
    $('#cvWrap').append(s); setTimeout(() => s.remove(), 800);
  };
  const chime = () => {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      [660, 880, 1320].forEach((f, i) => {
        const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * .12;
        o.frequency.value = f; g.gain.setValueAtTime(.0001, t);
        g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .4);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + .45);
      });
    } catch (e) {}
  };
  const update = () => {
    raf = 0;
    const p = Math.min(100, Math.round(100 - measure() / total * 100));
    setPct(p);
    if (p >= 96 && !finished) {
      finished = true; setPct(100);
      dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, dirt.width, dirt.height);
      $('#done').hidden = false; chime();
      for (let i = 0; i < 14; i++) setTimeout(() => sparkle(80 + Math.random() * 240, 60 + Math.random() * 320), i * 70);
      render();
    }
  };
  const erase = (a, b) => {
    dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.globalCompositeOperation = 'destination-out';
    dctx.lineCap = 'round'; dctx.lineJoin = 'round';
    if (tool === 'scaler') { dctx.globalAlpha = 1; dctx.lineWidth = 26; }
    else { dctx.globalAlpha = .3; dctx.lineWidth = 56; }
    dctx.strokeStyle = '#000'; dctx.beginPath(); dctx.moveTo(a.x, a.y); dctx.lineTo(b.x, b.y); dctx.stroke();
    dctx.globalAlpha = 1; render();
    if (!raf) raf = requestAnimationFrame(update);
  };
  cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); $('#hint').style.opacity = 0; erase(last, last); });
  cv.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = pos(e); erase(last, p); last = p;
    if (performance.now() - sparkT > 90 && !finished) { sparkT = performance.now(); sparkle(p.px, p.py); }
  });
  ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));
  $$('.tool').forEach(b => b.onclick = () => { tool = b.dataset.tool; $$('.tool').forEach(x => x.classList.toggle('on', x === b)); });
  $('#reset').onclick = resetTooth;
  resetTooth();

  /* Implant visualizer */
  const LAYERS = {
    crown: ['#L-crown', 'The crown is custom porcelain, matched to your neighbouring teeth for shade and translucency.'],
    abut: ['#L-abut', 'The abutment is a small titanium connector that carries the crown above the gum line.'],
    post: ['#L-post', 'The post replaces the root. Bone grows onto its threaded surface over 8 to 12 weeks.']
  };
  $('#explode').addEventListener('input', () => {
    const v = $('#explode').value / 100;
    $('#L-crown').style.transform = `translateY(${-46 * v}px)`;
    $('#L-abut').style.transform = `translateY(${-16 * v}px)`;
    $('#L-post').style.transform = `translateY(${34 * v}px)`;
  });
  $('#layers').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#layers button').forEach(x => x.classList.toggle('on', x === b));
    Object.entries(LAYERS).forEach(([k, [sel]]) => { $(sel).style.opacity = k === b.dataset.layer ? 1 : .25; });
    $('#layerNote').textContent = LAYERS[b.dataset.layer][1];
  });
}

/* ---------- Contact form (demo) ---------- */
const cf = $('#contactForm');
if (cf) cf.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(cf), err = $('#cfErr', cf), ok = $('#cfOk', cf);
  err.textContent = '';
  if (!f.get('name').trim()) return void (err.textContent = 'Please enter your name.');
  if (!/^\S+@\S+\.\S+$/.test(f.get('email'))) return void (err.textContent = 'Please enter a valid email.');
  if (!f.get('message').trim()) return void (err.textContent = 'Please write a short message.');
  ok.hidden = false; cf.reset();
});

/* ---------- Booking modal ---------- */
const modal = $('#book'), form = $('#bookForm');
const TITLES = ['Choose a treatment', 'Pick a date and time', 'Your details', 'Confirm your visit'];
let step = 1;
const d0 = new Date(); d0.setDate(d0.getDate() + 1);
$('#dateIn').min = d0.toISOString().slice(0, 10);

function showStep(n) {
  step = n;
  $$('[data-step]', form).forEach(s => s.hidden = +s.dataset.step !== n);
  $('#stepNo').textContent = n; $('#bookTitle').textContent = TITLES[n - 1];
  $('#stepBar').style.width = n * 25 + '%';
  $('#back').style.visibility = n === 1 ? 'hidden' : 'visible';
  $('#next').textContent = n === 4 ? 'Confirm booking' : 'Next';
  $('#err').textContent = '';
  if (n === 4) {
    const f = new FormData(form);
    $('#summary').innerHTML = [['Treatment', f.get('treat')], ['Date', f.get('date')], ['Time', f.get('time')], ['Name', f.get('name')], ['Email', f.get('email')]]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }
}
function openBook(treat) {
  form.reset(); $('#success').hidden = true; $('#actions').hidden = false;
  $('.eyebrow', modal).hidden = false; $('.bar', modal).hidden = false;
  if (treat) { const r = $$('input[name=treat]', form).find(i => i.value === treat); if (r) r.checked = true; }
  showStep(1); modal.hidden = false; lockScroll(true); toggleChat(false);
  $('.chip input', modal).focus();
}
function closeBook() { modal.hidden = true; lockScroll(false); }
function validate() {
  const f = new FormData(form);
  if (step === 1 && !f.get('treat')) return 'Please choose a treatment.';
  if (step === 2 && (!f.get('date') || !f.get('time'))) return 'Please pick a date and a time.';
  if (step === 3) {
    if (!f.get('name').trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.get('email'))) return 'Please enter a valid email.';
  }
  return '';
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const msg = validate(); if (msg) { $('#err').textContent = msg; return; }
  if (step < 4) return showStep(step + 1);
  const f = new FormData(form);
  $$('[data-step]', form).forEach(s => s.hidden = true);
  $('#actions').hidden = true; $('.eyebrow', modal).hidden = true; $('.bar', modal).hidden = true;
  $('#bookTitle').textContent = '';
  $('#successMsg').textContent = `${f.get('treat')} on ${f.get('date')} at ${f.get('time')}. A confirmation will be sent to ${f.get('email')}.`;
  $('#success').hidden = false; icons();
});
$('#back').onclick = () => step > 1 && showStep(step - 1);
modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) closeBook(); });
document.addEventListener('click', e => { const b = e.target.closest('[data-book]'); if (b) openBook(b.dataset.treat); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!modal.hidden) closeBook(); else toggleChat(false); } });

/* ---------- AI assistant (simulated) ---------- */
const chat = $('#chat'), fab = $('#fab'), log = $('#log'), chatIn = $('#chatIn');
function toggleChat(open = !chat.classList.contains('open')) {
  chat.classList.toggle('open', open); fab.setAttribute('aria-expanded', open);
  if (open) { if (!log.children.length) greet(); chatIn.focus(); }
}
function say(text, who) {
  const d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = text;
  log.append(d); log.scrollTop = log.scrollHeight; return d;
}
function greet() { say('Hi, I am the Aurel Dental assistant. Ask about treatments, costs or emergencies, or pick a quick prompt below.', 'bot'); }
const KB = [
  [/whiten|bleach|shade/, 'Whitening estimates (demo figures):\nTake-home trays: from $180\nIn-clinic session: from $350\nMost people lift 3 to 6 shades. A short check up first makes sure your teeth are suitable.'],
  [/emergenc|knock|broken|chip|bleed|swell|severe|urgent/, 'Emergency steps:\n1. Rinse gently with warm water.\n2. Knocked out tooth: hold it by the crown, keep it in milk, and see us within 30 minutes.\n3. Use a cold compress for swelling.\n4. Avoid aspirin on the gum.\n5. Call us right away. Facial swelling or trouble breathing needs emergency services.'],
  [/book|appointment|schedule|consult/, 'I can set that up. It takes four short steps.', true],
  [/implant|all-on|all on/, 'Implants are placed under local anaesthetic or sedation, so most patients describe pressure rather than pain. Mild soreness for a few days is normal. All-on-4 can give you fixed teeth in one day.'],
  [/hurt|pain|scared|anxi|nervous/, 'Comfort comes first here. We use numbing gel, slow injections and optional sedation. Tell us if you want a break at any point.'],
  [/aligner|invisalign|straight|braces/, 'Clear aligners usually take 6 to 14 months. You see a 3D preview of the result before you start.'],
  [/veneer|smile|gap/, 'Veneers are thin porcelain shells. Most cases take two visits, and we mock up the design first so you can approve it.'],
  [/hour|open|where|location|address/, 'We are open Mon to Sat, 9:00 to 18:00 at 18 Linden Row, Suite 4.'],
  [/price|cost|how much|fee/, 'Prices depend on the plan. A consultation includes a scan and a written estimate, so you know the full cost before deciding.']
];
function reply(q) {
  const m = KB.find(([re]) => re.test(q.toLowerCase()));
  return m ? { text: m[1], act: m[2] } : { text: 'I can help with whitening, implants, aligners, veneers, costs, hours and emergencies. For anything clinical, our team will confirm at your consultation.' };
}
function ask(q) {
  q = q.trim(); if (!q) return;
  say(q, 'me');
  const t = say('Typing...', 'bot typing');
  setTimeout(() => {
    t.remove(); const r = reply(q), d = say(r.text, 'bot');
    if (r.act) {
      const b = document.createElement('button'); b.className = 'btn btn-primary sm'; b.textContent = 'Open booking';
      b.onclick = () => openBook(); d.append(b); log.scrollTop = log.scrollHeight;
    }
  }, 650);
}
fab.onclick = () => toggleChat();
$('#chatX').onclick = () => toggleChat(false);
$('#chatForm').addEventListener('submit', e => { e.preventDefault(); ask(chatIn.value); chatIn.value = ''; });
$('#qp').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });

icons();
