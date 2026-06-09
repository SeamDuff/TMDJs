// ============================================================
  // INTRO — cold open
  // Cuando exista el video: descomentar el <video> en el HTML.
  // El intro dura lo que dure el video (o INTRO_MAX_MS si es imagen).
  // Se muestra una vez por sesión; después entra directo al hero.
  // ============================================================
  const INTRO_MAX_MS = 4500;
  const intro = document.getElementById('intro');
  const introVideo = document.getElementById('intro-video');
  const introImg = document.getElementById('intro-img');
  const progreso = document.getElementById('intro-progreso');
  const yaVisto = sessionStorage.getItem('tm_intro_visto');

  function terminarIntro() {
    if (!intro || intro.classList.contains('saliendo')) return;
    sessionStorage.setItem('tm_intro_visto', '1');
    intro.classList.add('saliendo');
    document.body.classList.remove('con-intro');
    document.body.classList.add('lista');
    setTimeout(() => intro.classList.add('oculto'), 950);
  }

  if (yaVisto) {
    intro.classList.add('oculto');
    document.body.classList.add('lista');
  } else {
    document.body.classList.add('con-intro');

    if (introVideo) {
      // Modo video: la barra sigue al video, cierra cuando termina
      introImg.style.display = 'none';
      introVideo.addEventListener('timeupdate', () => {
        if (introVideo.duration) {
          progreso.style.width = (introVideo.currentTime / introVideo.duration * 100) + '%';
        }
      });
      introVideo.addEventListener('ended', terminarIntro);
      introVideo.addEventListener('error', () => {
        introImg.style.display = '';
        iniciarModoImagen();
      });
      // Si autoplay falla (políticas del browser), caemos a imagen
      introVideo.play().catch(() => {
        introImg.style.display = '';
        iniciarModoImagen();
      });
    } else {
      iniciarModoImagen();
    }
  }

  function iniciarModoImagen() {
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / INTRO_MAX_MS, 1);
      progreso.style.width = (p * 100) + '%';
      if (p < 1) requestAnimationFrame(tick);
      else terminarIntro();
    }
    requestAnimationFrame(tick);
  }

  document.getElementById('saltar-intro').addEventListener('click', terminarIntro);

  // Sticky nav: fondo sólido al scrollear
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Menú mobile
  const burger = document.getElementById('burger');
  const menumovil = document.getElementById('menumovil');
  const cerrarmenu = document.getElementById('cerrarmenu');

  burger.addEventListener('click', () => menumovil.classList.add('abierto'));
  cerrarmenu.addEventListener('click', () => menumovil.classList.remove('abierto'));
  menumovil.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menumovil.classList.remove('abierto'))
  );

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Filtros de agenda
  const filtros = document.querySelectorAll('.filtro');
  const shows = document.querySelectorAll('.show');

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(f => f.classList.remove('activo'));
      btn.classList.add('activo');
      const filtro = btn.dataset.filtro;
      shows.forEach(show => {
        show.classList.toggle('oculto',
          filtro !== 'todas' && show.dataset.pais !== filtro);
      });
    });
  });

  // Form aviso (solo visual)
  document.getElementById('form-aviso').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('aviso-email');
    const ciudad = document.getElementById('aviso-ciudad');
    if (email.value && ciudad.value) {
      document.getElementById('aviso-ok').classList.add('visible');
      email.value = '';
      ciudad.value = '';
    }
  });
