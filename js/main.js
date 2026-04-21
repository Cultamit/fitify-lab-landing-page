/* ================================
   FITIFYLAB LANDING PAGE - JAVASCRIPT
   Vanilla JS — No dependencies
   ================================ */

(function () {
  'use strict';

  // ================================
  // CONFIG
  // ================================
  const WHATSAPP_NUMBER = '917607485829'; // Replace with actual WhatsApp number

  // ================================
  // 1. NAVBAR SCROLL EFFECT
  // ================================
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ================================
  // 2. SMOOTH SCROLL FOR CTA BUTTONS
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ================================
  // 3. SCROLL ANIMATIONS (IntersectionObserver)
  // ================================
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(function (el) {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ================================
  // 4. COUNTER ANIMATION
  // ================================
  var counters = document.querySelectorAll('[data-count]');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var suffix = counter.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out curve
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window && counters.length > 0) {
    var statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      counterObserver.observe(statsSection);
    }
  }

  // ================================
  // 5. SHOW MORE TESTIMONIALS
  // ================================
  var showMoreBtn = document.getElementById('show-more-testimonials');
  var hiddenTestimonials = document.querySelector('.hidden-testimonials');

  if (showMoreBtn && hiddenTestimonials) {
    showMoreBtn.addEventListener('click', function () {
      hiddenTestimonials.classList.add('show');
      showMoreBtn.style.display = 'none';
    });
  }

  var showMoreTransBtn = document.getElementById('show-more-transformations');
  var transformationsTrack = document.querySelector('.transformations-track');

  if (showMoreTransBtn && transformationsTrack) {
    showMoreTransBtn.addEventListener('click', function () {
      transformationsTrack.classList.add('show-all');
      transformationsTrack.querySelectorAll('.transformation-extra').forEach(function (el) {
        el.classList.add('visible');
      });
      showMoreTransBtn.style.display = 'none';
    });
  }

  // ================================
  // 6. FORM VALIDATION & WHATSAPP REDIRECT
  // ================================
  var form = document.getElementById('strategy-form');
  var formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('error');
      });

      // Gather values
      var name = form.querySelector('#form-name').value.trim();
      var phone = form.querySelector('#form-phone').value.trim();
      var age = form.querySelector('#form-age').value.trim();
      var weight = form.querySelector('#form-weight').value.trim();
      var professional = form.querySelector('input[name="professional"]:checked');
      var struggle = form.querySelector('#form-struggle').value.trim();
      var timeSlot = form.querySelector('#form-timeslot').value;

      // Validate
      var valid = true;

      if (!name) {
        showError('form-name');
        valid = false;
      }
      if (!phone || phone.length < 10) {
        showError('form-phone');
        valid = false;
      }
      if (!age) {
        showError('form-age');
        valid = false;
      }
      if (!weight) {
        showError('form-weight');
        valid = false;
      }
      if (!professional) {
        showError('form-professional');
        valid = false;
      }
      if (!struggle) {
        showError('form-struggle');
        valid = false;
      }
      if (!timeSlot) {
        showError('form-timeslot');
        valid = false;
      }

      if (!valid) return;

      // Build WhatsApp message
      var message = 'Hi Fitifylab! I\'d like to book a Strategy Call.\n\n'
        + '--- My Details ---\n'
        + 'Name: ' + name + '\n'
        + 'Phone: ' + phone + '\n'
        + 'Age: ' + age + '\n'
        + 'Weight: ' + weight + ' kg\n'
        + 'Working Professional: ' + professional.value + '\n'
        + 'Struggling with: ' + struggle + '\n'
        + 'Preferred Time: ' + timeSlot + '\n\n'
        + 'Looking forward to the call!';

      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      // Show success state
      form.style.display = 'none';
      formSuccess.classList.add('show');

      // Open WhatsApp
      window.open(waUrl, '_blank');
    });
  }

  function showError(fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
      var group = field.closest('.form-group');
      if (group) group.classList.add('error');
    }
  }

  // ================================
  // 7. WHATSAPP FLOATING BUTTON
  // ================================
  var waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    waFloat.addEventListener('click', function () {
      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hi! I\'m interested in Fitifylab\'s 30-Day Transformation Plan. Can you share more details?');
      window.open(waUrl, '_blank');
    });
  }

})();
