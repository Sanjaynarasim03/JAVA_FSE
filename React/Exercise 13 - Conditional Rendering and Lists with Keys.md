# Exercise 13 - Conditional Rendering and Lists with Keys

## Scenario
Create a "bloggerapp" with 3 components (BookDetails, BlogDetails, CourseDetails) demonstrating multiple conditional rendering techniques.

---

## Setup

```bash
npx create-react-app bloggerapp
cd bloggerapp
```

---

## BlogDetails.js (map with keys + && operator)
`src/BlogDetails.js`

```jsx
import React, { useState } from 'react';

const BLOGS = [
  { id: 1, title: 'Getting Started with React', author: 'Alice', tags: ['React', 'Frontend'] },
  { id: 2, title: 'Spring Boot REST APIs', author: 'Bob', tags: ['Spring', 'Java'] },
  { id: 3, title: 'Microservices with Eureka', author: 'Carol', tags: ['Microservices'] },
];

function BlogDetails() {
  const [search, setSearch] = useState('');

  const filtered = BLOGS.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', margin: '10px 0' }}>
      <h2>📝 Blog Details</h2>
      <input
        type="text" placeholder="Search blogs..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '8px', marginBottom: '12px', width: '220px', border: '1px solid #ddd', borderRadius: '4px' }}
      />

      {/* Short-circuit && conditional */}
      {filtered.length === 0 && <p style={{ color: '#999' }}>No blogs found.</p>}

      {filtered.map(blog => (
        <div key={blog.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
          <strong>{blog.title}</strong>
          <span style={{ color: '#666', marginLeft: '10px' }}>by {blog.author}</span>
          <div style={{ marginTop: '4px' }}>
            {blog.tags.map(tag => (
              <span key={tag} style={{
                backgroundColor: '#e3f2fd', color: '#1565c0',
                padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '4px'
              }}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default BlogDetails;
```

---

## BookDetails.js (if/else in render method)
`src/BookDetails.js`

```jsx
import React, { Component } from 'react';

const BOOKS = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', genre: 'Technology' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Dave Thomas', genre: 'Technology' },
];

class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedGenre: 'all' };
  }

  render() {
    const { selectedGenre } = this.state;

    // if/else based conditional rendering
    let filteredBooks;
    if (selectedGenre === 'all') {
      filteredBooks = BOOKS;
    } else {
      filteredBooks = BOOKS.filter(b => b.genre === selectedGenre);
    }

    return (
      <section style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', margin: '10px 0' }}>
        <h2>📚 Book Details</h2>
        <div style={{ marginBottom: '12px' }}>
          {['all', 'Technology', 'Self-help'].map(genre => (
            <button
              key={genre}
              onClick={() => this.setState({ selectedGenre: genre })}
              style={{
                margin: '3px', padding: '5px 14px',
                backgroundColor: selectedGenre === genre ? '#1976d2' : '#eee',
                color: selectedGenre === genre ? 'white' : '#333',
                border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              {genre === 'all' ? 'All' : genre}
            </button>
          ))}
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredBooks.map(book => (
            <li key={book.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{book.title}</strong> — {book.author}
              <span style={{ float: 'right', color: '#888', fontSize: '13px' }}>{book.genre}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default BookDetails;
```

---

## CourseDetails.js (ternary + element variable)
`src/CourseDetails.js`

```jsx
import React, { useState } from 'react';

const COURSES = [
  { id: 1, title: 'React Full Stack', level: 'Advanced', enrolled: true },
  { id: 2, title: 'Spring Boot Mastery', level: 'Intermediate', enrolled: false },
  { id: 3, title: 'Microservices', level: 'Advanced', enrolled: true },
];

function CourseDetails() {
  const [showEnrolled, setShowEnrolled] = useState(false);

  const displayed = showEnrolled ? COURSES.filter(c => c.enrolled) : COURSES;

  // Element variable
  const enrolledBadge = (
    <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginLeft: '8px' }}>
      Enrolled
    </span>
  );

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', margin: '10px 0' }}>
      <h2>🎓 Course Details</h2>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <input type="checkbox" checked={showEnrolled} onChange={e => setShowEnrolled(e.target.checked)} />
        Show enrolled only
      </label>
      {displayed.map(course => (
        <div key={course.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <span><strong>{course.title}</strong> — {course.level}</span>
          {/* Ternary + element variable */}
          {course.enrolled ? enrolledBadge : null}
        </div>
      ))}
    </section>
  );
}

export default CourseDetails;
```

---

## App.js (Tab navigation — renders all 3 components)

```jsx
import React, { useState } from 'react';
import BookDetails from './BookDetails';
import BlogDetails from './BlogDetails';
import CourseDetails from './CourseDetails';

function App() {
  const [tab, setTab] = useState('all');

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1>Blogger App — Conditional Rendering</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'books', 'blogs', 'courses'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 16px', backgroundColor: tab === t ? '#333' : '#eee',
                     color: tab === t ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {(tab === 'all' || tab === 'books') && <BookDetails />}
      {(tab === 'all' || tab === 'blogs') && <BlogDetails />}
      {(tab === 'all' || tab === 'courses') && <CourseDetails />}
    </div>
  );
}

export default App;
```
