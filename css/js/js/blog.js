let posts = [];

fetch("data/posts.json")
  .then(res => res.json())
  .then(data => {
    posts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    populateCategories();
    renderPosts(posts);
  });

const container = document.getElementById("blog-container");
const modalOverlay = document.getElementById("modalOverlay");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

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
    const card = document.createElement("div");
    card.className = "blog-post";
    card.innerHTML = `
      <img src="${post.thumbnail}" alt="${post.title}">
      <h2>${post.title}</h2>
      <div class="meta">${post.date} • ${post.category}</div>
      <p>${post.content}</p>
      <a onclick="openModal(${index})">Devamını oku →</a>
    `;
    container.appendChild(card);
  });
}

function filterPosts() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = posts.filter(post => {
    const matchesCategory = category === "Tümü" || post.category === category;
    const matchesKeyword =
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword);
    return matchesCategory && matchesKeyword;
  });

  renderPosts(filtered);
}

function openModal(index) {
  const post = posts[index];
  document.getElementById("modalTitle").innerText = post.title;
  document.getElementById("modalMeta").innerText = `${post.date} • ${post.category}`;
  document.getElementById("modalContent").innerText = post.full;
  document.getElementById("modalImage").src = post.thumbnail;
  modalOverlay.style.display = "flex";
}

function closeModal() {
  modalOverlay.style.display = "none";
}

// Tema değişimi
const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleThemeBtn.innerText = document.body.classList.contains("light") ? "🌙 Karanlık Tema" : "☀️ Açık Tema";
});
