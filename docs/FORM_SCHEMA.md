# Form Schema Guide

All forms in Site-Forms should follow the standard JSON schema defined in `models/form-schema.json`.

## Schema Structure

Each form must have:

```json
{
  "id": "form-id",
  "name": "Human Readable Name",
  "version": "1.0.0",
  "recipient": "email@example.com",
  "fields": [],
  "settings": {}
}
```

## Form Configuration

### Basic Information

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique form identifier (kebab-case) |
| `name` | Yes | string | Display name |
| `version` | No | string | Schema version (semver) |
| `description` | No | string | Form description |
| `recipient` | Yes | string or array | Email recipient(s) |

Example:
```json
{
  "id": "contact-form",
  "name": "Contact Us",
  "version": "1.0.0",
  "description": "Main contact form for website",
  "recipient": ["contact@example.com", "support@example.com"]
}
```

## Fields Definition

Each field must include:

```json
{
  "name": "field-name",
  "label": "Field Label",
  "type": "text",
  "required": true
}
```

### Supported Field Types

| Type | HTML Element | Example |
|------|--------------|---------|
| `text` | `<input type="text">` | Name, address |
| `email` | `<input type="email">` | Email address |
| `tel` | `<input type="tel">` | Phone number |
| `url` | `<input type="url">` | Website |
| `number` | `<input type="number">` | Age, quantity |
| `date` | `<input type="date">` | Date picker |
| `time` | `<input type="time">` | Time picker |
| `textarea` | `<textarea>` | Message, feedback |
| `select` | `<select>` | Dropdown list |
| `checkbox` | `<input type="checkbox">` | Yes/no options |
| `radio` | `<input type="radio">` | Select one option |

### Field Properties

