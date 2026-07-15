# Exercise 14 - React Context API

## Scenario
Convert an Employee Management app from prop-drilling to React Context API for theme sharing.

---

## Setup

```bash
npx create-react-app contextapp
cd contextapp
```

---

## ThemeContext.js
`src/ThemeContext.js`

```jsx
import { createContext } from 'react';

// Create context with default value of 'light'
const ThemeContext = createContext('light');

export default ThemeContext;
```

---

## App.js (Theme Provider)
`src/App.js`

```jsx
import React, { Component } from 'react';
import ThemeContext from './ThemeContext';
import EmployeesList from './EmployeesList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: 'light' };
  }

  toggleTheme = () => {
    this.setState(prev => ({ theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }

  render() {
    const { theme } = this.state;

    const appStyle = {
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f5f5f5',
      color: theme === 'dark' ? '#e0e0e0' : '#333',
      padding: '20px',
      transition: 'all 0.3s ease',
      fontFamily: 'Arial, sans-serif'
    };

    return (
      /* ThemeContext.Provider wraps the entire app.
         All descendant components can access theme without prop passing. */
      <ThemeContext.Provider value={theme}>
        <div style={appStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>👥 Employee Management System</h1>
            <button
              onClick={this.toggleTheme}
              style={{
                padding: '10px 20px',
                backgroundColor: theme === 'dark' ? '#e0e0e0' : '#333',
                color: theme === 'dark' ? '#333' : 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
              }}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* EmployeesList no longer receives theme as prop */}
          <EmployeesList />
        </div>
      </ThemeContext.Provider>
    );
  }
}

export default App;
```

---

## EmployeesList.js (No Prop Drilling)
`src/EmployeesList.js`

```jsx
import React from 'react';
import EmployeeCard from './EmployeeCard';

const EMPLOYEES = [
  { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', dept: 'Engineering' },
  { id: 2, name: 'Bob Williams', role: 'Backend Developer', dept: 'Engineering' },
  { id: 3, name: 'Carol Smith', role: 'UX Designer', dept: 'Design' },
  { id: 4, name: 'David Brown', role: 'DevOps Engineer', dept: 'Infrastructure' },
];

function EmployeesList() {
  return (
    <div>
      <h2>All Employees</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {EMPLOYEES.map(emp => (
          /* theme is NOT passed as a prop — EmployeeCard reads from context */
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
}

export default EmployeesList;
```

---

## EmployeeCard.js (useContext Consumer)
`src/EmployeeCard.js`

```jsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function EmployeeCard({ employee }) {
  // Retrieve theme from context — no props needed!
  const theme = useContext(ThemeContext);

  const cardStyle = {
    width: '220px',
    padding: '16px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    // Dynamic styles based on theme from context
    backgroundColor: theme === 'dark' ? '#16213e' : '#ffffff',
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    border: theme === 'dark' ? '1px solid #444' : '1px solid #ddd',
    boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
  };

  const btnClass = theme === 'dark' ? 'dark' : 'light';

  const btnStyle = {
    marginTop: '12px',
    padding: '8px 16px',
    width: '100%',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    // Button color based on theme
    backgroundColor: theme === 'dark' ? '#e0e0e0' : '#1976d2',
    color: theme === 'dark' ? '#333' : '#fff',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '10px' }}>
        {employee.name.charAt(0)}
      </div>
      <h3 style={{ margin: 0, fontSize: '16px' }}>{employee.name}</h3>
      <p style={{ color: theme === 'dark' ? '#aaa' : '#666', margin: '4px 0', fontSize: '14px' }}>
        {employee.role}
      </p>
      <p style={{ color: theme === 'dark' ? '#888' : '#999', margin: '4px 0', fontSize: '13px' }}>
        {employee.dept}
      </p>

      {/* className uses the theme variable from context */}
      <button style={btnStyle} className={btnClass}>
        View Profile
      </button>
    </div>
  );
}

export default EmployeeCard;
```

---

## Context API vs Prop Drilling

| Aspect | Prop Drilling | Context API |
|--------|--------------|-------------|
| **Passing data** | Passed via every component level | Available to any descendant directly |
| **Boilerplate** | High (many props) | Low (one provider, one useContext) |
| **Maintenance** | Hard (update all components) | Easy (update provider only) |
| **Best for** | Local component data | Global data (theme, auth, locale) |

---

## Key Steps

```
1. Create context:   const ThemeContext = createContext('light')
2. Wrap with Provider:  <ThemeContext.Provider value={theme}>
3. Consume in child:   const theme = useContext(ThemeContext)
```
