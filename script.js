// ---------- custom cursor ----------
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
function loop(){
  rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(loop);
}
loop();
document.querySelectorAll('a, button, .magnetic, .env-row').forEach(el=>{
  el.addEventListener('mouseenter', ()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave', ()=>ring.classList.remove('hover'));
});

// ---------- mobile nav toggle ----------
const toggle = document.querySelector('.nav-toggle');
const tabs = document.querySelector('.tabs');
if(toggle){
  toggle.addEventListener('click', ()=> tabs.classList.toggle('open'));
  tabs.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>tabs.classList.remove('open')));
}

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target); }
  });
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---------- gutter active line highlight ----------
const gutterSpans = document.querySelectorAll('.gutter span[data-target]');
if(gutterSpans.length){
  const targets = Array.from(gutterSpans).map(s=>document.querySelector(s.dataset.target)).filter(Boolean);
  const gio = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      const idx = targets.indexOf(en.target);
      if(idx>-1 && en.isIntersecting){
        gutterSpans.forEach(s=>s.classList.remove('active'));
        gutterSpans[idx].classList.add('active');
      }
    });
  }, {threshold:.4});
  targets.forEach(t=> t && gio.observe(t));
}

// ---------- typing effect ----------
const typeEl = document.querySelector('[data-type]');
if(typeEl){
  const words = JSON.parse(typeEl.dataset.type);
  let wi=0, ci=0, deleting=false;
  function tick(){
    const word = words[wi];
    if(!deleting){
      ci++;
      typeEl.textContent = word.slice(0,ci);
      if(ci===word.length){ deleting=true; setTimeout(tick,1400); return; }
    } else {
      ci--;
      typeEl.textContent = word.slice(0,ci);
      if(ci===0){ deleting=false; wi=(wi+1)%words.length; }
    }
    setTimeout(tick, deleting?40:70);
  }
  tick();
}

// ---------- copy to clipboard (contact env rows) ----------
document.querySelectorAll('.env-row[data-copy]').forEach(row=>{
  row.addEventListener('click', ()=>{
    const text = row.dataset.copy;
    navigator.clipboard && navigator.clipboard.writeText(text).catch(()=>{});
    const label = row.querySelector('.env-copy');
    const original = label.textContent;
    row.classList.add('copied');
    label.textContent = 'copiado';
    setTimeout(()=>{ label.textContent = original; row.classList.remove('copied'); }, 1600);
  });
});
