import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Grid, TextField, Snackbar, Alert, Box, Slider } from "@mui/material";
import Navbar from "./Navbar";
import "../style/AddProduct.css"; // Import the CSS file

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [priceRange, setPriceRange] = useState([0, 10000]); // Default price range

  // Fetch products from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      })
      .catch(() => showSnackbar("Failed to fetch products", "error"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewProduct((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.image) {
      axios
        .post("http://localhost:5000/products", newProduct)
        .then((response) => {
          const addedProduct = response.data;
          setProducts((prev) => [...prev, addedProduct]); // Update the full products list
          setFilteredProducts((prev) => [...prev, addedProduct]); // Update the filtered list
          resetForm();
          showSnackbar("Product added successfully", "success");
        })
        .catch(() => showSnackbar("Failed to add product", "error"));
    } else {
      showSnackbar("Please fill in all fields", "warning");
    }
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    setEditingProduct(productToEdit);
    setNewProduct({ name: productToEdit.name, price: productToEdit.price, image: productToEdit.image });
    setImagePreview(productToEdit.image);
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:5000/products/${editingProduct._id}`, newProduct)
      .then((response) => {
        setProducts((prev) =>
          prev.map((product) => (product._id === editingProduct._id ? response.data : product))
        );
        setFilteredProducts((prev) =>
          prev.map((product) => (product._id === editingProduct._id ? response.data : product))
        );
        resetForm();
        showSnackbar("Product updated successfully", "success");
      })
      .catch(() => showSnackbar("Failed to update product", "error"));
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((product) => product._id !== id));
        setFilteredProducts((prev) => prev.filter((product) => product._id !== id));
        showSnackbar("Product deleted successfully", "success");
      })
      .catch(() => showSnackbar("Failed to delete product", "error"));
  };

  const resetForm = () => {
    setNewProduct({ name: "", price: "", image: "" });
    setImagePreview(null);
    setEditingProduct(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const handlePriceFilterChange = (event, newValue) => {
    setPriceRange(newValue);
    const filtered = products.filter(
      (product) => product.price >= newValue[0] && product.price <= newValue[1]
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="add-product-container">
        <h1 className="add-product-title">Manage Products</h1>

        <div className="add-product-form">
          <TextField
            label="Product Name"
            variant="outlined"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
          />
          <TextField
            label="Product Price"
            variant="outlined"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <div className="add-product-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={editingProduct ? handleSaveEdit : handleAddProduct}
          >
            {editingProduct ? "Save Changes" : "Add Product"}
          </Button>
          {editingProduct && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>

        <Box sx={{ width: "100%", maxWidth: 600, margin: "2rem auto" }}>
          <Typography gutterBottom>Filter by Price</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceFilterChange}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
          />
        </Box>

        <Grid container spacing={3} className="product-grid">
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-card-content">
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    ₱{parseFloat(product.price).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEditProduct(product._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} style={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddProduct;
