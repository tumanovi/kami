/*****************************************************слайдер шеринг ****************************** */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация для каждого контейнера
    const swiperContainers = document.querySelectorAll('.sharing__slider-container');
    swiperContainers.forEach((container, index) => {
        const swiper = new Swiper(container, {
            // Основные опции
            slidesPerView: 1,
            spaceBetween: 10,
            loop: false,               // зацикливание, если нужно
            
            // ВАЖНО для Safari — отключаем pointer-events, используем touch
            touchEventsTarget: 'container',
            simulateTouch: true,
            allowTouchMove: true,
            
            // Блокировка вертикального скролла при свайпе
            touchStartPreventDefault: true,
            touchMoveStopPropagation: true,
            
            // Пагинация (точки)
            pagination: {
                el: container.querySelector('.swiper-pagination'),
                clickable: true,
            },
            
            // Навигационные стрелки
            navigation: {
                nextEl: container.querySelector('.swiper-button-next'),
                prevEl: container.querySelector('.swiper-button-prev'),
            },
            
            // Чувствительность
            threshold: 5,              // минимальное расстояние для свайпа
            touchRatio: 1,             // чувствительность
            resistance: true,          // резиновый эффект
            resistanceRatio: 0.85,     // степень сопротивления
            
            // Анимация
            speed: 300,
            
            // Адаптивность
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 1, spaceBetween: 15 },
            }
        });
    });
    
    // После инициализации слайдеров — Fancybox
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox="gallery"]', {
            loop: true,
            animationEffect: "zoom",
            transitionEffect: "slide",
            thumbs: { autoStart: true },
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
}); */