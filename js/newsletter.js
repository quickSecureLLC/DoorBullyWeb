document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('newsletterModal');
    const closeButton = modal.querySelector('.modal-close');
    const submitButton = modal.querySelector('button[type="submit"]');
    const form = document.getElementById('newsletterForm');
    
    let modalShown = false;
    let scrolled = false;

    // Close button functionality
    closeButton.addEventListener('click', hideModal);

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = modal.querySelector('input[type="email"]');
        const emailValue = emailInput.value.trim();

        // Validate that the email contains an "@"
        if (!emailValue.includes('@')) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Send the email to Google Apps Script endpoint using no-cors mode
        fetch('https://script.google.com/macros/s/AKfycbx0oYMCuEc7qsKR9hbtieViobpy8M0frWz4z_KBkZFOJY-EnIa72aer7gfpVMfHBzOScg/exec', {
            method: 'POST',
            mode: 'no-cors',  // Opaque response mode to bypass CORS preflight
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailValue })
        })
        .then(() => {
            // In no-cors mode, the response is opaque so we assume success
            console.log('Email submitted (opaque response):', emailValue);
            showNotification('Thank you for subscribing!', 'success');
            hideModal();
        })
        .catch(error => {
            console.error('Error submitting email:', error);
            showNotification('There was an error. Please try again later.', 'error');
        });
    });

    // Show the modal after 30 seconds (only once)
    setTimeout(() => {
        console.log('30 seconds passed, showing modal...');
        showModal();
    }, 30000);

    // Also show the modal when the user scrolls past 800px (only once)
    window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 800) {
            scrolled = true;
            showModal();
        }
    }, { passive: true });

    // Helper to show the modal
    function showModal() {
        if (modalShown) return;
        modalShown = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Helper to hide the modal
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 2rem',
            backgroundColor: type === 'error' ? '#ff4444' : type === 'success' ? '#00C851' : '#4762d6',
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
}); 