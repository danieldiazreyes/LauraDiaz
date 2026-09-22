(() => {
  const header = document.querySelector('.header');
  const links = [...header.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;

  function updateNavigation() {
    const boundary = header.getBoundingClientRect().height + 90;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) current = section;
    }
    for (const link of links) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    framePending = false;
  }

  function measureHeader() {
    document.documentElement.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
    updateNavigation();
  }
  measureHeader();
  if ('ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  window.addEventListener('resize', measureHeader, { passive: true });
  window.addEventListener('scroll', () => {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });

  // Content stays visible without scripting, and is animated only on entry.
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!motion.matches) entry.target.classList.add('reveal-enter');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll('.collection').forEach(collection => {
      collection.querySelectorAll('figure').forEach((figure, index) => {
        figure.style.setProperty('--reveal-delay', (index % 3) * 140 + 'ms');
      });
    });
    document.querySelectorAll('.section-heading, .collection figure').forEach(element => observer.observe(element));
  }
})();
