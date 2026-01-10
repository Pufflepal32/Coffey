/**
 * Coffey's Roofing LLC - Main JavaScript
 * Minimal, vanilla JS for essential functionality
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE MENU
  // ============================================

  const menuBtn = document.querySelector('.header__menu-btn');
  const nav = document.querySelector('.header__nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          menuBtn.classList.remove('is-open');
        }
      }
    });
  });

  // ============================================
  // GALLERY MODAL / LIGHTBOX
  // ============================================

  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.modal');
  const modalImg = document.querySelector('.modal__content img');
  const modalClose = document.querySelector('.modal__close');
  const modalPrev = document.querySelector('.modal__nav--prev');
  const modalNext = document.querySelector('.modal__nav--next');

  let currentIndex = 0;
  let galleryImages = [];

  if (galleryItems.length > 0 && modal) {
    // Collect all gallery images
    galleryImages = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      return {
        src: img.dataset.full || img.src,
        alt: img.alt
      };
    });

    // Open modal on gallery item click
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        currentIndex = index;
        openModal();
      });

      // Keyboard accessibility
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentIndex = index;
          openModal();
        }
      });
    });

    function openModal() {
      updateModalImage();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      galleryItems[currentIndex].focus();
    }

    function updateModalImage() {
      modalImg.src = galleryImages[currentIndex].src;
      modalImg.alt = galleryImages[currentIndex].alt;
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateModalImage();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateModalImage();
    }

    // Modal controls
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalPrev) {
      modalPrev.addEventListener('click', prevImage);
    }

    if (modalNext) {
      modalNext.addEventListener('click', nextImage);
    }

    // Close on background click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('is-open')) return;

      switch(e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================

  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    if (question) {
      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('is-open');
        question.setAttribute('aria-expanded', !isOpen);
      });
    }
  });

  // ============================================
  // CONTACT FORM
  // ============================================

  const contactForm = document.querySelector('.contact-form form');
  const formSuccess = document.querySelector('.form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const message = formData.get('message');

      // Basic validation
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }
      });

      // Phone validation (basic)
      const phoneInput = contactForm.querySelector('input[name="phone"]');
      if (phoneInput && phoneInput.value) {
        const phoneRegex = /^[\d\s\-\(\)\+]{7,}$/;
        if (!phoneRegex.test(phoneInput.value)) {
          isValid = false;
          phoneInput.style.borderColor = '#ef4444';
        }
      }

      if (isValid) {
        // In production, you would send this to a server
        // For now, show success message
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('is-visible');
        }

        // Log form data (for demo purposes)
        console.log('Form submitted:', { name, phone, message });
      }
    });

    // Clear error styling on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', function() {
        this.style.borderColor = '';
      });
    });
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================

  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('is-loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================

  const header = document.querySelector('.header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
      } else {
        header.style.boxShadow = '';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // ACTIVE NAV LINK
  // ============================================

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header__nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // ============================================
  // PHONE NUMBER TRACKING (optional analytics)
  // ============================================

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      // Track phone call clicks (integrate with analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'Contact',
          'event_label': 'Phone Call',
          'value': 1
        });
      }
      console.log('Phone call initiated');
    });
  });

  // ============================================
  // REVIEWS CAROUSEL
  // ============================================

  const reviewsCarousel = document.querySelector('.reviews-carousel');

  if (reviewsCarousel) {
    const track = reviewsCarousel.querySelector('.reviews-carousel__track');
    const slides = reviewsCarousel.querySelectorAll('.reviews-carousel__slide');
    const dots = reviewsCarousel.querySelectorAll('.reviews-carousel__dot');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentSlide);
      });
    }

    function nextSlide() {
      const next = (currentSlide + 1) % totalSlides;
      goToSlide(next);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
  }

})();
