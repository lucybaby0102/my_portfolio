document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img.lazy-img');

  // 沒有 IO：直接載入所有圖片
  if (!('IntersectionObserver' in window)) {
    images.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('is-loaded');
      img.removeAttribute('data-src');
    });
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;

      const onLoad = () => {
        img.classList.add('is-loaded');
        img.removeAttribute('data-src');
      };

      // 設置真正的 src
      if (img.dataset.src) img.src = img.dataset.src;

      // 已快取？直接執行；否則監聽一次
      if (img.complete) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
        // 失敗也收尾（可選）
        img.addEventListener('error', () => obs.unobserve(img), { once: true });
      }

      obs.unobserve(img);
    });
  }, {
    root: null,
    rootMargin: '200px 0px',
    threshold: 0
  });

  images.forEach(img => io.observe(img));
});