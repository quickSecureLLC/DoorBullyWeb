// Utility function for creating smooth number transitions
function animateNumber(element, start, end, duration = 2000) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate numbers when they come into view
const numberElements = document.querySelectorAll('.animate-number');
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const end = parseInt(element.dataset.number);
            animateNumber(element, 0, end);
            numberObserver.unobserve(element);
        }
    });
}, {
    threshold: 0.5
});

numberElements.forEach(element => {
    numberObserver.observe(element);
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const parallaxSpeed = 0.5;
        
        if (scroll <= heroHeight) {
            const yPos = scroll * parallaxSpeed;
            heroSection.style.backgroundPositionY = `${yPos}px`;
        }
    });
}

// Smooth reveal for feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Typing animation for hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when hero section is in view
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    const titleObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typeWriter(heroTitle, titleText);
            titleObserver.unobserve(heroTitle);
        }
    });
    
    titleObserver.observe(heroTitle);
}

// Animate dashboard status updates
function animateDashboardUpdate(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 50);
}

// Add pulse animation to CTA buttons
const ctaButtons = document.querySelectorAll('.hero-cta .btn-primary');
ctaButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.classList.add('pulse');
    });
    
    button.addEventListener('mouseout', () => {
        button.classList.remove('pulse');
    });
});

// Animate product cards on hover
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// Smooth scroll progress indicator
function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / (documentHeight - windowHeight)) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fade in header elements
    const headerElements = document.querySelectorAll('.main-header *');
    headerElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Initialize scroll progress
    updateScrollProgress();

    // Enhanced FAQ Animations
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.toggle-icon');
        
        // Set initial height for smooth transitions
        answer.style.height = '0px';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'height 0.3s ease-out';
        
        if (icon) {
            icon.style.transition = 'transform 0.3s ease-out';
        }
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.toggle-icon');
                    
                    otherItem.classList.remove('active');
                    otherAnswer.style.height = '0px';
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current FAQ item
            if (!isOpen) {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            } else {
                item.classList.remove('active');
                answer.style.height = '0px';
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Update height on window resize
        window.addEventListener('resize', () => {
            if (item.classList.contains('active')) {
                answer.style.height = answer.scrollHeight + 'px';
            }
        });
    });
}); 