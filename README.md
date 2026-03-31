# Site-Forms - Web3Forms Alternative with GitHub Integration

A lightweight, open-source form submission service that integrates with GitHub Pages and allows direct email delivery without external dependencies.

🌐 **Live Demo**: [brianhexer.github.io/Site-Forms](https://brianhexer.github.io/Site-Forms/)
📖 **Complete Guide**: [brianhexer.github.io/Site-Forms/guide.html](https://brianhexer.github.io/Site-Forms/guide.html)

## 🚀 Features

- **Direct Email Delivery** - Submit forms directly to recipient emails
- **GitHub Pages Compatible** - Deploy on GitHub Pages for free
- **Reusable Form Model** - Template system for creating forms across multiple pages
- **No Backend Required** - Uses serverless functions or simple webhooks
- **Collaboration Ready** - Open model for teams to build forms together
- **Email Integration** - Support for multiple email providers

## 📁 Project Structure

```
Site-Forms/
├── docs/                      # GitHub Pages source
│   ├── index.html            # Landing page
│   ├── css/
│   │   └── style.css         # Shared styles
│   ├── js/
│   │   ├── form-handler.js   # Form submission logic
│   │   └── form-model.js     # Reusable form model
│   └── pages/
│       ├── contact.html      # Example: Contact form
│       ├── newsletter.html   # Example: Newsletter signup
│       └── feedback.html     # Example: Feedback form
├── api/                       # Backend functions
│   ├── submit-form.js        # Main form handler
│   ├── config.js             # Configuration & env vars
│   └── email-service.js      # Email provider integration
├── models/                    # Form templates
│   ├── form-schema.json      # Standard form schema
│   └── form-model.js         # Reusable model class
├── examples/                  # Usage examples
│   └── basic-form.html       # Quick start example
├── .github/workflows/         # CI/CD workflows
│   └── deploy.yml            # Auto-deploy to Pages
├── .env.example              # Environment variables template
└── CONTRIBUTING.md           # Collaboration guidelines
```

## 🔧 Quick Start

**Visit the [📖 Complete Guide](https://brianhexer.github.io/Site-Forms/guide.html) for step-by-step instructions!**

1. **Sign Up for EmailJS**
   - Go to [emailjs.com](https://emailjs.com)
   - Create free account (200 emails/month)

2. **Get Your Credentials**
   - Service ID, Template ID, Public Key

3. **Test a Form**
   - Visit the [Contact Form](https://brianhexer.github.io/Site-Forms/pages/contact.html)
   - Fill it out and submit

🚀 **That's it!** Forms send emails immediately. See the [Complete Guide](https://brianhexer.github.io/Site-Forms/guide.html) for more details.

## 📝 How to Create a Form

### Basic HTML Form

```html
<form id="contact-form" class="site-form" data-form-name="contact">
  <div class="form-field">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div class="form-field">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-field">
    <label for="message">Message</label>
    <textarea id="message" name="message" required></textarea>
  </div>
  
  <button type="submit" class="btn-submit">Send</button>
</form>

<script src="/js/form-handler.js"></script>
```

### Advanced: Using Form Model

```javascript
import FormModel from '/js/form-model.js';

const contactForm = new FormModel({
  id: 'contact-form',
  fields: ['name', 'email', 'message'],
  recipient: 'admin@example.com',
  redirectUrl: '/thank-you.html'
});

contactForm.init();
```

## 📧 Email Integration

### Supported Providers

- **EmailJS** - Browser-based email sending
- **SendGrid** - API-based email service
- **Firebase** - Cloud functions + email
- **Custom Webhook** - Your own backend

### Setup EmailJS

1. Create account at [emailjs.com](https://www.emailjs.com)
2. Add Service ID, Template ID to environment
3. Update `email-service.js` with your IDs

```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```

## 🤝 Collaboration Model

This project is designed for team collaboration:

- **Form Templates** - Share reusable form patterns
- **Shared Components** - CSS and JS components in `/docs`
- **Standard Schema** - All forms follow `form-schema.json`
- **Multiple Branches** - Collaborate on feature branches
- **Pull Requests** - Review and merge new forms

### Creating a Collaborative Form

1. Create a branch: `git checkout -b form/newsletter-signup`
2. Add your form to `docs/pages/`
3. Test locally
4. Submit PR for review
5. Merge to main - auto-deployed!

## 🔐 Security

- **No Credentials in Frontend** - All sensitive data server-side
- **CORS Protection** - Validate origins
- **Rate Limiting** - Prevent spam submissions
- **Input Validation** - Server-side validation required

## 📚 Documentation

- **[📖 Complete Guide](https://brianhexer.github.io/Site-Forms/guide.html)** - Start here! Full walkthrough with examples
- **[Form Schema Guide](./docs/FORM_SCHEMA.md)** - Form definition and field types
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Email Integration](./docs/EMAIL_SETUP.md)** - Setup guides for all email providers
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute and collaborate

## 🚀 Deployment Options

- **GitHub Pages** (Free) - Static hosting
- **Vercel** (Free tier) - Serverless functions
- **Netlify** (Free tier) - Functions + forms
- **Firebase** (Free tier) - Cloud functions

## 📄 License

[Your License] - See LICENSE file

## 💬 Support

- Issues: [GitHub Issues](https://github.com/yourusername/Site-Forms/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/Site-Forms/discussions)