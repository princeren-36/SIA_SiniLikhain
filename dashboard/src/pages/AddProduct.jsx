import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Grid, TextField, Box, CardMedia } from "@mui/material";
import Navbar from "./Navbar";

// Example of some initial products with placeholder image URLs
const initialProducts = [
  { 
    id: 1, 
    name: "Handmade Vase", 
    price: "$25", 
    image: "../src/images/vase.jpg" // Placeholder image URL
  },
  { 
    id: 2, 
    name: "Wooden Bowl", 
    price: "$30", 
    image: "../src/images/bowl.jpg"
  },
  { 
    id: 3, 
    name: "Woven Basket", 
    price: "$20", 
    image: "../src/images/basket.jpg"
  },
];

function AddProduct() {
  const [products, setProducts] = useState(initialProducts); // Store the products
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" }); // State for new product form
  const [editingProduct, setEditingProduct] = useState(null); // For editing a product
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create local image URL
      setImagePreview(imageUrl);
      setNewProduct((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.image) {
      const newId = products.length + 1;
      setProducts((prev) => [
        ...prev,
        { id: newId, name: newProduct.name, price: newProduct.price, image: newProduct.image },
      ]);
      setNewProduct({ name: "", price: "", image: "" }); // Clear form after adding
      setImagePreview(null); // Clear image preview
    }
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setEditingProduct(productToEdit);
    setNewProduct({ name: productToEdit.name, price: productToEdit.price, image: productToEdit.image });
    setImagePreview(productToEdit.image); // Set image preview for editing
  };

  const handleSaveEdit = () => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProduct.id
          ? { ...product, name: newProduct.name, price: newProduct.price, image: newProduct.image }
          : product
      )
    );
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", image: "" });
    setImagePreview(null); // Clear image preview after saving
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 3 }}>
        <h1>Our Products</h1>

        <Box sx={{ marginBottom: 4 }}>
          <TextField
            label="Product Name"
            variant="outlined"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            sx={{ marginRight: 2 }}
          />
          <TextField
            label="Product Price"
            variant="outlined"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            sx={{ marginRight: 2 }}
          />

          {/* Image upload field */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: "20px", marginRight: "20px" }}
          />

          {imagePreview && (
            <Box sx={{ marginBottom: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={editingProduct ? handleSaveEdit : handleAddProduct}
          >
            {editingProduct ? "Save Changes" : "Add Product"}
          </Button>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                {/* Product Image */}
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="200" // Fixed height for the image
                  image={product.image}
                  title={product.name}
                  sx={{
                    width: "100%", // Ensure image takes full width of its container
                    objectFit: "cover",
                    height: 200,
                  }}
                />
                <CardContent>
                  <Typography variant="h5">{product.name}</Typography>
                  <Typography variant="h6">{product.price}</Typography>
                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                      sx={{ marginLeft: 2 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default AddProduct;
