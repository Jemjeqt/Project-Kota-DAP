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
      <article class="news-item flex flex-col border-b pb-4 bg-white rounded-lg shadow-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300">
        <div class="relative h-64">
          <img 
            src="${item.gambar}" 
            alt="${item.judul}" 
            loading="lazy" 
            class="w-full h-full object-cover"
            onerror="this.src='https://via.placeholder.com/800x400?text=Gambar+Tidak+Tersedia'"
          >
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <span class="text-sm text-blue-600">${item.kategori}</span>
          <h3 class="text-xl font-bold text-red-800 mb-4 line-clamp-2 h-16">
            ${item.judul}
          </h3>
          <div class="flex items-center justify-between text-gray-500 mb-4">
            <span class="text-sm">${item.tanggal}</span>
            <span class="text-sm">${item.penulis}</span>
          </div>
          <p class="text-gray-600 text-bold mb-4 line-clamp-3 flex-grow">
            ${item.ringkasan}
          </p>
          <div class="border-t pt-4 mt-auto">
            <div class="flex flex-wrap gap-2">
              ${item.tags.map(tag => `
                <span class="inline-block underline px-3 py-1 text-sm font-semibold text-gray-700">${tag}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </article>
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

  setupScrollHandler() {
    const nav = document.querySelector('nav');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;
          if (nav) {
            nav.style.transform = `translateY(${currentScroll > lastScroll ? '-100%' : '0'})`;
            nav.style.opacity = currentScroll > lastScroll ? '0' : '1';
          }
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  init() {
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        // Ganti URL di sini dengan halaman yang ingin dituju
        window.location.href = '/Berita/indeks.html';
      });
    }
    this.setupScrollHandler();
    this.setupSmoothScroll();
    this.fetchBerita();
  }
}

// Initialize once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const newsManager = new NewsManager('daftarBerita', 'loadMore');
  newsManager.init();
});

// Initialize once DOM is ready
document.addEventListener('DOMContentLoaded', renderNews);


// Fungsi untuk mengubah tampilan saat tombol di klik
function buttonFunction() {
  const section = document.querySelector('#home');
  const video = section.querySelector('video');
  const overlay = section.querySelector('.bg-gradient-to-b');

  if (!section || !video) {
    console.error('Elemen tidak ditemukan!');
    return;
  }

  const computedStyle = window.getComputedStyle(section);
  const currentBgImage = computedStyle.backgroundImage;

  if (currentBgImage === 'none' || currentBgImage === '') {
    section.style.backgroundImage = "url('https://bandungbaratkab.go.id/img/kbb-vector.png')";
    video.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    section.style.backgroundImage = '';
    video.style.display = 'block';
    overlay.style.display = 'block';
  }
}


