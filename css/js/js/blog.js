// css/js/js/blog.js

document.addEventListener('DOMContentLoaded', () => {
  const container       = document.getElementById('blog-container');
  const modalOverlay    = document.getElementById('modalOverlay');
  const modalInner      = modalOverlay ? modalOverlay.querySelector('.modal') : null;
  const searchInput     = document.getElementById('search');
  const categoryFilter  = document.getElementById('categoryFilter');
  const themeBtn        = document.getElementById('themeToggle'); // id düzeltildi

  let posts = [];
  let filtered = [];

  // ------- Yardımcılar -------
  const fmtDate = d => d ? new Date(d).toLocaleDateString('tr-TR') : '';
  const safe    = s => (s || '').toString();

  function openPostModal(post) {
    if (!modalOverlay || !modalInner) return;
    const meta = [safe(post.category), fmtDate(post.date)].filter(Boolean).join(' • ');
    modalInner.innerHTML = `
      <button class="modal-close" aria-label="Kapat">✕</button>
      <h2>${safe(post.title)}</h2>
      <div class="meta">${meta}</div>
      ${post.image || post.thumbnail ? `<img src="${post.image || post.thumbnail}" alt="${safe(post.title)}">` : ''}
      <p>${safe(post.full || post.content || post.excerpt)}</p>
      <textarea class="comment-box" rows="4" placeholder="Yorumunuzu yazın..."></textarea>
    `;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalInner.querySelector('.modal-close')?.addEventListener('click', closeModal);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ------- Listeleme -------
  function postCardTemplate(post) {
    const img = post.thumbnail || post.image;
    const meta = [fmtDate(post.date), safe(post.category)].filter(Boolean).join(' • ');
    return `
      <article class="blog-post" role="article">
        ${img ? `<img src="${img}" alt="${safe(post.title)}">` : ''}
        <h2>${safe(post.title)}</h2>
        <div class="meta">${meta}</div>
        <p>${safe(post.excerpt || post.content || '').slice(0, 180)}${(post.excerpt || post.content || '').length > 180 ? '…' : ''}</p>
        <a href="#" class="read-more" aria-label="Devamını oku">Devamını oku →</a>
      </article>
    `;
  }

  function renderPosts(list) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || !list.length) {
      container.innerHTML = '<p>Gösterilecek yazı bulunamadı.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach((post) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = postCardTemplate(post).trim();
      const card = wrap.firstElementChild;
      card.querySelector('.read-more')?.addEventListener('click', (e) => {
        e.preventDefault();
        openPostModal(post);
      });
      frag.appendChild(card);
    });
    container.appendChild(frag);
  }

  function populateCategories() {
    if (!categoryFilter) return;
    const cats = ['Tümü', ...new Set(posts.map(p => p.category).filter(Boolean))];
    categoryFilter.innerHTML = '';
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  function filterPosts() {
    const q   = (searchInput?.value || '').toLowerCase().trim();
    const cat = (categoryFilter?.value || 'Tümü');
    filtered  = posts.filter(p => {
      const text = `${safe(p.title)} ${safe(p.excerpt)} ${safe(p.content)} ${safe(p.full)}`.toLowerCase();
      const passText = !q || text.includes(q);
      const passCat  = (cat === 'Tümü') || (p.category === cat);
      return passText && passCat;
    });
    renderPosts(filtered);
  }

  // ------- Veri yükle -------
  if (container) {
    fetch('data/posts.json')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(data => {
        posts = (Array.isArray(data) ? data : []).sort((a,b) => new Date(b.date||0) - new Date(a.date||0));
        populateCategories();
        renderPosts(posts);
      })
      .catch(() => {
        container.innerHTML = '<p>Blog verileri yüklenemedi.</p>';
      });
  }

  // ------- Olaylar -------
  searchInput?.addEventListener('input', () => { filterPosts(); });
  categoryFilter?.addEventListener('change', () => { filterPosts(); });

  // Tema butonu (id düzeltildi)
  themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeBtn.textContent = document.body.classList.contains('light') ? '🌙 Karanlık Tema' : '☀️ Açık Tema';
    try { localStorage.setItem('piezotech-theme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch {}
  });
});
