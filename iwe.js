
(() => {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: .07});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('[data-gallery-track]');
    const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
    const current = gallery.querySelector('[data-gallery-current]');
    const prev = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    if (!track || !slides.length) return;

    let activeIndex = 0;
    const setActive = index => {
      activeIndex = Math.max(0, Math.min(slides.length - 1, index));
      if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
    };
    const goTo = index => {
      const target = (index + slides.length) % slides.length;
      slides[target].scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'start'});
      setActive(target);
    };

    prev?.addEventListener('click', () => goTo(activeIndex - 1));
    next?.addEventListener('click', () => goTo(activeIndex + 1));
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(activeIndex + 1); }
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const left = track.scrollLeft;
        let nearest = 0;
        let distance = Infinity;
        slides.forEach((slide, index) => {
          const d = Math.abs(slide.offsetLeft - left);
          if (d < distance) { distance = d; nearest = index; }
        });
        setActive(nearest);
        ticking = false;
      });
    }, {passive: true});
  });

  const dialog = document.querySelector('[data-gallery-dialog]');
  const dialogImage = dialog?.querySelector('[data-gallery-dialog-image]');
  const dialogCaption = dialog?.querySelector('[data-gallery-dialog-caption]');
  document.querySelectorAll('[data-gallery-open]').forEach(button => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage) return;
      dialogImage.src = button.dataset.src || '';
      dialogImage.alt = button.dataset.alt || '';
      if (dialogCaption) dialogCaption.textContent = button.dataset.caption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  dialog?.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

})();
