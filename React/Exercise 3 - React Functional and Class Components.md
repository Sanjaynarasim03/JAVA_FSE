# Exercise 3 - React Functional and Class Components

## Scenario
Cognizant Academy team wants a cohort dashboard using both functional and class components.

---

## Setup

```bash
npx create-react-app cohortapp
cd cohortapp
```

---

## Cohort.js (Data Model)
`src/Cohort.js`

```js
// Cohort data class
class Cohort {
  constructor(id, code, name, status, startDate, endDate, trainer) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.status = status;      // 'ongoing' or 'completed'
    this.startDate = startDate;
    this.endDate = endDate;
    this.trainer = trainer;
  }
}

export default Cohort;
```

---

## CohortData.js (Mock Data)
`src/CohortData.js`

```js
import Cohort from './Cohort';

const CohortData = [
  new Cohort(1, 'DNC-2024-01', 'Digital Nurture Cohort 1', 'ongoing',
             '2024-01-15', '2024-07-15', 'Alice Johnson'),
  new Cohort(2, 'DNC-2023-04', 'Digital Nurture Cohort 4', 'completed',
             '2023-07-01', '2023-12-31', 'Bob Williams'),
  new Cohort(3, 'DNC-2024-02', 'Digital Nurture Cohort 2', 'ongoing',
             '2024-03-01', '2024-09-01', 'Carol Smith'),
  new Cohort(4, 'DNC-2023-02', 'Digital Nurture Cohort 3', 'completed',
             '2023-03-15', '2023-09-15', 'David Brown'),
];

export default CohortData;
```

---

## CohortDetails.js (Functional Component)
`src/CohortDetails.js`

```jsx
import React from 'react';

// Functional component using destructured props
function CohortDetails({ cohort }) {
  const titleColor = cohort.status === 'ongoing' ? 'green' : 'blue';

  const containerStyle = {
    width: '300px',
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    border: '1px solid black',
    borderRadius: '10px',
    verticalAlign: 'top'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ color: titleColor }}>{cohort.code}</h3>
      <dl>
        <dt style={{ fontWeight: 500 }}>Name</dt>
        <dd>{cohort.name}</dd>
        <dt style={{ fontWeight: 500 }}>Status</dt>
        <dd>{cohort.status.toUpperCase()}</dd>
        <dt style={{ fontWeight: 500 }}>Start Date</dt>
        <dd>{cohort.startDate}</dd>
        <dt style={{ fontWeight: 500 }}>End Date</dt>
        <dd>{cohort.endDate}</dd>
        <dt style={{ fontWeight: 500 }}>Trainer</dt>
        <dd>{cohort.trainer}</dd>
      </dl>
    </div>
  );
}

export default CohortDetails;
```

---

## CohortDashboard.js (Class Component)
`src/CohortDashboard.js`

```jsx
import React, { Component } from 'react';
import CohortDetails from './CohortDetails';
import CohortData from './CohortData';

class CohortDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cohorts: CohortData,
      filter: 'all'
    };
  }

  getFilteredCohorts() {
    const { cohorts, filter } = this.state;
    if (filter === 'all') return cohorts;
    return cohorts.filter(c => c.status === filter);
  }

  render() {
    const { filter } = this.state;
    const filtered = this.getFilteredCohorts();

    return (
      <div style={{ padding: '20px' }}>
        <h1>My Academy - Cohort Dashboard</h1>

        {/* Filter buttons */}
        <div style={{ marginBottom: '20px' }}>
          {['all', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => this.setState({ filter: f })}
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
        </div>

        {/* Render cohort cards */}
        <div>
          {filtered.map(cohort => (
            <CohortDetails key={cohort.id} cohort={cohort} />
          ))}
        </div>

        <p style={{ color: '#666' }}>
          Showing {filtered.length} of {this.state.cohorts.length} cohorts
        </p>
      </div>
    );
  }
}

export default CohortDashboard;
```

---

## App.js

```jsx
import React from 'react';
import CohortDashboard from './CohortDashboard';

function App() {
  return <CohortDashboard />;
}

export default App;
```
