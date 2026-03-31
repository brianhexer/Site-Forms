/**
 * API Configuration
 * Store environment-specific settings here
 */

const config = {
  // Email Service
  emailService: process.env.EMAIL_SERVICE || 'emailjs',
  
  // Form Settings
  rateLimit: parseInt(process.env.FORM_RATE_LIMIT) || 5,
  spamCheckEnabled: process.env.FORM_SPAM_CHECK !== 'false',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'localhost').split(','),
  
  // EmailJS
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY
  },
  
  // SendGrid
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.ADMIN_EMAIL || 'noreply@site-forms.com'
  },
  
  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  },
  
  // Webhook
  webhook: {
    url: process.env.WEBHOOK_URL,
    secret: process.env.WEBHOOK_SECRET
  },
  
  // Notifications
  adminEmail: process.env.ADMIN_EMAIL,
  notificationEnabled: process.env.NOTIFICATION_EMAIL !== 'false'
};

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];
  
  if (!config.emailService) {
    errors.push('EMAIL_SERVICE not configured');
  }
  
  if (config.emailService === 'emailjs') {
    if (!config.emailjs.serviceId) errors.push('EMAILJS_SERVICE_ID not set');
    if (!config.emailjs.templateId) errors.push('EMAILJS_TEMPLATE_ID not set');
    if (!config.emailjs.publicKey) errors.push('EMAILJS_PUBLIC_KEY not set');
  }
  
  if (config.emailService === 'sendgrid') {
    if (!config.sendgrid.apiKey) errors.push('SENDGRID_API_KEY not set');
  }
  
  if (config.emailService === 'firebase') {
    if (!config.firebase.projectId) errors.push('FIREBASE_PROJECT_ID not set');
  }
  
  if (config.emailService === 'webhook' && !config.webhook.url) {
    errors.push('WEBHOOK_URL not configured');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Get config value with fallback
 */
function get(path, defaultValue = null) {
  return path.split('.').reduce((obj, key) => obj?.[key], config) ?? defaultValue;
}

/**
 * Check if origin is allowed (CORS)
 */
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  // Extract domain without protocol
  const originDomain = new URL(origin).hostname;
  
  return config.allowedOrigins.some(allowed => {
    const allowedDomain = allowed.split(':')[0];
    return originDomain === allowedDomain || originDomain === 'localhost';
  });
}

module.exports = {
  config,
  validateConfig,
  get,
  isOriginAllowed
};
