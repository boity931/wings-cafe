import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#2436f8ff',
      color: '#fff',
      padding: '4px 0', 
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      margin: '0 auto',
      zIndex: 1000,
      fontSize: '12px',
    }}>
      <div style={{ marginBottom: '2px' }}> 
        <a href="/about" style={{ color: '#fff', margin: '0 10px', textDecoration: 'none' }}>About Us</a>
        <a href="/contact" style={{ color: '#fff', margin: '0 10px', textDecoration: 'none' }}>Contact</a>
        <a href="/privacy" style={{ color: '#fff', margin: '0 10px', textDecoration: 'none' }}>Privacy Policy</a>
      </div>
      <p style={{ margin: 0 }}>© 2025 Wings Cafe. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
