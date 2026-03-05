document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('image-modal');
    if (!modalOverlay) return; // Only run on pages with a modal

    const modalCloseBtn = modalOverlay.querySelector('.modal-close');
    const prevBtn = modalOverlay.querySelector('.carousel-prev');
    const nextBtn = modalOverlay.querySelector('.carousel-next');
    const mainImg = document.getElementById('carousel-main-img');
    const indicatorsContainer = modalOverlay.querySelector('.carousel-indicators');

    let currentImages = [];
    let currentIndex = 0;

    // Elements that open the carousel
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.open-carousel');
        if (!card) return;

        e.preventDefault();

        const rawImages = card.getAttribute('data-images');
        if (!rawImages) return;

        // Split comma-separated string of image URLs
        currentImages = rawImages.split(',').map(img => img.trim());

        if (currentImages.length === 0) return;

        currentIndex = 0;
        updateCarousel();
        buildIndicators();

        // Show Modal
        modalOverlay.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    });

    const closeCarousel = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Brief timeout to let the fade animation finish before clearing source
        setTimeout(() => {
            mainImg.src = '';
            currentImages = [];
            indicatorsContainer.innerHTML = '';
        }, 400);
    };

    const updateCarousel = () => {
        if (currentImages.length === 0) return;

        // Add fade out effect
        mainImg.classList.add('fade');

        // Wait briefly for CSS transition then swap image source and fade back in
        setTimeout(() => {
            mainImg.src = currentImages[currentIndex];
            mainImg.classList.remove('fade');
            updateIndicators();
        }, 150); // Matches CSS transition duration roughly
    };

    const nextImage = () => {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateCarousel();
    };

    const prevImage = () => {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateCarousel();
    };

    const buildIndicators = () => {
        indicatorsContainer.innerHTML = '';
        if (currentImages.length <= 1) return; // No dots if only 1 image

        currentImages.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (idx === currentIndex) dot.classList.add('active');

            dot.addEventListener('click', () => {
                if (currentIndex !== idx) {
                    currentIndex = idx;
                    updateCarousel();
                }
            });

            indicatorsContainer.appendChild(dot);
        });
    };

    const updateIndicators = () => {
        const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Event Listeners
    modalCloseBtn.addEventListener('click', closeCarousel);

    // Close on background click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeCarousel();
        }
    });

    // Navigation buttons
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!modalOverlay.classList.contains('active')) return;

        if (e.key === 'Escape') closeCarousel();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
