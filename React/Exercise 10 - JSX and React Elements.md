# Exercise 10 - JSX and React Elements

## Scenario
Create an "officespacerentalapp" using JSX elements, attributes, and inline CSS with conditional styling.

---

## Setup

```bash
npx create-react-app officespacerentalapp
cd officespacerentalapp
```

---

## App.js
`src/App.js`

```jsx
import React from 'react';
import officeImg from './assets/office.jpg'; // Add an office image to src/assets/

// Office data object
const office = {
  name: 'Prestige Tech Park - Block A',
  rent: 85000,
  address: 'Outer Ring Road, Marathahalli, Bangalore - 560103',
  area: '2500 sq ft',
  floors: '12th Floor'
};

// List of office spaces
const officeList = [
  { id: 1, name: 'DLF Cyber City', rent: 120000, address: 'Gurgaon, Haryana', area: '3000 sq ft' },
  { id: 2, name: 'Infosys Campus - Pune', rent: 45000, address: 'Hinjewadi, Pune', area: '1200 sq ft' },
  { id: 3, name: 'RMZ Infinity', rent: 95000, address: 'Old Madras Road, Bangalore', area: '2800 sq ft' },
  { id: 4, name: 'WTC Chennai', rent: 55000, address: 'Mount Road, Chennai', area: '1500 sq ft' },
  { id: 5, name: 'Bagmane Tech Park', rent: 75000, address: 'CV Raman Nagar, Bangalore', area: '2200 sq ft' },
];

function App() {
  // Inline style: rent color based on value
  const getRentStyle = (rent) => ({
    color: rent < 60000 ? 'red' : 'green',
    fontWeight: 'bold',
    fontSize: '18px'
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      {/* Heading element */}
      <h1 style={{ textAlign: 'center', color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>
        🏢 Office Space Rental Portal
      </h1>

      {/* Image attribute */}
      {/* Uncomment if you have an image:
      <img
        src={officeImg}
        alt="Office Space"
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', margin: '20px 0' }}
      />
      */}

      {/* Use a placeholder image */}
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
        alt="Office Space"
        style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px', margin: '20px 0' }}
      />

      {/* Featured office object */}
      <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2>Featured Office Space</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Name', office.name],
              ['Address', office.address],
              ['Area', office.area],
              ['Floor', office.floors],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold', color: '#555', width: '120px' }}>{label}</td>
                <td style={{ padding: '8px' }}>{value}</td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', color: '#555' }}>Monthly Rent</td>
              <td style={{ padding: '8px' }}>
                {/* Inline CSS: rent color using conditional JSX expression */}
                <span style={getRentStyle(office.rent)}>₹{office.rent.toLocaleString()}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Loop through office list */}
      <h2>Available Office Spaces</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {officeList.map(space => (
          <div key={space.id} style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '16px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '8px' }}>{space.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>📍 {space.address}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>📐 {space.area}</p>

            {/* Conditional inline CSS: Red if rent < 60000, Green if >= 60000 */}
            <p>
              Rent: <span style={getRentStyle(space.rent)}>₹{space.rent.toLocaleString()}/mo</span>
            </p>

            <button style={{
              marginTop: '10px',
              width: '100%',
              padding: '8px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Footer using JSX expression */}
      <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
        Showing {officeList.length} office spaces | Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

export default App;
```

---

## JSX Concepts Demonstrated

| Concept | Example |
|---------|---------|
| **JSX Element** | `<h1>Office Portal</h1>` |
| **JSX Attribute** | `<img src={url} alt="office" />` |
| **Object in JSX** | `{office.name}`, `{office.rent}` |
| **List rendering** | `officeList.map(space => <div>...)` |
| **Inline CSS (object)** | `style={{ color: rent < 60000 ? 'red' : 'green' }}` |
| **Conditional expression** | `rent < 60000 ? 'red' : 'green'` |
| **JS expression in JSX** | `{new Date().toLocaleDateString()}` |
