// DOM Elements
const header = document.querySelector('.main-header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.querySelector('#modalImage');
const scrollProgress = document.createElement('div');

// Add scroll progress bar
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

// Mobile Menu Toggle
mobileMenuToggle?.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.primary-nav') && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        }
    });
});

// Header scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Update scroll progress
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
    
    // Header show/hide
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        header.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down & past header
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    // Add shadow when scrolled
    if (currentScroll > 0) {
        header.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Enhanced Image Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const zoomableImages = document.querySelectorAll('.zoomable');
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    document.body.appendChild(imageModal);

    let currentScale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    zoomableImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const clone = img.cloneNode();
            imageModal.innerHTML = '';
            imageModal.appendChild(clone);
            imageModal.classList.add('active');
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
            document.body.style.overflow = 'hidden';
        });
    });

    imageModal.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(1, currentScale + delta), 4);
        const rect = imageModal.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (newScale !== currentScale) {
            currentScale = newScale;
            updateTransform();
        }
    });

    imageModal.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'IMG' && currentScale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            imageModal.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        imageModal.style.cursor = 'auto';
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    function updateTransform() {
        const img = imageModal.querySelector('img');
        if (img) {
            img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
    }
});

// Modal functionality for images
const zoomableImages = document.querySelectorAll('.zoomable');
zoomableImages.forEach(img => {
    img.addEventListener('click', () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question?.addEventListener('click', () => {
        const isOpen = answer.classList.contains('active');
        
        // Close all other answers
        document.querySelectorAll('.faq-answer.active').forEach(a => {
            if (a !== answer) {
                a.classList.remove('active');
                a.style.maxHeight = null;
            }
        });
        
        // Toggle current answer
        answer.classList.toggle('active');
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// Initialize FAQ content
const faqGrid = document.querySelector('.faq-grid');
const faqContent = [
    {
        question: 'How does it work?',
        answer: `The QuickSecure System operates with simplicity and efficiency. The manual Quick Locking Slider is effortlessly pulled down to secure the door, while the electronic system can be remotely activated through the integrated app.`
    },
    {
        question: 'How is this different from locking a door normally?',
        answer: `QuickSecure offers enhanced safety through its intuitive design, especially in high-stress situations. The system requires no fine motor control and can be activated instantly, either manually or electronically.`
    },
    {
        question: 'How much does it cost?',
        answer: `Pricing is customized based on your specific requirements and the number of units needed. We provide detailed assessments and personalized quotes to ensure you receive the best value for your investment.`
    },
    {
        question: 'How do I install the QuickSecure?',
        answer: `Installation is handled by our certified technicians who will assess your location, recommend appropriate materials, and perform precise installation with minimal modification to your existing doors.`
    }
];

// Populate FAQ section
if (faqGrid) {
    faqContent.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item fade-up';
        faqItem.innerHTML = `
            <button class="faq-question" aria-expanded="false">
                ${faq.question}
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        `;
        faqGrid.appendChild(faqItem);
    });
}

// Security Dashboard Demo
const dashboardContent = document.querySelector('.dashboard-content');
if (dashboardContent) {
    // Simulated security status updates
    const updateSecurityStatus = () => {
        const status = [
            { zone: 'Main Entrance', status: 'Secured', lastChecked: '2 mins ago' },
            { zone: 'East Wing', status: 'Monitoring', lastChecked: '1 min ago' },
            { zone: 'West Wing', status: 'Secured', lastChecked: 'Just now' }
        ];
        
        dashboardContent.innerHTML = status.map(zone => `
            <div class="status-item">
                <h4>${zone.zone}</h4>
                <span class="status ${zone.status.toLowerCase()}">${zone.status}</span>
                <small>Last checked: ${zone.lastChecked}</small>
            </div>
        `).join('');
    };
    
    // Update every 3 seconds
    updateSecurityStatus();
    setInterval(updateSecurityStatus, 3000);
}

// Handle keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeModal();
    }
});

// Prevent scroll when modal is open
modal?.addEventListener('wheel', (e) => {
    if (e.target === modal) {
        e.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other questions
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current question
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Sticky Header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                    mobileMenuToggle.click();
                }
            }
        });
    });
}); 