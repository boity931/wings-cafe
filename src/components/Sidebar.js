import React from 'react';

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>
          Dashboard
        </li>
        <li className={activeSection === 'add-product' ? 'active' : ''} onClick={() => setActiveSection('add-product')}>
          Add Product
        </li>
        <li className={activeSection === 'products' ? 'active' : ''} onClick={() => setActiveSection('products')}>
          View Products
        </li>
      </ul>
    </aside>
  );
}
