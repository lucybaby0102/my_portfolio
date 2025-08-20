document.addEventListener('DOMContentLoaded', () => {
	if (!window.gsap) { console.error('GSAP not loaded'); return; }
	gsap.registerPlugin(TextPlugin);

	const h1 = document.querySelector('#mypersonal h1');
	const h2 = document.querySelector('#mypersonal h2');
	const cta = document.querySelector('#mypersonal .btn-get-started');

	// 若使用者偏好減少動畫：直接顯示並結束
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		gsap.set([h1, h2, cta], { opacity: 1, clearProps: 'all' });
		return;
	}

	// 目標文字
	const h1Final = "Hi, I'm Nozomi!";
	const h2Final = "I am a Web Designer";

	
// 初始狀態
	h1.textContent = '';
	h2.textContent = '';
	gsap.set([h1, h2], { opacity: 1 });
	gsap.set(cta, { opacity: 0, y: 8 });

	gsap.to(cta, {
		opacity: 1,
		y: 0,
		duration: 0.45,
		ease: 'power2.out',
		onComplete: () => {
			// 2) 箭頭獨立上下浮動（無限循環）
			gsap.to('#mypersonal .btn-get-started i', {
				y: 8,
				duration: 1.2,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1
			});
		}
	});

  // 主動畫
	const tl = gsap.timeline({ 
			defaults: { ease: 'none' }, 
			repeat: -1,
			repeatDelay: 1.2,
			onRepeat: () => {
				h1.textContent = '';
				h2.textContent = '';
			}
		});

	tl.to(h1, { duration: 1.2, text: h1Final })
		.to(h2, { duration: 1.0, text: h2Final }, '>-0.1')
	
});
