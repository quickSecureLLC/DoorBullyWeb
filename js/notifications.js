document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop/tablet
    if (window.innerWidth < 768) return;

    const notifications = [
        '🔒 New panic-button mobile feature is now live across all platforms.',
        '🕒 Lockdown response time optimized to under 3.8 seconds.',
        '🗺️ Campus floor plan editor now supports drag-and-drop labeling.',
        '🔔 Automated alert escalation added for unacknowledged incidents.',
        '📱 Mobile app update adds live dashboard access for administrators.',
        '⚡ QuickSecure locks now support low-battery alerts in real time.',
        '🛠️ Device inspection scheduler now syncs with Google Calendar.',
        '📶 Offline-mode fallback activated for all locking units.',
        '🧠 Threat detection accuracy improved with AI model v3.1.',
        '✅ New checklist module added for lockdown drill auditing.',
        '📊 Weekly summary reports now available for system performance.',
        '🔐 Manual override access now logs time and location in dashboard.',
        '🧪 Gunshot localization accuracy now includes corridor mapping.',
        '🔄 Remote firmware update capability now active for all locks.',
        '🗂️ Inspection logs exportable to PDF and CSV formats.',
        '🌐 Dashboard now supports multi-site monitoring from one view.',
        '🔄 Lockdown drill history now available with replay timeline.',
        '💡 Interactive map markers now display device status and logs.',
        '🚨 Voice alert announcements now trigger with lockdown status.',
        '📍 Device geolocation syncing enabled via WiFi triangulation.'
    ];

    const notificationContainer = document.querySelector('.hero-notifications');
    const notificationBox = document.querySelector('.notification-box');
    const messageElement = document.querySelector('.notification-message');
    
    let currentIndex = 0;
    let isAnimating = false;

    function showNotification() {
        if (isAnimating) return;
        isAnimating = true;

        // Show container
        notificationContainer.classList.add('show');

        // After container slides in, show the notification box
        setTimeout(() => {
            messageElement.textContent = notifications[currentIndex];
            notificationBox.classList.add('show');

            // Hide after 10 seconds
            setTimeout(hideNotification, 10000);
        }, 600);
    }

    function hideNotification() {
        notificationBox.classList.remove('show');
        
        // After box fades out, slide container out
        setTimeout(() => {
            notificationContainer.classList.remove('show');
            
            // Prepare next notification
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % notifications.length;
                isAnimating = false;
                showNotification();
            }, 10000); // Wait 10 seconds before showing next
        }, 400);
    }

    // Start the notification cycle
    setTimeout(showNotification, 2000); // Initial delay

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            notificationBox.classList.remove('show');
            notificationContainer.classList.remove('show');
            isAnimating = false;
        } else {
            // Resume with next notification when tab becomes visible
            setTimeout(showNotification, 1000);
        }
    });

    // Pause animations when window is resized below threshold
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth < 768) {
                notificationBox.classList.remove('show');
                notificationContainer.classList.remove('show');
                isAnimating = false;
            } else if (!isAnimating) {
                showNotification();
            }
        }, 250);
    });
}); 