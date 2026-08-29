// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Close mobile menu when a nav link is tapped ----
var navToggle = document.getElementById('nav-toggle');
document.querySelectorAll('.nav-menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    if (navToggle) navToggle.checked = false;
  });
});

// ---- Scroll reveal ----
var revealTargets = document.querySelectorAll(
  '.work-card, .accordion-item, .expertise-group, .section-title, .section-lede'
);
revealTargets.forEach(function (el) { el.classList.add('reveal'); });

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  revealTargets.forEach(function (el) { observer.observe(el); });
} else {
  revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
}

// ---- Nav active-section highlighting ----
var navLinks = document.querySelectorAll('.nav-menu a');
var sections = Array.prototype.map.call(navLinks, function (link) {
  var id = link.getAttribute('href').replace('#', '');
  return document.getElementById(id);
}).filter(Boolean);

function setActiveNav() {
  var scrollPos = window.scrollY + 120;
  var current = null;
  sections.forEach(function (section) {
    if (section.offsetTop <= scrollPos) current = section;
  });
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').replace('#', '');
    link.classList.toggle('is-active', current && current.id === id);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();
