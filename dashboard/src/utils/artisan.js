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
