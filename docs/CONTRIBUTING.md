# Contributing to Driver's Ed Stories

## Code Style Guide

### General Guidelines
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
```typescript
// Use functional components with TypeScript
const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers next
  const handleEvent = () => {
    // Implementation
  };
  
  // Helper functions
  const helperFunction = () => {
    // Implementation
  };
  
  // Return JSX last
  return (
    // JSX
  );
};
```

### File Organization
```
src/
├── components/        # Reusable UI components
├── features/         # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and services
├── pages/           # Next.js pages
└── types/           # TypeScript type definitions
```

### Testing
- Write tests using Jest and React Testing Library
- Test user interactions and component behavior
- Mock external dependencies
- Aim for high test coverage

### State Management
- Use React Query for server state
- Use Zustand for client state
- Keep state as local as possible
- Document state management decisions

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use code splitting where appropriate

### Accessibility
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

### Git Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Pull Request Guidelines
- Reference related issues
- Include screenshots for UI changes
- Update documentation
- Add tests for new features
- Keep changes focused and atomic

### Code Review Process
1. Automated checks must pass
2. Two approvals required
3. Address review comments
4. Squash commits before merging

### Documentation
- Update README.md for new features
- Include inline documentation
- Update API documentation
- Document breaking changes

### Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Troubleshooting
- Check console errors
- Verify environment variables
- Clear cache if needed
- Check dependency versions

### Getting Help
- Join our Discord server
- Check existing issues
- Ask in discussions
- Read documentation

### License
By contributing, you agree that your contributions will be licensed under the MIT License.