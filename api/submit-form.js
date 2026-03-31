/**
 * Form Submission Handler
 * 
 * This is the main API endpoint for handling form submissions.
 * Can be deployed to:
 * - Vercel Functions (/api/submit-form.js)
 * - Netlify Functions (/functions/submit-form.js)
 * - Firebase Cloud Functions
 * - Any Node.js backend
 */

const { sendEmail } = require('./email-service');
const { config, validateConfig, isOriginAllowed } = require('./config');

/**
 * Validate form submission
 */
function validateSubmission(data) {
  const errors = [];
  
  if (!data.formId) {
    errors.push('Form ID is required');
  }
  
  if (!data.data || typeof data.data !== 'object') {
    errors.push('Form data is required');
  }
  
  if (!data.recipient) {
    errors.push('Recipient email is required');
  }
  
  // Validate email format
  if (data.recipient && !isValidEmail(data.recipient)) {
    errors.push('Invalid recipient email format');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check for spam patterns
 */
function isSpam(data) {
  const textFields = Object.values(data.data).filter(v => typeof v === 'string');
  
  for (const field of textFields) {
    // Check for excessive links
    const linkCount = (field.match(/https?:\/\//g) || []).length;
    if (linkCount > 3) return true;
    
    // Check for repeated characters
    if (/(.)\1{9,}/.test(field)) return true;
    
    // Check for spam keywords
    const spamKeywords = ['viagra', 'casino', 'lottery', 'click here'];
    if (spamKeywords.some(keyword => field.toLowerCase().includes(keyword))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Rate limiting helper
 */
const submissionCounts = new Map();

function checkRateLimit(identifier, limit = config.rateLimit) {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  if (!submissionCounts.has(identifier)) {
    submissionCounts.set(identifier, []);
  }
  
  const submissions = submissionCounts.get(identifier);
  const recentSubmissions = submissions.filter(time => time > oneHourAgo);
  
  if (recentSubmissions.length >= limit) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissionCounts.set(identifier, recentSubmissions);
  
  return true;
}

/**
 * Main handler function
 */
async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Validate configuration
    const validation = validateConfig();
    if (!validation.valid) {
      console.error('Configuration errors:', validation.errors);
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: process.env.DEBUG ? validation.errors : undefined
      });
    }
    
    // Check CORS
    if (!isOriginAllowed(req.headers.origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    
    // Parse and validate submission
    const submission = req.body;
    const validation_result = validateSubmission(submission);
    
    if (!validation_result.valid) {
      return res.status(400).json({ 
        error: 'Invalid submission',
        details: validation_result.errors 
      });
    }
    
    // Check rate limiting
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    if (!checkRateLimit(ipAddress)) {
      return res.status(429).json({ 
        error: 'Too many submissions. Please try again later.' 
      });
    }
    
    // Check for spam
    if (config.spamCheckEnabled && isSpam(submission)) {
      console.warn(`Spam detected from ${ipAddress}`);
      return res.status(400).json({ error: 'Submission blocked' });
    }
    
    // Send email
    const message = formatMessage(submission.data);
    const subject = `New form submission from ${submission.formId}`;
    
    await sendEmail({
      recipientEmail: submission.recipient,
      subject: subject,
      message: message,
      formData: submission.data,
      service: config.emailService
    });
    
    // Success response
    return res.status(200).json({ 
      success: true,
      message: 'Form submitted successfully' 
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to submit form',
      details: process.env.DEBUG ? error.message : undefined
    });
  }
}

/**
 * Format form data as message
 */
function formatMessage(data) {
  const excludeFields = ['_userEmail', '_ipAddress', '_timestamp', '_formName'];
  
  let message = '';
  for (const [key, value] of Object.entries(data)) {
    if (!excludeFields.includes(key)) {
      const label = formatLabel(key);
      const val = Array.isArray(value) ? value.join(', ') : value;
      message += `${label}: ${val}\n`;
    }
  }
  
  return message;
}

/**
 * Format field name to label
 */
function formatLabel(fieldName) {
  return fieldName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// For Node.js/Express
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
}

// For Vercel
exports.default = handler;
