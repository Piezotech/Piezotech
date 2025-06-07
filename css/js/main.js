// Accordion Aç/Kapa
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const body = header.nextElementSibling;
    if (body.style.maxHeight) {
      body.style.maxHeight = null;
    } else {
      body.style.maxHeight = body.scrollHeight+'px';
    }
  });
});

// Nav & Footer’u partials’dan çek
function loadHTML(elId, url) {
  fetch(url)
    .then(r => r.text())
    .then(html => document.getElementById(elId).innerHTML = html);
}
loadHTML('nav-placeholder','partials/nav.html');
loadHTML('footer-placeholder','partials/footer.html');
