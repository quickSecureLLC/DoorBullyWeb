document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing script...');

    // ================ Variables and Elements ================
    const nav = document.querySelector('.main-nav ul');
    const header = document.querySelector('.main-header');
    const navContainer = document.querySelector('.nav-container');
    const heroCTA = document.querySelector('.hero-cta');
    const sections = document.querySelectorAll('.section');
    const images = document.querySelectorAll('img');
    const footer = document.querySelector('.main-footer');

    // Elements for dark mode toggle
    let darkModeToggle;
    createDarkModeToggle();

    // Create a mobile nav toggle (hamburger menu)
    createMobileNavToggle();

    // Create a modal popup to showcase advanced functionality
    createModalPopup();

    // ================ Smooth Scrolling for Nav Links ================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetID = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetID);
            if (targetEl) {
                // Smooth scroll
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ================ Intersection Observer for Section Animations ================
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

    // ================ Lazy Loading Images ================
    const imgObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // If we had data-src, we’d swap it here. For now, assume images already loaded.
                // img.src = img.dataset.src;
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => {
        imgObserver.observe(img);
    });

    // ================ Dark Mode Functionality ================
    function createDarkModeToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('dark-mode-toggle-container');
        darkModeToggle = document.createElement('button');
        darkModeToggle.classList.add('dark-mode-toggle');
        darkModeToggle.textContent = 'Toggle Dark Mode';
        toggleContainer.appendChild(darkModeToggle);
        footer.appendChild(toggleContainer);

        // Check saved preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // ================ Mobile Navigation (Hamburger) ================
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

        // Close menu when link is clicked (on mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('show');
                hamburger.classList.remove('open');
            });
        });
    }

    // ================ Modal Popup Creation and Logic ================
    function createModalPopup() {
        // Modal HTML structure
        const modal = document.createElement('div');
        modal.classList.add('modal-backdrop', 'hidden');

        modal.innerHTML = `
            <div class="modal">
                <h2>Stay Informed</h2>
                <p>Sign up for our newsletter to receive the latest security insights and updates on DoorBully.</p>
                <input type="email" placeholder="Your Email" aria-label="Email Address" />
                <button class="modal-submit">Sign Up</button>
                <button class="modal-close">&times;</button>
            </div>
        `;

        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.modal-close');
        const submitButton = modal.querySelector('.modal-submit');

        closeButton.addEventListener('click', () => {
            hideModal(modal);
        });

        submitButton.addEventListener('click', () => {
            // A simple pretend submission
            console.log('Email submitted:', modal.querySelector('input').value);
            hideModal(modal);
        });

        // Show modal after a delay or after scrolling a certain amount
        setTimeout(() => {
            console.log('30 seconds passed, showing modal...');
            showModal(modal);
        }, 30000); // 30 seconds after DOMContentLoaded

        // Alternatively, we can show after user scrolls a bit
        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && window.scrollY > 800) {
                scrolled = true;
                showModal(modal);
            }
        }, { passive: true });
    }

    function showModal(modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // ================ Debounced Resize and Scroll Events for Performance ================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('Window resized, rechecking layout...');
            // Potentially re-calculate positions, re-lazyload, or re-observe elements.
        }, 200);
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Could be used for scroll-based analytics or updating a scroll position indicator.
            console.log('User stopped scrolling, update something if needed...');
        }, 200);
    }, { passive: true });

    // ================ Additional Checks and Logging ================
    console.log('Initialization complete. All event listeners attached and functionalities enabled.');

    // Example of further delayed checks for reliability:
    setTimeout(() => {
        console.log('Double-checking if all sections loaded and visible classes applied where needed.');
        sections.forEach(sec => {
            if (sec.classList.contains('visible')) {
                console.log(`Section ${sec.id} is visible.`);
            } else {
                console.log(`Section ${sec.id} not yet visible, might appear on scroll.`);
            }
        });
    }, 10000); // Check after 10 seconds

    // End of main script
});