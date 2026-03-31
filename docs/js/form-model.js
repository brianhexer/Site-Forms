/**
 * FormModel - Reusable form class for Site-Forms
 * 
 * Usage:
 * const form = new FormModel({
 *   id: 'contact-form',
 *   fields: ['name', 'email', 'message'],
 *   recipient: 'admin@example.com'
 * });
 * form.init();
 */

class FormModel {
  constructor(config = {}) {
    this.config = {
      emailService: 'emailjs',
      successMessage: 'Thank you! Your form has been submitted.',
      errorMessage: 'An error occurred. Please try again.',
      redirectUrl: null,
      rateLimit: 5,
      spamCheck: true,
      ...config
    };

    this.form = null;
    this.isSubmitting = false;
    this.submissions = new Map();

    if (this.config.id) {
      this.form = document.getElementById(this.config.id);
    }
  }

  /**
   * Initialize form
   */
  init() {
    if (!this.form) {
      console.error(`Form with id "${this.config.id}" not found`);
      return false;
    }

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.attachClientValidation();
    console.log(`Form "${this.config.id}" initialized`);
    return true;
  }

  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      // Validate form
      if (!this.form.checkValidity()) {
        this.showError('Please fill in all required fields correctly.');
        this.isSubmitting = false;
        return;
      }

      // Check rate limiting
      if (!this.checkRateLimit()) {
        this.showError('Too many submissions. Please try again later.');
        this.isSubmitting = false;
        return;
      }

      // Check spam
      if (this.config.spamCheck && this.isSpam()) {
        console.warn('Spam detected');
        this.showError('Submission blocked.');
        this.isSubmitting = false;
        return;
      }

      // Get form data
      const formData = this.getFormData();

      // Submit form
      await this.submitForm(formData);

      // Success
      this.form.reset();
      this.showSuccess();

      // Redirect if configured
      if (this.config.redirectUrl) {
        setTimeout(() => {
          window.location.href = this.config.redirectUrl;
        }, 1500);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(this.config.errorMessage);
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Get form data as object
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Get email field for rate limiting
    data._userEmail = data.email || '';
    data._ipAddress = this.getClientIp();
    data._timestamp = new Date().toISOString();
    data._formName = this.config.id;

    return data;
  }

  /**
   * Submit form to backend
   */
  async submitForm(data) {
    // Method 1: Using EmailJS (browser-side)
    if (this.config.emailService === 'emailjs') {
      return this.submitViaEmailJS(data);
    }

    // Method 2: Using custom webhook
    if (this.config.webhookUrl) {
      return this.submitViaWebhook(data);
    }

    // Method 3: Using Firestore (if Firebase initialized)
    if (window.firebase) {
      return this.submitViaFirebase(data);
    }

    throw new Error('No email service configured');
  }

  /**
   * Submit via EmailJS (browser-based)
   */
  async submitViaEmailJS(data) {
    if (!window.emailjs) {
      throw new Error('EmailJS not loaded');
    }

    const templateParams = {
      form_name: this.config.id,
      from_name: data.name || 'No Name',
      from_email: data.email || 'no-email@provided.com',
      to_email: this.config.recipient,
      message: this.formatDataAsMessage(data),
      ...data
    };

    return window.emailjs.send(
      window.EMAILJS_SERVICE_ID,
      window.EMAILJS_TEMPLATE_ID,
      templateParams
    );
  }

