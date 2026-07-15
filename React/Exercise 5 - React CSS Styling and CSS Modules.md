# Exercise 5 - React CSS Styling and CSS Modules

## Scenario
Style a cohort dashboard using CSS Modules to create scoped, component-level styling.

---

## Setup

```bash
npx create-react-app cohortdashboard
cd cohortdashboard
```

---

## CohortDetails.module.css
`src/CohortDetails.module.css`

```css
/* Scoped styles for CohortDetails component */

.box {
  width: 300px;
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 10px;
  vertical-align: top;
  background-color: #fff;
  transition: box-shadow 0.2s ease;
}

.box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Tag selector for <dt> elements */
dt {
  font-weight: 500;
  color: #444;
  margin-top: 8px;
}

dd {
  color: #333;
  margin-left: 0;
  margin-bottom: 4px;
}

.ongoing {
  color: green;
  font-weight: bold;
}

.completed {
  color: blue;
  font-weight: bold;
}

.statusBadge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.badgeOngoing {
  background-color: #d4edda;
  color: #155724;
}

.badgeCompleted {
  background-color: #cce5ff;
  color: #004085;
}
```

---

## CohortDetails.js (using CSS Modules)
`src/CohortDetails.js`

```jsx
import React from 'react';
import styles from './CohortDetails.module.css';

function CohortDetails({ cohort }) {
  // Dynamically choose color class based on status
  const titleClass = cohort.status === 'ongoing' ? styles.ongoing : styles.completed;
  const badgeClass = cohort.status === 'ongoing' ? styles.badgeOngoing : styles.badgeCompleted;

  return (
    <div className={styles.box}>
      {/* h3 color changes based on status */}
      <h3 className={titleClass}>{cohort.code}</h3>

      <span className={`${styles.statusBadge} ${badgeClass}`}>
        {cohort.status.toUpperCase()}
      </span>

      <dl>
        <dt>Cohort Name</dt>
        <dd>{cohort.name}</dd>

        <dt>Trainer</dt>
        <dd>{cohort.trainer}</dd>

        <dt>Start Date</dt>
        <dd>{cohort.startDate}</dd>

        <dt>End Date</dt>
        <dd>{cohort.endDate}</dd>
      </dl>
    </div>
  );
}

export default CohortDetails;
```

---

## App.css (Global Styles)
`src/App.css`

```css
/* Global reset and typography */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
}

.dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
```

---

## App.js

```jsx
import React, { useState } from 'react';
import CohortDetails from './CohortDetails';
import './App.css';

const COHORTS = [
  { id: 1, code: 'DNC-2024-01', name: 'Digital Nurture Cohort 1', status: 'ongoing',
    startDate: '2024-01-15', endDate: '2024-07-15', trainer: 'Alice Johnson' },
  { id: 2, code: 'DNC-2023-04', name: 'Digital Nurture Cohort 4', status: 'completed',
    startDate: '2023-07-01', endDate: '2023-12-31', trainer: 'Bob Williams' },
  { id: 3, code: 'DNC-2024-02', name: 'Digital Nurture Cohort 2', status: 'ongoing',
    startDate: '2024-03-01', endDate: '2024-09-01', trainer: 'Carol Smith' },
  { id: 4, code: 'DNC-2023-02', name: 'Digital Nurture Cohort 3', status: 'completed',
    startDate: '2023-03-15', endDate: '2023-09-15', trainer: 'David Brown' },
];

function App() {
  const [filter, setFilter] = useState('all');

  const filtered = COHORTS.filter(c => filter === 'all' || c.status === filter);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Academy — Cohort Dashboard</h1>
        <p>Track ongoing and completed learning cohorts</p>
      </header>

      <div style={{ marginBottom: '20px' }}>
        {['all', 'ongoing', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              margin: '5px',
              padding: '8px 20px',
              backgroundColor: filter === f ? '#667eea' : '#eee',
              color: filter === f ? 'white' : '#333',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="dashboard">
        {filtered.map(cohort => (
          <CohortDetails key={cohort.id} cohort={cohort} />
        ))}
      </div>
    </div>
  );
}

export default App;
```

---

## CSS Modules Benefits

| Feature | CSS Modules | Regular CSS |
|---------|-------------|-------------|
| **Scoping** | Automatically scoped to component | Global — can clash |
| **Naming** | Any class name (no BEM needed) | Needs unique naming convention |
| **Import** | `import styles from './X.module.css'` | `import './X.css'` |
| **Usage** | `className={styles.myClass}` | `className="myClass"` |
