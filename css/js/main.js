/* ===============================
   Piezotech • Main Script (script.js)
   - Splash & giriş animasyonları
   - Partiküller
   - Typewriter
   - Scroll görünüm animasyonu
   - Hamburger menü
   - Tema anahtarı (localStorage)
   - Accordion
   - Nav/Footer partial fetch
   - Blog: fetch + filtre + modal
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------
     Splash Animasyonu
  ----------------------------------*/
  const splash = $('#splash');
  const splashLogo = $('#splash-logo');
  const splashTitle = $('#splash-title');

  if (splash && splashLogo && splashTitle && window.anime && !prefersReduced) {
    // Logo
    anime({
      targets: '#splash-logo',
      opacity: [0, 1],
      scale: [0.8, 1.1],
      easing: 'easeOutExpo',
      duration: 950,
      delay: 300
    });
    // Başlık
    anime({
      targets: '#splash-title',
      opacity: [0, 1],
      scale: [0.6, 1],
      easing: 'easeOutExpo',
      duration: 900,
      delay: 670
    });
    // Splash gizle
    setTimeout(() => {
      anime({
        targets: '#splash',
        opacity: [1, 0],
        easing: 'easeInOutQuad',
        duration: 650,
        complete: () => splash.classList.add('hide')
      });
    }, 2100);
  } else if (splash) {
    // Hareket azaltılsa veya anime yoksa hızlıca gizle
    splash.classList.add('hide');
  }

  /* -------------------------------
     Partiküller
  ----------------------------------*/
  const particlesRoot = $('.particles');
  if (particlesRoot) {
    const COUNT = prefersReduced ? 10 : 32;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.opacity = (prefersReduced ? 0.06 : 0.09) + Math.random() * (prefersReduced ? 0.05 : 0.09);
      particlesRoot.appendChild(p);
    }
  }

  /* -------------------------------
     Typewriter
  ----------------------------------*/
  const typeTarget = $('#typewriter');
  const typeText = 'PiezoTech ile giyilebilir enerji sistemlerinin geleceğini keşfedin...';
  if (typeTarget) {
    let i = 0;
    const speed = prefersReduced ? 45 : 25;
    const startDelay = prefersReduced ? 200 : 460;
    function typeWriter() {
      if (i <= typeText.length) {
        typeTarget.textContent = typeText.substring(0, i++);
        setTimeout(typeWriter, speed);
      }
    }
    setTimeout(typeWriter, startDelay);
  }

  /* -------------------------------
     Scroll ile fade-in (IntersectionObserver)
  ----------------------------------*/
  const sectionEls = $$('.section');
  if (sectionEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    sectionEls.forEach(el => obs.observe(el));
  }

  /* -------------------------------
     Hamburger Menü
  ----------------------------------*/
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  const closeMenuBtn = $('#closeMenuBtn');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = "none";
    document.body.style.overflow = "";
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', openMenu);
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }
  $$('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* -------------------------------
     Tema Değişimi (localStorage destekli)
  ----------------------------------*/
  const toggleThemeBtn = $('#themeToggle');
  const THEME_KEY = 'piezotech-theme';

  function applyStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    updateThemeButton();
  }
  function updateThemeButton() {
    if (!toggleThemeBtn) return;
    const light = document.body.classList.contains('light');
    toggleThemeBtn.textContent = light ? '🌙 Karanlık Tema' : '☀️ Açık Tema';
  }
  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    updateThemeButton();
  }

  applyStoredTheme();
  if (toggleThemeBtn) toggleThemeBtn.addEventListener('click', toggleTheme);

  /* -------------------------------
     Accordion
  ----------------------------------*/
  $$('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('active');
      const body = header.nextElementSibling;
      if (!body) return;
      if (body.style.maxHeight) {
        body.style.maxHeight = null;
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* -------------------------------
     Nav & Footer Partial'ları
  ----------------------------------*/
  const navPh = $('#nav-placeholder');
  const footerPh = $('#footer-placeholder');

  if (navPh) {
    fetch('partials/nav.html')
      .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(html => navPh.innerHTML = html)
      .catch(() => {/* sessizce geç */});
  }
  if (footerPh) {
    fetch('partials/footer.html')
      .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(html => footerPh.innerHTML = html)
      .catch(() => {/* sessizce geç */});
  }

  /* -------------------------------
     BLOG • data/posts.json
     - Arama + Kategori filtre
     - Modal detay
  ----------------------------------*/
  const container = $('#blog-container') || $('#posts') || $('.blog-grid'); // farklı sayfa adları için esnek
  const modalOverlay = $('#modalOverlay') || $('.modal-overlay');
  const searchInput = $('#search');
  const categoryFilter = $('#categoryFilter');
  const commentBox = $('#commentBox'); // varsa

  const modal = $('.modalOverlay') || $('.modal-overlay');
  const modalCloseBtn = modal ? $('.modal-close', modal) : null;

  let posts = [];
  let filtered = [];

  const debounced = (fn, delay=200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  function openModal(contentHTML) {
    if (!modalOverlay) return;
    // İçeriği doldur
    const modalInner = modalOverlay.querySelector('.modal');
    if (modalInner) {
      modalInner.innerHTML = `
        <button class="modal-close" aria-label="Kapat">✕</button>
        ${contentHTML}
      `;
      const closeBtn = modalInner.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    }
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // ESC ile kapat
    document.addEventListener('keydown', escClose);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
  }

  function escClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function postCardTemplate(post) {
    const img = post.image ? `<img src="${post.image}" alt="${post.title}">` : '';
    const meta = [
      post.date ? new Date(post.date).toLocaleDateString('tr-TR') : '',
      post.category || ''
    ].filter(Boolean).join(' • ');

    return `
      <article class="blog-post" role="article">
        ${img}
        <h2>${post.title || 'Başlık'}</h2>
        <div class="meta">${meta}</div>
        <p>${post.excerpt || ''}</p>
        <a href="#" class="read-more" aria-label="Devamını oku">Devamını oku →</a>
      </article>
    `;
  }

  function renderPosts(list) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || !list.length) {
      container.innerHTML = `<p>Gösterilecek yazı bulunamadı.</p>`;
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach((post) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = postCardTemplate(post).trim();
      const card = wrapper.firstElementChild;
      // Modal içerik
      const link = card.querySelector('.read-more');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const full = `
            <h2>${post.title || ''}</h2>
            <div class="meta">${post.category || ''} • ${post.date ? new Date(post.date).toLocaleDateString('tr-TR') : ''}</div>
            ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            <p>${post.content || post.excerpt || ''}</p>
            ${commentBox ? `<textarea class="comment-box" rows="4" placeholder="Yorumunuzu yazın..."></textarea>` : ''}
          `;
          openModal(full);
        });
      }
      frag.appendChild(card);
    });
    container.appendChild(frag);
  }

  function populateCategories() {
    if (!categoryFilter || !posts.length) return;
    const cats = ["Tümü", ...new Set(posts.map(p => p.category).filter(Boolean))];
    categoryFilter.innerHTML = '';
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  function filterPosts() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = (categoryFilter?.value || 'Tümü');
    filtered = posts.filter(p => {
      const text = `${p.title || ''} ${p.excerpt || ''} ${p.content || ''}`.toLowerCase();
      const passText = !q || text.includes(q);
      const passCat = (cat === 'Tümü') || (p.category === cat);
      return passText && passCat;
    });
    renderPosts(filtered);
  }
  const filterPostsDebounced = debounced(filterPosts, 120);

  // Blog verilerini yükle
  if (container) {
    fetch("data/posts.json")
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        posts = (Array.isArray(data) ? data : []).sort((a, b) => {
          const da = new Date(a.date || 0).getTime();
          const db = new Date(b.date || 0).getTime();
          return db - da;
        });
        populateCategories();
        renderPosts(posts);
      })
      .catch(() => {
        container.innerHTML = `<p>Blog verileri yüklenemedi.</p>`;
      });

    // Arama & kategori filtre olayları
    if (searchInput) searchInput.addEventListener('input', filterPostsDebounced);
    if (categoryFilter) categoryFilter.addEventListener('change', filterPosts);
  }
});
