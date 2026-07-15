# Exercise 15 - React Forms

## Scenario
Create a registration form with controlled components, validation, and form submission.

---

## Setup

```bash
npx create-react-app formapp
cd formapp
```

---

## RegistrationForm.js
`src/RegistrationForm.js`

```jsx
import React, { useState } from 'react';

const INITIAL_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', gender: '',
  technology: '', agreeTerms: false
};

function RegistrationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!form.phone.match(/^\d{10}$/)) newErrors.phone = '10-digit phone number required';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.gender) newErrors.gender = 'Please select gender';
    if (!form.technology) newErrors.technology = 'Please select a technology';
    if (!form.agreeTerms) newErrors.agreeTerms = 'You must accept the terms';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '10px', borderRadius: '6px',
    border: errors[field] ? '2px solid #f44336' : '1px solid #ccc',
    fontSize: '15px', marginTop: '4px', boxSizing: 'border-box'
  });

  const errorStyle = { color: '#f44336', fontSize: '13px', marginTop: '3px' };
  const labelStyle = { fontWeight: '500', color: '#444' };

  if (submitted) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px',
                    backgroundColor: '#e8f5e9', borderRadius: '10px', textAlign: 'center' }}>
        <h2 style={{ color: '#2e7d32' }}>✅ Registration Successful!</h2>
        <p>Welcome, <strong>{form.firstName} {form.lastName}</strong>!</p>
        <p>Email: {form.email}</p>
        <p>Technology: {form.technology}</p>
        <button onClick={handleReset} style={{
          marginTop: '20px', padding: '10px 24px', backgroundColor: '#1976d2',
          color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
        }}>
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '550px', margin: '30px auto', padding: '30px',
                  border: '1px solid #ddd', borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '24px' }}>
        📝 User Registration
      </h2>

      <form onSubmit={handleSubmit} noValidate>

        {/* First & Last Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>First Name *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange}
                   placeholder="John" style={inputStyle('firstName')} />
            {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
          </div>
          <div>
            <label style={labelStyle}>Last Name *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange}
                   placeholder="Doe" style={inputStyle('lastName')} />
            {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div style={{ marginTop: '12px' }}>
          <label style={labelStyle}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
                 placeholder="john@example.com" style={inputStyle('email')} />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div style={{ marginTop: '12px' }}>
          <label style={labelStyle}>Phone *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                 placeholder="9876543210" style={inputStyle('phone')} />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>

        {/* Password */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          <div>
            <label style={labelStyle}>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
                   style={inputStyle('password')} />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>
          <div>
            <label style={labelStyle}>Confirm Password *</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword}
                   onChange={handleChange} style={inputStyle('confirmPassword')} />
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Gender - Radio buttons */}
        <div style={{ marginTop: '12px' }}>
          <label style={labelStyle}>Gender *</label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
            {['Male', 'Female', 'Other'].map(g => (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="gender" value={g}
                       checked={form.gender === g} onChange={handleChange} />
                {g}
              </label>
            ))}
          </div>
          {errors.gender && <p style={errorStyle}>{errors.gender}</p>}
        </div>

        {/* Technology - Select dropdown */}
        <div style={{ marginTop: '12px' }}>
          <label style={labelStyle}>Technology *</label>
          <select name="technology" value={form.technology} onChange={handleChange}
                  style={{ ...inputStyle('technology'), backgroundColor: 'white' }}>
            <option value="">-- Select Technology --</option>
            {['React', 'Angular', 'Vue', 'Spring Boot', 'Node.js', 'Python', 'Java'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.technology && <p style={errorStyle}>{errors.technology}</p>}
        </div>

        {/* Terms Checkbox */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="agreeTerms" checked={form.agreeTerms}
                   onChange={handleChange} style={{ marginTop: '3px' }} />
            <span style={{ fontSize: '14px', color: '#555' }}>
              I agree to the <a href="#terms" style={{ color: '#1976d2' }}>Terms and Conditions</a>
            </span>
          </label>
          {errors.agreeTerms && <p style={errorStyle}>{errors.agreeTerms}</p>}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" style={{
            flex: 1, padding: '12px', backgroundColor: '#1976d2',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer'
          }}>
            Register
          </button>
          <button type="button" onClick={handleReset} style={{
            padding: '12px 20px', backgroundColor: '#eee',
            color: '#333', border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer'
          }}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
```

---

## App.js

```jsx
import React from 'react';
import RegistrationForm from './RegistrationForm';

function App() {
  return <RegistrationForm />;
}

export default App;
```
