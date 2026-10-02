const U = (id, w = 1100) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Itens sugeridos para a demo (sem preços até o cardápio real ser definido)
const MENU = {
  cafes: [
    { name: 'Espresso da casa', desc: 'Intenso, aromático e servido para começar bem.', img: '1514432324607-a09d9b4aefdd' },
    { name: 'Cappuccino cremoso', desc: 'Espresso com leite vaporizado e espuma delicada.', img: '1517256064527-09c73fc73e38' },
    { name: 'Coado do dia', desc: 'Uma xícara para apreciar gole por gole.', img: '1442512595331-e89e73853f31' },
  ],
  doces: [
    { name: 'Bolo de cenoura com chocolate', desc: 'Massa fofinha e cobertura generosa.', img: '1578985545062-69928b1d9587' },
    { name: 'Bolo do dia', desc: 'Uma nova fatia para descobrir a cada visita.', img: '1464349095431-e9a21285b5f3' },
    { name: 'Cookie da casa', desc: 'Douradinho por fora, macio por dentro.', img: '1558961363-fa8fdf82db35' },
  ],
  lanches: [
    { name: 'Pão de queijo', desc: 'Um clássico para acompanhar o café.', img: '1509440159596-0249088772ff' },
    { name: 'Tostado da casa', desc: 'Pão quentinho e recheio caprichado.', img: '1528735602780-2552fd46c7af' },
    { name: 'Combo de pausa', desc: 'Café e acompanhamento para deixar o intervalo completo.', img: '1495474472287-4d71bcdd2085' },
  ],
};
const LABEL = { cafes: 'Cafés', doces: 'Doces', lanches: 'Lanches' };

const spot = document.getElementById('spot');
const list = document.getElementById('menu-list');
let cat = 'cafes', idx = 0;

function renderSpot(animate = true) {
  const it = MENU[cat][idx];
  const apply = () => {
    const img = document.getElementById('spot-img');
    const done = () => spot.classList.remove('swap');
    img.onload = done; setTimeout(done, 1500);
    img.src = U(it.img); img.alt = it.name;
    document.getElementById('spot-tag').textContent = LABEL[cat];
    document.getElementById('spot-name').textContent = it.name;
    document.getElementById('spot-desc').textContent = it.desc;
    if (img.complete && img.naturalWidth) done();
  };
  if (animate) { spot.classList.add('swap'); setTimeout(apply, 380); } else apply();
  [...list.children].forEach((li, n) => li.classList.toggle('on', n === idx));
}
function renderList() {
  list.innerHTML = '';
  MENU[cat].forEach((it, n) => {
    const li = document.createElement('li');
    li.tabIndex = 0; li.style.setProperty('--i', n);
    li.innerHTML = `<div class="row-line"><h4>${it.name}</h4><span class="dots"></span><span class="n">${String(n + 1).padStart(2, '0')}</span></div><p>${it.desc}</p>`;
    const pick = () => { idx = n; renderSpot(); };
    li.addEventListener('click', pick);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    list.appendChild(li);
  });
}
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    cat = tab.dataset.cat; idx = 0;
    renderList(); renderSpot();
  });
});
renderList(); renderSpot(false);

// "Aberto agora": horário de DEMONSTRAÇÃO (shopping). Trocar pelo horário real da loja.
// Índice 0 = domingo ... 6 = sábado. null = fechado no dia. [abre, fecha] em horas.
const HOURS = { 0: [11, 20], 1: [10, 22], 2: [10, 22], 3: [10, 22], 4: [10, 22], 5: [10, 22], 6: [10, 22] };
function updateStatus() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const today = HOURS[day];
  let state, text;
  if (today && h >= today[0] && h < today[1]) {
    state = 'open'; text = `Aberto agora · fecha às ${today[1]}h`;
  } else if (today && h < today[0]) {
    state = 'closed'; text = `Fechado agora · abre às ${today[0]}h`;
  } else {
    const next = HOURS[(day + 1) % 7];
    state = 'closed'; text = next ? `Fechado agora · abre amanhã às ${next[0]}h` : 'Fechado agora';
  }
  [['status', 'status-text'], ['status2', 'status-text2']].forEach(([box, t]) => {
    const b = document.getElementById(box), tx = document.getElementById(t);
    if (!b || !tx) return;
    b.classList.remove('open', 'closed'); b.classList.add(state); tx.textContent = text;
  });
}
updateStatus(); setInterval(updateStatus, 60000);

// Menu mobile
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// ================= Movimento =================
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// seções que aparecem com fade suave
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// títulos: palavra por palavra
function splitWords(root) {
  let n = 0;
  (function walk(node) {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', n++);
          w.appendChild(s); frag.appendChild(w);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1 && ch.tagName.toLowerCase() !== 'svg') walk(ch);
    });
  })(root);
  root.classList.add('split');
}

// fotos em cortina e blocos em sequência
document.querySelectorAll('.manifesto-photo img, .about-photo img, .mosaic img').forEach((el, i) => {
  el.classList.add('clip'); el.style.setProperty('--i', i % 5);
});
['.strip-inner > *', '.rows .row', '.faq-list details', '.info > div', '.two-col > *', '.menu-foot > *'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => { el.classList.add('st'); el.style.setProperty('--i', i); });
});

if (!reduce) {
  document.querySelectorAll('.display, .title, .hero-title, .final h2').forEach(splitWords);
}

// Observa o elemento (ou o "pai", quando o próprio está recortado e não dispara o observador)
const hosts = new Map();
const pending = new Set();
const addTo = (host, el) => { if (!hosts.has(host)) hosts.set(host, []); hosts.get(host).push(el); };
function reveal(host) {
  if (!pending.has(host)) return;
  pending.delete(host); io2.unobserve(host);
  (hosts.get(host) || [host]).forEach(el => {
    el.classList.add('in');
    if (el.classList.contains('st')) setTimeout(() => { el.classList.remove('st', 'in'); el.style.removeProperty('--i'); }, 2000);
  });
}
const io2 = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting || e.boundingClientRect.bottom < 0) reveal(e.target); });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.split, .st, .doodle, .underline').forEach(el => {
  if (el.closest('.hero-copy') && !el.classList.contains('st')) return; // título da capa entra ao carregar
  pending.add(el); io2.observe(el);
});
document.querySelectorAll('.clip, .hand').forEach(el => addTo(el.parentElement, el));
hosts.forEach((_, host) => { pending.add(host); io2.observe(host); });
// reforço: quem ficou para trás num salto de scroll (links do menu) também é revelado
const catchUp = () => pending.forEach(h => { if (h.getBoundingClientRect().top < innerHeight * .94) reveal(h); });
addEventListener('scroll', () => requestAnimationFrame(catchUp), { passive: true });
// capa: entra assim que a fonte carregar
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  setTimeout(() => document.querySelectorAll('.hero-copy .split, .hero-copy .underline').forEach(el => el.classList.add('in')), 150);
});

// parallax e barra de progresso
if (!reduce) {
  const bar = document.querySelector('.progress');
  const heroImg = document.querySelector('.hero .hero-bg img');
  const bandImg = document.querySelector('.band-img');
  let ticking = false;
  const frame = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar && max > 0) bar.style.transform = `scaleX(${Math.min(1, y / max)})`;
    if (heroImg && y < 1000) heroImg.style.transform = `translateY(${y * .14}px)`;
    if (bandImg) {
      const r = bandImg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) bandImg.style.transform = `translateY(${-(r.top + r.height / 2 - innerHeight / 2) * .12}px)`;
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();
}
