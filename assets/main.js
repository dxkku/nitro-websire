const allowedPaths = ['/', '/index.html', '/news', '/news/', '/news/index.html'];
if (!allowedPaths.includes(window.location.pathname)) {
    window.location.replace('/');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch and inject Header
    fetch('/assets/header.html')
        .then(response => response.text())
        .then(data => {
            // Prepend header data wrapper to body. We create a temporary div to parse it.
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            
            // We want to extract the header part and discard the old inline script from header.html if any
            // Since we'll update header.html to remove the script, we can just prepend its contents.
            while (tempDiv.firstChild) {
                document.body.prepend(tempDiv.lastChild);
            }
            
            // Re-apply active state
            applyActiveState();
            
            // Initialize mobile menu
            initMobileMenu();
        })
        .catch(err => console.error('Error loading header:', err));

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes fully into view
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after it appears once, or let it toggle on scroll
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Give a slight delay before triggering so we avoid FOUC elements flying in instantly on load
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => observer.observe(el));
    }, 100);
});

function applyActiveState() {
    // Try to get a clean path to determine active tab
    // We handle root "/", "/community", "/community/", or "/community/index.html"
    let path = window.location.pathname;
    
    // Normalize path
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    
    const parts = path.split('/');
    let currentPage = 'index';
    
    // If we're at a subpage like /community or /downloads
    if (parts.length > 1 && parts[1] !== '' && parts[1] !== 'index.html') {
        currentPage = parts[1];
    }

    document.querySelectorAll('.tab-btn').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.id = 'selected-tab';
        } else {
            // Ensure any stale IDs are removed
            link.removeAttribute('id');
        }
    });
}

function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const headerInner = document.querySelector('.header-inner');
    
    if (toggleBtn && headerInner) {
        toggleBtn.addEventListener('click', () => {
            headerInner.classList.toggle('mobile-open');
        });
    }
}
