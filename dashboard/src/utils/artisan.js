import axios from "axios";
import { API_BASE } from "./api";

/**
 * Fetch all products for a given artisan username.
 * @param {string} artisanUsername
 * @returns {Promise<Array>} Array of products
 */
export async function getArtisanProducts(artisanUsername) {
  if (!artisanUsername) return [];
  try {
    const res = await axios.get(`${API_BASE}/products`);
    // Filter products by artisan username (as in ArtisanDashboard)
    return res.data.filter(p => p.artisan === artisanUsername);
  } catch (e) {
    console.error("Error fetching artisan products:", e);
    return [];
  }
}

/**
 * Fetch sold products count data for a given artisan's products.
 * @param {string} artisanUsername
 * @returns {Promise<Object>} Map of product IDs to sold quantities
 */
export async function getProductSoldCounts(artisanUsername) {
  if (!artisanUsername) return {};
  try {
    // Fetch all orders for this artisan
    const res = await axios.get(`${API_BASE}/orders/artisan/${artisanUsername}`);
    const orders = res.data;
    
    // Create a map to count sold quantities by product ID
    const soldCounts = {};
    
    // Process all orders to count sold items
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Handle both string IDs and object IDs
          let productId = item.productId;
          if (typeof productId === 'object' && productId !== null) {
            productId = productId.toString();
          }
          
          if (productId) {
            soldCounts[productId] = (soldCounts[productId] || 0) + (parseInt(item.quantity) || 0);
          }
        });
      }
    });
    
    console.log("Product sold counts:", soldCounts);
    return soldCounts;
  } catch (e) {
    console.error("Error fetching product sold counts:", e);
    return {};
  }
}

/**
 * Calculate the average buyer rating for an artisan's products.
 * @param {Array} products - Array of product objects
 * @returns {number} average rating (rounded to 1 decimal)
 */
export function getAverageBuyerRating(products) {
  let total = 0;
  let count = 0;
  products.forEach(product => {
    if (Array.isArray(product.ratings)) {
      product.ratings.forEach(r => {
        if (typeof r.value === 'number') {
          total += r.value;
          count++;
        }
      });
    }
  });
  return count > 0 ? parseFloat((total / count).toFixed(1)) : 0;
}

/**
 * Fetch recent orders for a given artisan username.
 * @param {string} artisanUsername - The username of the artisan
 * @param {number} limit - Maximum number of orders to return
 * @returns {Promise<Array>} Array of recent orders with products sold
 */
export async function getRecentArtisanSales(artisanUsername, limit = 5) {
  if (!artisanUsername) return [];
  try {
    // Fetch all orders for this artisan
    const res = await axios.get(`${API_BASE}/orders/artisan/${artisanUsername}`);
    const orders = res.data;
    
    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Get most recent orders up to the limit
    const recentOrders = sortedOrders.slice(0, limit);
    
    // Extract the sold items from each order
    const recentSales = recentOrders.flatMap(order => {
      // Format date
      const orderDate = new Date(order.createdAt);
      const formattedDate = orderDate.toLocaleDateString();
      
      // Map each item in the order to a sale record
      return order.items.map(item => ({
        orderId: order._id,
        orderDate: formattedDate,
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        buyerUsername: order.userId?.username || 'Unknown'
      }));
    });
    
    return recentSales;
  } catch (e) {
    console.error("Error fetching recent artisan sales:", e);
    return [];
  }
}
