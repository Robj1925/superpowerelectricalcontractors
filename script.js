/* =====================================================
   SUPER POWER ELECTRICAL CONTRACTORS — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR: scroll effect + active link ───────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── HAMBURGER MENU ───────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── SMOOTH SCROLL for all anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL REVEAL ANIMATIONS ────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .discount-card, .stat-card, .payment-badge, .gallery-item, .review-card, .why-list li, .contact-item, .trust-item'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED COUNTERS ───────────────────────────────────────
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || 0);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = eased * target;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // ─── GALLERY LIGHTBOX ────────────────────────────────────────
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lightboxClose= document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = item.dataset.label || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ─── REVIEWS CAROUSEL ────────────────────────────────────────
  const track     = document.getElementById('reviews-track');
  const dotsContainer = document.getElementById('review-dots');
  const prevBtn   = document.getElementById('review-prev');
  const nextBtn   = document.getElementById('review-next');
  const cards     = Array.from(document.querySelectorAll('.review-card'));

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  let autoplayInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const numDots = Math.ceil(cards.length / cardsPerView);
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('review-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.review-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    const numSlides = Math.ceil(cards.length / cardsPerView);
    currentIndex = Math.max(0, Math.min(index, numSlides - 1));
    const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;
    updateDots();
  }

  function goNext() { goTo(currentIndex + 1 < Math.ceil(cards.length / cardsPerView) ? currentIndex + 1 : 0); }
  function goPrev() { goTo(currentIndex > 0 ? currentIndex - 1 : Math.ceil(cards.length / cardsPerView) - 1); }

  prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });

  function startAutoplay() { autoplayInterval = setInterval(goNext, 5000); }
  function resetAutoplay() { clearInterval(autoplayInterval); startAutoplay(); }

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev(); resetAutoplay(); }
  });

  function initCarousel() {
    cardsPerView = getCardsPerView();
    buildDots();
    goTo(0);
    startAutoplay();
  }

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    buildDots();
    goTo(0);
  });

  initCarousel();

  // ─── CONTACT FORM ────────────────────────────────────────────
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');
  const submitBtn   = document.getElementById('form-submit-btn');

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name  = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    if (!name || !phone) {
      alert('Please fill in your name and phone number so we can reach you!');
      return;
    }

    // Build mailto link as simple fallback (EmailJS can be added later)
    const service = form.querySelector('#service').value;
    const message = form.querySelector('#message').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const body = encodeURIComponent(
      `New estimate request from the website:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nService: ${service || 'Not specified'}\n\nMessage:\n${message || 'No message provided.'}`
    );

    // Open email client
    window.location.href = `mailto:superpowerelectricalcontractor@gmail.com?subject=Free Estimate Request from ${name}&body=${body}`;

    // Show success message
    submitBtn.style.display = 'none';
    successMsg.style.display = 'flex';
    form.reset();

    // Reset after 6 seconds
    setTimeout(() => {
      submitBtn.style.display = '';
      successMsg.style.display = 'none';
    }, 6000);
  });

  // ─── HERO SCROLL HINT FADE ───────────────────────────────────
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

}); // end DOMContentLoaded