```json
{
  "name": "full-name",
  "label": "Full Name",
  "type": "text",
  "required": true,
  "placeholder": "John Doe",
  "validation": {
    "pattern": "^[a-zA-Z\\s]+$",
    "minLength": 2,
    "maxLength": 100
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Unique field identifier (kebab-case) |
| `label` | string | Display label |
| `type` | string | Field type |
| `required` | boolean | Is field required? |
| `placeholder` | string | Placeholder text |
| `validation` | object | Validation rules |

### Validation Options

```json
{
  "validation": {
    "pattern": "^[a-z]+$",        // Regex pattern
    "minLength": 5,               // Minimum characters
    "maxLength": 50,              // Maximum characters
    "min": 0,                     // Minimum number
    "max": 100,                   // Maximum number
    "step": 5,                    // Number step
    "match": "password"           // Must match another field
  }
}
```

### Select / Options Fields

For dropdowns and radio buttons:

```json
{
  "name": "category",
  "label": "Choose Category",
  "type": "select",
  "options": [
    { "value": "sales", "label": "Sales Inquiry" },
    { "value": "support", "label": "Support" },
    { "value": "feedback", "label": "Feedback" }
  ]
}
```

### Checkbox Fields

For multiple checkboxes:

```json
{
  "name": "interests",
  "label": "What interests you?",
  "type": "checkbox",
  "options": [
    { "value": "tech", "label": "Technology" },
    { "value": "design", "label": "Design" },
    { "value": "biz", "label": "Business" }
  ]
}
```

## Form Settings

Optional settings for form behavior:

```json
{
  "settings": {
    "redirectUrl": "/thank-you.html",
    "successMessage": "Thank you for your submission!",
    "errorMessage": "Sorry, something went wrong.",
    "rateLimit": 5,
    "spamCheck": true,
    "confirmationEmail": true,
    "notificationEmail": true
  }
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `redirectUrl` | string | null | Redirect URL after submit |
| `successMessage` | string | "Thank you" | Success message text |
| `errorMessage` | string | "Error occurred" | Error message text |
| `rateLimit` | number | 5 | Max submissions per hour |
| `spamCheck` | boolean | true | Enable spam detection |
| `confirmationEmail` | boolean | false | Send user confirmation |
| `notificationEmail` | boolean | true | Notify admin |

## Complete Example

```json
{
  "id": "contact-form",
  "name": "Contact Form",
  "version": "1.0.0",
  "description": "Main website contact form",
  
  "recipient": "contact@example.com",
  
  "fields": [
    {
      "name": "full-name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "John Doe",
      "validation": {
        "minLength": 2,
        "maxLength": 100
      }
    },
    {
      "name": "email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "john@example.com"
    },
    {
      "name": "phone",
      "label": "Phone Number",
      "type": "tel",
      "required": false,
      "placeholder": "(555) 123-4567"
    },
    {
      "name": "company",
      "label": "Company",
      "type": "text",
      "required": false
    },
    {
      "name": "subject",
      "label": "Subject",
      "type": "select",
      "required": true,
      "options": [
        { "value": "", "label": "-- Select --" },
        { "value": "sales", "label": "Sales Inquiry" },
        { "value": "support", "label": "Technical Support" },
        { "value": "partnership", "label": "Partnership" },
        { "value": "other", "label": "Other" }
      ]
    },
    {
      "name": "message",
      "label": "Message",
      "type": "textarea",
      "required": true,
      "placeholder": "How can we help?",
      "validation": {
        "minLength": 10,
        "maxLength": 5000
      }
    },
    {
      "name": "subscribe",
      "label": "Subscribe to our newsletter",
      "type": "checkbox",
      "required": false
    }
  ],
  
  "settings": {
    "redirectUrl": "/thank-you.html",
    "successMessage": "Thank you for contacting us! We'll get back to you soon.",
    "errorMessage": "Sorry, there was an error. Please try again.",
    "rateLimit": 5,
    "spamCheck": true,
    "confirmationEmail": true,
    "notificationEmail": true
  }
}
```

## HTML Generation

Use the schema to generate HTML:

```html
<form id="contact-form" class="site-form" data-form-name="contact-form">
  
  <div class="form-field">
    <label for="full-name">Full Name <span class="required">*</span></label>
    <input 
      id="full-name"
      type="text"
      name="full-name"
      placeholder="John Doe"
      minlength="2"
      maxlength="100"
      required>
  </div>
  
  <div class="form-field">
    <label for="email">Email Address <span class="required">*</span></label>
    <input 
      id="email"
      type="email"
      name="email"
      placeholder="john@example.com"
      required>
  </div>
  
  <!-- More fields... -->
  
  <button type="submit" class="btn btn-submit">Send</button>
  
</form>
```

## Validation Rules

When creating fields, ensure:

1. **Unique names** - No duplicate field names
2. **Valid types** - Use supported types only
3. **Required fields** - Must have label
4. **Options** - Required for select/checkbox/radio
5. **Patterns** - Valid regex patterns
6. **Min/Max** - Make sense for field type

## Best Practices

1. **Naming Convention**
   - Use kebab-case for IDs and field names
   - Use readable names (`contact-email` not `ce`)

2. **UX Design**
   - Keep forms simple (5-7 fields ideal)
   - Group related fields
   - Make required fields clear
   - Use logical field order

3. **Validation**
   - Validate on client-side for UX
   - Always validate on server
   - Provide clear error messages
   - Show required field indicators

4. **Labels & Placeholders**
   - Always include labels
   - Use helpful placeholders
   - Be specific (`Phone Number` not `Contact`)

5. **Security**
   - Never ask for passwords via forms
   - Validate email addresses
   - Sanitize all input on backend
   - Use HTTPS for submission

## Tools

### Schema Validator
Validate your schema against the JSON Schema:
```bash
npm install -g ajv-cli
ajv validate -s models/form-schema.json -d forms/my-form.json
```

### Generate HTML from Schema
```javascript
// Example function to generate HTML from schema
function generateFormHTML(schema) {
  let html = `<form id="${schema.id}" class="site-form">`;
  
  schema.fields.forEach(field => {
    html += `
      <div class="form-field">
        <label for="${field.name}">${field.label}</label>
        <input 
          type="${field.type}"
          id="${field.name}"
          name="${field.name}"
          ${field.required ? 'required' : ''}
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
        >
      </div>
    `;
  });
  
  html += '<button type="submit">Submit</button></form>';
  return html;
}
```

## See Also

- [API Reference](./API.md)
- [Email Setup](./EMAIL_SETUP.md)
- [Examples](../examples/)
