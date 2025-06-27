import React from "react";

function ArtisanDashboard({ user, stats, fetchSalesData, fetchMarketInsights, setActiveTab, navigate }) {
  return (
    <div className="text-gray-800 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-md transition-transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-[source-code-pro,monospace] text-blue-800">Total Products</h3>
            <span className="text-2xl opacity-80">🏺</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          <p className="text-sm text-blue-700 mt-2">Items in your portfolio</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-md transition-transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-[source-code-pro,monospace] text-green-800">Approved</h3>
            <span className="text-2xl opacity-80">✓</span>
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-sm text-green-700 mt-2">Products available to buyers</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 shadow-md transition-transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-[source-code-pro,monospace] text-yellow-800">Pending</h3>
            <span className="text-2xl opacity-80">⏳</span>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-700 mt-2">Awaiting approval</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-md transition-transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-[source-code-pro,monospace] text-orange-800">Low Stock</h3>
            <span className="text-2xl opacity-80">⚠️</span>
          </div>
          <p className="text-3xl font-bold text-orange-700">{stats.lowStock}</p>
          <p className="text-sm text-orange-700 mt-2">Items with quantity &lt; 5</p>
        </div>
      </div>
      {/* Account Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-[source-code-pro,monospace] text-gray-800">Account Information</h3>
            <button 
              onClick={() => {/* Future functionality to edit profile */}}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Edit Profile
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col p-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm font-[source-code-pro,monospace]">Username</span>
              <span className="font-medium mt-1 text-gray-900">{user?.username}</span>
            </div>
            <div className="flex flex-col p-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm font-[source-code-pro,monospace]">Email</span>
              <span className="font-medium mt-1 text-gray-900">{user?.email}</span>
            </div>
            <div className="flex flex-col p-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm font-[source-code-pro,monospace]">Phone</span>
              <span className="font-medium mt-1 text-gray-900">{user?.phone}</span>
            </div>
            <div className="flex flex-col p-3">
              <span className="text-gray-600 text-sm font-[source-code-pro,monospace]">Account Type</span>
              <span className="font-medium mt-1 bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded-full text-sm">Artisan</span>
            </div>
          </div>
        </div>
        {/* Recent Activity / Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-[source-code-pro,monospace] mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate("/AddProduct")}
              className="py-4 px-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex flex-col items-center text-center text-blue-800 border border-blue-200"
            >
              <span className="text-2xl mb-2">✚</span>
              <span className="font-[source-code-pro,monospace] text-sm">Add New Product</span>
            </button>
            <button 
              onClick={() => setActiveTab("inventory")}
              className="py-4 px-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 flex flex-col items-center text-center text-green-800 border border-green-200"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="font-[source-code-pro,monospace] text-sm">View Inventory</span>
            </button>
            <button 
              onClick={fetchSalesData}
              className="py-4 px-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 flex flex-col items-center text-center text-purple-800 border border-purple-200"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="font-[source-code-pro,monospace] text-sm">Sales Reports</span>
            </button>
            <button 
              onClick={fetchMarketInsights}
              className="py-4 px-6 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-200 flex flex-col items-center text-center text-amber-800 border border-amber-200"
            >
              <span className="text-2xl mb-2">🔍</span>
              <span className="font-[source-code-pro,monospace] text-sm">Market Insights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtisanDashboard;
