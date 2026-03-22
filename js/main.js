/*****************************************************слайдер шеринг ****************************** */

document.addEventListener('DOMContentLoaded', function() {
    function initMobileSlider() {
        // Только для мобильных
        if (window.innerWidth > 670) return;
        
        const sliderContainer = document.querySelector('.sharing__slider');
        const dotsContainer = document.querySelector('.sharing-dots');
        const originalImages = document.querySelectorAll('.sharing__content a[data-fancybox]');
        
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
        
        const slides = document.querySelectorAll('.sharing__slide');
        const dots = document.querySelectorAll('.dot');
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
    
    // Запускаем при загрузке и изменении размера
    initMobileSlider();
    window.addEventListener('resize', initMobileSlider);
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