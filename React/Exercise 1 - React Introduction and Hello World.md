# Exercise 1 - React Introduction and Hello World

## Scenario
Create a first React application that displays a Hello World message and introduces JSX syntax.

---

## Setup

```bash
npx create-react-app helloapp
cd helloapp
npm start
```

---

## App.js
`src/App.js`

```jsx
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, World!</h1>
        <p>Welcome to React - A JavaScript Library for Building User Interfaces</p>
        <ul>
          <li>Component-based architecture</li>
          <li>Virtual DOM for performance</li>
          <li>JSX — JavaScript + XML syntax</li>
          <li>One-way data flow</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
```

---

## Greeting.js (Functional Component)
`src/components/Greeting.js`

```jsx
import React from 'react';

// Functional component that accepts props
function Greeting({ name, role }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '8px' }}>
      <h2>Hello, {name}! 👋</h2>
      <p>You are logged in as: <strong>{role}</strong></p>
      <p>Current Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

// Default props
Greeting.defaultProps = {
  name: 'Guest',
  role: 'Visitor'
};

export default Greeting;
```

---

## Updated App.js (using Greeting component)

```jsx
import React from 'react';
import Greeting from './components/Greeting';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>My First React App</h1>

      {/* Render Greeting component with different props */}
      <Greeting name="Alice" role="Admin" />
      <Greeting name="Bob" role="Developer" />
      <Greeting /> {/* Uses default props */}

      {/* Inline JSX expressions */}
      <div>
        <p>Today is: {new Date().toLocaleDateString()}</p>
        <p>2 + 2 = {2 + 2}</p>
        <p>React version: {React.version}</p>
      </div>
    </div>
  );
}

export default App;
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **JSX** | HTML-like syntax inside JavaScript |
| **Component** | Reusable UI building block |
| **Props** | Read-only data passed to components |
| **Default Props** | Fallback values when props not provided |
| **`{}` in JSX** | Embed JavaScript expressions |
