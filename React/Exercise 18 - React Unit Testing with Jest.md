# Exercise 18 - React Unit Testing with Jest

## Scenario
Write unit tests for React components using Jest and React Testing Library.

---

## Setup

```bash
npx create-react-app testapp
cd testapp
# React Testing Library is already included with CRA
npm install --save-dev @testing-library/user-event
```

---

## Calculator.js (Component Under Test)
`src/Calculator.js`

```jsx
import React, { useState } from 'react';

function Calculator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState('+');

  const calculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    let res;
    switch (operation) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b !== 0 ? a / b : 'Error: Division by zero'; break;
      default: res = 0;
    }
    setResult(res);
  };

  return (
    <div data-testid="calculator">
      <h2>Calculator</h2>
      <input
        data-testid="num1"
        type="number"
        value={num1}
        onChange={e => setNum1(e.target.value)}
        placeholder="Number 1"
      />
      <select
        data-testid="operation"
        value={operation}
        onChange={e => setOperation(e.target.value)}
      >
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">×</option>
        <option value="/">/</option>
      </select>
      <input
        data-testid="num2"
        type="number"
        value={num2}
        onChange={e => setNum2(e.target.value)}
        placeholder="Number 2"
      />
      <button data-testid="calculate-btn" onClick={calculate}>Calculate</button>
      {result !== null && (
        <p data-testid="result">Result: {result}</p>
      )}
    </div>
  );
}

export default Calculator;
```

---

## Calculator.test.js
`src/Calculator.test.js`

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

describe('Calculator Component', () => {

  // Test 1: Component renders correctly
  test('renders calculator heading', () => {
    render(<Calculator />);
    const heading = screen.getByText('Calculator');
    expect(heading).toBeInTheDocument();
  });

  // Test 2: Input fields render
  test('renders num1 and num2 input fields', () => {
    render(<Calculator />);
    expect(screen.getByTestId('num1')).toBeInTheDocument();
    expect(screen.getByTestId('num2')).toBeInTheDocument();
    expect(screen.getByTestId('calculate-btn')).toBeInTheDocument();
  });

  // Test 3: Addition
  test('should add two numbers correctly', () => {
    render(<Calculator />);

    fireEvent.change(screen.getByTestId('num1'), { target: { value: '5' } });
    fireEvent.change(screen.getByTestId('num2'), { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('calculate-btn'));

    expect(screen.getByTestId('result')).toHaveTextContent('Result: 8');
  });

  // Test 4: Subtraction
  test('should subtract two numbers correctly', () => {
    render(<Calculator />);

    fireEvent.change(screen.getByTestId('num1'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('operation'), { target: { value: '-' } });
    fireEvent.change(screen.getByTestId('num2'), { target: { value: '4' } });
    fireEvent.click(screen.getByTestId('calculate-btn'));

    expect(screen.getByTestId('result')).toHaveTextContent('Result: 6');
  });

  // Test 5: Multiplication
  test('should multiply two numbers', () => {
    render(<Calculator />);

    fireEvent.change(screen.getByTestId('num1'), { target: { value: '4' } });
    fireEvent.change(screen.getByTestId('operation'), { target: { value: '*' } });
    fireEvent.change(screen.getByTestId('num2'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('calculate-btn'));

    expect(screen.getByTestId('result')).toHaveTextContent('Result: 20');
  });

  // Test 6: Division by zero
  test('should show error on division by zero', () => {
    render(<Calculator />);

    fireEvent.change(screen.getByTestId('num1'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('operation'), { target: { value: '/' } });
    fireEvent.change(screen.getByTestId('num2'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('calculate-btn'));

    expect(screen.getByTestId('result')).toHaveTextContent('Error: Division by zero');
  });

  // Test 7: No result shown before clicking button
  test('should not show result before calculate is clicked', () => {
    render(<Calculator />);
    expect(screen.queryByTestId('result')).not.toBeInTheDocument();
  });
});
```

---

## Greeting.test.js (Simple component test)
`src/Greeting.test.js`

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

test('renders greeting with name', () => {
  render(<Greeting name="Alice" />);
  expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
});

test('renders default greeting', () => {
  render(<Greeting name="World" />);
  const element = screen.getByRole('heading');
  expect(element).toHaveTextContent('Hello, World!');
});
```

---

## Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run a specific test file
npm test -- --testPathPattern=Calculator
```

---

## Testing Library Queries

| Query | Use Case |
|-------|----------|
| `getByText` | Find by visible text |
| `getByTestId` | Find by `data-testid` attribute |
| `getByRole` | Find by ARIA role (heading, button) |
| `getByPlaceholderText` | Find by placeholder |
| `queryBy*` | Returns null if not found (no throw) |
| `findBy*` | Async version (returns Promise) |
