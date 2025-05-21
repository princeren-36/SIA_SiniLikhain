import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, Fab, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import NavbarArtisan from "./NavbarArtisan";
import Rating from "@mui/material/Rating";
import "../style/AddProduct.css";

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", image: null, quantity: 1, category: "" });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // For dialog
  const [openForm, setOpenForm] = useState(false); // For add/edit dialog
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      const artisanProducts = res.data.filter(p => p.artisan === user.username);
      setProducts(artisanProducts);
    });
  }, [user.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handleImage = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async () => {
    if (editId) {
      // Edit product
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("artisan", user.username);
      if (formData.image) data.append("image", formData.image);
      data.append("quantity", formData.quantity);
      data.append("category", formData.category);

      const res = await axios.put(`http://localhost:5000/products/${editId}`, data);
      setProducts((prev) =>
        prev.map((p) => (p._id === editId ? res.data : p))
      );
      setEditId(null);
    } else {
      // Add product
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("artisan", user.username);
      data.append("image", formData.image);
      data.append("quantity", formData.quantity);
      data.append("category", formData.category);

      const res = await axios.post("http://localhost:5000/products", data);
      setProducts((prev) => [...prev, res.data]);
    }
    setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
    setPreview(null);
    setOpenForm(false);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      image: null,
      quantity: product.quantity || 1,
      category: product.category || "",
    });
    setPreview(product.image ? `http://localhost:5000${product.image}` : null);
    setOpenForm(true);
    setSelectedProduct(null); // Close dialog if open
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    if (editId === id) {
      setEditId(null);
      setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
      setPreview(null);
    }
    setSelectedProduct(null); // Close dialog if open
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
    setPreview(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditId(null);
    setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
    setPreview(null);
    setOpenForm(false);
  };

  return (
    <>
      <NavbarArtisan />
      <Box className="addproduct-main" p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" className="addproduct-title">
            My Products
          </Typography>
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className="addproduct-add-btn"
              onClick={handleOpenAdd}
              sx={{ boxShadow: "none", textTransform: "none" }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Add/Edit Product Dialog */}
        <Dialog open={openForm} onClose={handleCloseForm} maxWidth="xs" fullWidth>
          <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              className="addproduct-input"
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              className="addproduct-input"
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              className="addproduct-input"
              inputProps={{ min: 1 }}
            />
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              className="addproduct-input"
              sx={{ marginTop: 2 }}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Home Decor">Home Decor</MenuItem>
              <MenuItem value="Art">Art</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="addproduct-file-input"
            />
            {preview && (
              <img src={preview} alt="Preview" className="addproduct-preview-img" />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className="addproduct-submit-btn"
              onClick={handleSubmit}
            >
              {editId ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="addproduct-cancel-btn"
              onClick={handleCloseForm}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2} className="addproduct-grid-container">
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id} className="addproduct-grid-item">
              <Box
                className="addproduct-product-box"
                border={1}
                borderRadius={2}
                p={2}
                onClick={() => setSelectedProduct(p)}
              >
                <img
                  src={`http://localhost:5000${p.image}`}
                  alt={p.name}
                  className="addproduct-product-img"
                />
                <Typography className="addproduct-product-name">{p.name}</Typography>
                <Typography className="addproduct-product-price">₱{p.price}</Typography>
                <Typography className="addproduct-product-qty">Qty: {p.quantity}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Product Details Dialog */}
        <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            {selectedProduct && (
              <>
                <img
                  src={`http://localhost:5000${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="addproduct-product-img"
                  style={{ marginBottom: 16 }}
                />
                <Typography variant="h6">{selectedProduct.name}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>₱{selectedProduct.price}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Quantity: {selectedProduct.quantity}</Typography>
                {/* Show average rating */}
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  <Rating
                    name="product-rating"
                    value={
                      selectedProduct.ratings && selectedProduct.ratings.length
                        ? selectedProduct.ratings.reduce((sum, r) => sum + r.value, 0) / selectedProduct.ratings.length
                        : 0
                    }
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({selectedProduct.ratings ? selectedProduct.ratings.length : 0})
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleEdit(selectedProduct)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(selectedProduct._id)}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default AddProduct;
