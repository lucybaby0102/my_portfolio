(function() {
	"use strict";
	console.log("[main.js] loaded");

	const select = (el, all = false) => {
		el = el.trim()
		if (all) {
		return [...document.querySelectorAll(el)]
		} else {
		return document.querySelector(el)
		}
	};


	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all)
		if (selectEl) {
		if (all) {
			selectEl.forEach(e => e.addEventListener(type, listener))
		} else {
			selectEl.addEventListener(type, listener)
		}
		}
	};


	const onscroll = (el, listener) => {
		el.addEventListener('scroll', listener)
	};


	let navbarlinks = select('#navbar .scrollto', true)
	const navbarlinksActive = () => {
		let position = window.scrollY + 200
		navbarlinks.forEach(navbarlink => {
		if (!navbarlink.hash) return
		let section = select(navbarlink.hash)
		if (!section) return
		if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
			navbarlink.classList.add('active')
		} else {
			navbarlink.classList.remove('active')
		}
		})
	};
	window.addEventListener('load', navbarlinksActive)
	onscroll(document, navbarlinksActive)


	const scrollto = (el) => {
		let header = select('#header')
		let offset = header.offsetHeight

		if (!header.classList.contains('header-scrolled')) {
		offset -= 16
		}

		let elementPos = select(el).offsetTop
		window.scrollTo({
		top: elementPos - offset,
		behavior: 'smooth'
		})
	};


	let selectHeader = select('#header')
	if (selectHeader) {
		let headerOffset = selectHeader.offsetTop
		let nextElement = selectHeader.nextElementSibling
		const headerFixed = () => {
			if ((headerOffset - window.scrollY) <= 0) {
				selectHeader.classList.add('fixed-top')
				nextElement.classList.add('scrolled-offset')
			} else {
				selectHeader.classList.remove('fixed-top')
				nextElement.classList.remove('scrolled-offset')
			}
		}
		window.addEventListener('load', headerFixed)
		onscroll(document, headerFixed)
	};


	let backtotop = select('.back-to-top')
	if (backtotop) {
		const toggleBacktotop = () => {
			if (window.scrollY > 100) {
				backtotop.classList.add('active')
			} else {
				backtotop.classList.remove('active')
			}
		}
		window.addEventListener('load', toggleBacktotop)
		onscroll(document, toggleBacktotop)
	};

	
	on('click', '.mobile-nav-toggle', function(e) {
		select('#navbar').classList.toggle('navbar-mobile')
		this.classList.toggle('bi-list')
		this.classList.toggle('bi-x')
	});

	
	on('click', '.navbar .dropdown > a', function(e) {
		if (select('#navbar').classList.contains('navbar-mobile')) {
			e.preventDefault()
			this.nextElementSibling.classList.toggle('dropdown-active')
		}
	}, true);

	
	on('click', '.scrollto', function(e) {
		if (select(this.hash)) {
			e.preventDefault()

			let navbar = select('#navbar')
			if (navbar.classList.contains('navbar-mobile')) {
				navbar.classList.remove('navbar-mobile')
				let navbarToggle = select('.mobile-nav-toggle')
				navbarToggle.classList.toggle('bi-list')
				navbarToggle.classList.toggle('bi-x')
			}
			scrollto(this.hash)
		}
	}, true);

	window.addEventListener('load', () => {
		if (window.location.hash) {
			const target = document.querySelector(window.location.hash);
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
	
	window.addEventListener('load', () => {
		let portfolioContainer = select('.portfolio-container');
		if (portfolioContainer) {
		let portfolioIsotope = new Isotope(portfolioContainer, {
			itemSelector: '.portfolio-item',
			layoutMode: 'fitRows'
		});

		let portfolioFilters = select('#portfolio-flters li', true);

		on('click', '#portfolio-flters li', function(e) {
			e.preventDefault();
			portfolioFilters.forEach(function(el) {
			el.classList.remove('filter-active');
			});
			this.classList.add('filter-active');

			portfolioIsotope.arrange({
			filter: this.getAttribute('data-filter')
			});
		}, true);
		}

	});


	const portfolioLightbox = GLightbox({
		selector: '.portfolio-lightbox'
	});

	
	


	new Swiper('.portfolio-details-slider', {
		speed: 400,
		loop: true,
		autoplay: {
		delay: 5000,
		disableOnInteraction: false
		},
		pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true
		}
	});


	let skilsContent = select('.skills-content');
	if (skilsContent) {
		new Waypoint({
		element: skilsContent,
		offset: '80%',
		handler: function(direction) {
			let progress = select('.progress .progress-bar', true);
			progress.forEach((el) => {
			el.style.width = el.getAttribute('aria-valuenow') + '%'
			});
		}
		})
	};


	new Swiper('.testimonials-slider', {
		speed: 600,
		loop: true,
		autoplay: {
		delay: 5000,
		disableOnInteraction: false
		},
		slidesPerView: 'auto',
		pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true
		},
		breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 40
		},

		1200: {
			slidesPerView: 3,
		}
		}
	});
	
	
	// 建立每個 section 的 6 張預覽
	(() => {
		// 讓 lightbox 在「動態插入 DOM 後」也能正常工作
		let lightbox = null;

		function ensureImgSrc(root) {
			const imgs = root.querySelectorAll("img[data-src]");
			imgs.forEach(img => {
				// 1) 補 src
				if (!img.getAttribute("src")) img.setAttribute("src", img.dataset.src);

				// 2) 解除 lazy 狀態（避免 opacity:0 / observer 沒重新綁）
				img.removeAttribute("data-src");
				img.classList.remove("lazy-img");

				// 3) 保險：如果你的 CSS 有把 lazy-img 設成 opacity:0
				img.style.opacity = 1;
			
			});
		}

		function initLightbox() {
			if (lightbox && lightbox.destroy) lightbox.destroy();
			lightbox = GLightbox({
				selector: ".portfolio-lightbox",
				loop: true
			});
		}

		function buildPreview(sectionEl) {
			const previewEl = sectionEl.querySelector(".portfolio-preview");
			const sourceWrap = sectionEl.querySelector(".portfolio-source .portfolio-container-source");
			if (!previewEl || !sourceWrap) return;

			const previewCount = parseInt(previewEl.dataset.limit || "6", 10);
			previewEl.innerHTML = "";

			const allItems = Array.from(sourceWrap.querySelectorAll(".portfolio-item"));
			allItems.slice(0, previewCount).forEach(item => {
				const clone = item.cloneNode(true);
				ensureImgSrc(clone);
				previewEl.appendChild(clone);
			});
		}

		function bindModal() {
			const modalEl = document.getElementById("portfolioMoreModal");
				if (!modalEl) return;

				modalEl.addEventListener("show.bs.modal", (e) => {
				const btn = e.relatedTarget;
				if (!btn) return;

				const title = btn.dataset.title || "All Works";
				const sourceSelector = btn.dataset.source; // "#portfolio .portfolio-source"
				if (!sourceSelector) return;

				const titleEl = document.getElementById("portfolioMoreModalTitle");
				if (titleEl) titleEl.textContent = title;

				const grid = modalEl.querySelector(".js-portfolio-modal-grid");
				if (!grid) return;

				const sourceEl = document.querySelector(sourceSelector);
				const sourceWrap = sourceEl?.querySelector(".portfolio-container-source");
				if (!sourceWrap) return;

				grid.innerHTML = "";
				const allItems = Array.from(sourceWrap.querySelectorAll(".portfolio-item"));
				allItems.forEach(item => {
					const clone = item.cloneNode(true);
					ensureImgSrc(clone);
					grid.appendChild(clone);
				});

				initLightbox();
			});
		}

		function initAllSections() {
			// 你要做「預覽6個 + More modal」的區塊，把 selector 加在這裡
			["#portfolio", "#portfolio-ad", "#portfolio-card"].forEach(sel => {
			const sectionEl = document.querySelector(sel);
			if (sectionEl) buildPreview(sectionEl);
			});

			// 預覽生成後也要初始化 lightbox
			initLightbox();
		}

		document.addEventListener("DOMContentLoaded", () => {
			["#portfolio", "#portfolio-ad", "#portfolio-card"].forEach(sel => {
				const sectionEl = document.querySelector(sel);
				if (sectionEl) buildPreview(sectionEl);
			});

			initLightbox();
			bindModal();
		});

	})();

})();