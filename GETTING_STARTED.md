# Quick Start Guide

Get your first Site-Forms form working in 5 minutes!

## Option 1: Using EmailJS (Simplest)

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up for free
3. Verify your email address

### Step 2: Create Email Service
1. In dashboard, click "Email Services"
2. Click "Add Service" and select your email provider (Gmail, Outlook, etc.)
3. Follow the setup wizard

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Name: contact_form
Subject: New Form Submission from {{from_name}}

Content:
---
From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}
---
```

### Step 4: Get Your Credentials
1. In dashboard, click your service name → "Configuration"
2. Copy these three values:
   - **Service ID**: `service_xxxxxx`
   - **Template ID**: `template_xxxxxx`
3. Click "Account" → "API" → Copy your **Public Key**

### Step 5: Create Your Form

Create `contact.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <link rel="stylesheet" href="https://cdn.example.com/style.css">
</head>
<body>
    <div class="container-sm">
        <h1>Contact Us</h1>
        
        <form id="contact-form" class="site-form" 
              data-form-name="contact"
              data-recipient="your-email@example.com"
              data-success-message="Thank you! We received your message.">
            
            <div class="form-field">
                <label for="name">Your Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-field">
                <label for="email">Your Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-field">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
            </div>
            
            <div class="form-field">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-submit">Send</button>
        </form>
    </div>

    <!-- Include Site-Forms Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
    <script src="form-model.js"></script>
    <script src="form-handler.js"></script>
    
    <!-- Configure EmailJS -->
    <script>
        window.EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
        window.EMAILJS_SERVICE_ID = 'service_xxxxxx';
        window.EMAILJS_TEMPLATE_ID = 'template_xxxxxx';
    </script>
</body>
</html>
```

### Step 6: Test Your Form
1. Open your HTML file in browser
2. Fill out and submit
3. Check your email

Done! 🎉

---

## Option 2: Deploy to GitHub Pages

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/Site-Forms.git
cd Site-Forms
```

### Step 2: Configure EmailJS
Edit `docs/pages/contact.html`:
1. Replace `YOUR_PUBLIC_KEY_HERE` with your EmailJS public key
2. Replace `service_xxxxx` with your service ID
3. Replace `template_xxxxx` with your template ID
4. Update recipient email

### Step 3: Enable GitHub Pages
1. Go to Settings → Pages
2. Select "Deploy from branch"
3. Select branch: `main`, folder: `/docs`
4. Click Save

### Step 4: Push Changes
```bash
git add .
git commit -m "Configure Site-Forms for GitHub Pages"
git push origin main
```

Your site will be live at: `https://yourusername.github.io/Site-Forms`

---

## Option 3: Using SendGrid (Production)

### Setup:
1. Create [SendGrid](https://sendgrid.com) account
2. Create API key
3. Deploy to Vercel/Netlify with backend function
4. Set `SENDGRID_API_KEY` environment variable

See [Email Setup Guide](docs/EMAIL_SETUP.md) for details.

---

## Form Data Attributes Reference

```html
<form class="site-form"
      id="my-form"
      data-form-name="my-form"
      data-recipient="admin@example.com"
      data-redirect-url="/thank-you.html"
      data-success-message="Thanks for contacting us!"
      data-error-message="Sorry, please try again">
</form>
```

| Attribute | Purpose |
|-----------|---------|
| `class="site-form"` | Enables Site-Forms handling |
| `id="..."` | Form identifier |
| `data-form-name="..."` | Submission label |
| `data-recipient="..."` | Email recipient |
| `data-redirect-url="..."` | Redirect after submit (optional) |
| `data-success-message="..."` | Success message (optional) |
| `data-error-message="..."` | Error message (optional) |

---

## Common Issues

### "EmailJS not initialized"
- Make sure EmailJS script is loaded before form-model.js
- Verify `window.EMAILJS_PUBLIC_KEY` is set

### Form not submitting
- Check browser console for errors
- Verify all required fields are filled
- Check EmailJS credentials are correct

### Email not received
- Check spam folder
- Verify recipient email is correct
- Check EmailJS quota (200/month free)

### CORS errors
- Use same domain for form and API
- Check webhook URL is correct

---

## Next Steps

1. **Customize Styles**
   - Edit `css/style.css`
   - Override CSS variables

2. **Add More Forms**
   - Copy contact form template
   - Update form name and fields
   - Add to GitHub Pages

3. **Collaborate**
   - Fork repository
   - Create feature branch
   - Submit pull request

4. **Production Setup**
   - Move to SendGrid/Firebase
   - Set up domain email
   - Configure anti-spam

---

## Resources

- [Full Documentation](README.md)
- [API Reference](docs/API.md)
- [Form Schema Guide](docs/FORM_SCHEMA.md)
- [Email Setup Guide](docs/EMAIL_SETUP.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## Support

- 📧 [Email Support](mailto:support@site-forms.local)
- 🐛 [Report Issues](https://github.com/yourusername/Site-Forms/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/Site-Forms/discussions)
- 📚 [Documentation](docs/)

---

## Examples

**Already set up in this repo:**
- Contact form: `/docs/pages/contact.html`
- Newsletter: `/docs/pages/newsletter.html`
- Feedback: `/docs/pages/feedback.html`
- Basic example: `/examples/basic-form.html`

Visit `/docs/index.html` for demo!
