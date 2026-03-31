# Email Integration Setup Guide

This guide covers how to set up email delivery for Site-Forms.

## Available Email Services

### 1. EmailJS (Recommended for GitHub Pages)

EmailJS sends emails directly from the browser, requiring no backend server.

#### Setup Steps:

1. **Create EmailJS Account**
   - Go to [emailjs.com](https://www.emailjs.com)
   - Sign up for free account

2. **Create Email Service**
   - Click "Email Services" in dashboard
   - Select your email provider (Gmail, Outlook, etc.)
   - Follow setup wizard

3. **Create Email Template**
   - Go to "Email Templates"
   - Create new template
   - Use variables like `{{from_name}}`, `{{message}}`, etc.

4. **Get Your Credentials**
   ```
   Service ID: service_xxxxx
   Template ID: template_xxxxx  
   Public Key: your_public_key
   ```

5. **Configure in Your Form**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
   <script>
     window.EMAILJS_PUBLIC_KEY = 'your_public_key';
     window.EMAILJS_SERVICE_ID = 'service_xxxxx';
     window.EMAILJS_TEMPLATE_ID = 'template_xxxxx';
   </script>
   ```

6. **Update `.env` File**
   ```
   EMAIL_SERVICE=emailjs
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_SERVICE_ID=service_xxxxx
   EMAILJS_TEMPLATE_ID=template_xxxxx
   ```

**Pros:**
- No backend required
- Free tier: 200 emails/month
- Works on GitHub Pages
- Easy setup

**Cons:**
- Public key is visible in frontend
- Limited free tier
- Email appears to come from your email account

---

### 2. SendGrid

SendGrid is a professional email service with generous free tier.

#### Setup Steps:

1. **Create SendGrid Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up (250 free emails/day)

2. **Create API Key**
   - Go to Settings > API Keys
   - Create new Full Access key
   - Copy the key (save it securely)

3. **Set Up Sender Authentication**
   - Verify sender domain (or use default)

4. **Configure in Backend**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   const msg = {
     to: 'recipient@example.com',
     from: 'noreply@yourdomain.com',
     subject: 'Form Submission',
     html: '<p>Your message here</p>',
   };
   
   await sgMail.send(msg);
   ```

5. **Update `.env` File**
   ```
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ADMIN_EMAIL=noreply@yourdomain.com
   ```

6. **Deploy Backend**
   - Use Vercel, Netlify, or similar
   - Set environment variables in deployment

**Pros:**
- Professional service
- Generous free tier (250/day)
- Great for production
- Good reputation

**Cons:**
- Requires backend server
- More complex setup
- Domain verification needed

---

### 3. Firebase Cloud Functions

Use Firebase for serverless email delivery.

#### Setup Steps:

1. **Create Firebase Project**
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create new project

2. **Enable Cloud Functions**
   - Go to "Build" > "Functions"
   - Create new function

3. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init functions
   ```

4. **Create Email Function**
   ```javascript
   const functions = require('firebase-functions');
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD
     }
   });
   
   exports.submitForm = functions.https.onRequest(async (req, res) => {
     const { to, subject, message } = req.body;
     
     try {
       await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: to,
         subject: subject,
         html: message
       });
       res.status(200).json({ success: true });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

5. **Deploy**
   ```bash
   firebase deploy --only functions
   ```

**Pros:**
- Free tier (125K invocations/month)
- Serverless
- Integrated with Firebase

**Cons:**
- Cold starts (slight delay)
- Requires Gmail setup

---

### 4. Custom Webhook

Send submissions to your own server.

#### Setup:

1. **Set Webhook URL**
   ```html
   <form data-webhook-url="https://your-server.com/api/submit-form">
   ```

2. **Handle on Your Backend**
   ```javascript
   app.post('/api/submit-form', async (req, res) => {
     const { to, subject, message, formData } = req.body;
     
     // Send email using any service
     // await sendEmail({ to, subject, message });
     
     res.json({ success: true });
   });
   ```

**Pros:**
- Full control
- Works with any email service

**Cons:**
- Requires backend
- More maintenance

---

## Testing Email Setup

### Test with EmailJS:
```javascript
// Open browser console and test:
emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  {
    to_email: 'test@example.com',
    from_name: 'Test User',
    message: 'This is a test message'
  }
);
```

### Test Form Submission:
1. Fill out form completely
2. Check browser console for errors
3. Check spam folder for received email
4. Verify all form data is included

---

## Troubleshooting

### Email not received:
1. Check spam folder
2. Verify email address is correct
3. Check service rate limits
4. Enable debug mode (check browser console)

### CORS errors:
1. Add your domain to allowed origins
2. Check webhook endpoint CORS headers

### Rate limiting:
1. Check FORM_RATE_LIMIT setting
2. Clear browser cache/localStorage
3. Wait before trying again

---

## Best Practices

1. **Never expose API keys in frontend**
   - Use backend for SendGrid, Firebase
   - Only use EmailJS public key for browser

2. **Validate on backend**
   - Verify email format
   - Check required fields
   - Sanitize input

3. **Set rate limiting**
   - Prevent spam submissions
   - Limit per IP address
   - Use CAPTCHA for public forms

4. **Monitor submissions**
   - Log all submissions
   - Set up alerts for errors
   - Monitor email delivery

5. **Test thoroughly**
   - Test with real form
   - Verify email formatting
   - Check all edge cases

---

## Security Considerations

1. **Sensitive Data**
   - Don't send passwords or credit cards
   - Encrypt encrypted fields
   - Use HTTPS

2. **Spam Prevention**
   - Implement CAPTCHA for public forms
   - Enable spam checking
   - Monitor for abuse

3. **Privacy**
   - Clear privacy policy
   - Get consent before sending
   - Delete old submissions

---

## Support

- [EmailJS Docs](https://www.emailjs.com/docs/)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [GitHub Issues](https://github.com/yourusername/Site-Forms/issues)
