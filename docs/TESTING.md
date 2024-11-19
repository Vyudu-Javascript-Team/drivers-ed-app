# Testing Guide

## Overview

Our testing strategy includes:
- Unit tests
- Integration tests
- End-to-end tests
- Performance tests
- Accessibility tests

## Test Structure

```typescript
describe('Component/Feature', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Tests
  it('should do something', () => {
    // Test implementation
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Writing Tests

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Feature } from './Feature';

const queryClient = new QueryClient();

describe('Feature', () => {
  it('integrates with API', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Feature />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Data')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('completes user journey', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start');
  await expect(page.locator('h1')).toHaveText('Welcome');
});
```

## Mocking

### API Mocks
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: 'test' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Component Mocks
```typescript
jest.mock('./Component', () => ({
  Component: () => <div>Mocked Component</div>,
}));
```

## Test Coverage

Aim for:
- 80% overall coverage
- 100% coverage for critical paths
- 90% coverage for business logic

## Performance Testing

```typescript
import { performance } from 'perf_hooks';

describe('Performance', () => {
  it('renders quickly', () => {
    const start = performance.now();
    render(<Component />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
});
```

## Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices

1. Test Behavior, Not Implementation
```typescript
// Good
test('submits form', async () => {
  await userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Bad
test('calls submit function', () => {
  const submit = jest.fn();
  render(<Form onSubmit={submit} />);
  expect(submit).toHaveBeenCalled();
});
```

2. Use Data Attributes for Testing
```typescript
// Component
<button data-testid="submit">Submit</button>

// Test
screen.getByTestId('submit')
```

3. Group Related Tests
```typescript
describe('Form', () => {
  describe('validation', () => {
    it('requires email');
    it('validates email format');
  });

  describe('submission', () => {
    it('submits valid data');
    it('handles errors');
  });
});
```

4. Clean Up After Tests
```typescript
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
```

## Continuous Integration

Tests run on:
- Pull requests
- Main branch commits
- Release tags

```yaml
# .gitlab-ci.yml
test:
  script:
    - npm install
    - npm test
```

## Debugging Tests

```bash
# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
node --inspect-brk node_modules/.bin/jest path/to/test --runInBand
```

## Common Patterns

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Testing Context
```typescript
const wrapper = ({ children }) => (
  <Provider>
    {children}
  </Provider>
);

const { result } = renderHook(() => useContext(Context), { wrapper });
```

### Testing Async Code
```typescript
test('loads data', async () => {
  render(<Component />);
  
  expect(screen.getByText('Loading')).toBeInTheDocument();
  expect(await screen.findByText('Data')).toBeInTheDocument();
});
```