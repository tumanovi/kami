 (function() {
        // Sticky Header + бургер-меню
        const header = document.getElementById('mainHeader');
        const placeholder = document.getElementById('headerPlaceholder');
        let headerHeight = header.offsetHeight;
        
        function updateSticky() {
            const scrollY = window.scrollY;
            if (scrollY > 10) {
                if (!header.classList.contains('is-sticky')) {
                    header.classList.add('is-sticky');
                    document.body.classList.add('has-sticky-header');
                    if (placeholder) placeholder.style.height = headerHeight + 'px';
                }
            } else {
                if (header.classList.contains('is-sticky')) {
                    header.classList.remove('is-sticky');
                    document.body.classList.remove('has-sticky-header');
                    if (placeholder) placeholder.style.height = '0px';
                }
            }
        }
        
        window.addEventListener('scroll', updateSticky);
        window.addEventListener('resize', () => {
            headerHeight = header.offsetHeight;
            if (header.classList.contains('is-sticky') && placeholder) {
                placeholder.style.height = headerHeight + 'px';
            }
        });
        updateSticky();
        
        // бургер меню
        const burger = document.getElementById('burgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('menuOverlay');
        const mobileLinks = document.querySelectorAll('.mobile-menu__link');
        
        function closeMenu() {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }
        function openMenu() {
            mobileMenu.classList.add('open');
            overlay.classList.add('active');
            burger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        overlay.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMenu();
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        const offset = header.classList.contains('is-sticky') ? header.offsetHeight : 0;
                        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: elementPosition - offset - 10, behavior: 'smooth' });
                    }
                }
            });
        });
        
        // Swiper + Fancybox
        const swiperContainers = document.querySelectorAll('.sharing__slider-container');
        swiperContainers.forEach((container) => {
            new Swiper(container, {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: false,
                touchEventsTarget: 'container',
                simulateTouch: true,
                allowTouchMove: true,
                pagination: { el: container.querySelector('.swiper-pagination'), clickable: true },
                navigation: { nextEl: container.querySelector('.swiper-button-next'), prevEl: container.querySelector('.swiper-button-prev') },
                threshold: 5,
                speed: 300,
            });
        });
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind('[data-fancybox="gallery"]', { loop: true, animationEffect: "zoom", transitionEffect: "slide", thumbs: { autoStart: true } });
            Fancybox.bind('[data-fancybox="gallery2"]', { loop: true, animationEffect: "zoom", transitionEffect: "slide", thumbs: { autoStart: true } });
        }
        
        // плавный скролл для десктопных ссылок
        document.querySelectorAll('.header__nav a, .header__logo, .footer-cta__button, .button--primary, .button--secondary, .format-card__link').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const hash = this.getAttribute('href');
                if (hash && hash.startsWith('#') && hash !== '#') {
                    const target = document.querySelector(hash);
                    if (target) {
                        e.preventDefault();
                        const offset = header.classList.contains('is-sticky') ? header.offsetHeight : 0;
                        const pos = target.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: pos - offset - 10, behavior: 'smooth' });
                    }
                }
            });
        });
    })();

    // Свайпы для бургер-меню (влево — открыть, вправо — закрыть)
(function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const burger = document.getElementById('burgerBtn');
    const overlay = document.getElementById('menuOverlay');
    
    let touchStartX = 0;
    let touchEndX = 0;
    let isTracking = false;
    const minSwipeDistance = 50;
    
    function openMenuSwipe() {
        if (!mobileMenu.classList.contains('open')) {
            mobileMenu.classList.add('open');
            overlay.classList.add('active');
            burger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMenuSwipe() {
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchEndX = touchStartX;
        isTracking = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isTracking) return;
        touchEndX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!isTracking) return;
        isTracking = false;
        
        const deltaX = touchEndX - touchStartX;
        
        if (Math.abs(deltaX) < minSwipeDistance) return;
        
        // Свайп влево (deltaX < 0) - открываем меню
        if (deltaX < 0 && !mobileMenu.classList.contains('open')) {
            openMenuSwipe();
        }
        // Свайп вправо (deltaX > 0) - закрываем меню
        else if (deltaX > 0 && mobileMenu.classList.contains('open')) {
            closeMenuSwipe();
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }, { passive: false });
})();