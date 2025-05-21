import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, Snackbar, Alert, TextField } from "@mui/material";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch latest product quantities and update cart on mount
  useEffect(() => {
    const fetchCartWithQuantities = async () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (storedCart.length === 0) {
        setCart([]);
        return;
      }
      // Fetch all products from server
      const { data: products } = await axios.get("http://localhost:5000/products");
      // Map cart items to include latest quantity as maxQuantity
      const updatedCart = storedCart.map(item => {
        const prod = products.find(p => p._id === item._id);
        return prod
          ? { ...item, maxQuantity: prod.quantity }
          : { ...item, maxQuantity: item.quantity }; // fallback if product not found
      });
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
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
    const maxQty = updatedCart[index].maxQuantity || 1;
    const newQty = Math.max(1, Math.min(Number(value) || 1, maxQty));
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleBuy = async () => {
    try {
      await axios.post("http://localhost:5000/products/buy", { cart });
      setCart([]);
      localStorage.removeItem("cart");
      setSnackbarOpen(true);
    } catch {
      alert("Purchase failed.");
    }
  };

  return (
    <>
      <NavbarBuyer />
      <Box p={4} className="buyer-container">
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
                  <Card className="buyer-card">
                    <CardMedia
                      component="img"
                      image={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="buyer-card-img"
                    />
                    <CardContent className="buyer-card-content">
                      <Typography variant="h6" className="buyer-product-name">{product.name}</Typography>
                      <Typography color="text.secondary" className="buyer-product-price">₱{product.price}</Typography>
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
                            style: { textAlign: "center", width: 50 }
                          }}
                          className="cart-qty-input"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          / {product.maxQuantity || 1}
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
            <Box mt={4} display="flex" justifyContent="center">
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
    </>
  );
}

export default Cart;