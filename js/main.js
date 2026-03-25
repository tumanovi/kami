/*****************************************************слайдер шеринг ****************************** */
document.addEventListener('DOMContentLoaded', function() {
    
    // Функция для создания слайдера в блоке
    function createSlider(block) {
        // Проверяем ширину экрана
        if (window.innerWidth > 670) return;
        
        const sliderWrapper = block.querySelector('.sharing__slider-wrapper');
        const slider = block.querySelector('.sharing__slider');
        const dotsContainer = block.querySelector('.sharing-dots');
        
        if (!sliderWrapper || !slider || !dotsContainer) return;
        
        // Получаем оригинальные изображения из .sharing__content
        const originalImages = block.querySelectorAll('.sharing__content a[data-fancybox]');
        if (originalImages.length === 0) return;
        
        // Очищаем слайдер и точки
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        // Создаем слайды
        originalImages.forEach((imgLink, index) => {
            const slide = document.createElement('div');
            slide.className = 'sharing__slide';
            
            // Клонируем ссылку с изображением
            const clonedLink = imgLink.cloneNode(true);
            
            // Временно отключаем fancybox на слайдере
            clonedLink.removeAttribute('data-fancybox');
            clonedLink.style.pointerEvents = 'none';
            
            slide.appendChild(clonedLink);
            slider.appendChild(slide);
            
            // Создаем точку
            const dot = document.createElement('button');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const slides = block.querySelectorAll('.sharing__slide');
        const dots = block.querySelectorAll('.sharing-dots .dot');
        let currentIndex = 0;
        let startX = 0;
        let startIndex = 0;
        let isDragging = false;
        let startTime = 0;
        
        // Функция перехода к слайду
        function goToSlide(index, animate = true) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            const translateX = -currentIndex * 100;
            
            slider.style.transition = animate ? 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)' : 'none';
            slider.style.transform = `translateX(${translateX}%)`;
            
            // Обновляем точки
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Инициализация
        goToSlide(0, false);
        
        // Touch события
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            startIndex = currentIndex;
            isDragging = true;
            slider.style.transition = 'none';
        }, { passive: true });
        
        slider.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const slideWidth = slider.offsetWidth / slides.length;
            const percentMoved = (diff / slideWidth) * 100;
            
            let newTranslate = -startIndex * 100 - percentMoved;
            
            // Ограничиваем overscroll
            const maxTranslate = -((slides.length - 1) * 100);
            if (newTranslate > 0) {
                newTranslate = newTranslate * 0.3;
            } else if (newTranslate < maxTranslate) {
                newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
            }
            
            slider.style.transform = `translateX(${newTranslate}%)`;
        }, { passive: true });
        
        slider.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const endTime = Date.now();
            const velocity = Math.abs(diff) / (endTime - startTime);
            
            let newIndex = startIndex;
            
            // Определяем нужно ли перелистывать
            if (Math.abs(diff) > 30 || velocity > 0.3) {
                if (diff > 0) {
                    newIndex = startIndex + 1;
                } else {
                    newIndex = startIndex - 1;
                }
            }
            
            goToSlide(newIndex, true);
        });
        
        // Обработка touchcancel
        slider.addEventListener('touchcancel', function() {
            if (isDragging) {
                isDragging = false;
                goToSlide(startIndex, true);
            }
        });
    }
    
    // Инициализация всех блоков
    const sharingBlocks = document.querySelectorAll('.sharing');
    sharingBlocks.forEach(block => createSlider(block));
    
    // Переинициализация при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            sharingBlocks.forEach(block => {
                // Очищаем слайдер
                const slider = block.querySelector('.sharing__slider');
                const dots = block.querySelector('.sharing-dots');
                if (slider) slider.innerHTML = '';
                if (dots) dots.innerHTML = '';
                // Пересоздаем
                createSlider(block);
            });
        }, 250);
    });
    
    // Инициализация Fancybox (только для изображений вне слайдера)
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox="gallery"]', {
            loop: true,
            animationEffect: "zoom",
            transitionEffect: "slide",
            thumbs: {
                autoStart: true
            },
            toolbar: "zoom|slideshow|thumbs|close"
        });
    }
});
/************************************************************************************************** 
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
*/