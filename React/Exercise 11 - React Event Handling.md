# Exercise 11 - React Event Handling

## Scenario
Create an "eventexamplesapp" demonstrating various event handlers including Increment/Decrement, argument passing, and a Currency Converter.

---

## Setup

```bash
npx create-react-app eventexamplesapp
cd eventexamplesapp
```

---

## EventExamples.js
`src/EventExamples.js`

```jsx
import React, { Component } from 'react';

class EventExamples extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      message: '',
      inrValue: '',
      euroValue: ''
    };
  }

  // Increment counter
  incrementCounter = () => {
    this.setState(prev => ({ counter: prev.counter + 1 }));
  }

  // Say hello (called alongside increment)
  sayHello = () => {
    this.setState({ message: 'Hello! Welcome to the Event Examples App.' });
  }

  // Increment button invokes multiple methods
  handleIncrement = () => {
    this.incrementCounter();
    this.sayHello();
  }

  // Decrement counter
  handleDecrement = () => {
    this.setState(prev => ({
      counter: prev.counter - 1,
      message: 'Counter decremented.'
    }));
  }

  // Method that takes an argument
  handleWelcome = (msg) => {
    this.setState({ message: `Welcome! You said: "${msg}"` });
  }

  // Synthetic event — OnPress (onClick is React's synthetic event)
  handleSyntheticClick = (event) => {
    // event is the SyntheticEvent object
    event.preventDefault();
    this.setState({ message: 'I was clicked! (Synthetic onClick event fired)' });
    console.log('SyntheticEvent:', event.type, event.target);
  }

  // Currency converter: INR to Euro
  handleConvert = (event) => {
    event.preventDefault();
    const inr = parseFloat(this.state.inrValue);
    if (isNaN(inr) || inr <= 0) {
      this.setState({ message: 'Please enter a valid INR amount.' });
      return;
    }
    const euro = (inr / 90.5).toFixed(2); // Approx conversion rate
    this.setState({ euroValue: euro, message: `₹${inr} = €${euro}` });
  }

  render() {
    const { counter, message, inrValue, euroValue } = this.state;

    const sectionStyle = {
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      margin: '15px 0',
      backgroundColor: '#fff'
    };

    const btnStyle = (color) => ({
      padding: '10px 24px',
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      margin: '5px',
      fontSize: '15px'
    });

    return (
      <div style={{ fontFamily: 'Arial', maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
        <h1>🎯 React Event Handling Examples</h1>

        {/* Message display */}
        {message && (
          <div style={{ backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '6px',
                        marginBottom: '15px', color: '#2e7d32' }}>
            ℹ️ {message}
          </div>
        )}

        {/* Section 1: Increment + Decrement (multiple method invocation) */}
        <div style={sectionStyle}>
          <h3>1. Counter with Multiple Methods on Increment</h3>
          <p>Count: <strong style={{ fontSize: '24px' }}>{counter}</strong></p>

          {/* Increment invokes incrementCounter() AND sayHello() */}
          <button style={btnStyle('#4caf50')} onClick={this.handleIncrement}>
            ➕ Increase
          </button>

          <button style={btnStyle('#f44336')} onClick={this.handleDecrement}>
            ➖ Decrement
          </button>
        </div>

        {/* Section 2: Argument passing */}
        <div style={sectionStyle}>
          <h3>2. Say Welcome (Argument Passing)</h3>
          {/* Pass "welcome" as argument via arrow function */}
          <button style={btnStyle('#1976d2')}
                  onClick={() => this.handleWelcome('welcome')}>
            Say Welcome
          </button>
          <button style={btnStyle('#9c27b0')}
                  onClick={() => this.handleWelcome('hello there!')}>
            Say Hello There!
          </button>
        </div>

        {/* Section 3: Synthetic Event */}
        <div style={sectionStyle}>
          <h3>3. Synthetic Event (OnClick → displays "I was clicked")</h3>
          <button style={btnStyle('#ff5722')} onClick={this.handleSyntheticClick}>
            Click Me (Synthetic Event)
          </button>
        </div>

        {/* Section 4: Currency Converter */}
        <div style={sectionStyle}>
          <h3>4. Currency Converter (INR → Euro)</h3>
          <form onSubmit={this.handleConvert}>
            <input
              type="number"
              placeholder="Enter amount in INR (₹)"
              value={inrValue}
              onChange={e => this.setState({ inrValue: e.target.value })}
              style={{ padding: '10px', width: '250px', marginRight: '10px',
                       border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px' }}
            />
            <button type="submit" style={btnStyle('#e91e63')}>
              Convert to Euro
            </button>
          </form>
          {euroValue && (
            <p style={{ marginTop: '10px', fontSize: '20px', color: '#1565c0' }}>
              ₹{inrValue} = <strong>€{euroValue}</strong>
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default EventExamples;
```

---

## App.js

```jsx
import React from 'react';
import EventExamples from './EventExamples';

function App() {
  return <EventExamples />;
}

export default App;
```

---

## React Event Handling Concepts

| Concept | Syntax |
|---------|--------|
| Simple handler | `onClick={this.handleClick}` |
| Multiple methods | `onClick={() => { method1(); method2(); }}` |
| Argument passing | `onClick={() => this.handle('value')}` |
| Synthetic Event | `onClick={e => { e.preventDefault(); ... }}` |
| Form submit | `onSubmit={this.handleSubmit}` |
| Input change | `onChange={e => this.setState({ val: e.target.value })}` |
