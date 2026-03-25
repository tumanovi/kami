/*****************************************************слайдер шеринг ****************************** */
document.addEventListener('DOMContentLoaded', function() {
    function initMobileSliderForBlock(block) {
        // Только для мобильных
        if (window.innerWidth > 670) return;
        
        const sliderContainer = block.querySelector('.sharing__slider');
        const dotsContainer = block.querySelector('.sharing-dots');
        const originalImages = block.querySelectorAll('.sharing__content a[data-fancybox]');
        
        if (!sliderContainer || !dotsContainer || originalImages.length === 0) return;
        
        // Очищаем и создаем слайды
        sliderContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        originalImages.forEach((imgLink, index) => {
            // Слайд
            const slide = document.createElement('div');
            slide.className = 'sharing__slide';
            
            const newLink = imgLink.cloneNode(true);
            slide.appendChild(newLink);
            sliderContainer.appendChild(slide);
            
            // Точка
            const dot = document.createElement('button');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        const slides = block.querySelectorAll('.sharing__slide');
        const dots = block.querySelectorAll('.sharing-dots .dot');
        let current = 0;
        let startX = 0;
        let currentTranslate = 0;
        let isDragging = false;
        let startTime = 0;
        
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            current = index;
            const translateValue = -current * 100;
            sliderContainer.style.transform = `translateX(${translateValue}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
        
        function getTranslateX() {
            const transform = sliderContainer.style.transform;
            if (!transform) return 0;
            const match = transform.match(/translateX\(([-\d.]+)%\)/);
            return match ? parseFloat(match[1]) : 0;
        }
        
        // Свайп с улучшенной обработкой для Safari
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
            currentTranslate = getTranslateX();
            sliderContainer.style.transition = 'none';
            // Предотвращаем скролл страницы во время свайпа
            e.preventDefault();
        }, { passive: false });
        
        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const movePercent = (diff / sliderContainer.offsetWidth) * 100;
            let newTranslate = currentTranslate - movePercent;
            
            // Ограничиваем, чтобы не было overscroll
            if (newTranslate > 0) newTranslate = newTranslate / 3; // резиновый эффект
            if (newTranslate < -((slides.length - 1) * 100)) {
                newTranslate = -((slides.length - 1) * 100) + (newTranslate + ((slides.length - 1) * 100)) / 3;
            }
            
            sliderContainer.style.transform = `translateX(${newTranslate}%)`;
            e.preventDefault();
        }, { passive: false });
        
        sliderContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            sliderContainer.style.transition = 'transform 0.3s ease';
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const endTime = Date.now();
            const velocity = Math.abs(diff) / (endTime - startTime);
            
            // Быстрый свайп (скорость > 0.3) или значительное смещение (> 20px)
            if (velocity > 0.3 || Math.abs(diff) > 30) {
                if (diff > 0) {
                    goToSlide(current + 1);
                } else {
                    goToSlide(current - 1);
                }
            } else {
                // Возвращаем на текущий слайд
                goToSlide(current);
            }
        });
        
        // Обработка touchcancel (например, при прерывании системой)
        sliderContainer.addEventListener('touchcancel', (e) => {
            if (!isDragging) return;
            isDragging = false;
            sliderContainer.style.transition = 'transform 0.3s ease';
            goToSlide(current);
        });
        
        // Инициализируем позицию первого слайда
        goToSlide(0);
    }
    
    // Находим все блоки .sharing и инициализируем каждый
    const sharingBlocks = document.querySelectorAll('.sharing');
    sharingBlocks.forEach(block => {
        initMobileSliderForBlock(block);
    });
    
    // Обновляем при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            sharingBlocks.forEach(block => {
                // Очищаем и переинициализируем
                const sliderContainer = block.querySelector('.sharing__slider');
                if (sliderContainer) {
                    sliderContainer.innerHTML = '';
                    sliderContainer.style.transform = '';
                }
                const dotsContainer = block.querySelector('.sharing-dots');
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                }
                initMobileSliderForBlock(block);
            });
        }, 250);
    });
});
/************************************************************************************************** */
 // ***************************************************************************************fancybox
        Fancybox.bind('[data-fancybox="gallery"]', {
  loop: true,              // Бесконечный цикл в галерее
  animationEffect: "zoom", // Эффект при открытии
  transitionEffect: "slide", // Эффект переключения
  thumbs: {
    autoStart: true       // Показывать миниатюры сразу
  },
  toolbar: "zoom|slideshow|thumbs|close" // Кнопки в панели
});