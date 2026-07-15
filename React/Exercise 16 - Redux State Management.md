# Exercise 16 - Redux State Management

## Scenario
Implement Redux for global state management in a shopping cart application.

---

## Setup

```bash
npx create-react-app reduxshopapp
cd reduxshopapp
npm install @reduxjs/toolkit react-redux
```

---

## store/cartSlice.js
`src/store/cartSlice.js`

```jsx
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  },
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id);
      state.totalQuantity++;
      state.totalAmount += action.payload.price;
      if (existing) {
        existing.quantity++;
        existing.totalPrice += action.payload.price;
      } else {
        state.items.push({ ...action.payload, quantity: 1, totalPrice: action.payload.price });
      }
    },
    removeItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload);
      state.totalQuantity--;
      state.totalAmount -= existing.price;
      if (existing.quantity === 1) {
        state.items = state.items.filter(i => i.id !== action.payload);
      } else {
        existing.quantity--;
        existing.totalPrice -= existing.price;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

---

## store/store.js
`src/store/store.js`

```jsx
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

export default store;
```

---

## ProductList.js
`src/ProductList.js`

```jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from './store/cartSlice';

const PRODUCTS = [
  { id: 1, name: 'iPhone 15', price: 79999, category: 'Electronics' },
  { id: 2, name: 'Sony Headphones', price: 24999, category: 'Electronics' },
  { id: 3, name: 'Nike Shoes', price: 8999, category: 'Fashion' },
  { id: 4, name: 'Python Book', price: 699, category: 'Books' },
  { id: 5, name: 'USB-C Hub', price: 3499, category: 'Accessories' },
];

function ProductList() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const getItemInCart = (id) => cartItems.find(i => i.id === id);

  return (
    <div>
      <h2>🛍️ Products</h2>
      {PRODUCTS.map(product => {
        const cartItem = getItemInCart(product.id);
        return (
          <div key={product.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px', margin: '8px 0', border: '1px solid #eee', borderRadius: '8px'
          }}>
            <div>
              <strong>{product.name}</strong>
              <span style={{ color: '#666', marginLeft: '8px', fontSize: '13px' }}>({product.category})</span>
              <p style={{ margin: 0, color: '#1976d2', fontWeight: 'bold' }}>₹{product.price.toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {cartItem && (
                <>
                  <button
                    onClick={() => dispatch(removeItem(product.id))}
                    style={{ width: '32px', height: '32px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}
                  >−</button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                </>
              )}
              <button
                onClick={() => dispatch(addItem(product))}
                style={{ width: '32px', height: '32px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}
              >+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
```

---

## Cart.js
`src/Cart.js`

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from './store/cartSlice';

function Cart() {
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999', border: '1px dashed #ddd', borderRadius: '8px' }}>
        🛒 Cart is empty. Add some products!
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
      <h2>🛒 Cart ({totalQuantity} items)</h2>
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
          <span>{item.name} × {item.quantity}</span>
          <strong>₹{item.totalPrice.toLocaleString()}</strong>
        </div>
      ))}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
        <span>Total:</span>
        <span style={{ color: '#1976d2' }}>₹{totalAmount.toLocaleString()}</span>
      </div>
      <button
        onClick={() => dispatch(clearCart())}
        style={{ marginTop: '12px', width: '100%', padding: '10px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Clear Cart
      </button>
    </div>
  );
}

export default Cart;
```

---

## App.js

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import ProductList from './ProductList';
import Cart from './Cart';

function App() {
  return (
    <Provider store={store}>
      <div style={{ fontFamily: 'Arial', maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
        <h1>🛒 Redux Shopping App</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          <ProductList />
          <Cart />
        </div>
      </div>
    </Provider>
  );
}

export default App;
```

---

## Redux Toolkit Concepts

| Concept | Description |
|---------|-------------|
| `createSlice` | Defines state + reducers in one place |
| `configureStore` | Creates Redux store |
| `useSelector` | Read state from Redux store |
| `useDispatch` | Dispatch actions to Redux store |
| `Provider` | Makes store available to entire React tree |
