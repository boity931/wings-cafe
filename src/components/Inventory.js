import React, { useState, useEffect } from 'react';
import api from '../api';

function Inventory({ onChanged }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [editedFields, setEditedFields] = useState({}); 

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, description, category, price, quantity } = newProduct;

    if (!name || !price || !quantity) {
      return alert('Please fill all required fields');
    }

    try {
      const newProductData = {
        name,
        description,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      };

      await api.post('/products', newProductData);
      setNewProduct({ name: '', description: '', category: '', price: '', quantity: '' });
      await fetchProducts();
      if (onChanged) onChanged();
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product');
    }
  };

  const handleFieldChange = (id, value, field) => {
  
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEditedFields(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    }
  };

  const handleSaveEdits = async (product) => {
    const edits = editedFields[product.id];
    if (!edits) return;

    
    if (edits.price !== undefined) {
      const priceVal = parseFloat(edits.price);
      if (isNaN(priceVal) || priceVal < 0) {
        return alert('Enter a valid price value.');
      }
    }
    if (edits.quantity !== undefined) {
      const quantityVal = parseInt(edits.quantity, 10);
      if (isNaN(quantityVal) || quantityVal < 0) {
        return alert('Enter a valid quantity value.');
      }
    }

  
    const updatedProduct = { ...product };
    if (edits.price !== undefined) updatedProduct.price = parseFloat(edits.price);
    if (edits.quantity !== undefined) updatedProduct.quantity = parseInt(edits.quantity, 10);

    try {
      await api.put(`/products/${product.id}`, updatedProduct);

      setEditedFields(prev => {
        const newData = { ...prev };
        delete newData[product.id];
        return newData;
      });

      await fetchProducts();
      if (onChanged) onChanged();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
      if (onChanged) onChanged();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product.');
    }
  };

  if (loading) return <div className="dashboard">Loading inventory...</div>;

  return (
    <div className="dashboard">
      <div className="card inventory-table">
        <h3>Product Inventory</h3>
        <table className="table product-inventory" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price (M)</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const edits = editedFields[product.id] || {};
              const isChanged =
                (edits.price !== undefined && parseFloat(edits.price) !== product.price) ||
                (edits.quantity !== undefined && parseInt(edits.quantity, 10) !== product.quantity);
              const isLowQuantity = (product.quantity || 0) < 10;

              return (
                <tr key={product.id} style={{ backgroundColor: isLowQuantity ? '#ffcccc' : 'transparent' }}>
                  <td>{product.name}</td>
                  <td>{product.description || 'N/A'}</td>
                  <td>{product.category || 'N/A'}</td>
                  <td>
                    <input
                      type="text"
                      value={edits.price !== undefined ? edits.price : product.price}
                      onChange={e => handleFieldChange(product.id, e.target.value, 'price')}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={edits.quantity !== undefined ? edits.quantity : product.quantity}
                      onChange={e => handleFieldChange(product.id, e.target.value, 'quantity')}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <button disabled={!isChanged} onClick={() => handleSaveEdits(product)}>
                      Save
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ backgroundColor: '#e74c3c', color: 'white' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card inventory-form" style={{ marginTop: '20px' }}>
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct} className="add-product-form">
          <input name="name" value={newProduct.name} onChange={handleNewProductChange} placeholder="Product Name" required />
          <input name="description" value={newProduct.description} onChange={handleNewProductChange} placeholder="Description" />
          <input name="category" value={newProduct.category} onChange={handleNewProductChange} placeholder="Category" />
          <input name="price" type="number" step="0.01" min="0" value={newProduct.price} onChange={handleNewProductChange} placeholder="Price" required />
          <input name="quantity" type="number" min="0" value={newProduct.quantity} onChange={handleNewProductChange} placeholder="Quantity" required />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default Inventory;
















