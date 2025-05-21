document.addEventListener('DOMContentLoaded', function() {
    // Debug log to confirm script loading
    console.log('Contact form script loaded');

    // Initialize Intersection Observer for animations
    const animatedElements = document.querySelectorAll('.fade-up, .fade-up-delay, .fade-up-delay-2');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    const contactForm = document.getElementById('contactForm');
    const formSections = document.querySelectorAll('.form-section');
    
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    // Initialize form sections animation
    formSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        section.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        // Don't prevent default - let FormSubmit handle the submission
        
        // Basic validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                console.log('Invalid field:', field.name);
                e.preventDefault(); // Prevent submission if validation fails
            } else {
                field.classList.remove('invalid');
            }
        });
        
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('invalid');
            console.log('Invalid email');
            e.preventDefault();
        }
        
        // Phone validation
        if (phoneInput) {
            const phoneNumber = phoneInput.value.replace(/\D/g, '');
            if (phoneNumber.length !== 10) {
                isValid = false;
                phoneInput.classList.add('invalid');
                console.log('Invalid phone number');
                e.preventDefault();
            }
        }
        
        if (!isValid) {
            console.log('Form validation failed');
            const firstInvalid = contactForm.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        } else {
            console.log('Form is valid, submitting');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            // Form will submit naturally to FormSubmit
        }
    });
    
    // Remove invalid class on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });
});

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 2rem',
        backgroundColor: type === 'error' ? '#ff4444' : '#4762d6',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 