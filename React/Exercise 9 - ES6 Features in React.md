# Exercise 9 - ES6 Features in React (map, arrow functions, destructuring)

## Scenario
Create a cricket app using ES6 features: map(), arrow functions, destructuring, and spread operator.

---

## Setup

```bash
npx create-react-app cricketapp
cd cricketapp
```

---

## ListofPlayers.js (map + arrow functions)
`src/ListofPlayers.js`

```jsx
import React from 'react';

function ListofPlayers() {
  // Declare array with 11 players using map feature of ES6
  const players = [
    { id: 1, name: 'Rohit Sharma', score: 85 },
    { id: 2, name: 'Shubman Gill', score: 62 },
    { id: 3, name: 'Virat Kohli', score: 95 },
    { id: 4, name: 'Suryakumar Yadav', score: 55 },
    { id: 5, name: 'KL Rahul', score: 78 },
    { id: 6, name: 'Hardik Pandya', score: 43 },
    { id: 7, name: 'Ravindra Jadeja', score: 30 },
    { id: 8, name: 'Jasprit Bumrah', score: 12 },
    { id: 9, name: 'Mohammed Shami', score: 8 },
    { id: 10, name: 'Kuldeep Yadav', score: 65 },
    { id: 11, name: 'Mohammed Siraj', score: 5 },
  ];

  // Filter players with scores below 70 using arrow function
  const lowScorers = players.filter(player => player.score < 70);

  // Map all players to JSX
  const allPlayerItems = players.map(player => (
    <li key={player.id} style={{
      padding: '8px',
      margin: '4px 0',
      backgroundColor: player.score >= 70 ? '#e8f5e9' : '#ffebee',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <span>{player.name}</span>
      <strong style={{ color: player.score >= 70 ? '#2e7d32' : '#c62828' }}>
        {player.score} runs
      </strong>
    </li>
  ));

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏏 All Players</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allPlayerItems}
      </ul>

      <h3 style={{ marginTop: '20px', color: '#c62828' }}>
        Players Below 70 Runs ({lowScorers.length})
      </h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {lowScorers.map(p => (
          <li key={p.id} style={{ padding: '6px', color: '#b71c1c' }}>
            ⚠️ {p.name} — {p.score} runs
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListofPlayers;
```

---

## IndianPlayers.js (Destructuring + Spread)
`src/IndianPlayers.js`

```jsx
import React from 'react';

function IndianPlayers() {
  const allPlayers = [
    'Rohit Sharma', 'Shubman Gill', 'Virat Kohli',
    'Suryakumar Yadav', 'KL Rahul', 'Hardik Pandya',
    'Ravindra Jadeja', 'Jasprit Bumrah', 'Mohammed Shami',
    'Kuldeep Yadav', 'Mohammed Siraj'
  ];

  // Destructuring: Extract odd and even players
  const [first, second, third, ...rest] = allPlayers;

  const oddPlayers = allPlayers.filter((_, index) => index % 2 === 0);
  const evenPlayers = allPlayers.filter((_, index) => index % 2 !== 0);

  // Spread operator: merge two arrays
  const T20Players = ['Suryakumar Yadav', 'KL Rahul', 'Hardik Pandya'];
  const RanjiTrophyPlayers = ['Sarfaraz Khan', 'Abhimanyu Easwaran', 'Priyank Panchal'];
  const mergedPlayers = [...T20Players, ...RanjiTrophyPlayers]; // Merge using spread

  const sectionStyle = {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px',
    margin: '12px 0'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🇮🇳 Indian Players</h2>

      {/* Destructuring result */}
      <div style={sectionStyle}>
        <h3>Top 3 (Destructured)</h3>
        <p>1st: {first} | 2nd: {second} | 3rd: {third}</p>
        <p>Rest ({rest.length} players): {rest.join(', ')}</p>
      </div>

      {/* Odd/Even split */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ ...sectionStyle, flex: 1 }}>
          <h3>Odd Team Players</h3>
          <ol>
            {oddPlayers.map((p, i) => <li key={i}>{p}</li>)}
          </ol>
        </div>
        <div style={{ ...sectionStyle, flex: 1 }}>
          <h3>Even Team Players</h3>
          <ol>
            {evenPlayers.map((p, i) => <li key={i}>{p}</li>)}
          </ol>
        </div>
      </div>

      {/* Merged arrays using spread */}
      <div style={sectionStyle}>
        <h3>Merged Team (T20 + Ranji Trophy)</h3>
        <p style={{ color: '#1976d2' }}>T20: {T20Players.join(', ')}</p>
        <p style={{ color: '#7b1fa2' }}>Ranji: {RanjiTrophyPlayers.join(', ')}</p>
        <p style={{ color: '#e91e63', fontWeight: 'bold' }}>
          Combined ({mergedPlayers.length}): {mergedPlayers.join(', ')}
        </p>
      </div>
    </div>
  );
}

export default IndianPlayers;
```

---

## App.js (Conditional rendering with flag)

```jsx
import React, { useState } from 'react';
import ListofPlayers from './ListofPlayers';
import IndianPlayers from './IndianPlayers';

function App() {
  const [flag, setFlag] = useState(true);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>🏏 Cricket App — ES6 Features</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFlag(true)}
          style={{
            marginRight: '10px', padding: '8px 20px',
            backgroundColor: flag ? '#1976d2' : '#eee',
            color: flag ? 'white' : '#333',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          List of Players (Flag = true)
        </button>
        <button
          onClick={() => setFlag(false)}
          style={{
            padding: '8px 20px',
            backgroundColor: !flag ? '#7b1fa2' : '#eee',
            color: !flag ? 'white' : '#333',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Indian Players (Flag = false)
        </button>
      </div>

      {/* Conditional rendering using flag variable */}
      {flag ? <ListofPlayers /> : <IndianPlayers />}
    </div>
  );
}

export default App;
```

---

## ES6 Features Demonstrated

| Feature | Example Used |
|---------|-------------|
| `map()` | Render list of players |
| `filter()` | Find low scorers |
| Arrow functions | `players.filter(p => p.score < 70)` |
| Destructuring | `const [first, second, ...rest] = array` |
| Spread operator | `[...T20Players, ...RanjiPlayers]` |
| Template literals | `` `${name} — ${score} runs` `` |
| `const`/`let` | Preferred over `var` |
