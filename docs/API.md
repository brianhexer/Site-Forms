# API Reference

## Form Submission Endpoint

### POST `/api/submit-form`

Submit a form and send email notification.

#### Request Body

```json
{
  "formId": "contact-form",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, this is a test message",
    "_timestamp": "2024-03-31T10:00:00Z",
    "_userEmail": "john@example.com",
    "_ipAddress": "192.168.1.1"
  },
  "recipient": "admin@example.com"
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

**Validation Error (400)**
```json
{
  "error": "Invalid submission",
  "details": [
    "Form ID is required",
    "Invalid recipient email format"
  ]
}
```

**Rate Limited (429)**
```json
{
  "error": "Too many submissions. Please try again later."
}
```

**Server Error (500)**
```json
{
  "error": "Server configuration error",
  "details": ["EMAIL_SERVICE not configured"]
}
```

---

## FormModel JavaScript API

### Constructor

```javascript
const form = new FormModel(config);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | string | - | Form element ID |
| `fields` | array | [] | Field names to submit |
| `recipient` | string | - | Email recipient |
| `redirectUrl` | string | null | Post-submit redirect |
| `successMessage` | string | "Thank you!" | Success message |
| `errorMessage` | string | "Error occurred" | Error message |
| `webhookUrl` | string | null | Custom webhook URL |
| `emailService` | string | "emailjs" | Email service type |
| `rateLimit` | number | 5 | Max submissions/hour |
| `spamCheck` | boolean | true | Enable spam checking |

### Methods

#### `init()`
Initialize form handling.
```javascript
form.init();
```

#### `getFormData()`
Get form data as object.
```javascript
const data = form.getFormData();
// Returns: { name: "...", email: "...", ... }
```

#### `setEmailService(type, config)`
Change email service.
```javascript
form.setEmailService('sendgrid', {
  webhookUrl: 'https://...'
});
```

#### `resetState()`
Reset form to initial state.
```javascript
form.resetState();
```

#### `getSubmissionHistory()`
Get previous submissions from localStorage.
```javascript
const history = form.getSubmissionHistory();
// Returns: [timestamp1, timestamp2, ...]
```

### Events

Listen to form lifecycle events:

```javascript
const form = document.getElementById('my-form');

form.addEventListener('submit', (e) => {
  console.log('Form submitted');
});
```

---

## HTML Data Attributes

Configure forms using data attributes:

```html
<form class="site-form"
      id="contact-form"
      data-form-name="contact"
      data-recipient="admin@example.com"
      data-redirect-url="/thank-you.html"
      data-success-message="Thanks for contacting us!"
      data-error-message="Sorry, please try again"
      data-webhook-url="https://api.example.com/submit"
      data-webhook-secret="secret-key"
      data-rate-limit="10"
      data-spam-check="true">
</form>
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique form identifier |
| `data-form-name` | string | Form name for submissions |
| `data-recipient` | string | Email recipient address |
| `data-redirect-url` | string | Redirect after submit |
| `data-success-message` | string | Success message text |
| `data-error-message` | string | Error message text |
| `data-webhook-url` | string | Custom webhook endpoint |
| `data-webhook-secret` | string | Webhook authentication secret |
| `data-rate-limit` | number | Max submissions per hour |
| `data-spam-check` | boolean | Enable spam detection |

---

## CSS Classes

Predefined classes for styling:

### Form Classes

```html
<form class="site-form">
  <div class="form-field">
    <label>Name</label>
    <input type="text">
  </div>
  
  <div class="form-row">
    <!-- Multiple columns -->
  </div>
  
  <button class="btn btn-submit">Submit</button>
</form>
```

### State Classes

```css
.form-success-message   /* Success message */
.form-error-message     /* Error message */
.form-warning-message   /* Warning message */
.form-info-message      /* Info message */

input.error             /* Invalid input */
.form-loading           /* Form submitting */
```

### Button Classes

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>

<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-block">Full Width</button>
```

### Utility Classes

```html
<div class="container">Container</div>
<div class="container-sm">Small Container</div>
<div class="container-md">Medium Container</div>

<p class="text-center">Centered</p>
<p class="text-muted">Muted text</p>

<div class="mt-1">Margin top</div>
<div class="mb-2">Margin bottom</div>
<div class="p-3">Padding</div>
```

---

## Environment Variables

Configure via `.env` file:

```bash
# Email Service
EMAIL_SERVICE=emailjs                          # emailjs, sendgrid, firebase, webhook
EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxx
EMAILJS_PRIVATE_KEY=xxxxxxxx

SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
ADMIN_EMAIL=admin@example.com

FIREBASE_PROJECT_ID=project-id
FIREBASE_PRIVATE_KEY=xxxxx
FIREBASE_CLIENT_EMAIL=xxx@iam.gserviceaccount.com

# Form Settings
FORM_RATE_LIMIT=5                             # Submissions per hour
FORM_SPAM_CHECK=true                          # Enable spam detection
ALLOWED_ORIGINS=localhost,example.com         # CORS allowed origins

# Notifications
NOTIFICATION_EMAIL=true                       # Send admin notifications
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Form not found" | Invalid form ID | Check form ID matches |
| "No email service configured" | Missing credentials | Set up email service |
| "Too many submissions" | Rate limit exceeded | Wait before retrying |
| "Submission blocked" | Spam detected | Check form data |
| "Invalid email format" | Bad email address | Verify recipient email |
| "CORS error" | Origin not allowed | Add domain to allowed origins |

### Debug Mode

Enable debug output:
```javascript
localStorage.setItem('site-forms-debug', 'true');
```

Check browser console for detailed logs.

---

## Deployment

### GitHub Pages (Static Only)
- Forms directory: `/docs`
- Use EmailJS for email delivery
- No backend needed

### Vercel (Recommended)
```bash
git push origin main
# Auto deploy with GitHub integration
```

Set environment variables in Vercel dashboard.

### Netlify
```bash
git push origin main
# Auto deploy with GitHub integration
```

Add functions for form handling.

### Firebase
```bash
firebase deploy --only functions,hosting
```

---

## Rate Limiting

Control submission frequency:

```javascript
// In each FormModel instance
const form = new FormModel({
  rateLimit: 5  // 5 submissions per hour per form
});
```

Rate limits are tracked per:
- IP address (server-side)
- Email address (client-side)
- Form ID

---

## Validation Rules

### Built-in Validation

- Required fields: `required` attribute
- Email format: `type="email"`
- Phone format: `type="tel"`
- URL format: `type="url"`
- Numbers: `type="number"` with min/max
- Custom pattern: `pattern="regex"`

### Custom Validation

```javascript
const form = document.getElementById('my-form');
form.addEventListener('invalid', (e) => {
  if (e.target.name === 'custom-field') {
    e.preventDefault();
    e.target.setCustomValidity('Custom error message');
  }
});
```

---

## Support & Examples

- [Basic Example](../examples/basic-form.html)
- [Contact Form](../pages/contact.html)
- [Newsletter Form](../pages/newsletter.html)
- [Feedback Form](../pages/feedback.html)
- [GitHub Issues](https://github.com/yourusername/Site-Forms/issues)
