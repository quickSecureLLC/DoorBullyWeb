document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing script...');

    const nav = document.querySelector('.main-nav ul');
    const navContainer = document.querySelector('.nav-container');
    const sections = document.querySelectorAll('.section');
    const images = document.querySelectorAll('img');
    const footer = document.querySelector('.main-footer');

    // Existing functionality calls...
    createDarkModeToggle();
    createMobileNavToggle();
    createModalPopup();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetID);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for Section Animations
    const sectionObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // Lazy Loading Images
    const imgObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => {
        imgObserver.observe(img);
    });

    // FAQ Toggle
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.faq-item');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other open items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                if (openItem !== parentItem) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isExpanded) {
                parentItem.classList.remove('open');
                question.setAttribute('aria-expanded', 'false');
            } else {
                parentItem.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Image Zoom (Lightbox)
    createImageZoom();

    console.log('Initialization complete. All functionalities enabled.');

    function createDarkModeToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('dark-mode-toggle-container');
        const darkModeToggle = document.createElement('button');
        darkModeToggle.classList.add('dark-mode-toggle');
        darkModeToggle.textContent = 'Toggle Dark Mode';
        toggleContainer.appendChild(darkModeToggle);
        document.body.appendChild(toggleContainer);
    
        // Check saved mode in localStorage
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    
        // Toggle Dark Mode
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
    
            // Update manual and electronic section text colors dynamically
            const sections = document.querySelectorAll('.section-content p, .section-content ul');
            sections.forEach((section) => {
                section.style.color = document.body.classList.contains('dark-mode') ? '#eee' : '#333';
            });
        });
    }
    

    function createMobileNavToggle() {
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        navContainer.insertBefore(hamburger, navContainer.firstChild);

        hamburger.addEventListener('click', () => {
            nav.classList.toggle('show');
            hamburger.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('show');
                hamburger.classList.remove('open');
            });
        });
    }

    function createModalPopup() {
    let modalShown = false; // Ensures the modal only shows once
    let scrolled = false;   // Tracks if user has scrolled past 800px

    // 1) Create the modal backdrop + content
    const modal = document.createElement('div');
    modal.classList.add('modal-backdrop', 'hidden');
    modal.innerHTML = `
        <div class="modal">
            <h2>Stay Informed</h2>
            <p>Sign up for our newsletter to receive the latest security insights and updates on QuickSecure.</p>
            <input type="email" placeholder="Your Email" aria-label="Email Address" />
            <button class="modal-submit">Sign Up</button>
            <button class="modal-close">&times;</button>
        </div>
    `;
    document.body.appendChild(modal);

    // 2) Grab references to the close and submit buttons
    const closeButton = modal.querySelector('.modal-close');
    const submitButton = modal.querySelector('.modal-submit');

    // 3) Close button logic
    closeButton.addEventListener('click', () => {
        hideModal();
    });

    // 4) Submit button logic (validates email and sends it to Google Apps Script)
    submitButton.addEventListener('click', () => {
        const emailInput = modal.querySelector('input');
        const emailValue = emailInput.value.trim();

        // Check that the email contains an "@"
        if (!emailValue.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Send the email to your Google Apps Script endpoint
        fetch('https://script.google.com/macros/s/AKfycbw1s7y04Pc2gjCiJX6R0BorsHxr2JmzBALcJY-vkj2HKnT8MzgZv5tsArcGNVwLO0v7oQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailValue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Email submitted:', emailValue);
                hideModal();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error submitting email:', error);
            alert('There was an error. Please try again later.');
        });
    });

    // 5) Show the modal after 30 seconds (only once)
    setTimeout(() => {
        console.log('30 seconds passed, showing modal...');
        showModal();
    }, 30000);

    // 6) Also show the modal if user scrolls past 800px (only once)
    window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 800) {
            scrolled = true;
            showModal();
        }
    }, { passive: true });

    // 7) Helper to show the modal
    function showModal() {
        if (modalShown) return; // If we've already shown the modal, do nothing
        modalShown = true;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // 8) Helper to hide the modal
    function hideModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}


    function createImageZoom() {
        const zoomableImages = document.querySelectorAll('.zoomable-image');
        const imageModal = document.getElementById('image-modal');
        const imageModalImg = document.getElementById('image-modal-img');
        const imageModalClose = imageModal.querySelector('.image-modal-close');

        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                const fullsizeSrc = img.getAttribute('data-fullsize') || img.src;
                imageModalImg.src = fullsizeSrc;
                imageModal.classList.remove('hidden');
            });
        });

        imageModalClose.addEventListener('click', () => {
            imageModal.classList.add('hidden');
        });

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.add('hidden');
            }
        });
    }

});

