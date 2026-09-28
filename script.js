var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Close mobile menu when a nav link is tapped ----
var navToggle = document.getElementById('nav-toggle');
document.querySelectorAll('.nav-menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    if (navToggle) navToggle.checked = false;
  });
});

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

// ---- Hero photo carousel ----
var heroCarousel = document.getElementById('hero-carousel');
if (heroCarousel) {
  var heroSlides = heroCarousel.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dot');
  var heroIndex = 0;
  var heroTimer = null;

  function showHeroSlide(i) {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach(function (slide, idx) {
      slide.classList.toggle('is-active', idx === heroIndex);
    });
    heroDots.forEach(function (dot, idx) {
      dot.classList.toggle('is-active', idx === heroIndex);
    });
  }

  function startHeroAutoplay() {
    if (prefersReducedMotion || heroSlides.length < 2) return;
    heroTimer = window.setInterval(function () { showHeroSlide(heroIndex + 1); }, 5000);
  }

  function stopHeroAutoplay() {
    if (heroTimer) window.clearInterval(heroTimer);
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      stopHeroAutoplay();
      showHeroSlide(parseInt(dot.getAttribute('data-slide'), 10));
      startHeroAutoplay();
    });
  });

  startHeroAutoplay();
}
