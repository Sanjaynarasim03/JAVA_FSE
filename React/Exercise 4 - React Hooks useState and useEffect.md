# Exercise 4 - React Hooks (useState, useEffect)

## Scenario
Build a cohort management app using React Hooks instead of class components.

---

## Setup

```bash
npx create-react-app hooksapp
cd hooksapp
npm install axios
```

---

## useCohorts.js (Custom Hook)
`src/hooks/useCohorts.js`

```jsx
import { useState, useEffect } from 'react';

// Custom hook that manages cohort state
function useCohorts(initialCohorts) {
  const [cohorts, setCohorts] = useState(initialCohorts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulates fetching from an API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // In real app: fetch from API
      setCohorts(initialCohorts);
      setLoading(false);
    }, 500);
  }, []); // Empty deps = runs once on mount

  const addCohort = (newCohort) => {
    setCohorts(prev => [...prev, { ...newCohort, id: Date.now() }]);
  };

  const deleteCohort = (id) => {
    setCohorts(prev => prev.filter(c => c.id !== id));
  };

  return { cohorts, loading, error, addCohort, deleteCohort };
}

export default useCohorts;
```

---

## CohortList.js (Using Hooks)
`src/CohortList.js`

```jsx
import React, { useState, useEffect } from 'react';

const MOCK_COHORTS = [
  { id: 1, code: 'DNC-2024-01', name: 'Digital Nurture 1', status: 'ongoing', trainer: 'Alice' },
  { id: 2, code: 'DNC-2023-04', name: 'Digital Nurture 4', status: 'completed', trainer: 'Bob' },
  { id: 3, code: 'DNC-2024-02', name: 'Digital Nurture 2', status: 'ongoing', trainer: 'Carol' },
];

function CohortList() {
  // useState: manages cohort array
  const [cohorts, setCohorts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // useEffect: runs when component mounts (simulates API call)
  useEffect(() => {
    console.log('Component mounted — loading cohorts');
    // Simulate API delay
    setTimeout(() => setCohorts(MOCK_COHORTS), 300);

    // Cleanup function (runs on unmount)
    return () => console.log('Component unmounted');
  }, []); // [] = runs only once

  // useEffect: runs whenever filter changes
  useEffect(() => {
    console.log('Filter changed to:', filter);
  }, [filter]);

  const filteredCohorts = cohorts
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const deleteCohort = (id) => {
    setCohorts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cohort Dashboard (Hooks)</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search cohorts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '8px', marginRight: '10px', width: '200px' }}
      />

      {/* Filter buttons */}
      {['all', 'ongoing', 'completed'].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: filter === f ? '#61dafb' : '#eee',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}

      {/* Cohort list */}
      <div style={{ marginTop: '20px' }}>
        {filteredCohorts.length === 0 ? (
          <p>No cohorts found.</p>
        ) : (
          filteredCohorts.map(cohort => (
            <div
              key={cohort.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                margin: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ color: cohort.status === 'ongoing' ? 'green' : 'blue' }}>
                  {cohort.code}
                </strong>
                <span> — {cohort.name}</span>
                <small style={{ marginLeft: '10px', color: '#666' }}>
                  Trainer: {cohort.trainer}
                </small>
              </div>
              <button
                onClick={() => deleteCohort(cohort.id)}
                style={{ background: '#ff4444', color: 'white', border: 'none',
                         borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <p>{filteredCohorts.length} cohort(s) displayed</p>
    </div>
  );
}

export default CohortList;
```

---

## App.js

```jsx
import React from 'react';
import CohortList from './CohortList';

function App() {
  return <CohortList />;
}

export default App;
```

---

## React Hooks Reference

| Hook | Purpose | Example |
|------|---------|---------|
| `useState` | Local state management | `const [count, setCount] = useState(0)` |
| `useEffect` | Side effects (API, timers) | `useEffect(() => {...}, [deps])` |
| `useContext` | Consume context | `const theme = useContext(ThemeContext)` |
| `useRef` | Mutable ref / DOM access | `const ref = useRef(null)` |
| `useCallback` | Memoize functions | `const fn = useCallback(() => {...}, [deps])` |
| `useMemo` | Memoize values | `const val = useMemo(() => compute(), [deps])` |
