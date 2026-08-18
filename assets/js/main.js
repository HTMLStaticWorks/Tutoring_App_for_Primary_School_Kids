/* ==========================================================================
   BrightSparks Tutoring - Main Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRtl();
  initMobileMenu();
  initDropdowns();
  initPricingToggle();
  initFaqAccordion();
  initBookingForm();
  initModals();
});

/* --- 1. Theme Management (Dark Mode) --- */
const SUN_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const MOON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const GLOBE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

function updateThemeIcons(isDark) {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.innerHTML = isDark ? `${SUN_SVG} <span>Light</span>` : `${MOON_SVG} <span>Dark</span>`;
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('brightsparks_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  updateThemeIcons(isDark);

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('brightsparks_theme', activeDark ? 'dark' : 'light');
      updateThemeIcons(activeDark);
      showToast(activeDark ? 'Dark Mode Activated' : 'Light Mode Activated', activeDark ? SUN_SVG : MOON_SVG);
    });
  });
}

/* --- 2. RTL Layout Toggle --- */
function initRtl() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn, [title="Toggle RTL"]');
  const savedRtl = localStorage.getItem('brightsparks_rtl') === 'true';

  if (savedRtl) {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  rtlToggles.forEach(btn => {
    btn.innerHTML = `${GLOBE_SVG} <span>RTL</span>`;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') === 'rtl';
      const next = !current;
      document.documentElement.setAttribute('dir', next ? 'rtl' : 'ltr');
      localStorage.setItem('brightsparks_rtl', next);
      showToast(next ? 'RTL Mode Enabled' : 'LTR Mode Enabled', GLOBE_SVG);
    });
  });
}

/* --- 3. Mobile Navigation Drawer --- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!openBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}

/* --- 4. Dropdown Menus for Mobile / Touch --- */
function initDropdowns() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });
}

/* --- 5. Pricing Monthly / Annual Switcher --- */
function initPricingToggle() {
  const toggleInput = document.getElementById('pricing-billing-toggle');
  if (!toggleInput) return;

  const priceElements = document.querySelectorAll('[data-monthly-price]');

  toggleInput.addEventListener('change', () => {
    const isAnnual = toggleInput.checked;
    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-monthly-price');
      const annual = el.getAttribute('data-annual-price');
      if (isAnnual && annual) {
        el.textContent = `$${annual}`;
      } else if (monthly) {
        el.textContent = `$${monthly}`;
      }
    });
    showToast(isAnnual ? '🎉 20% Annual Discount Applied!' : 'Monthly Billing Selected');
  });
}

/* --- 6. FAQ Accordion & Category Filter --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const categoryBtns = document.querySelectorAll('.faq-cat-btn');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      faqItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- 7. Trial Booking Form --- */
function initBookingForm() {
  const bookingForm = document.getElementById('trial-booking-form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const parentName = document.getElementById('booking-parent-name')?.value || 'Parent';
    const childGrade = document.getElementById('booking-grade')?.value || 'Primary Grade';
    
    showToast(`✨ Success! Free trial booked for ${childGrade}. Confirmation sent to email!`, '🌟');
    bookingForm.reset();

    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  });
}

/* --- 8. Modals Handler --- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
      }
    });
  });

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });
}

/* --- 9. Toast Notification System --- */
function showToast(message, iconHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span class="toast-icon flex items-center justify-center">${iconHtml}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
