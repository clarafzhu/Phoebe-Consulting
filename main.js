/* ============================================================
   JDP CONSULTING — INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll: header shadow ──────────────────────────────── */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ──────────────────────────────────── */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  mobileToggle?.addEventListener('click', () => {
    const open = mobileToggle.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', !open);
  });

  document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  /* ── Mega Menu ──────────────────────────────────────────── */
  const megaItems = document.querySelectorAll('.nav-item.has-mega');
  let closeTimer;

  megaItems.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');

    const openPanel = () => {
      clearTimeout(closeTimer);
      megaItems.forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.add('open');
      trigger?.setAttribute('aria-expanded', 'true');
    };

    const closePanel = () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('open');
        trigger?.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    item.addEventListener('mouseenter', openPanel);
    item.addEventListener('mouseleave', closePanel);
    item.querySelector('.mega-panel')?.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    item.querySelector('.mega-panel')?.addEventListener('mouseleave', closePanel);
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      megaItems.forEach(i => { i.classList.remove('open'); i.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false'); });
      if (!isOpen) openPanel();
    });
  });

  /* Close mega on outside click */
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item.has-mega')) {
      megaItems.forEach(i => { i.classList.remove('open'); i.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false'); });
    }
  });

  /* ── Service Tabs ───────────────────────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const TAB_SLUGS = { '1': 'market-entry', '2': 'regulatory', '3': 'supply-chain', '4': 'corporate', '5': 'brand-esg' };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(`tab-${target}`)?.classList.add('active');

      /* Keep URL in sync so the tab is bookmarkable / shareable */
      if (history.replaceState) {
        const url = new URL(location.href);
        const slug = TAB_SLUGS[target];
        if (!slug || slug === 'market-entry') url.searchParams.delete('tab');
        else url.searchParams.set('tab', slug);
        history.replaceState(null, '', url);
      }
    });
  });

  /* ── Story Accordions ───────────────────────────────────── */
  document.querySelectorAll('.story-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      btn.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
      body.classList.toggle('open', !isOpen);

      if (!isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = '0';
      }
    });
  });

  /* ── Whitepaper Form ────────────────────────────────────── */
  const insightForm = document.getElementById('insight-form');
  const insightSuccess = document.getElementById('form-success');

  insightForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = insightForm.querySelector('#form-email').value.trim();
    if (!email) return;

    const btn = insightForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Submitting…';
    btn.disabled = true;
    insightForm.querySelector('#form-email').disabled = true;

    setTimeout(() => {
      insightForm.style.display = 'none';
      insightSuccess.classList.add('visible');
    }, 1000);
  });

  /* ── Contact Form ───────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.querySelector('#contact-name').value.trim();
    const email = contactForm.querySelector('#contact-email').value.trim();
    if (!name || !email) return;

    contactForm.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
    contactSuccess.classList.add('visible');
  });

  /* ── Scroll-reveal (IntersectionObserver) ───────────────── */
  const autoRevealEls = document.querySelectorAll(
    '.pillar, .capability-card, .story-card, .story-mini, .entity-card, .insight-card-small, .featured-insight-card, .insight-card-full, .credibility-band'
  );
  autoRevealEls.forEach(el => el.classList.add('fade-up'));

  /* Observe every element that carries fade-up — whether added above or hardcoded in HTML */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

  /* ── Library filter bar (insights.html) ────────────────── */
  const filterBtns = document.querySelectorAll('.library-filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('.insight-card-full').forEach(card => {
          const matches = cat === 'all' || card.dataset.category === cat;
          card.classList.toggle('hidden', !matches);
        });
      });
    });
  }

  /* ── Page-based active nav highlight ───────────────────── */
  (function () {
    const file = location.pathname.split('/').pop() || 'index.html';
    const page = file.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.classList.toggle('page-active', item.dataset.page === page);
    });
  })();

  /* ── Smooth scroll for in-page anchors only ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

});
