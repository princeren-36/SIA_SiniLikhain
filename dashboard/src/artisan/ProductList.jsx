import React from "react";
import ArtisanLayout from "./ArtisanLayout";

const ProductList = () => (
  <ArtisanLayout>
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Product List</h2>
      <p className="text-white">
        Here are your products.
      </p>
      {/* List of products would go here */}
    </div>
  </ArtisanLayout>
);

export default ProductList;
