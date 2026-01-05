# Testing Setup

This project uses **Jest** and **React Testing Library (RTL)** for unit and integration testing.

## Overview

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **ts-jest**: TypeScript preprocessor for Jest

## Installation

Install all testing dependencies:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── components/
│   └── CourseList/
│       ├── CoursesList.tsx
│       └── CoursesList.test.tsx    # Component tests
├── setupTests.ts                    # Test setup and global mocks
└── types/
    └── jest.d.ts                    # Jest type definitions
```

## Writing Tests

### Basic Component Test

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('handles button click', async () => {
  const user = userEvent.setup();
  render(<MyButton />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

### Testing with Props

```typescript
test('displays custom message', () => {
  const message = 'Custom message';
  render(<MyComponent message={message} />);
  expect(screen.getByText(message)).toBeInTheDocument();
});
```

## Configuration Files

### jest.config.js
Main Jest configuration file that sets up:
- Test environment (jsdom)
- Module name mapping for CSS/SCSS files
- Coverage thresholds
- TypeScript transformation

### setupTests.ts
Runs before each test file:
- Imports `@testing-library/jest-dom` for additional matchers
- Sets up global mocks (e.g., window.matchMedia)

## Common Testing Patterns

### Query Priority (Recommended Order)
1. `getByRole` - Most accessible queries
2. `getByLabelText` - For form elements
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

### Assertions
```typescript
// Element presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Text content
expect(element).toHaveTextContent('text');

// CSS classes
expect(element).toHaveClass('className');

// Attributes
expect(element).toHaveAttribute('href', '/path');

// Visibility
expect(element).toBeVisible();
```

## Coverage Thresholds

The project enforces minimum coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Mocking

### CSS/SCSS Modules
CSS and SCSS imports are automatically mocked using `identity-obj-proxy`.

### Images and Static Files
Image imports are mocked using the file mock in `__mocks__/fileMock.js`.

### API Calls
```typescript
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('fetches data', async () => {
  mockedAxios.get.mockResolvedValue({ data: { id: 1 } });
  // test code
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees and does
2. **Use semantic queries** - Prefer `getByRole` over `getByTestId`
3. **Avoid testing implementation details** - Don't test state directly
4. **Keep tests simple** - One assertion per test when possible
5. **Use descriptive test names** - Clearly describe what is being tested
6. **Clean up after tests** - RTL does this automatically, but be mindful with custom setup

## Debugging Tests

### View rendered output
```typescript
const { debug } = render(<MyComponent />);
debug(); // Prints DOM to console
```

### Check specific element
```typescript
debug(screen.getByRole('button'));
```

## Example Test File

See `src/components/CourseList/CoursesList.test.tsx` for a complete example of testing a React component with various test cases.

## Troubleshooting

### Tests not finding modules
- Ensure `moduleNameMapper` in `jest.config.js` is configured correctly
- Check that file extensions are listed in `moduleFileExtensions`

### TypeScript errors in tests
- Verify `@types/jest` is installed
- Add `"types": ["jest", "@testing-library/jest-dom"]` to tsconfig.json
- Check that `setupTests.ts` is included in `setupFilesAfterEnv`

### Coverage not generating
- Run `npm run test:coverage`
- Check `collectCoverageFrom` patterns in `jest.config.js`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
