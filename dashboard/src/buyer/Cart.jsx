import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, Snackbar, Alert, TextField } from "@mui/material";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function Cart() {
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const navigate = useNavigate ? useNavigate() : () => {};

  const calculateCartTotal = (currentCart) => {
    return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  useEffect(() => {
    const fetchCartWithQuantities = async () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (storedCart.length === 0) {
        setCart([]);
        return;
      }
      try {
        const { data: products } = await axios.get("http://localhost:5000/products");
        const updatedCart = storedCart.map(item => {
          const prod = products.find(p => p._id === item._id);
          const safeQuantity = prod ? Math.min(item.quantity, prod.quantity) : item.quantity;
          return prod
            ? { ...item, maxQuantity: prod.quantity, quantity: safeQuantity }
            : { ...item, maxQuantity: item.quantity };
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        setCart(storedCart);
      }
    };
    fetchCartWithQuantities();
  }, []);

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const maxQty = item.maxQuantity || 1;
    let newQty = Number(value);
    if (isNaN(newQty) || newQty < 1) {
      newQty = 1;
    } else if (newQty > maxQty) {
      newQty = maxQty;
    }
    item.quantity = newQty;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleBuy = async () => {
    const user = getCurrentUser();
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    try {
      const itemsToPurchase = cart.filter(item => item.quantity > 0);
      if (itemsToPurchase.length === 0) {
        alert("Your cart is empty. Add items before purchasing.");
        return;
      }
      await axios.post("http://localhost:5000/products/buy", { cart: itemsToPurchase });
      setCart([]);
      localStorage.removeItem("cart");
      setSnackbarOpen(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Purchase failed: ${error.response.data.message}`);
      } else {
        alert("Purchase failed. Please try again.");
      }
    }
  };

  return (
    <>
      <NavbarBuyer />
      <Box p={4} className="buyer-container" style={{ Height: '120vh' , overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom className="buyer-title">
          My Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          <>
            <Grid container spacing={3} className="buyer-grid">
              {cart.map((product, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx} className="buyer-grid-item">
                  <Card className="buyer-card" sx={{ maxWidth: 300, mx: 'auto' }} style={{ width: '100%' ,height: '100%'}}> 
                    <CardMedia
                      component="img"
                      image={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="buyer-card-img"
                      sx={{ height: 180, objectFit: 'cover' }} 
                    />
                    <CardContent className="buyer-card-content">
                      <Typography variant="h6" className="buyer-product-name">{product.name}</Typography>
                      <Typography color="text.secondary" className="buyer-product-price">
                        Price: ₱{product.price}
                      </Typography>
                      <Typography color="text.primary" variant="body1" sx={{ fontWeight: 'bold' }}>
                        Item Total: ₱{(product.price * product.quantity).toFixed(2)}
                      </Typography>
                      <Box mt={1} display="flex" alignItems="center" justifyContent="center">
                        <TextField
                          label="Qty"
                          type="number"
                          size="small"
                          value={product.quantity}
                          onChange={e => handleQuantityChange(idx, e.target.value)}
                          inputProps={{
                            min: 1,
                            max: product.maxQuantity || 1,
                            style: { textAlign: "center", width: 80 }
                          }}
                          className="cart-qty-input"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          / {product.maxQuantity || 1} available
                        </Typography>
                      </Box>
                    </CardContent>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleRemove(idx)}
                    >
                      Remove
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" style={{ marginBottom: '50px' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }} style={{ fontWeight: 'bold', color: '#1b2a41' }}>
                Grand Total: ₱{calculateCartTotal(cart)}
              </Typography>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleBuy}
              >
                Buy Now
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Purchase successful!
        </Alert>
      </Snackbar>
      <Dialog open={loginPromptOpen} onClose={() => setLoginPromptOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>You must be logged in to buy products. Do you want to log in now?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginPromptOpen(false)} color="inherit">No</Button>
          <Button onClick={() => { setLoginPromptOpen(false); navigate('/Login'); }} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Cart;
