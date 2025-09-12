import React, { useState } from 'react';
import api from '../api';

function Sales({ products, updateProductQuantity, onSold }) {
  const [selling, setSelling] = useState({});

  const handleQuantityChange = (productId, value) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const quantity = Number(product.quantity || 0);
    const num = Math.max(1, Math.min(parseInt(value, 10) || 1, quantity));
    setSelling(prev => ({ ...prev, [productId]: num }));
  };

  const sellProduct = async (productId) => {
    const quantityToSell = selling[productId] || 1;
    const product = products.find(p => p.id === productId);
    if (!product) return alert('Product not found');

    if (quantityToSell > product.quantity) {
      return alert(`Quantity (${quantityToSell}) exceeds available quantity (${product.quantity}).`);
    }

    const transactionData = {
      type: 'deduct',
      amount: Number(quantityToSell),
      note: 'sold',
      productId,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await api.post(`/products/${productId}/transaction`, transactionData);
      const updatedQuantity = product.quantity - quantityToSell;
      const updatedProduct = { ...product, quantity: updatedQuantity };
      await api.put(`/products/${productId}`, updatedProduct);
      updateProductQuantity(productId, updatedQuantity);
      if (onSold) onSold();
      setSelling(prev => ({ ...prev, [productId]: 1 }));
      alert(`Sold ${quantityToSell} x ${product.name} successfully! Total: M${(product.price * quantityToSell).toFixed(2)}`);
    } catch (err) {
      console.error('Sale failed:', err);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            alert('Invalid sale data. Please check the quantity.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('Sale failed. Check console for details.');
        }
      } else {
        alert('Network error. Please check your connection.');
      }
    }
  };

  if (products.length === 0) return <div>No products available</div>;

  return (
    <div className="dashboard">
      <h3>Sales</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        {products.map(product => (
          <div
            key={product.id}
            className="card"
            style={{ width: 250, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}
          >
            <h4>{product.name}</h4>
            <p>Price: M{Number(product.price || 0).toFixed(2)}</p>
            <p>Quantity: {product.quantity || 0}</p>
            <input
              type="number"
              min="1"
              max={product.quantity || 0}
              value={selling[product.id] || 1}
              onChange={e => handleQuantityChange(product.id, e.target.value)}
              disabled={product.quantity === 0}
              style={{ width: '80px', marginBottom: 8 }}
            />
            <button
              onClick={() => sellProduct(product.id)}
              disabled={product.quantity === 0}
              style={{
                width: '100%',
                backgroundColor: product.quantity === 0 ? '#ccc' : '#007bff',
                color: '#fff',
                border: 'none',
                padding: '8px',
                cursor: product.quantity === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {product.quantity === 0 ? 'Out of Stock' : 'Sell'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sales;




















