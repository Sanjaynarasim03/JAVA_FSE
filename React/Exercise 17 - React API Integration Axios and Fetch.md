# Exercise 17 - React API Integration (Axios and Fetch)

## Scenario
Fetch country data from a REST API and display it using Axios and the Fetch API.

---

## Setup

```bash
npx create-react-app countryapp
cd countryapp
npm install axios
```

---

## CountryList.js (Using Axios)
`src/CountryList.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Axios GET request to public REST Countries API
    axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital')
      .then(response => {
        const sorted = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch countries: ' + err.message);
        setLoading(false);
      });
  }, []);

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', fontSize: '20px' }}>
      ⏳ Loading countries...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
      ❌ {error}
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <h1>🌍 Countries of the World (Axios)</h1>
      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px',
                 border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px' }}
      />
      <p style={{ color: '#666', marginBottom: '16px' }}>
        Showing {filtered.length} of {countries.length} countries
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {filtered.slice(0, 50).map(country => (
          <div key={country.name.common} style={{
            border: '1px solid #eee', borderRadius: '10px', padding: '12px',
            textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <img src={country.flags.png} alt={country.name.common}
                 style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
            <h4 style={{ margin: '8px 0 4px' }}>{country.name.common}</h4>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              {country.region}
              {country.capital?.[0] && ` • ${country.capital[0]}`}
            </p>
            <p style={{ color: '#999', fontSize: '12px', margin: '4px 0 0' }}>
              👥 {country.population?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryList;
```

---

## CountryFetch.js (Using native Fetch API)
`src/CountryFetch.js`

```jsx
import React, { useState, useEffect } from 'react';

function CountryFetch() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Native Fetch API with async/await
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,region'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCountries(data.slice(0, 20)); // Show first 20
      } catch (err) {
        console.error('Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <p>Loading via Fetch API...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Countries (Fetch API)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {countries.map(c => (
          <div key={c.name.common} style={{
            padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <img src={c.flags.png} alt={c.name.common} style={{ width: '40px', height: '25px', objectFit: 'cover' }} />
            <span>{c.name.common}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryFetch;
```

---

## App.js

```jsx
import React, { useState } from 'react';
import CountryList from './CountryList';
import CountryFetch from './CountryFetch';

function App() {
  const [mode, setMode] = useState('axios');

  return (
    <div>
      <div style={{ padding: '12px 20px', backgroundColor: '#1976d2', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setMode('axios')}
          style={{ padding: '8px 18px', backgroundColor: mode === 'axios' ? '#fff' : 'transparent',
                   color: mode === 'axios' ? '#1976d2' : 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}
        >
          Axios
        </button>
        <button
          onClick={() => setMode('fetch')}
          style={{ padding: '8px 18px', backgroundColor: mode === 'fetch' ? '#fff' : 'transparent',
                   color: mode === 'fetch' ? '#1976d2' : 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}
        >
          Fetch API
        </button>
      </div>
      {mode === 'axios' ? <CountryList /> : <CountryFetch />}
    </div>
  );
}

export default App;
```

---

## Axios vs Fetch API

| Feature | Axios | Fetch API |
|---------|-------|-----------|
| **Install needed** | `npm install axios` | Built into browser |
| **JSON parsing** | Automatic | Manual (`.json()`) |
| **Error handling** | Throws for HTTP errors | Only throws for network errors |
| **Interceptors** | Yes | No |
| **Cancel requests** | Yes (CancelToken) | Yes (AbortController) |
