import React, { useState, useEffect } from 'react';


export default function Dashboard({ products: initialProducts = [], onStockChange }) {
  const [products, setProducts] = useState(initialProducts);
  const [editQuantity, setEditQuantity] = useState({});

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const totalItems = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const lowQuantity = products.filter(p => Number(p.quantity || 0) <= 5).length;

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
  };

  const handleQuantityChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setEditQuantity(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="dashboard card" style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '90%',
    }}>
      <h3 style={{
        fontSize: '2rem',
        color: '#2c3e50',
        marginBottom: '20px',
        fontWeight: '600',
        textAlign: 'center',
      }}>
        Dashboard Overview
      </h3>


      <div className="summary-cards" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <div className="summary-card" style={cardStyle}>
          <h4 style={cardTitleStyle}>Total Items</h4>
          <p><strong style={totalStyle}>{totalItems}</strong></p>
        </div>
        <div className="summary-card" style={cardStyle}>
          <h4 style={cardTitleStyle}>Total Quantity</h4>
          <p><strong style={{ fontSize: '1.5rem', color: '#27ae60' }}>{totalQuantity}</strong></p>
        </div>
        <div className="summary-card" style={cardStyle}>
          <h4 style={cardTitleStyle}>Low Quantity</h4>
          <p><strong style={{ fontSize: '1.5rem', color: '#e74c3c' }}>{lowQuantity}</strong></p>
        </div>
      </div>


      <div className="product-cards" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginTop: '20px',
      }}>
        {products.slice(0, 8).map(p => {
          const isLowQuantity = Number(p.quantity || 0) <= 5;
          const currentQuantity = editQuantity[p.id] !== undefined ? editQuantity[p.id] : p.quantity;

          return (
            <div
              key={p.id}
              className="product-card"
              title={isLowQuantity ? '⚠️ Low stock! Consider restocking.' : undefined} // ✅ ADDED
              style={{
                ...productCardStyle,
                border: isLowQuantity ? '2px solid #e74c3c' : '1px solid #ecf0f1',
              }}
            >
              <img
                src={p.image || 'https://via.placeholder.com/150?text=No+Image'}
                alt={p.name}
                style={productImageStyle}
                onError={handleImageError}
              />
              <div style={{
                padding: '10px',
                backgroundColor: isLowQuantity ? '#f5f5f5' : '#ffffff',
                color: isLowQuantity ? '#555' : '#000',
              }}>
                <h4 style={productNameStyle}>{p.name}</h4>
                <p style={productPriceStyle}>Price: M{Number(p.price || 0).toFixed(2)}</p>
                <div>
                  <label style={quantityLabelStyle}>
                    Quantity:&nbsp;
                    <input
                      type="text"
                      value={currentQuantity}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      style={quantityInputStyle}
                      readOnly
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <div className="info-cards" style={{
        display: 'flex',
        gap: '20px',
        marginTop: '30px',
        flexWrap: 'wrap',
      }}>

        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>🕒 Working Hours</h4>
          <p><strong>Days:</strong> Monday to Saturday</p>
          <p><strong>Weekdays:</strong> 8:00 AM - 5:00 PM</p>
          <p><strong>Weekends:</strong> 8:00 AM - 7:00 PM</p>
        </div>


        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>📱 Contact & Socials</h4>
          <p><strong>Facebook:</strong> @wingshop</p>
          <p><strong>Instagram:</strong> @wingshop</p>
          <p><strong>Twitter:</strong> @wingshop</p>
          <p><strong>Phone:</strong> 57896743</p>
          <p><strong>Location:</strong> Limkokwing Campus Maseru</p>
        </div>
      </div>
    </div>
  );
}


const cardStyle = {
  flex: 1,
  padding: '15px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  border: '1px solid #ecf0f1',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s',
  minWidth: '250px',
};

const cardTitleStyle = {
  fontSize: '1.2rem',
  color: '#34495e',
  marginBottom: '10px',
};

const totalStyle = {
  fontSize: '1.5rem',
  color: '#2980b9',
};

const productCardStyle = {
  flex: '1 1 23%',
  minWidth: '150px',
  maxWidth: '250px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  transition: 'transform 0.2s',
};

const productImageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
};

const productNameStyle = {
  fontSize: '1.1rem',
  color: '#2c3e50',
  marginBottom: '5px',
  fontWeight: '500',
};

const productPriceStyle = {
  fontSize: '0.95rem',
  color: '#7f8c8d',
  marginBottom: '5px',
};

const quantityLabelStyle = {
  fontSize: '0.95rem',
  color: '#34495e',
};

const quantityInputStyle = {
  width: '60px',
  fontSize: '0.95rem',
  padding: '2px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  backgroundColor: 'transparent',
  color: '#000',
  
};



