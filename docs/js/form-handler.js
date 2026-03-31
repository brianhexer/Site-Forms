/**
 * Form Handler - Global form submission handler for Site-Forms
 * 
 * This script automatically handles all forms with class "site-form"
 * Include this script in your HTML: <script src="/js/form-handler.js"></script>
 */

// Initialize EmailJS (if configured)
function initializeEmailJS() {
  const publicKey = document.currentScript?.dataset.emailjsPublicKey || 
                    window.EMAILJS_PUBLIC_KEY;
  
  if (publicKey && typeof emailjs !== 'undefined') {
    emailjs.init(publicKey);
    console.log('EmailJS initialized');
  }
}

// Initialize all forms on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeEmailJS();
  
  // Find all forms with class "site-form"
  const forms = document.querySelectorAll('form.site-form');
  
  forms.forEach(form => {
    const formModel = new FormModel({
      id: form.id || form.getAttribute('data-form-name'),
      recipient: form.getAttribute('data-recipient') || 
                 form.getAttribute('data-notify-email'),
      redirectUrl: form.getAttribute('data-redirect-url'),
      successMessage: form.getAttribute('data-success-message') || 
                      'Thank you! Your form has been submitted.',
      errorMessage: form.getAttribute('data-error-message') || 
                    'An error occurred. Please try again.',
      webhookUrl: form.getAttribute('data-webhook-url'),
      webhookSecret: form.getAttribute('data-webhook-secret'),
      rateLimit: parseInt(form.getAttribute('data-rate-limit') || '5'),
      spamCheck: form.getAttribute('data-spam-check') !== 'false'
    });
    
    formModel.init();
  });
});

/**
 * Email Service Configuration
 * Set these globally before including form-handler.js
 */
window.EMAILJS_PUBLIC_KEY = window.EMAILJS_PUBLIC_KEY || '';
window.EMAILJS_SERVICE_ID = window.EMAILJS_SERVICE_ID || '';
window.EMAILJS_TEMPLATE_ID = window.EMAILJS_TEMPLATE_ID || '';
