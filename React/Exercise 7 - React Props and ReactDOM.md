# Exercise 7 - React Props and ReactDOM

## Scenario
Create a Shopping application using Props to pass Cart item data from parent (OnlineShopping) to child components.

---

## Setup

```bash
npx create-react-app shoppingapp
cd shoppingapp
```

---

## Cart.js (Data Model)
`src/Cart.js`

```js
class Cart {
  constructor(itemname, price) {
    this.itemname = itemname;
    this.price = price;
  }
}

export default Cart;
```

---

## CartItem.js (Child Component)
`src/CartItem.js`

```jsx
import React from 'react';

// Receives a single cart item via props
function CartItem({ item, index }) {
  return (
    <tr>
      <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{index + 1}</td>
      <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.itemname}</td>
      <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
        ₹{item.price.toFixed(2)}
      </td>
    </tr>
  );
}

export default CartItem;
```

---

## OnlineShopping.js (Parent Class Component)
`src/OnlineShopping.js`

```jsx
import React, { Component } from 'react';
import Cart from './Cart';
import CartItem from './CartItem';

class OnlineShopping extends Component {

  constructor(props) {
    super(props);

    // Initialize an array of Cart items
    this.state = {
      cartItems: [
        new Cart('Apple iPhone 15', 79999),
        new Cart('Sony Headphones WH-1000XM5', 24999),
        new Cart('Nike Running Shoes', 8999),
        new Cart('Python Programming Book', 699),
        new Cart('USB-C Hub 7-in-1', 3499),
      ]
    };
  }

  getTotalPrice() {
    return this.state.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  render() {
    const { cartItems } = this.state;
    const total = this.getTotalPrice();

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px',
                    border: '1px solid #ddd', borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#e91e63', marginBottom: '20px' }}>🛒 Online Shopping Cart</h1>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Item</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {/* Pass each Cart item as props to CartItem component */}
            {cartItems.map((item, index) => (
              <CartItem key={index} item={item} index={index} />
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#e8f5e9' }}>
              <td colSpan={2} style={{ padding: '10px', fontWeight: 'bold' }}>
                Total Amount
              </td>
              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right',
                           color: '#2e7d32' }}>
                ₹{total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <button style={{
          marginTop: '20px', width: '100%', padding: '12px',
          backgroundColor: '#e91e63', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '16px',
          cursor: 'pointer'
        }}>
          Proceed to Checkout
        </button>
      </div>
    );
  }
}

export default OnlineShopping;
```

---

## App.js (ReactDOM.render usage)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import OnlineShopping from './OnlineShopping';

// Modern React 18 way
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OnlineShopping />
  </React.StrictMode>
);
```

Or in App.js:

```jsx
import React from 'react';
import OnlineShopping from './OnlineShopping';

function App() {
  return <OnlineShopping />;
}

export default App;
```

---

## Props Flow

```
OnlineShopping (Parent)
  state: cartItems = [Cart1, Cart2, Cart3, Cart4, Cart5]
      ↓  props: item={cart}, index={i}
  CartItem (Child) × 5
    renders: #, itemname, price
```

---

## Expected Output

```
🛒 Online Shopping Cart
+----+-----------------------------+----------+
| #  | Item                        | Price    |
+----+-----------------------------+----------+
| 1  | Apple iPhone 15             | ₹79999   |
| 2  | Sony Headphones WH-1000XM5  | ₹24999   |
| 3  | Nike Running Shoes          | ₹8999    |
| 4  | Python Programming Book     | ₹699     |
| 5  | USB-C Hub 7-in-1            | ₹3499    |
+----+-----------------------------+----------+
| Total Amount                    | ₹118195  |
+----+-----------------------------+----------+
```
