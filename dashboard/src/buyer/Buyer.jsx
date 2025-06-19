import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, TextField, InputAdornment, IconButton, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavbarBuyer from "./NavbarBuyer";
import axios from 'axios';
import Rating from '@mui/material/Rating';
import "../style/Buyer.css";

function Buyer() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then(res => {
      setProducts(res.data.filter(p => p.quantity > 0));
      const cats = Array.from(new Set(res.data.map(p => p.category).filter(Boolean)));
      setCategories(cats);
    });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product, qty) => {
    const existingIndex = cart.findIndex(item => item._id === product._id);
    let updatedCart;
    if (existingIndex !== -1) {
      const existing = cart[existingIndex];
      const newQty = Math.min(existing.quantity + qty, product.quantity);
      updatedCart = [...cart];
      updatedCart[existingIndex] = { ...existing, quantity: newQty };
    } else {
      updatedCart = [...cart, { ...product, quantity: qty }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSnackbarOpen(true);
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  return (
    <>
      <NavbarBuyer />
      <Box p={4} className="buyer-container">
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={3}
          justifyContent="center"
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ background: "#fff", borderRadius: 2 }}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            size="small"
            sx={{ minWidth: 140, background: "#fff", borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Grid container spacing={3} className="buyer-grid">
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id} className="buyer-grid-item">
              <Card className="buyer-card" onClick={() => handleOpenProduct(product)}>
                <CardMedia
                  component="img"
                  image={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="buyer-card-img"
                />
                <CardContent className="buyer-card-content">
                  <Typography variant="h6" className="buyer-product-name">{product.name}</Typography>
                  <Typography color="text.secondary" className="buyer-product-price">₱{product.price}</Typography>
                  {product.category && (
                    <Typography variant="caption" color="text.secondary">{product.category}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent className="buyer-dialog-content">
          {selectedProduct && (
            <>
              <img
                src={`http://localhost:5000${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="buyer-dialog-img-large"
              />
              <Typography variant="h6" className="buyer-dialog-name-small">
                {selectedProduct.name}
              </Typography>
              <Typography variant="subtitle1" className="buyer-dialog-price-small">
                ₱{selectedProduct.price}
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(
                  Math.max(1, Math.min(selectedProduct.quantity, parseInt(e.target.value) || 1))
                )}
                inputProps={{ min: 1, max: selectedProduct.quantity }}
                className="buyer-dialog-qty"
              />
              <Typography variant="body2" color="text.secondary" className="buyer-dialog-available-small">
                Available: {selectedProduct.quantity}
              </Typography>
              <Button
                variant="contained"
                color="success"
                disabled={quantity > selectedProduct.quantity}
                className="buyer-dialog-add-btn"
                onClick={() => {
                  handleAddToCart(selectedProduct, quantity);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </Button>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
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
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography variant="body2" sx={{ mr: 1 }}>Your Rating:</Typography>
                <Rating
                  name="user-rating"
                  value={
                    selectedProduct.ratings
                      ? (selectedProduct.ratings.find(r => r.user === (JSON.parse(localStorage.getItem("user"))?.username))?.value || 0)
                      : 0
                  }
                  onChange={async (e, newValue) => {
                    if (!newValue) return;
                    const user = JSON.parse(localStorage.getItem("user"))?.username;
                    await axios.post(`http://localhost:5000/products/${selectedProduct._id}/rate`, {
                      user,
                      value: newValue
                    });

                    const { data } = await axios.get(`http://localhost:5000/products`);
                    const updated = data.find(p => p._id === selectedProduct._id);
                    setSelectedProduct(updated);
                    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions className="buyer-dialog-actions">
          <Button variant="outlined" onClick={() => setSelectedProduct(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Buyer;
