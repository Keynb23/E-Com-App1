import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import type { Product } from '../../types/types'; 
import './crud.css';

const CRUD: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'rating'>>({
    title: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    brand: '', 
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const db = getFirestore();
  const auth = getAuth();
  // FIX: Memoize the products collection reference!
  const productsCollectionRef = useMemo(() => collection(db, 'products'), [db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); 
  }, [auth]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(productsCollectionRef); 
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]; 
      setProducts(productsData);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. " + err.message);
    } finally {
      setLoading(false);
    }
  }, [productsCollectionRef]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 

  // --- rest of your code below, unchanged ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("You must be logged in to add products.");
      return;
    }
    if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.image) {
      setError("Please fill in all required fields (Title, Price, Category, Image URL).");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addDoc(productsCollectionRef, {
        ...newProduct,
        price: Number(newProduct.price), 
        rating: { rate: 0, count: 0 },
      });
      setNewProduct({ title: '', description: '', price: 0, category: '', image: '', brand: '' }); 
      await fetchProducts();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setError("Failed to add product. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("You must be logged in to update products.");
      return;
    }
    if (!editingProduct || !editingProduct.id) {
      setError("No product selected for update.");
      return;
    }
    if (!editingProduct.title || !editingProduct.price || !editingProduct.category || !editingProduct.image) {
      setError("Please fill in all required fields for the product being edited.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const productDocRef = doc(productsCollectionRef, editingProduct.id);
      await updateDoc(productDocRef, {
        title: editingProduct.title,
        description: editingProduct.description,
        price: Number(editingProduct.price), 
        category: editingProduct.category,
        image: editingProduct.image,
        brand: editingProduct.brand,
      });
      setEditingProduct(null); 
      await fetchProducts(); 
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError("Failed to update product. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!currentUser) {
      setError("You must be logged in to delete products.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return; 
    }

    setLoading(true);
    setError(null);
    try {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      await fetchProducts(); 
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError(null); 
  };

  return (
    <div className="crud-container">
      <h1>Product Management</h1>

      {loading && <p className="crud-message loading">Loading products...</p>}
      {error && <p className="crud-message error">{error}</p>}
      {!currentUser && !loading && (
        <p className="crud-message info">Please log in to manage products.</p>
      )}

      <div className="crud-section add-product-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct} className="crud-form">
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price === 0 ? '' : newProduct.price} 
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
            required
            min="0"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Brand (Optional)"
            value={newProduct.brand || ''}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
          />
          <button type="submit" disabled={!currentUser || loading}>Add Product</button>
        </form>
      </div>

      {editingProduct && (
        <div className="crud-section edit-product-section">
          <h2>Edit Product: {editingProduct.title}</h2>
          <form onSubmit={handleUpdateProduct} className="crud-form">
            <input
              type="text"
              placeholder="Title"
              value={editingProduct.title}
              onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
              required
              min="0"
              step="0.01"
            />
            <input
              type="text"
              placeholder="Category"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct.image}
              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Brand (Optional)"
              value={editingProduct.brand || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
            />
            <div className="form-actions">
              <button type="submit" disabled={!currentUser || loading}>Update Product</button>
              <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="crud-section product-list-section">
        <h2>Existing Products</h2>
        {products.length === 0 && !loading && !error && (
          <p className="crud-message info">No products found. Add some!</p>
        )}
        <div className="crud-product-container">
          {products.map((product) => (
            <div key={product.id} className="crud-product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <h3>{product.title}</h3>
              <p className="crud-product-price">${product.price.toFixed(2)}</p>
              <p className="crud-product-category">{product.category}</p>
              <p className="crud-product-brand">{product.brand}</p>
              <div className="crud-product-actions">
                <button
                  onClick={() => handleEditProduct(product)}
                  disabled={!currentUser || loading}
                  className="crud-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={!currentUser || loading}
                  className="crud-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRUD;