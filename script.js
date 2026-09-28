var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Close mobile menu when a nav link is tapped ----
var navToggle = document.getElementById('nav-toggle');
document.querySelectorAll('.nav-menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    if (navToggle) navToggle.checked = false;
  });
});

// ---- Areas of Focus pill carousel navigation ----
var pillCloud = document.querySelector('.pill-cloud');
var pillPrev = document.querySelector('.pill-nav-prev');
var pillNext = document.querySelector('.pill-nav-next');

function scrollPillCarousel(direction) {
  if (!pillCloud) return;
  var pill = pillCloud.querySelector('.pill');
  var scrollAmount = pill ? pill.getBoundingClientRect().width + 10 : 160;
  pillCloud.scrollBy({ left: direction * scrollAmount * 2, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

if (pillPrev) {
  pillPrev.addEventListener('click', function () { scrollPillCarousel(-1); });
}
if (pillNext) {
  pillNext.addEventListener('click', function () { scrollPillCarousel(1); });
}

// ---- Scroll reveal ----
var revealTargets = document.querySelectorAll('.section-title');
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

// ---- Photo carousels (Hero, Who Am I) ----
function initCarousel(containerId, slideClass, dotClass, intervalMs) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var slides = container.querySelectorAll('.' + slideClass);
  var dots = document.querySelectorAll('.' + dotClass);
  var index = 0;
  var timer = null;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('is-active', idx === index);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('is-active', idx === index);
    });
  }

  function startAutoplay() {
    if (prefersReducedMotion || slides.length < 2) return;
    timer = window.setInterval(function () { showSlide(index + 1); }, intervalMs);
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      stopAutoplay();
      showSlide(parseInt(dot.getAttribute('data-slide'), 10));
      startAutoplay();
    });
  });

  startAutoplay();
}

initCarousel('hero-carousel', 'hero-slide', 'hero-dot', 3000);
initCarousel('whoami-carousel', 'whoami-slide', 'whoami-dot', 3000);
