# Contributing to Site-Forms

Thank you for your interest in contributing to Site-Forms! We welcome all contributions, including new form templates, improvements to the form model, and bug fixes.

## 🤝 How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/Site-Forms.git
cd Site-Forms
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# Or for new forms:
git checkout -b form/form-name
```

### 3. Make Your Changes

#### Adding a New Form:
- Create HTML file in `docs/pages/`
- Follow the form schema in `models/form-schema.json`
- Use existing CSS classes from `docs/css/style.css`
- Test locally with a simple HTTP server

#### Improving Form Model:
- Update `docs/js/form-model.js` or `models/form-model.js`
- Add/update tests
- Document API changes

#### Adding Email Provider:
- Update `api/email-service.js`
- Add configuration to `.env.example`
- Include setup documentation

### 4. Test Your Changes

#### Local Testing:
```bash
# Start a simple HTTP server
python -m http.server 8000

# Visit: http://localhost:8000/docs/
```

#### Test Checklist:
- [ ] Form submits without errors
- [ ] Validation works correctly
- [ ] Email is received (if configured)
- [ ] Success message displays
- [ ] Mobile responsive
- [ ] Works in all browsers

### 5. Commit & Push
```bash
git add .
git commit -m "Add: description of changes"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Describe the changes clearly
- Reference any related issues
- Include screenshots if UI changes
- Request review from maintainers

## 📋 Form Template Guidelines

### File Naming
- Use kebab-case: `contact-form.html`, `newsletter-signup.html`
- Name should match form purpose

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Title</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="container">
        <form id="form-name" class="site-form" data-form-name="form-name">
            <!-- Form fields -->
        </form>
    </div>
    <script src="../js/form-handler.js"></script>
</body>
</html>
```

### Required Fields
All forms must include:
- `id` attribute
- `class="site-form"`
- `data-form-name` attribute
- At least name/email for contact info
- Submit button

### Validation
- Email fields: `type="email"`
- Required fields: `required` attribute
- Message field: `textarea` for longer forms
- Phone fields: `type="tel"`

## 🐛 Reporting Issues

### To Report a Bug:
1. Check if issue already exists
2. Provide clear description
3. Include browser/OS details
4. Attach screenshot if possible
5. Provide steps to reproduce

### Issue Title Format
- `[BUG]` for bugs
- `[FEATURE]` for feature requests
- `[DOCUMENTATION]` for doc updates
- `[FORM]` for new form templates

## 📚 Code Standards

### JavaScript
- Use ES6+ features (no IE11 support required)
- Use meaningful variable names
- Comment complex logic
- Max line length: 100 characters

### CSS
- Use BEM naming convention
- Mobile-first approach
- Support modern browsers (last 2 versions)

### HTML
- Valid HTML5
- Semantic elements
- Accessible forms (proper labels, ARIA)
- Mobile responsive

## 🎨 Design Consistency

- Use colors from `style.css` variables
- Maintain form field spacing (0.75rem margin-bottom)
- Use consistent button styling
- Test on mobile (320px minimum width)

## 📝 Commit Message Format

```
[TYPE]: Brief description (50 chars max)

Longer explanation if needed. Explain WHAT and WHY,
not HOW. Keep lines under 72 characters.

Fixes #123
See also #456
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic change)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

## 🚀 Development Workflow

### Local Setup
```bash
# Install dependencies (if using npm)
npm install

# Start development server
npm run dev

# Or use Python simple server
python -m http.server 8000
```

### File Synchronization
- Always pull latest before creating branch
- Keep branches up-to-date with main
- Rebase if conflicts arise

### Review Process
1. Pull request created
2. Automated checks run
3. Manual review by maintainers
4. Changes requested or approved
5. Merge to main (auto-deploy to Pages)

## 📞 Questions?

- Create a [GitHub Discussion](https://github.com/yourusername/Site-Forms/discussions)
- Check [Existing Issues](https://github.com/yourusername/Site-Forms/issues)
- Read [Documentation](./docs/)

## ✅ Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Changes tested locally
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No breaking changes (or clearly documented)
- [ ] Forms work on mobile
- [ ] No console errors

## 🎉 Thank You!

Your contributions make Site-Forms better for everyone!
