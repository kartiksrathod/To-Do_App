# Contributing to Advanced To-Do List

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🌟 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check [Issues](../../issues) for existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Why it would be useful
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation
4. **Test your changes**:
   ```bash
   # Frontend
   cd frontend && yarn test
   
   # Backend
   cd backend && pytest
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "Add: Brief description of changes"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (for UI changes)

## 📝 Coding Standards

### Frontend (React)
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Use Tailwind CSS for styling

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints
- Add docstrings for functions
- Handle errors appropriately
- Write async code where beneficial

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable (#123)

Examples:
```
Add: Dark mode toggle functionality
Fix: Task deletion error on empty list
Update: README with new installation steps
Refactor: Task component for better performance
```

## 🧪 Testing Guidelines

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage
- Test on multiple browsers (for frontend)

## 📚 Documentation

- Update README.md if adding features
- Add JSDoc/docstrings for new functions
- Update API documentation for backend changes
- Include code comments for complex logic

## 🤝 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged!

## 💡 Development Tips

### Setting Up Development Environment
```bash
# Backend hot reload
uvicorn server:app --reload

# Frontend hot reload
yarn start
```

### Debugging
- Use browser DevTools for frontend
- Use FastAPI's automatic docs at `/docs`
- Check console/terminal logs

## 📞 Questions?

Feel free to:
- Open an issue for questions
- Reach out to maintainers
- Join discussions in Issues

## 🎉 Recognition

All contributors will be:
- Listed in our Contributors section
- Acknowledged in release notes
- Appreciated for their time and effort!

Thank you for contributing to making this project better! 🚀
