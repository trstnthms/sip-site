const gallery = document.querySelector('.preview');
const track = gallery.querySelector('.slides');
const links = [...gallery.querySelectorAll('.pagination a')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let hovered = false, resumeAt = 0;
const current = () => Math.round(track.scrollLeft / track.clientWidth);
gallery.addEventListener('pointerenter', () => { hovered = matchMedia('(hover: hover)').matches; });
gallery.addEventListener('pointerleave', () => { hovered = false; });
gallery.addEventListener('pointerdown', () => { resumeAt = Date.now() + 10000; });
track.addEventListener('scroll', () => {
  links.forEach((link, index) => {
    if (index === current()) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { passive: true });
links[0].setAttribute('aria-current', 'true');
setInterval(() => {
  const bounds = track.getBoundingClientRect();
  if (reducedMotion.matches || hovered || gallery.querySelector(':focus-visible') || document.hidden || Date.now() < resumeAt || bounds.bottom <= 0 || bounds.top >= innerHeight) return;
  const next = (current() + 1) % links.length;
  track.scrollTo({ left: next * track.clientWidth, behavior: next === 0 || reducedMotion.matches ? 'instant' : 'smooth' });
}, 5000);
