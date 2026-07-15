# Exercise 6 - React Router

## Scenario
Create a TrainersApp SPA with React Router for navigation between Home, Trainers List, and Trainer Detail pages.

---

## Setup

```bash
npx create-react-app TrainersApp
cd TrainersApp
npm install react-router-dom
```

---

## Trainer.js (Data Model)
`src/Trainer.js`

```js
class Trainer {
  constructor(trainerId, name, email, phone, technology, skills) {
    this.trainerId = trainerId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.technology = technology;
    this.skills = skills;
  }
}

export default Trainer;
```

---

## TrainersMock.js (Mock Data)
`src/TrainersMock.js`

```js
import Trainer from './Trainer';

const TrainersMock = [
  new Trainer('T001', 'Alice Johnson', 'alice@training.com', '9876543210', 'Java', ['Spring Boot', 'Microservices', 'JUnit']),
  new Trainer('T002', 'Bob Williams', 'bob@training.com', '9876543211', 'React', ['React', 'Redux', 'JavaScript', 'TypeScript']),
  new Trainer('T003', 'Carol Smith', 'carol@training.com', '9876543212', 'Python', ['Django', 'Flask', 'Machine Learning']),
  new Trainer('T004', 'David Brown', 'david@training.com', '9876543213', 'DevOps', ['Docker', 'Kubernetes', 'CI/CD', 'AWS']),
  new Trainer('T005', 'Eva Martinez', 'eva@training.com', '9876543214', 'Data Science', ['Python', 'TensorFlow', 'SQL']),
];

export default TrainersMock;
```

---

## Home.js
`src/Home.js`

```jsx
import React from 'react';

function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Cognizant Academy Trainers Portal</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
        This portal helps you find trainers and their areas of expertise.
      </p>
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', minWidth: '150px' }}>
          <h3>5</h3>
          <p>Active Trainers</p>
        </div>
        <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', minWidth: '150px' }}>
          <h3>12</h3>
          <p>Technologies</p>
        </div>
        <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px', minWidth: '150px' }}>
          <h3>48</h3>
          <p>Cohorts Delivered</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
```

---

## TrainersList.js
`src/TrainersList.js`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import TrainersMock from './TrainersMock';

function TrainersList() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>All Trainers</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {TrainersMock.map(trainer => (
          <li key={trainer.trainerId} style={{
            padding: '12px',
            margin: '8px 0',
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              {/* Link to trainer detail page with ID parameter */}
              <Link to={`/trainers/${trainer.trainerId}`}
                    style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold', fontSize: '18px' }}>
                {trainer.name}
              </Link>
              <p style={{ color: '#666', margin: '4px 0 0' }}>
                {trainer.technology} — {trainer.skills.slice(0, 3).join(', ')}
              </p>
            </div>
            <span style={{
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px'
            }}>
              {trainer.technology}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainersList;
```

---

## TrainerDetail.js
`src/TrainerDetail.js`

```jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import TrainersMock from './TrainersMock';

function TrainerDetail() {
  // Extract 'id' from URL parameter
  const { id } = useParams();

  // Find trainer by ID
  const trainer = TrainersMock.find(t => t.trainerId === id);

  if (!trainer) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Trainer not found</h2>
        <Link to="/trainers">← Back to Trainers List</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/trainers" style={{ color: '#1976d2' }}>← Back to Trainers</Link>

      <h2 style={{ marginTop: '20px' }}>{trainer.name}</h2>

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        {[
          ['ID', trainer.trainerId],
          ['Email', trainer.email],
          ['Phone', trainer.phone],
          ['Technology', trainer.technology],
        ].map(([label, value]) => (
          <tr key={label} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px', fontWeight: 'bold', color: '#666', width: '140px' }}>{label}</td>
            <td style={{ padding: '10px' }}>{value}</td>
          </tr>
        ))}
      </table>

      <div style={{ marginTop: '20px' }}>
        <h3>Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {trainer.skills.map(skill => (
            <span key={skill} style={{
              backgroundColor: '#e8f5e9', color: '#2e7d32',
              padding: '4px 12px', borderRadius: '16px', fontSize: '14px'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrainerDetail;
```

---

## App.js (with React Router)

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './Home';
import TrainersList from './TrainersList';
import TrainerDetail from './TrainerDetail';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ backgroundColor: '#1976d2', padding: '12px 24px', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Trainers Portal
        </Link>
        <NavLink to="/" end style={({ isActive }) => ({
          color: isActive ? '#ffeb3b' : 'white', textDecoration: 'none'
        })}>
          Home
        </NavLink>
        <NavLink to="/trainers" style={({ isActive }) => ({
          color: isActive ? '#ffeb3b' : 'white', textDecoration: 'none'
        })}>
          Trainers
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainers" element={<TrainersList />} />
        <Route path="/trainers/:id" element={<TrainerDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