  /**
   * Submit via custom webhook
   */
  async submitViaWebhook(data) {
    const response = await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Form-Secret': this.config.webhookSecret || ''
      },
      body: JSON.stringify({
        formId: this.config.id,
        data: data,
        recipient: this.config.recipient
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Submit via Firebase
   */
  async submitViaFirebase(data) {
    const db = firebase.firestore();
    
    return db.collection('form_submissions').add({
      formId: this.config.id,
      data: data,
      recipient: this.config.recipient,
      createdAt: new Date(),
      processed: false
    });
  }

  /**
   * Format form data as readable message
   */
  formatDataAsMessage(data) {
    const excludeFields = ['_userEmail', '_ipAddress', '_timestamp', '_formName'];
    
    let message = '';
    for (const [key, value] of Object.entries(data)) {
      if (!excludeFields.includes(key)) {
        const label = this.formatLabel(key);
        const val = Array.isArray(value) ? value.join(', ') : value;
        message += `${label}: ${val}\n`;
      }
    }
    return message;
  }

  /**
   * Format field name to label
   */
  formatLabel(fieldName) {
    return fieldName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check rate limiting
   */
  checkRateLimit() {
    const key = this.config.id;
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    if (!this.submissions.has(key)) {
      this.submissions.set(key, []);
    }

    const submissions = this.submissions.get(key);
    const recentSubmissions = submissions.filter(time => time > oneHourAgo);

    if (recentSubmissions.length >= this.config.rateLimit) {
      return false;
    }

    recentSubmissions.push(now);
    this.submissions.set(key, recentSubmissions);
    
    // Store in localStorage for persistence across page reloads
    try {
      localStorage.setItem(`form_submissions_${key}`, JSON.stringify(recentSubmissions));
    } catch (e) {
      console.warn('localStorage not available');
    }

    return true;
  }

  /**
   * Simple spam detection
   */
  isSpam() {
    const data = this.getFormData();
    
    // Check for excessive links
    let linkCount = 0;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        linkCount += (value.match(/http[s]?:\/\//g) || []).length;
      }
    }

    if (linkCount > 3) {
      return true;
    }

    // Check for repeated characters (spammy patterns)
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.length > 10) {
        if (/(.)\1{9,}/.test(value)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get client IP (best effort)
   */
  getClientIp() {
    // This is a placeholder - actual IP requires backend
    return 'client-ip';
  }

  /**
   * Attach HTML5 validation
   */
  attachClientValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.showFieldError(input, this.getValidationMessage(input));
      });

      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  /**
   * Get validation message for field
   */
  getValidationMessage(field) {
    if (field.validity.valueMissing) {
      return 'This field is required';
    }
    if (field.validity.typeMismatch) {
      return `Please enter a valid ${field.type}`;
    }
    if (field.validity.tooShort) {
      return `Minimum length is ${field.minLength} characters`;
    }
    if (field.validity.tooLong) {
      return `Maximum length is ${field.maxLength} characters`;
    }
    if (field.validity.rangeUnderflow) {
      return `Minimum value is ${field.min}`;
    }
    if (field.validity.rangeOverflow) {
      return `Maximum value is ${field.max}`;
    }
    if (field.validity.patternMismatch) {
      return 'Please enter a valid value';
    }
    return 'Invalid field';
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    let errorEl = field.parentElement.querySelector('.error-message');
    
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      field.parentElement.appendChild(errorEl);
    }

    errorEl.textContent = message;
    field.classList.add('error');
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /**
   * Show success message
   */
  showSuccess() {
    const successEl = document.createElement('div');
    successEl.className = 'form-success-message';
    successEl.textContent = this.config.successMessage;
    this.form.parentElement.insertBefore(successEl, this.form);

    setTimeout(() => {
      successEl.classList.add('fade-out');
    }, 2000);
  }

  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error-message';
    errorEl.textContent = message;
    this.form.parentElement.insertBefore(errorEl, this.form);

    setTimeout(() => {
      errorEl.classList.add('fade-out');
    }, 3000);
  }

  /**
   * Set email service configuration
   */
  setEmailService(type, config = {}) {
    this.config.emailService = type;
    Object.assign(this.config, config);
  }

  /**
   * Reset form state
   */
  resetState() {
    this.isSubmitting = false;
    this.form.reset();
  }

  /**
   * Get submission history (from localStorage)
   */
  getSubmissionHistory() {
    try {
      const key = `form_submissions_${this.config.id}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormModel;
}
