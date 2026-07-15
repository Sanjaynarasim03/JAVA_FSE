# Exercise 19 - TypeScript with React

## Scenario
Create a typed React application using TypeScript for type safety in components, props, and state.

---

## Setup

```bash
npx create-react-app tsapp --template typescript
cd tsapp
```

---

## types/index.ts
`src/types/index.ts`

```typescript
// Type definitions for the application

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  active: boolean;
}

export interface Department {
  id: number;
  name: string;
  headCount: number;
}

export type FilterType = 'all' | 'active' | 'inactive';

export interface EmployeeCardProps {
  employee: Employee;
  onToggleActive: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
}
```

---

## EmployeeCard.tsx
`src/EmployeeCard.tsx`

```tsx
import React from 'react';
import { EmployeeCardProps } from './types';

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onToggleActive, onDelete }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '16px',
    margin: '8px',
    width: '250px',
    display: 'inline-block',
    verticalAlign: 'top',
    backgroundColor: employee.active ? '#f9fbe7' : '#fafafa',
    opacity: employee.active ? 1 : 0.7,
  };

  const statusStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: employee.active ? '#e8f5e9' : '#ffebee',
    color: employee.active ? '#2e7d32' : '#c62828',
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px' }}>{employee.name}</h3>
      <span style={statusStyle}>{employee.active ? 'Active' : 'Inactive'}</span>
      <p style={{ color: '#666', fontSize: '14px', margin: '8px 0 4px' }}>{employee.email}</p>
      <p style={{ color: '#888', fontSize: '13px', margin: '4px 0' }}>
        {employee.department} | ₹{employee.salary.toLocaleString()}
      </p>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onToggleActive(employee.id)}
          style={{
            flex: 1,
            padding: '6px',
            backgroundColor: employee.active ? '#ff9800' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {employee.active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
```

---

## FilterBar.tsx
`src/FilterBar.tsx`

```tsx
import React from 'react';
import { FilterBarProps, FilterType } from './types';

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, totalCount }) => {
  const filters: FilterType[] = ['all', 'active', 'inactive'];

  return (
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: '#666' }}>Filter ({totalCount}):</span>
      {filters.map((filter: FilterType) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            padding: '6px 16px',
            backgroundColor: currentFilter === filter ? '#1976d2' : '#eee',
            color: currentFilter === filter ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
```

---

## App.tsx
`src/App.tsx`

```tsx
import React, { useState } from 'react';
import { Employee, FilterType } from './types';
import EmployeeCard from './EmployeeCard';
import FilterBar from './FilterBar';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@co.com', department: 'Engineering', salary: 95000, active: true },
  { id: 2, name: 'Bob Williams', email: 'bob@co.com', department: 'Design', salary: 80000, active: true },
  { id: 3, name: 'Carol Smith', email: 'carol@co.com', department: 'Marketing', salary: 70000, active: false },
  { id: 4, name: 'David Brown', email: 'david@co.com', department: 'Engineering', salary: 105000, active: true },
];

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleToggleActive = (id: number): void => {
    setEmployees(prev =>
      prev.map(emp => emp.id === id ? { ...emp, active: !emp.active } : emp)
    );
  };

  const handleDelete = (id: number): void => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const filteredEmployees: Employee[] = employees.filter(emp => {
    if (filter === 'active') return emp.active;
    if (filter === 'inactive') return !emp.active;
    return true;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <h1>👥 Employee Dashboard (TypeScript)</h1>

      <FilterBar
        currentFilter={filter}
        onFilterChange={setFilter}
        totalCount={filteredEmployees.length}
      />

      <div>
        {filteredEmployees.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No employees found.</p>
        ) : (
          filteredEmployees.map((employee: Employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
```

---

## TypeScript Benefits in React

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| **Props type safety** | Runtime error | Compile-time error |
| **State typing** | `useState(value)` | `useState<Type>(value)` |
| **Interface** | ❌ Not available | ✅ `interface Props {}` |
| **Autocomplete** | Partial | Full IDE support |
| **Refactoring** | Risky | Safe (compiler catches errors) |

---

## Run TypeScript React App

```bash
npm start
# TypeScript errors appear in terminal + browser

# Build (checks all types)
npm run build
```
