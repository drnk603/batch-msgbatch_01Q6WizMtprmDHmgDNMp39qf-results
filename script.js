(function() {
    'use strict';

    window.__app = window.__app || {};

    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    function initBurgerMenu() {
        if (window.__app.burgerInitialized) return;
        window.__app.burgerInitialized = true;

        var toggle = document.querySelector('.navbar-toggler, .c-nav__toggle');
        var collapse = document.querySelector('.navbar-collapse, .c-nav__list');
        var body = document.body;

        if (!toggle || !collapse) return;

        function closeMenu() {
            collapse.classList.remove('show', 'is-open');
            toggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('u-no-scroll');
        }

        function openMenu() {
            collapse.classList.add('show', 'is-open');
            toggle.setAttribute('aria-expanded', 'true');
            body.classList.add('u-no-scroll');
        }

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (collapse.classList.contains('show') || collapse.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('click', function(e) {
            if ((collapse.classList.contains('show') || collapse.classList.contains('is-open')) && !collapse.contains(e.target) && !toggle.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && (collapse.classList.contains('show') || collapse.classList.contains('is-open'))) {
                closeMenu();
            }
        });

        var navLinks = collapse.querySelectorAll('.nav-link, .c-nav__link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                closeMenu();
            });
        }

        var resizeHandler = debounce(function() {
            if (window.innerWidth >= 768 && (collapse.classList.contains('show') || collapse.classList.contains('is-open'))) {
                closeMenu();
            }
        }, 250);

        window.addEventListener('resize', resizeHandler, { passive: true });
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInitialized) return;
        window.__app.smoothScrollInitialized = true;

        var isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
        var header = document.querySelector('.l-header, .navbar');

        document.addEventListener('click', function(e) {
            var target = e.target.closest('a[href^="#"]');
            if (!target) return;

            var href = target.getAttribute('href');
            if (href === '#' || href === '#!') return;

            if (isHomepage) {
                e.preventDefault();
                var targetElement = document.querySelector(href);
                if (targetElement) {
                    var headerHeight = header ? header.offsetHeight : 80;
                    var targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInitialized) return;
        window.__app.scrollSpyInitialized = true;

        var sections = document.querySelectorAll('section[id], div[id^="section-"]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"], .c-nav__link[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        var header = document.querySelector('.l-header, .navbar');
        var headerHeight = header ? header.offsetHeight : 80;

        function updateActiveLink() {
            var scrollPosition = window.scrollY + headerHeight + 100;

            var currentSection = null;
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var sectionTop = section.offsetTop;
                var sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section;
                    break;
                }
            }

            for (var j = 0; j < navLinks.length; j++) {
                var link = navLinks[j];
                link.classList.remove('active');
                link.removeAttribute('aria-current');

                if (currentSection) {
                    var href = link.getAttribute('href');
                    if (href === '#' + currentSection.id) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                }
            }
        }

        var scrollHandler = throttle(updateActiveLink, 100);
        window.addEventListener('scroll', scrollHandler, { passive: true });
        updateActiveLink();
    }

    function initIntersectionObserver() {
        if (window.__app.intersectionInitialized) return;
        window.__app.intersectionInitialized = true;

        if (!('IntersectionObserver' in window)) return;

        var animateElements = document.querySelectorAll('.card, .c-card, .c-button, .btn, img:not(.c-logo__img), .c-form');

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

                    setTimeout(function(el) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 50, entry.target);

                    observer.unobserve(entry.target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        for (var i = 0; i < animateElements.length; i++) {
            observer.observe(animateElements[i]);
        }
    }

    function initHoverEffects() {
        if (window.__app.hoverInitialized) return;
        window.__app.hoverInitialized = true;

        var hoverElements = document.querySelectorAll('.btn, .c-button, .card, .c-card, .nav-link, .c-nav__link');

        for (var i = 0; i < hoverElements.length; i++) {
            var element = hoverElements[i];

            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease-in-out';
            });

            element.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.3s ease-in-out';
            });
        }

        var buttons = document.querySelectorAll('.btn, .c-button');
        for (var j = 0; j < buttons.length; j++) {
            buttons[j].addEventListener('click', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                this.appendChild(ripple);

                setTimeout(function() {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        }

        var style = document.createElement('style');
        style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
        document.head.appendChild(style);
    }

    function initScrollToTop() {
        if (window.__app.scrollTopInitialized) return;
        window.__app.scrollTopInitialized = true;

        var scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
        scrollBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--color-primary); color: white; border: none; font-size: 24px; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease-in-out; z-index: 1000; box-shadow: var(--shadow-lg);';

        document.body.appendChild(scrollBtn);

        function toggleScrollBtn() {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        var scrollHandler = throttle(toggleScrollBtn, 100);
        window.addEventListener('scroll', scrollHandler, { passive: true });
        toggleScrollBtn();
    }

    function initCountUp() {
        if (window.__app.countUpInitialized) return;
        window.__app.countUpInitialized = true;

        var counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        if (!('IntersectionObserver' in window)) return;

        function animateCount(element) {
            var target = parseInt(element.getAttribute('data-count'));
            var duration = 2000;
            var start = 0;
            var increment = target / (duration / 16);
            var current = start;

            var timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    animateCount(entries[i].target);
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.5 });

        for (var i = 0; i < counters.length; i++) {
            observer.observe(counters[i]);
        }
    }

    function initFormValidation() {
        if (window.__app.formValidationInitialized) return;
        window.__app.formValidationInitialized = true;

        var notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 350px;';
        document.body.appendChild(notificationContainer);

        window.__app.notify = function(message, type) {
            type = type || 'info';
            var alertClass = 'alert-' + (type === 'error' ? 'danger' : type);

            var alert = document.createElement('div');
            alert.className = 'alert ' + alertClass + ' alert-dismissible fade show';
            alert.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; box-shadow: var(--shadow-lg); animation: slideIn 0.3s ease-out;';
            alert.innerHTML = message + '<button type="button" class="btn-close" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">×</button>';

            var closeBtn = alert.querySelector('.btn-close');
            closeBtn.addEventListener('click', function() {
                alert.classList.remove('show');
                setTimeout(function() {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 150);
            });

            notificationContainer.appendChild(alert);

            setTimeout(function() {
                if (alert.parentNode) {
                    alert.classList.remove('show');
                    setTimeout(function() {
                        if (alert.parentNode) {
                            alert.parentNode.removeChild(alert);
                        }
                    }, 150);
                }
            }, 5000);
        };

        var style = document.createElement('style');
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
        document.head.appendChild(style);

        var forms = document.querySelectorAll('.c-form, form');

        for (var i = 0; i < forms.length; i++) {
            var form = forms[i];

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var currentForm = this;
                var isValid = true;
                var errors = [];

                var firstName = currentForm.querySelector('#firstName');
                if (firstName && firstName.value.trim() === '') {
                    isValid = false;
                    errors.push('Vorname ist erforderlich.');
                    showFieldError(firstName, 'Bitte geben Sie Ihren Vornamen ein.');
                } else if (firstName && !/^[a-zA-ZÀ-ÿs-']{2,50}$/.test(firstName.value.trim())) {
                    isValid = false;
                    errors.push('Vorname enthält ungültige Zeichen.');
                    showFieldError(firstName, 'Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph erlaubt.');
                } else if (firstName) {
                    clearFieldError(firstName);
                }

                var lastName = currentForm.querySelector('#lastName');
                if (lastName && lastName.value.trim() === '') {
                    isValid = false;
                    errors.push('Nachname ist erforderlich.');
                    showFieldError(lastName, 'Bitte geben Sie Ihren Nachnamen ein.');
                } else if (lastName && !/^[a-zA-ZÀ-ÿs-']{2,50}$/.test(lastName.value.trim())) {
                    isValid = false;
                    errors.push('Nachname enthält ungültige Zeichen.');
                    showFieldError(lastName, 'Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph erlaubt.');
                } else if (lastName) {
                    clearFieldError(lastName);
                }

                var email = currentForm.querySelector('#email');
                if (email && email.value.trim() === '') {
                    isValid = false;
                    errors.push('E-Mail ist erforderlich.');
                    showFieldError(email, 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
                } else if (email && !/^[^s@]+@[^s@]+.[^s@]+$/.test(email.value.trim())) {
                    isValid = false;
                    errors.push('E-Mail-Format ist ungültig.');
                    showFieldError(email, 'Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@domain.de).');
                } else if (email) {
                    clearFieldError(email);
                }

                var phone = currentForm.querySelector('#phone');
                if (phone && phone.value.trim() !== '' && !/^[ds+-()]{10,20}$/.test(phone.value.trim())) {
                    isValid = false;
                    errors.push('Telefonnummer-Format ist ungültig.');
                    showFieldError(phone, 'Bitte geben Sie eine gültige Telefonnummer ein (10-20 Zeichen, nur Ziffern, +, -, (, )).');
                } else if (phone) {
                    clearFieldError(phone);
                }

                var message = currentForm.querySelector('#message');
                if (message && message.value.trim() !== '' && message.value.trim().length < 10) {
                    isValid = false;
                    errors.push('Nachricht muss mindestens 10 Zeichen lang sein.');
                    showFieldError(message, 'Bitte geben Sie mindestens 10 Zeichen ein.');
                } else if (message) {
                    clearFieldError(message);
                }

                var privacy = currentForm.querySelector('#privacy');
                if (privacy && !privacy.checked) {
                    isValid = false;
                    errors.push('Datenschutz muss akzeptiert werden.');
                    showFieldError(privacy, 'Bitte akzeptieren Sie die Datenschutzerklärung.');
                } else if (privacy) {
                    clearFieldError(privacy);
                }

                var honeypot = currentForm.querySelector('input[name="honeypot"]');
                if (honeypot && honeypot.value !== '') {
                    isValid = false;
                }

                if (!isValid) {
                    window.__app.notify('Bitte korrigieren Sie die Fehler im Formular.', 'error');
                    return;
                }

                var submitBtn = currentForm.querySelector('button[type="submit"], input[type="submit"]');

                if (submitBtn) {
                    submitBtn.disabled = true;
                    var originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;"></span>Wird gesendet...';

                    var spinStyle = document.createElement('style');
                    spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                    document.head.appendChild(spinStyle);

                    setTimeout(function() {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        window.__app.notify('Ihre Nachricht wurde erfolgreich gesendet!', 'success');
                        
                        setTimeout(function() {
                            window.location.href = 'thank_you.html';
                        }, 1500);
                    }, 2000);
                }
            });
        }

        function showFieldError(field, message) {
            field.classList.add('is-invalid');
            field.style.borderColor = 'var(--color-error)';

            var errorDiv = field.parentNode.querySelector('.invalid-feedback');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                errorDiv.style.cssText = 'color: var(--color-error); font-size: 0.875rem; margin-top: 0.5rem; display: block;';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function clearFieldError(field) {
            field.classList.remove('is-invalid');
            field.style.borderColor = '';

            var errorDiv = field.parentNode.querySelector('.invalid-feedback');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }

        var honeypotStyle = document.createElement('style');
        honeypotStyle.textContent = 'input[name="honeypot"] { position: absolute; left: -9999px; }';
        document.head.appendChild(honeypotStyle);

        for (var j = 0; j < forms.length; j++) {
            if (!forms[j].querySelector('input[name="honeypot"]')) {
                var honeypotInput = document.createElement('input');
                honeypotInput.type = 'text';
                honeypotInput.name = 'honeypot';
                honeypotInput.tabIndex = -1;
                honeypotInput.setAttribute('autocomplete', 'off');
                forms[j].appendChild(honeypotInput);
            }
        }
    }

    function initImages() {
        if (window.__app.imagesInitialized) return;
        window.__app.imagesInitialized = true;

        var images = document.querySelectorAll('img');

        for (var i = 0; i < images.length; i++) {
            var img = images[i];

            if (!img.hasAttribute('loading') && !img.classList.contains('c-logo__img')) {
                img.setAttribute('loading', 'lazy');
            }

            if (!img.classList.contains('img-fluid')) {
                img.classList.add('img-fluid');
            }

            img.addEventListener('error', function() {
                var failedImg = this;
                var width = failedImg.getAttribute('width') || 300;
                var height = failedImg.getAttribute('height') || 200;

                failedImg.src = 'data:image/svg+xml;base64,' + btoa(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '"><rect width="100%" height="100%" fill="#e9ecef"/><text x="50%" y="50%" fill="#6c757d" text-anchor="middle" dy=".3em" font-family="system-ui,sans-serif" font-size="14">Bild nicht verfügbar</text></svg>'
                );
                failedImg.style.objectFit = 'contain';
            }, { once: true });
        }

        var videos = document.querySelectorAll('video');
        for (var j = 0; j < videos.length; j++) {
            if (!videos[j].hasAttribute('loading')) {
                videos[j].setAttribute('loading', 'lazy');
            }
        }
    }

    function initPrivacyModal() {
        if (window.__app.privacyModalInitialized) return;
        window.__app.privacyModalInitialized = true;

        var privacyLinks = document.querySelectorAll('a[href*="privacy"]');

        for (var i = 0; i < privacyLinks.length; i++) {
            privacyLinks[i].addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#privacy' || this.getAttribute('href') === '#datenschutz') {
                    e.preventDefault();
                    
                    var modal = document.createElement('div');
                    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease-out;';
                    
                    var modalContent = document.createElement('div');
                    modalContent.style.cssText = 'background: white; padding: 2rem; border-radius: 1rem; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: var(--shadow-xl); animation: slideUp 0.3s ease-out;';
                    modalContent.innerHTML = '<h2>Datenschutzerklärung</h2><p>Hier steht Ihre Datenschutzerklärung...</p><button style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Schließen</button>';
                    
                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);
                    
                    var closeBtn = modalContent.querySelector('button');
                    closeBtn.addEventListener('click', function() {
                        document.body.removeChild(modal);
                    });
                    
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal) {
                            document.body.removeChild(modal);
                        }
                    });
                    
                    var style = document.createElement('style');
                    style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }';
                    document.head.appendChild(style);
                }
            });
        }
    }

    window.__app.init = function() {
        if (window.__app.initialized) return;
        window.__app.initialized = true;

        initBurgerMenu();
        initSmoothScroll();
        initScrollSpy();
        initIntersectionObserver();
        initHoverEffects();
        initScrollToTop();
        initCountUp();
        initFormValidation();
        initImages();
        initPrivacyModal();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }

})();
# CSS Animations

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.navbar-collapse {
  height: calc(100vh - var(--header-h));
}

.alert {
  animation: slideIn 0.3s ease-out;
}

.card:hover,
.c-card:hover {
  animation: pulse 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  @keyframes fadeIn,
  @keyframes fadeInUp,
  @keyframes slideIn,
  @keyframes slideUp,
  @keyframes ripple,
  @keyframes spin,
  @keyframes pulse {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
