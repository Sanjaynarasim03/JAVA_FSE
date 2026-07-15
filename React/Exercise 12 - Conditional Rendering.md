# Exercise 12 - Conditional Rendering

## Scenario
Create a "ticketbookingapp" where guest users see flight details and logged-in users can book tickets.

---

## Setup

```bash
npx create-react-app ticketbookingapp
cd ticketbookingapp
```

---

## GuestPage.js
`src/GuestPage.js`

```jsx
import React from 'react';

const FLIGHTS = [
  { id: 1, flight: 'AI-201', from: 'Mumbai', to: 'Delhi', time: '06:00', price: 4500, seats: 42 },
  { id: 2, flight: '6E-345', from: 'Bangalore', to: 'Hyderabad', time: '09:30', price: 2800, seats: 18 },
  { id: 3, flight: 'SG-789', from: 'Chennai', to: 'Kolkata', time: '14:00', price: 5200, seats: 7 },
];

function GuestPage({ onLogin }) {
  return (
    <div style={{ padding: '30px' }}>
      <div style={{
        backgroundColor: '#fff3e0', border: '1px solid #ffcc02',
        padding: '12px 20px', borderRadius: '8px', marginBottom: '20px'
      }}>
        <strong>ℹ️ Guest Mode:</strong> You are browsing as a guest.
        <a href="#" onClick={onLogin} style={{ marginLeft: '10px', color: '#1976d2' }}>
          Login to book tickets
        </a>
      </div>

      <h2>✈️ Available Flights</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Browse our available flights. Login to book your seat.
      </p>

      {FLIGHTS.map(flight => (
        <div key={flight.id} style={{
          border: '1px solid #ddd', borderRadius: '10px', padding: '16px',
          margin: '10px 0', backgroundColor: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <strong style={{ fontSize: '18px', color: '#333' }}>{flight.flight}</strong>
            <p style={{ color: '#666', margin: '4px 0' }}>
              {flight.from} → {flight.to} at {flight.time}
            </p>
            <span style={{
              backgroundColor: flight.seats < 10 ? '#ffebee' : '#e8f5e9',
              color: flight.seats < 10 ? '#c62828' : '#2e7d32',
              padding: '2px 8px', borderRadius: '12px', fontSize: '12px'
            }}>
              {flight.seats} seats left
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1976d2' }}>₹{flight.price}</p>
            <button
              disabled
              style={{
                padding: '8px 20px', backgroundColor: '#ccc', color: '#888',
                border: 'none', borderRadius: '6px', cursor: 'not-allowed'
              }}
            >
              🔒 Login to Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GuestPage;
```

---

## UserPage.js
`src/UserPage.js`

```jsx
import React, { useState } from 'react';

const FLIGHTS = [
  { id: 1, flight: 'AI-201', from: 'Mumbai', to: 'Delhi', time: '06:00', price: 4500, seats: 42 },
  { id: 2, flight: '6E-345', from: 'Bangalore', to: 'Hyderabad', time: '09:30', price: 2800, seats: 18 },
  { id: 3, flight: 'SG-789', from: 'Chennai', to: 'Kolkata', time: '14:00', price: 5200, seats: 7 },
];

function UserPage({ username, onLogout }) {
  const [bookedFlight, setBookedFlight] = useState(null);

  const handleBook = (flight) => {
    setBookedFlight(flight);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{
        backgroundColor: '#e8f5e9', border: '1px solid #81c784',
        padding: '12px 20px', borderRadius: '8px', marginBottom: '20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span>✅ Welcome, <strong>{username}</strong>! You can now book tickets.</span>
        <button
          onClick={onLogout}
          style={{
            padding: '6px 16px', backgroundColor: '#e53935', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Booking confirmation — conditional rendering */}
      {bookedFlight && (
        <div style={{
          backgroundColor: '#e3f2fd', border: '2px solid #1976d2',
          padding: '20px', borderRadius: '10px', marginBottom: '20px'
        }}>
          <h3>🎉 Ticket Booked Successfully!</h3>
          <p><strong>Flight:</strong> {bookedFlight.flight}</p>
          <p><strong>Route:</strong> {bookedFlight.from} → {bookedFlight.to}</p>
          <p><strong>Time:</strong> {bookedFlight.time}</p>
          <p><strong>Amount Paid:</strong> ₹{bookedFlight.price}</p>
        </div>
      )}

      <h2>✈️ Available Flights</h2>

      {FLIGHTS.map(flight => (
        <div key={flight.id} style={{
          border: '1px solid #ddd', borderRadius: '10px', padding: '16px',
          margin: '10px 0', backgroundColor: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <strong style={{ fontSize: '18px', color: '#333' }}>{flight.flight}</strong>
            <p style={{ color: '#666', margin: '4px 0' }}>
              {flight.from} → {flight.to} at {flight.time}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1976d2' }}>₹{flight.price}</p>
            <button
              onClick={() => handleBook(flight)}
              style={{
                padding: '8px 20px', backgroundColor: '#1976d2', color: 'white',
                border: 'none', borderRadius: '6px', cursor: 'pointer'
              }}
            >
              Book Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPage;
```

---

## App.js (Conditional Rendering with Login/Logout)

```jsx
import React, { Component } from 'react';
import GuestPage from './GuestPage';
import UserPage from './UserPage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: 'John Doe'
    };
  }

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  }

  handleLogout = () => {
    this.setState({ isLoggedIn: false });
  }

  render() {
    const { isLoggedIn, username } = this.state;

    return (
      <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
        {/* Navigation */}
        <nav style={{
          backgroundColor: '#1976d2', color: 'white',
          padding: '15px 30px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>✈️ FlightBooker</h2>
          <span>{isLoggedIn ? `Logged in as ${username}` : 'Guest Mode'}</span>
        </nav>

        {/*
          Conditional Rendering:
          If isLoggedIn → show UserPage
          If not isLoggedIn → show GuestPage
          Uses: if/else via ternary operator
        */}
        {isLoggedIn
          ? <UserPage username={username} onLogout={this.handleLogout} />
          : <GuestPage onLogin={this.handleLogin} />
        }
      </div>
    );
  }
}

export default App;
```

---

## Conditional Rendering Patterns

```jsx
// 1. Ternary
{isLoggedIn ? <UserPage /> : <GuestPage />}

// 2. Short-circuit (&&)
{bookedFlight && <BookingConfirmation flight={bookedFlight} />}

// 3. if/else in render
if (isLoggedIn) {
  return <UserPage />;
}
return <GuestPage />;

// 4. Element variable
let page = isLoggedIn ? <UserPage /> : <GuestPage />;
return <div>{page}</div>;
```
