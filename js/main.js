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
        
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            current = index;
            sliderContainer.style.transform = `translateX(-${current * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
        
        // Свайп
        let startX = 0;
        let isDragging = false;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            sliderContainer.style.transition = 'none';
        });
        
        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const translateX = current * 100 + (diff / sliderContainer.offsetWidth) * 100;
            
            sliderContainer.style.transform = `translateX(-${translateX}%)`;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            sliderContainer.style.transition = 'transform 0.3s ease';
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(current + 1);
                } else {
                    goToSlide(current - 1);
                }
            } else {
                goToSlide(current);
            }
        });
    }
    
    // Находим все блоки .sharing и инициализируем каждый
    const sharingBlocks = document.querySelectorAll('.sharing');
    sharingBlocks.forEach(block => {
        initMobileSliderForBlock(block);
    });
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', function() {
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