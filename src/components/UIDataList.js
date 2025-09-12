import React from 'react';

export default function UIDataList({ uiData = [] }) {
  return (
    <div className="card">
      <h3>Live UI Database Products</h3>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th><th>Quantity</th><th>Timestamp</th></tr>
        </thead>
        <tbody>
          {uiData.map(p => (
            <tr key={p.id} className={Number(p.quantity) <= 5 ? 'low' : ''}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}