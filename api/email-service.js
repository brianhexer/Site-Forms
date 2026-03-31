/**
 * EmailJS Service Configuration and Helper Functions
 * 
 * This module handles email delivery through various providers
 */

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID,
  templateId: process.env.EMAILJS_TEMPLATE_ID,
  publicKey: process.env.EMAILJS_PUBLIC_KEY
};

// SendGrid Configuration
const SENDGRID_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.ADMIN_EMAIL || 'noreply@site-forms.com'
};

// Firebase Configuration
const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

/**
 * Send email via EmailJS
 */
async function sendViaEmailJS(recipientEmail, subject, message, formData) {
  const emailjs = require('@emailjs/nodejs');
  
  emailjs.init({
    publicKey: EMAILJS_CONFIG.publicKey,
    privateKey: process.env.EMAILJS_PRIVATE_KEY
  });

  const templateParams = {
    to_email: recipientEmail,
    from_name: formData.name || 'Form Submission',
    subject: subject,
    message: message,
    form_data: JSON.stringify(formData, null, 2),
    reply_to: formData.email || ''
  };

  return emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  );
}

/**
 * Send email via SendGrid
 */
async function sendViaSendGrid(recipientEmail, subject, message, formData) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_CONFIG.apiKey);

  const htmlContent = `
    <h2>${subject}</h2>
    <p>${message}</p>
    <hr>
    <h3>Form Data:</h3>
    <pre>${JSON.stringify(formData, null, 2)}</pre>
  `;

  const msg = {
    to: recipientEmail,
    from: SENDGRID_CONFIG.fromEmail,
    subject: subject,
    html: htmlContent,
    replyTo: formData.email || SENDGRID_CONFIG.fromEmail
  };

  return sgMail.send(msg);
}

/**
 * Send email via Firebase Cloud Functions
 */
async function sendViaFirebase(recipientEmail, subject, message, formData) {
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');

  // Initialize Firebase if not already done
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: FIREBASE_CONFIG.projectId,
      privateKey: FIREBASE_CONFIG.privateKey,
      clientEmail: FIREBASE_CONFIG.clientEmail
    });
  }

  const db = admin.firestore();
  
  // Store in Firestore for processing
  return db.collection('emails').add({
    to: recipientEmail,
    from: FIREBASE_CONFIG.clientEmail,
    subject: subject,
    message: message,
    formData: formData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'pending'
  });
}

/**
 * Custom webhook submission
 */
async function sendViaWebhook(webhookUrl, data) {
  const fetch = require('node-fetch');

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Form-Secret': process.env.WEBHOOK_SECRET || ''
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`);
  }

  return response.json();
}

/**
 * Format form data as message
 */
function formatFormAsMessage(formData) {
  const excludeFields = ['_userEmail', '_ipAddress', '_timestamp', '_formName'];
  
  let message = '';
  for (const [key, value] of Object.entries(formData)) {
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

/**
 * Main email sending function
 */
async function sendEmail(config) {
  const {
    recipientEmail,
    subject,
    message,
    formData,
    service = 'emailjs'
  } = config;

  try {
    console.log(`Sending email via ${service}...`);

    switch (service.toLowerCase()) {
      case 'emailjs':
        return await sendViaEmailJS(recipientEmail, subject, message, formData);
      
      case 'sendgrid':
        return await sendViaSendGrid(recipientEmail, subject, message, formData);
      
      case 'firebase':
        return await sendViaFirebase(recipientEmail, subject, message, formData);
      
      case 'webhook':
        return await sendViaWebhook(config.webhookUrl, {
          to: recipientEmail,
          subject: subject,
          message: message,
          formData: formData
        });
      
      default:
        throw new Error(`Unknown email service: ${service}`);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

module.exports = {
  sendEmail,
  sendViaEmailJS,
  sendViaSendGrid,
  sendViaFirebase,
  sendViaWebhook,
  formatFormAsMessage,
  formatLabel
};
