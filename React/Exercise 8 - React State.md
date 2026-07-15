# Exercise 8 - React State

## Scenario
Create a "CountPeople" app with entry/exit counters using React State.

---

## Setup

```bash
npx create-react-app counterapp
cd counterapp
```

---

## CountPeople.js
`src/CountPeople.js`

```jsx
import React, { Component } from 'react';

class CountPeople extends Component {

  constructor(props) {
    super(props);
    // State holds both counters
    this.state = {
      entrycount: 0,
      exitcount: 0
    };

    // Bind methods to 'this'
    this.UpdateEntry = this.UpdateEntry.bind(this);
    this.UpdateExit = this.UpdateExit.bind(this);
  }

  // Increment entry count when Login button is clicked
  UpdateEntry() {
    this.setState(prevState => ({
      entrycount: prevState.entrycount + 1
    }));
    console.log('Entry recorded. Total entries:', this.state.entrycount + 1);
  }

  // Increment exit count when Exit button is clicked
  UpdateExit() {
    if (this.state.exitcount < this.state.entrycount) {
      this.setState(prevState => ({
        exitcount: prevState.exitcount + 1
      }));
    } else {
      alert('Exit count cannot exceed Entry count!');
    }
  }

  getCurrentVisitors() {
    return this.state.entrycount - this.state.exitcount;
  }

  render() {
    const { entrycount, exitcount } = this.state;
    const current = this.getCurrentVisitors();

    const boxStyle = {
      textAlign: 'center',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      minWidth: '160px',
      backgroundColor: '#fff'
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '40px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🏬 Mall Visitor Counter</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Track people entering and exiting the mall
        </p>

        {/* Statistics */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={{ ...boxStyle, borderTop: '4px solid #4caf50' }}>
            <h2 style={{ color: '#4caf50', margin: 0 }}>{entrycount}</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>People Entered</p>
          </div>
          <div style={{ ...boxStyle, borderTop: '4px solid #f44336' }}>
            <h2 style={{ color: '#f44336', margin: 0 }}>{exitcount}</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>People Exited</p>
          </div>
          <div style={{ ...boxStyle, borderTop: '4px solid #2196f3' }}>
            <h2 style={{ color: '#2196f3', margin: 0 }}>{current}</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>Currently Inside</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={this.UpdateEntry}
            style={{
              padding: '16px 40px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
              transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✅ Login (Entry)
          </button>

          <button
            onClick={this.UpdateExit}
            disabled={exitcount >= entrycount}
            style={{
              padding: '16px 40px',
              backgroundColor: exitcount >= entrycount ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: exitcount >= entrycount ? 'not-allowed' : 'pointer',
              boxShadow: exitcount >= entrycount ? 'none' : '0 2px 8px rgba(244, 67, 54, 0.4)',
              transition: 'transform 0.1s'
            }}
          >
            🚪 Exit
          </button>
        </div>

        {/* Status */}
        <div style={{ marginTop: '30px', padding: '16px 30px',
                      backgroundColor: current > 0 ? '#e8f5e9' : '#fff3e0',
                      borderRadius: '8px', color: '#555' }}>
          <p>
            {current > 0
              ? `🏃 ${current} people currently in the mall`
              : '🏪 Mall is currently empty'}
          </p>
        </div>
      </div>
    );
  }
}

export default CountPeople;
```

---

## App.js

```jsx
import React from 'react';
import CountPeople from './CountPeople';

function App() {
  return <CountPeople />;
}

export default App;
```

---

## State Flow

```
State: { entrycount: 0, exitcount: 0 }
        ↓
[Login button clicked] → UpdateEntry() → setState({ entrycount: prev + 1 })
        ↓
[Exit button clicked]  → UpdateExit()  → setState({ exitcount: prev + 1 })
        ↓
React re-renders with new state values
        ↓
UI shows updated counts
```
