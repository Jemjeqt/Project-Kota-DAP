// Gulir halus dengan IntersectionObserver untuk performa lebih baik
const handleSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

// Navbar hide/show dengan throttling untuk mengurangi beban
const navbar = document.querySelector('nav');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScroll = window.pageYOffset;
      navbar.style.transform = `translateY(${currentScroll > lastScroll ? '-100%' : '0'})`;
      navbar.style.opacity = currentScroll > lastScroll ? '0' : '1';
      lastScroll = currentScroll;
      ticking = false;
    });
    ticking = true;
  }
});

// Berita renderer dengan DocumentFragment untuk performa lebih baik
class NewsManager {
  constructor(containerId, loadMoreBtnId, itemsPerPage = 3) {
    this.container = document.getElementById(containerId);
    this.loadMoreBtn = document.getElementById(loadMoreBtnId);
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.berita = [];
  }

  async fetchBerita() {
    try {
      // Mengubah path import sesuai struktur folder
      const response = await import('../data/berita.js');
      if (response && response.beritaData) {
        this.berita = response.beritaData;
        this.render();
      } else {
        console.error('Format data berita tidak sesuai');
        this.showError('Data berita tidak sesuai format');
      }
    } catch (error) {
      console.error('Gagal memuat data berita:', error);
      this.showError('Gagal memuat data berita');
    }
  }

  showError(message) {
    if (this.container) {
      this.container.innerHTML = `
        <div class="text-center text-red-600 p-4">
          ${message}. Mohon refresh halaman atau coba lagi nanti.
        </div>
      `;
    }
  }

  createNewsCard(item) {
    return `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
        <div class="relative h-64">
          <img 
            src="${item.gambar}" 
            alt="${item.judul}" 
            
            loading="lazy" 
            class="w-full h-full object-cover"
            onerror="this.src='https://via.placeholder.com/800x400?text=Gambar+Tidak+Tersedia'"
          >
          <span class="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ${item.kategori}
          </span>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-xl font-bold text-red-800 mb-4 line-clamp-2 h-16">
            ${item.judul}
          </h3>
          <div class="flex items-center justify-between text-gray-500 mb-4">
            <span class="text-sm">${item.tanggal}</span>
            <span class="text-sm">${item.penulis}</span>
          </div>
          <p class="text-gray-600 mb-4 line-clamp-3 flex-grow">
            ${item.ringkasan}
          </p>
          <div class="border-t pt-4 mt-auto">
            <div class="flex items-center justify-center">
              <button type="button" class="inline-block px-4 py-2 text-red-500 hover:text-red-700 font-medium text-center transition-colors duration-200" onclick="alert('Fitur ini masih dalam pengembangan')">
                Baca Selengkapnya
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');
    const start = 0;
    const end = this.currentPage * this.itemsPerPage;
    temp.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

    const newsHTML = this.berita
      .slice(start, end)
      .map(item => this.createNewsCard(item))
      .join('');

    temp.innerHTML = newsHTML;

    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }

    this.container.innerHTML = '';
    this.container.appendChild(fragment);

    // Perbarui visibilitas tombol muat lebih banyak
    if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display =
        end >= this.berita.length ? 'none' : 'block';
    }
  }

  init() {
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        this.currentPage++;
        // this.currentPage = this.berita.length % this.itemsPerPage === 0 ? this.berita.length / this.itemsPerPage : (this.berita.length / this.itemsPerPage) + 1;
        this.render();
      });
    }
    this.fetchBerita();
  }
}

// Mulai aplikasi saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
  const newsManager = new NewsManager('daftarBerita', 'loadMore');
  newsManager.init();
  handleSmoothScroll();
});