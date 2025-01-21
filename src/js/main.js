document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    /** Feedback rating stars **/
    const initRatingStars = () => {
        const stars = document.querySelectorAll('.form__rating-star');
        let selectedRating = 0;

        const updateStars = (rate, className) => {
            stars.forEach(star => {
                star.classList.remove('hover', 'selected');
                if (star.dataset.rate <= rate) {
                    star.classList.add(className);
                }
            });
        };

        stars.forEach(star => {
            ['mouseover', 'mouseout', 'click'].forEach(eventType => {
                star.addEventListener(eventType, (event) => {
                    const rate = star.dataset.rate;

                    if (event.type === 'mouseover') updateStars(rate, 'hover');
                    if (event.type === 'mouseout') updateStars(selectedRating, 'selected');
                    if (event.type === 'click') {
                        selectedRating = rate;
                        updateStars(selectedRating, 'selected');
                    }
                });
            });
        });

        const resetRating = () => {
            selectedRating = 0;
            stars.forEach(star => star.classList.remove('selected'));
        };

        window.resetRating = resetRating;
    };

    /** Floating button **/
    const initFloatingButton = () => {
        const contactBtn = document.getElementById('contactBtn');
        window.addEventListener('scroll', () => {
            contactBtn.classList.toggle('visible', window.scrollY > 0);
        });
    };

    /** Popup functionality **/
    const togglePopup = (popup, isActive) => {
        popup.classList.toggle('active', isActive);
        body.classList.toggle('lock', isActive);
    };

    const initPopup = (element, popup) => {
        element.addEventListener('click', () => togglePopup(popup, true));

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                togglePopup(popup, false);
                clearForm(popup);
            }
        });

        const closeButton = popup.querySelector('.form__close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                togglePopup(popup, false);
                clearForm(popup);
            });
        }
    };

    const initPopups = () => {
        const buttons = {
            contactBtn: { element: document.getElementById('contactBtn'), popup: document.getElementById('popupContactUs') },
            bookNowBtn: { element: document.getElementById('bookNowBtn'), popup: document.getElementById('popupContactUs') },
            feedbackBtn: { element: document.getElementById('feedbackBtn'), popup: document.getElementById('popupFeedback') },
            orderBtn: { element: document.querySelector('.order--js'), popup: document.getElementById('popupOrder') },
            orderNowBtn: { element: document.querySelector('.order-now--js'), popup: document.getElementById('popupOrder') },
        };

        Object.values(buttons).forEach(({ element, popup }) => {
            initPopup(element, popup);
        });
    };

    const showSuccessPopup = (currentPopup, popupId) => {
        const successPopup = document.getElementById('popupSuccess');
        const successMsg = document.getElementById('successMsg');

        if (currentPopup) {
            togglePopup(currentPopup, false);
        }

        togglePopup(successPopup, true);

        console.log(popupId);

        switch (popupId) {
            case 'popupContactUs':
                successMsg.textContent = 'We will get back to you shortly!';
                break;
            case 'popupFeedback':
                successMsg.textContent = 'Thank you for your feedback!';
                break;
            case 'popupOrder':
                successMsg.textContent = 'We will get back to you shortly!';
                break;
            default:
                successMsg.textContent = 'We will get back to you shortly!';
                break;
        }

        const closeSuccessPopupButton = successPopup.querySelector('.form__close');

        if (closeSuccessPopupButton) {
            closeSuccessPopupButton.addEventListener('click', () => {
                togglePopup(successPopup, false);
            });
        }

        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                togglePopup(successPopup, false);
            }
        });

        const closeSuccessPopupById = document.getElementById('successClose');
        if (closeSuccessPopupById) {
            closeSuccessPopupById.addEventListener('click', () => {
                togglePopup(successPopup, false);
            });
        }
    };

    /** Animations **/
    const initAnimations = () => {
        const setupIntersectionObserver = (selector, callback, options = { threshold: 1 }) => {
            const elements = document.querySelectorAll(selector);
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);
            elements.forEach(element => observer.observe(element));
        };

        setupIntersectionObserver('.section__best-price-old', (element) => {
            element.classList.add('visible');
        });

        setupIntersectionObserver(
            '.section__reasons-icon',
            () => {
                document.querySelectorAll('.section__reasons-icon').forEach((el, index) => {
                    setTimeout(() => el.classList.add('visible'), index * 500);
                });
            },
            { threshold: 0.1 }
        );
    };

    /** Form fields validation and submission **/
    const initFormSubmission = () => {
        const forms = document.querySelectorAll('form');
        const TEST_API_URL = 'https://jsonplaceholder.typicode.com/posts';
        const HASHTOKEN = '7BRltAlHPDGAXfQAf0hdIFpRG9aVBlC9';

        forms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                let isValid = true;

                const emailInputs = form.querySelectorAll('input[type="email"]');
                const phoneInputs = form.querySelectorAll('input[type="tel"]');
                const inputs = form.querySelectorAll('input, textarea, select');

                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.classList.add('form--error');
                        isValid = false;
                    } else if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
                        input.classList.add('form--error');
                        isValid = false;
                    } else {
                        input.classList.remove('form--error');
                    }
                });

                emailInputs.forEach(emailInput => {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailInput.value)) {
                        emailInput.classList.add('form--error');
                        isValid = false;
                    } else {
                        emailInput.classList.remove('form--error');
                    }
                });

                phoneInputs.forEach(phoneInput => {
                    const phonePattern = /^\+1\s?\(?[2-9][0-9]{2}\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/;
                    if (!phonePattern.test(phoneInput.value)) {
                        phoneInput.classList.add('form--error');
                        isValid = false;
                    } else {
                        phoneInput.classList.remove('form--error');
                    }
                });

                if (!isValid) {
                    return;
                }

                const formData = new FormData(form);
                const formDataObject = {
                    firstname: formData.get('firstname') || '',
                    lastname: formData.get('lastname') || '',
                    company: formData.get('company') || '',
                    address: formData.get('address') || '',
                    phone: formData.get('phone') || '',
                    email: formData.get('email') || '',
                    message: formData.get('message') || '',
                    product: formData.get('product') || '',
                    hashtoken: HASHTOKEN,
                };

                try {
                    const response = await fetch(TEST_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formDataObject),
                    });

                    const result = await response.json();
                    console.log('Test API Response:', result);

                    const currentPopup = form.closest('.popup');

                    const popupId = currentPopup ? currentPopup.id : '';

                    showSuccessPopup(currentPopup, popupId);

                    form.reset();

                    if (window.resetRating) {
                        window.resetRating();
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                }
            });

            const phoneInputs = form.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(phoneInput => {
                phoneInput.addEventListener('input', () => {
                    let input = phoneInput.value.replace(/\D/g, '');
                    let formatted = '+1 ';

                    if (input.startsWith('1')) input = input.slice(1);
                    if (input.length > 0) formatted += '(' + input.slice(0, 3);
                    if (input.length >= 4) formatted += ') ' + input.slice(3, 6);
                    if (input.length >= 7) formatted += '-' + input.slice(6, 10);

                    phoneInput.value = formatted;
                });

                phoneInput.addEventListener('blur', () => {
                    const regex = /^\+1\s?\(?[2-9][0-9]{2}\)?[.\-\s]?[2-9][0-9]{2}[.\-\s]?[0-9]{4}$/;
                    phoneInput.classList.toggle('form--error', !regex.test(phoneInput.value));
                });
            });
        });
    };

    const clearForm = (popup) => {
        const form = popup.querySelector('form');

        if (form) {
            form.reset();
            const formFields = form.querySelectorAll('input, textarea');
            formFields.forEach(field => field.classList.remove('form--error'));
        }

        if (window.resetRating) {
            window.resetRating();
        }
    };

    initRatingStars();
    initFloatingButton();
    initPopups();
    initAnimations();
    initFormSubmission();
});
