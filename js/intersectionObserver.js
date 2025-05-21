// Create Intersection Observer instance
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add 'visible' class when element enters viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation is triggered
            if (!entry.target.classList.contains('keep-observing')) {
                observer.unobserve(entry.target);
            }
        } else {
            // Remove 'visible' class if element should keep being observed
            if (entry.target.classList.contains('keep-observing')) {
                entry.target.classList.remove('visible');
            }
        }
    });
}, {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '50px' // Start animation slightly before element enters viewport
});

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll(`
    .fade-up,
    .fade-up-delay,
    .fade-up-delay-2,
    .fade-in,
    .scale-up,
    .slide-in-left,
    .slide-in-right
`);

animatedElements.forEach(element => {
    observer.observe(element);
});

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Trigger animations for elements already in viewport on page load
window.addEventListener('DOMContentLoaded', () => {
    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
});

// Handle animations on scroll for elements that should keep being observed
window.addEventListener('scroll', () => {
    const keepObservingElements = document.querySelectorAll('.keep-observing');
    keepObservingElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
}); 