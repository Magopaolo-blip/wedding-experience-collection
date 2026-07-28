
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
    const mainButton = gallery.querySelector('[data-gallery-main-open]');
    const mainImage = gallery.querySelector('[data-gallery-main]');
    const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    const current = gallery.querySelector('[data-gallery-current]');
    const prev = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    if (!mainButton || !mainImage || !thumbs.length) return;

    let activeIndex = 0;
    let changeTimer;

    const update = (index, immediate = false) => {
      const target = (index + thumbs.length) % thumbs.length;
      const thumb = thumbs[target];
      const apply = () => {
        activeIndex = target;
        mainImage.src = thumb.dataset.src || '';
        mainImage.alt = thumb.dataset.alt || '';
        mainButton.dataset.src = thumb.dataset.src || '';
        mainButton.dataset.alt = thumb.dataset.alt || '';
        if (current) current.textContent = String(target + 1).padStart(2, '0');
        thumbs.forEach((item, i) => {
          const selected = i === target;
          item.classList.toggle('is-active', selected);
          if (selected) item.setAttribute('aria-current', 'true');
          else item.removeAttribute('aria-current');
        });
        thumb.scrollIntoView({behavior: reduce || immediate ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest'});
        requestAnimationFrame(() => mainButton.classList.remove('is-changing'));
      };
      clearTimeout(changeTimer);
      if (immediate || reduce) apply();
      else {
        mainButton.classList.add('is-changing');
        changeTimer = setTimeout(apply, 150);
      }
    };

    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => update(index)));
    prev?.addEventListener('click', () => update(activeIndex - 1));
    next?.addEventListener('click', () => update(activeIndex + 1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); update(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); update(activeIndex + 1); }
    });

    let touchStartX = null;
    mainButton.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, {passive: true});
    mainButton.addEventListener('touchend', event => {
      if (touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const delta = endX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) < 45) return;
      mainButton.dataset.ignoreClick = 'true';
      window.setTimeout(() => delete mainButton.dataset.ignoreClick, 450);
      update(activeIndex + (delta < 0 ? 1 : -1));
    }, {passive: true});

    thumbs.slice(1, 3).forEach(thumb => {
      const image = new Image();
      image.src = thumb.dataset.src || '';
    });
    update(0, true);
  });

  const dialog = document.querySelector('[data-gallery-dialog]');
  const dialogImage = dialog?.querySelector('[data-gallery-dialog-image]');
  document.querySelectorAll('[data-gallery-main-open]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.ignoreClick === 'true') {
        delete button.dataset.ignoreClick;
        return;
      }
      if (!dialog || !dialogImage) return;
      dialogImage.src = button.dataset.src || button.querySelector('img')?.src || '';
      dialogImage.alt = button.dataset.alt || button.querySelector('img')?.alt || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  dialog?.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });


})();
