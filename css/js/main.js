document.addEventListener("DOMContentLoaded", () => {
  // Splash animasyonu
  anime({
    targets: '#splash-logo',
    opacity: [0, 1],
    scale: [0.8, 1.1],
    easing: 'easeOutExpo',
    duration: 950,
    delay: 300
  });
  anime({
    targets: '#splash-title',
    opacity: [0, 1],
    scale: [0.6, 1],
    easing: 'easeOutExpo',
    duration: 900,
    delay: 670
  });
  setTimeout(() => {
    anime({
      targets: '#splash',
      opacity: [1, 0],
      easing: 'easeInOutQuad',
      duration: 650,
      complete: () => document.getElementById('splash').classList.add('hide')
    });
  }, 2100);

  // Partiküller
  const c = document.querySelector('.particles');
  if (c) {
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.opacity = 0.09 + Math.random() * 0.09;
      c.appendChild(p);
    }
  }

  // Typewriter
  const typeTarget = document.getElementById('typewriter');
  const typeText = 'PiezoTech ile giyilebilir enerji sistemlerinin geleceğini keşfedin...';
  let i = 0;
  function typeWriter() {
    if (typeTarget && i <= typeText.length) {
      typeTarget.innerHTML = typeText.substring(0, i);
      i++;
      setTimeout(typeWriter, 25);
    }
  }
  setTimeout(typeWriter, 460);

  // Scroll ile fade animasyonu
  const sectionEls = document.querySelectorAll('.section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  sectionEls.forEach(el => obs.observe(el));

  // Hamburger Menü
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.style.display = "none";
      document.body.style.overflow = "";
    });
    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = "none";
        document.body.style.overflow = "";
      });
    });
  }

  // Tema Değişimi
  const toggleThemeBtn = document.getElementById("themeToggle");
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      toggleThemeBtn.innerText = document.body.classList.contains("light") ? "🌙 Karanlık Tema" : "☀️ Açık Tema";
    });
  }

  // Accordion Aç/Kapa
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('active');
      const body = header.nextElementSibling;
      if (body.style.maxHeight) {
        body.style.maxHeight = null;
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Nav & Footer’u partials’dan çek
  if (document.getElementById('nav-placeholder')) {
    fetch('partials/nav.html')
      .then(r => r.text())
      .then(html => document.getElementById('nav-placeholder').innerHTML = html);
  }
  if (document.getElementById('footer-placeholder')) {
    fetch('partials/footer.html')
      .then(r => r.text())
      .then(html => document.getElementById('footer-placeholder').innerHTML = html);
  }

  // Blog verisi (data/posts.json)
  const container = document.getElementById("blog-container");
  const modalOverlay = document.getElementById("modalOverlay");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("categoryFilter");

  let posts = [];

  if (container && searchInput && categoryFilter && modalOverlay) {
    fetch("data/posts.json")
      .then(res => res.json())
      .then(data => {
        posts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        populateCategories();
        renderPosts(posts);
      });

    searchInput.addEventListener("input", () => filterPosts());
    categoryFilter.addEventListener("change", () => filterPosts());

    function populateCategories() {
      const categories = ["Tümü", ...new Set(posts.map(p => p.category))];
      categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.innerText = cat;
        categoryFilter.appendChild(opt);
      });
    }

    function renderPosts(list) {
      container.innerHTML = "";
      list.forEach((post, index) => {
        const card = docume
