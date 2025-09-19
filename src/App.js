import React, { useEffect, useState } from 'react';
import api from './api';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Reports from './components/Reports';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Footer from './components/Footer';
import logo from './assets/logo.png';

function App() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [refreshSignal, setRefreshSignal] = useState(0);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Combine both fetches into one useEffect
  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, [refreshSignal]);

  const updateProductQuantity = (productId, newQuantity) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const handleRefresh = () => {
    setRefreshSignal(prev => prev + 1);
  };

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '60px',
      }}
    >
      <Navbar logo={logo} setActiveSection={setActiveSection} />
      <div className="main-content">
        <div className="content">
          {activeSection === 'dashboard' && (
            <Dashboard products={products} refreshSignal={refreshSignal} />
          )}
          {activeSection === 'inventory' && (
            <Inventory products={products} onChanged={handleRefresh} />
          )}
          {activeSection === 'reports' && (
            <Reports transactions={transactions} refreshSignal={refreshSignal} />
          )}
          {activeSection === 'sales' && (
            <Sales
              products={products}
              updateProductQuantity={updateProductQuantity}
              onSold={handleRefresh}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;




