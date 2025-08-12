document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img.lazy-img');

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;

      // 補上真正的 src
      img.src = img.dataset.src;

      // 監聽載入完成，用於淡入 & 清理
      img.addEventListener('load', () => {
        img.classList.add('is-loaded');
        img.removeAttribute('data-src');
      }, { once: true });

      obs.unobserve(img);
    });
  }, {
    root: null,
    rootMargin: '200px 0px', // 提前 200px 預載，滑到時不會空白
    threshold: 0
  });

  images.forEach(img => io.observe(img));
});
