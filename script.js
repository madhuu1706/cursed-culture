// ---- CONFIG: edit these ----
const CONFIG = {
  whatsapp: "918248589113",          // country code + number, no +
  instagram: "cursed.culture",        // handle without @
  total: 20,
  claimed: 1,                         // pieces already allocated
  closes: "2026-11-15T23:59:00+05:30" // request deadline, or "" to hide countdown
};
// ----------------------------

const $ = (s, r = document) => r.querySelector(s);

// nav
const nav = $("#nav"), burger = $("#burger"), links = $(".links");
addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 40), { passive: true });
burger.onclick = () => {
  const o = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
};
links.addEventListener("click", e => {
  if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

// hero slider
const slides = [...document.querySelectorAll(".slide")], dots = $("#dots");
let cur = 0, timer;
slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", "Slide " + (i + 1));
  b.onclick = () => { go(i); start(); };
  dots.append(b);
});
function go(i) {
  cur = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("on", n === cur));
  [...dots.children].forEach((d, n) => d.classList.toggle("on", n === cur));
}
function start() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6500); }
go(0); start();

// allocation tiles
const tiles = $("#tiles");
for (let i = 1; i <= CONFIG.total; i++) {
  const t = document.createElement("div");
  t.className = "tile" + (i <= CONFIG.claimed ? " gone" : "");
  t.textContent = String(i).padStart(2, "0");
  tiles.append(t);
}
$("#left").textContent = CONFIG.total - CONFIG.claimed;

// countdown
const count = $("#count");
if (!CONFIG.closes) { count.hidden = true; $("#countlabel").hidden = true; }
else {
  const end = new Date(CONFIG.closes).getTime();
  const tick = () => {
    let d = Math.max(0, end - Date.now());
    const v = { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
    for (const k in v) $(`[data-u=${k}]`, count).textContent = String(v[k]).padStart(2, "0");
    if (!d) $("#countlabel").textContent = "Requests closed";
  };
  tick(); setInterval(tick, 1000);
}

// links
$("#igLink").href = "https://instagram.com/" + CONFIG.instagram;
$("#waLink").href = "https://wa.me/" + CONFIG.whatsapp;

// request form -> WhatsApp (no payment, no backend)
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim();
  const miss = ["name", "city", "ig", "size", "ride"].some(n => !v(n));
  if (miss) { $("#err").textContent = "Fill every field."; return; }
  $("#err").textContent = "";
  const msg = `CURSED CULTURE — Drop 01 request\nName: ${v("name")}\nCity: ${v("city")}\nInstagram: ${v("ig")}\nSize: ${v("size")}\nRide: ${v("ride")}`;
  open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  f.reset();
});
