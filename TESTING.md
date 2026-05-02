# Running Tests

## Backend Tests

Install dependencies:
```bash
cd /Users/saj/Desktop/demo/TestProject
npm install
```

Run tests:
```bash
npm test
```

Run tests in watch mode (re-runs on file changes):
```bash
npm run test:watch
```

### Backend Test Coverage

The backend tests cover:
- **Health check endpoint** — verifies API is running
- **Root endpoint** — checks API info is returned
- **Add endpoint** — positive numbers, negatives, decimals, error handling
- **Subtract endpoint** — subtraction, negative results, error handling
- **Multiply endpoint** — multiplication, zero multiplication, negatives
- **Divide endpoint** — division, decimals, division by zero error handling
- **Generic calculate endpoint** — all operations, case-insensitive operations, error handling

## Frontend Tests

Install dependencies:
```bash
cd /Users/saj/Desktop/demo/TestProject/frontend
npm install
```

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Frontend Test Coverage

The frontend tests cover:
- **Rendering** — all buttons and display are present
- **Number input** — typing numbers, concatenation, decimal support
- **Clear/Backspace** — AC button resets, backspace removes digits
- **API Integration** — fetch calls are made correctly, results displayed
- **Error handling** — API errors and network errors are handled
- **All operations** — addition, subtraction, multiplication, division
- **Chained operations** — multiple operations in sequence

## Test Output

Both test suites will output:
- Number of tests passed/failed
- Coverage report (lines, functions, branches covered)
- Any failing tests with detailed error messages

Example output:
```
PASS  __tests__/calculator.test.js
  Calculator API
    ✓ should add two numbers correctly
    ✓ should divide by zero returns error
    ... (more tests)
    
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.345s
```

## Notes

- Backend tests use **supertest** to test Express routes
- Frontend tests use **React Testing Library** to test components
- All API endpoints are tested for both success and error cases
- Frontend tests mock the fetch API to avoid real network calls
