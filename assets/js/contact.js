/**
 * Reszolute - Contact Form Handler
 * Handles form validation and submission
 */

(function() {
    'use strict';

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');

    // ===========================
    // FORM VALIDATION
    // ===========================
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true; // Phone is optional
        const regex = /^[0-9\s\-\+\(\)]{10,}$/;
        return regex.test(phone);
    }

    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message || 'This field is required.';
        }
    }

    function clearFieldError(field) {
        field.classList.remove('is-invalid');
    }

    function validateForm() {
        let isValid = true;

        // Name validation
        const nameField = document.getElementById('name');
        if (!nameField.value.trim()) {
            showFieldError(nameField, 'Please enter your name.');
            isValid = false;
        } else {
            clearFieldError(nameField);
        }

        // Email validation
        const emailField = document.getElementById('email');
        if (!emailField.value.trim()) {
            showFieldError(emailField, 'Please enter your email address.');
            isValid = false;
        } else if (!validateEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearFieldError(emailField);
        }

        // Phone validation (optional but must be valid if provided)
        const phoneField = document.getElementById('phone');
        if (phoneField.value.trim() && !validatePhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number.');
            isValid = false;
        } else {
            clearFieldError(phoneField);
        }

        // Message validation
        const messageField = document.getElementById('message');
        if (!messageField.value.trim()) {
            showFieldError(messageField, 'Please enter your message.');
            isValid = false;
        } else if (messageField.value.trim().length < 10) {
            showFieldError(messageField, 'Message must be at least 10 characters long.');
            isValid = false;
        } else {
            clearFieldError(messageField);
        }

        return isValid;
    }

    // ===========================
    // CLEAR ERRORS ON INPUT
    // ===========================
    const formFields = contactForm.querySelectorAll('.form-control, .form-select');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // ===========================
    // FORM SUBMISSION - EMAILJS INTEGRATION
    // ===========================
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous success message
        successMessage.style.display = 'none';

        // Validate form
        if (!validateForm()) {
            const firstError = contactForm.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };

        try {
            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                service: formData.service || 'Not specified',
                message: formData.message,
                to_email: 'khanmkj96@gmail.com'
            };

            // Send email via EmailJS
            const response = await emailjs.send(
                'service_j7c8wvo',        // Your Service ID
                'template_7ayvp2i',       // Your Template ID
                templateParams
            );

            console.log('Email sent successfully:', response);
            showSuccessMessage();
            contactForm.reset();

        } catch (error) {
            console.error('EmailJS error:', error);
            
            // Fallback to mailto if EmailJS fails
            try {
                const subject = formData.service ? 
                    `Website Inquiry - ${formData.service}` : 
                    'Website Contact Form Submission';
                
                const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone || 'Not provided'}%0D%0AService: ${formData.service || 'Not specified'}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
                
                const mailtoLink = `mailto:khanmkj96@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
                window.location.href = mailtoLink;
                
                showSuccessMessage();
                contactForm.reset();
            } catch (mailtoError) {
                alert('There was an error sending your message. Please contact us directly at khanmkj96@gmail.com');
            }
        } finally {
            // Reset button state
            submitButton.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    });

    // ===========================
    // SHOW SUCCESS MESSAGE
    // ===========================
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
    }

    // ===========================
    // OPTIONAL: AUTO-SAVE TO LOCALSTORAGE
    // ===========================
    // Uncomment if you want to preserve form data on page refresh
    /*
    const formId = 'contactFormData';
    
    // Save form data on input
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            localStorage.setItem(formId, JSON.stringify(data));
        });
    });

    // Restore form data on load
    const savedData = localStorage.getItem(formId);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = contactForm.elements[key];
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error restoring form data:', e);
        }
    }

    // Clear saved data on successful submission
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem(formId);
        }, 2000);
    });
    */

})();
