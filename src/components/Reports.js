import React, { useEffect, useState } from 'react';
import api from '../api';

function Reports({ refreshSignal, products = [], transactions = [] }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodRes = await api.get('/products', { timeout: 5000 });
        if (!Array.isArray(prodRes.data)) {
          throw new Error('Products data is not an array');
        }
        setLocalProducts(prodRes.data || []);
      } catch (err) {
        console.error('Error fetching products in Reports:', err);
        setError(`Failed to fetch product data: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshSignal]);

  const allProducts = (products && products.length > 0) ? products : localProducts;

  const totalSales = (transactions || []).reduce((acc, txn) => {
    const product = allProducts.find(p => p.id === txn?.productId);
    return acc + (txn?.amount || 0) * (product?.price || 0);
  }, 0).toFixed(2);

  const totalProducts = allProducts.length;

  const restockProducts = allProducts.filter(p => Number(p.quantity || 0) <= 5);
  const restockCount = restockProducts.length;

  const productsWithDetails = allProducts.map(product => {
    const soldQuantity = (transactions || [])
      .filter(t => t?.productId === product.id && t?.type === 'deduct' && t?.note === 'sold')
      .reduce((acc, txn) => acc + (txn?.amount || 0), 0);

    const availableQuantity = Number(product.quantity || 0);

    return {
      name: product.name || 'Unnamed',
      price: Number(product.price || 0).toFixed(2),
      soldQuantity,
      availableQuantity,
      totalValue: Number(product.price || 0) * availableQuantity, 
      needsRestock: availableQuantity <= 5,
    };
  });

  const totalAvailableStockValue = productsWithDetails.reduce((acc, item) => acc + item.totalValue, 0).toFixed(2); 

  if (loading) return <div className="dashboard">Loading reports...</div>;
  if (error) return <div className="dashboard">Error: {error}</div>;

  return (
    <div className="dashboard">
      <div className="summary-cards" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="summary-card total-sales" style={{ flex: 1, padding: '1rem', border: '1px solid #ccc' }}>
          <h4>Total Sales</h4>
          <p>M{totalSales}</p>
        </div>
        <div className="summary-card total-products" style={{ flex: 1, padding: '1rem', border: '1px solid #ccc' }}>
          <h4>Total Products</h4>
          <p>{totalProducts}</p>
        </div>
        <div className="summary-card available-value" style={{ flex: 1, padding: '1rem', border: '1px solid #ccc' }}>
          <h4>Total Stock Value</h4>
          <p>M{totalAvailableStockValue}</p>
        </div>
        <div
          className="summary-card restock"
          style={{
            flex: 1,
            padding: '1rem',
            border: '1px solid #ccc',
            color: restockCount > 0 ? 'red' : 'inherit',
            fontWeight: restockCount > 0 ? 'bold' : 'normal',
            cursor: restockCount > 0 ? 'default' : 'auto',
          }}
          title={restockCount > 0 ? 'Products need restocking' : ''}
        >
          <h4>Restock</h4>
          <p>{restockCount}</p>
        </div>
      </div>
      <div className="card" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
        <h3>Product Overview</h3>
        {productsWithDetails.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Product Name</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Price (M)</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Sold Quantity</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Available Quantity</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Restock Needed</th>
              </tr>
            </thead>
            <tbody>
              {productsWithDetails.map((item, idx) => (
                <tr key={idx} style={{ color: item.needsRestock ? 'red' : 'inherit' }}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.name}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.price}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.soldQuantity}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.availableQuantity}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.needsRestock ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;




















