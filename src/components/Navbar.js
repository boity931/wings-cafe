import React, { useState } from 'react';

function Navbar({ logo, setActiveSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo" />
        <span>Wings Cafe</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>☰</div>
      <ul className={`navbar-nav ${menuOpen ? 'active' : ''}`}>
        <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); setMenuOpen(false); }}>Dashboard</a></li>
        <li><a href="#inventory" onClick={(e) => { e.preventDefault(); setActiveSection('inventory'); setMenuOpen(false); }}>Inventory</a></li>
        <li><a href="#reports" onClick={(e) => { e.preventDefault(); setActiveSection('reports'); setMenuOpen(false); }}>Reports</a></li>
        <li><a href="#sales" onClick={(e) => { e.preventDefault(); setActiveSection('sales'); setMenuOpen(false); }}>Sales</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;



