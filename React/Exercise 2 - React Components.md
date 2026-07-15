# Exercise 2 - React Components

## Scenario
Create a React application with functional and class components, demonstrating component hierarchy and reuse.

---

## Setup

```bash
npx create-react-app componentsapp
cd componentsapp
```

---

## Header.js (Functional Component)
`src/components/Header.js`

```jsx
import React from 'react';

function Header({ title, subtitle }) {
  return (
    <header style={{ backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
      <h1>{title}</h1>
      {subtitle && <h3>{subtitle}</h3>}
    </header>
  );
}

export default Header;
```

---

## Footer.js (Functional Component)
`src/components/Footer.js`

```jsx
import React from 'react';

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '10px', background: '#f1f1f1' }}>
      <p>&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
```

---

## Card.js (Reusable Card Component)
`src/components/Card.js`

```jsx
import React from 'react';

function Card({ title, content, imageUrl, tag }) {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    maxWidth: '300px',
    display: 'inline-block',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
  };

  const tagStyle = {
    backgroundColor: '#61dafb',
    color: '#000',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  };

  return (
    <div style={cardStyle}>
      {imageUrl && <img src={imageUrl} alt={title} style={{ width: '100%', borderRadius: '4px' }} />}
      <span style={tagStyle}>{tag}</span>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

export default Card;
```

---

## CourseList.js (Class Component demonstrating lifecycle-aware rendering)
`src/components/CourseList.js`

```jsx
import React, { Component } from 'react';
import Card from './Card';

class CourseList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: [
        { id: 1, title: 'React Fundamentals', content: 'Learn React from scratch', tag: 'Frontend' },
        { id: 2, title: 'Spring Boot', content: 'Build REST APIs with Spring Boot', tag: 'Backend' },
        { id: 3, title: 'Microservices', content: 'Design distributed systems', tag: 'Architecture' },
        { id: 4, title: 'JUnit & Mockito', content: 'Test-driven development in Java', tag: 'Testing' },
      ]
    };
  }

  render() {
    const { courses } = this.state;
    return (
      <section>
        <h2>Available Courses</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {courses.map(course => (
            <Card
              key={course.id}
              title={course.title}
              content={course.content}
              tag={course.tag}
            />
          ))}
        </div>
      </section>
    );
  }
}

export default CourseList;
```

---

## App.js (Component Hierarchy)

```jsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CourseList from './components/CourseList';

function App() {
  return (
    <div>
      {/* Top-level Header */}
      <Header
        title="Learning Management System"
        subtitle="Your gateway to technical excellence"
      />

      <main style={{ minHeight: '70vh', padding: '20px' }}>
        {/* CourseList renders multiple Card components */}
        <CourseList />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
```

---

## Component Hierarchy Diagram

```
App
├── Header (title, subtitle)
├── main
│   └── CourseList
│       ├── Card (course 1)
│       ├── Card (course 2)
│       ├── Card (course 3)
│       └── Card (course 4)
└── Footer
```
