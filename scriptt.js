function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Re-observe fade-in elements on newly shown page
  document.querySelectorAll('#page-' + name + ' .fade-in').forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}

function scrollToSection(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

function toggleMenu() {
  document.getElementById('navMenu').classList.toggle('open');
}

// Close menu when clicking a nav link on mobile
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navMenu').classList.remove('open');
    });
  });
});

// Intersection observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
