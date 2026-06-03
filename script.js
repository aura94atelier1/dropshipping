// ============================================
// MARA AURA - Premium Dropshipping Website
// JavaScript Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    setupNavigation();
    setupScrollEffects();
    setupFormHandling();
    setupMobileMenu();
    setupSmoothScroll();
    animateProductCards();
    addAnimations();
    setupLazyLoading();
});

// ============================================
// NAVIGATION SETUP
// ============================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Set home as active by default
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
}

// ============================================
// SCROLL EFFECTS
// ============================================
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const heroSection = document.querySelector('.hero');
        
        if (window.scrollY > (heroSection?.offsetHeight || 600) - 100) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ============================================
// FORM HANDLING
// ============================================
function setupFormHandling() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing! Check your email for exclusive offers.', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        max-width: 90%;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// PRODUCT CARD ANIMATION ON LOAD
// ============================================
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card, .feature-card, .affiliate-card');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ============================================
// ADD CSS ANIMATIONS
// ============================================
function addAnimations() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .bounce {
            animation: bounce 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// LAZY LOADING FOR IMAGES (Performance)
// ============================================
function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// TRACKING AND ANALYTICS (Ready for integration)
// ============================================
class Analytics {
    static trackClick(element, category, action) {
        console.log(`Click tracked: ${category} - ${action}`);
    }

    static trackPageView(pageName) {
        console.log(`Page viewed: ${pageName}`);
    }

    static trackConversion(type) {
        console.log(`Conversion tracked: ${type}`);
    }
}

// Track store link clicks
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.store-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const storeName = this.textContent;
            Analytics.trackClick(this, 'store-link', `clicked-${storeName}`);
        });
    });

    document.querySelectorAll('.affiliate-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const storeName = this.querySelector('h3').textContent;
            Analytics.trackClick(this, 'affiliate-store', `clicked-${storeName}`);
        });
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Resize handler with debounce
window.addEventListener('resize', debounce(function() {
    console.log('Window resized');
}, 250));

// ============================================
// CONSOLE GREETING
// ============================================
console.log('%c🎉 Welcome to MARA AURA! 🎉', 'font-size: 20px; color: #ff6b9d; font-weight: bold;');
console.log('%cYour Premium Dropshipping Platform', 'font-size: 14px; color: #c44569;');
console.log('%cWith 6 Affiliate Partners: Amazon, Temu, Jumia, AliExpress, Alibaba, Shein', 'font-size: 12px; color: #666;');