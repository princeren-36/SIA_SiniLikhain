import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaEdit, FaSave, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaStar } from "react-icons/fa";
import { MdEmail, MdDescription, MdCloudUpload } from "react-icons/md";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
import { toast } from "react-toastify";
import cartBg from '../images/2.jpg';
import { API_BASE } from "../utils/api";

// Function to fetch statistics for a buyer
const fetchBuyerStatistics = async (buyerId) => {
  try {
    // Fetch all orders for this buyer
    console.log("Fetching orders for user:", buyerId);
    const ordersResponse = await axios.get(`${API_BASE}/orders?userId=${buyerId}`);
    console.log("Orders data received:", ordersResponse.data);
    
    // Count completed orders
    const completedOrders = ordersResponse.data?.filter(order => 
      order.status === "delivered" || order.status === "completed"
    ).length || 0;
    console.log("Completed orders count:", completedOrders);
    
    // Calculate total spent from all orders
    let totalSpent = 0;
    ordersResponse.data?.forEach(order => {
      // Use totalAmount since that's what's in the Order model
      totalSpent += order.totalAmount || 0;
    });
    console.log("Total spent:", totalSpent);
    
    // Fetch ratings given by the buyer
    const ratingsCount = await axios.get(`${API_BASE}/users/${buyerId}/ratings/count`)
      .then(res => res.data?.count || 0)
      .catch(err => {
        console.error("Error fetching ratings:", err);
        return 0;
      });
    
    return {
      completedOrders,
      totalSpent,
      ratingsCount
    };
  } catch (error) {
    console.error("Error fetching buyer statistics:", error);
    return {
      completedOrders: 0,
      totalSpent: 0,
      ratingsCount: 0
    };
  }
};

const BuyerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: null,
    location: "",
    joined: "",
    statistics: {
      completedOrders: 0,
      totalSpent: 0,
      ratingsCount: 0
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState(null);
  
  // Get user ID from localStorage or sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get user data from storage
        const userStorage = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!userStorage) {
          console.warn("No user found in storage");
          setIsLoading(false);
          return;
        }
        
        const userData = JSON.parse(userStorage);
        if (userData && userData._id) {
          setUserId(userData._id);
          
          // Pre-populate profile data from local storage while waiting for API response
          setProfileData(prevData => ({
            ...prevData,
            name: userData.username || prevData.name,
            email: userData.email || prevData.email,
            bio: userData.bio || prevData.bio,
            location: userData.location || prevData.location,
            avatar: userData.avatar || prevData.avatar,
          }));
        } else {
          console.warn("User found but missing _id field", userData);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Error loading user data:", e);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Fetch profile data from API when userId is available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Try to fetch user data from server
        const response = await axios.get(`${API_BASE}/users/${userId}`).catch(error => {
          console.warn("API not available, using fallback data");
          throw error;
        });
        
        // Fetch real-time statistics
        let stats = {
          completedOrders: 0,
          totalSpent: 0,
          ratingsCount: 0
        };
        
        try {
          stats = await fetchBuyerStatistics(userId);
        } catch (statsError) {
          console.warn("Could not fetch statistics, using fallback data", statsError);
        }
        
        if (response && response.data) {
          // Format the date
          const dateStr = response.data.joinedAt || response.data.createdAt;
          let formattedDate;
          try {
            formattedDate = dateStr ? new Date(dateStr).toISOString().split('T')[0] : "N/A";
          } catch (dateError) {
            console.warn("Invalid date format from API", dateStr);
            formattedDate = "N/A";
          }
          
          // Update profile data from API response with real-time statistics
          setProfileData({
            name: response.data.username || response.data.name,
            email: response.data.email,
            bio: response.data.bio || "Share a bit about yourself as a buyer on SiniLikhain.",
            avatar: response.data.avatar,
            location: response.data.location || "Philippines",
            joined: formattedDate,
            statistics: stats
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data from API:", error);
        toast.info("Using locally stored profile data");
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = async () => {
    setIsSaving(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("username", profileData.name);
      formData.append("email", profileData.email);
      formData.append("bio", profileData.bio);
      formData.append("location", profileData.location);
      
      // Only append image if a new one is selected
      if (imageFile) {
        formData.append("avatar", imageFile);
      }
      
      // Make API call to update profile
      const response = await axios.put(`${API_BASE}/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response && response.data) {
        console.log("Profile update response:", response.data);
        
        // Get updated data from response
        const updatedAvatar = response.data.avatar || null;
        const updatedUsername = response.data.username || profileData.name;
        const updatedEmail = response.data.email || profileData.email;
        const updatedBio = response.data.bio || profileData.bio;
        const updatedLocation = response.data.location || profileData.location;
        
        // Update profile data state with server response
        setProfileData(prevData => ({
          ...prevData,
          avatar: updatedAvatar,
          name: updatedUsername,
          email: updatedEmail,
          bio: updatedBio,
          location: updatedLocation
        }));
        
        // Reset image preview and file
        setImagePreview(null);
        setImageFile(null);
        
        // Update local storage with new data
        try {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            
            // Update user data in storage
            user.username = updatedUsername;
            user.email = updatedEmail;
            user.bio = updatedBio;
            user.location = updatedLocation;
            
            // Update avatar if provided in response
            if (updatedAvatar) {
              user.avatar = updatedAvatar;
            }
            
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(user));
            
            // Debug: Log updated user data
            console.log("Updated storage with user data:", user);
          }
        } catch (storageError) {
          console.error("Failed to update profile in storage:", storageError);
        }
        
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancelClick = () => {
    // Reset any changes
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfileData(prevData => ({
          ...prevData,
          name: user.username || prevData.name,
          email: user.email || prevData.email,
          bio: user.bio || prevData.bio,
          location: user.location || prevData.location,
        }));
      } catch (e) {
        console.error("Error resetting profile data:", e);
      }
    }
    
    // Reset image preview
    setImagePreview(null);
    setImageFile(null);
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      toast.info('Image selected. Click Save to upload.');
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Format statistics for display
  const formattedStatistics = {
    completedOrders: profileData.statistics.completedOrders || 0,
    totalSpent: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(profileData.statistics.totalSpent || 0),
    ratingsCount: profileData.statistics.ratingsCount || 0
  };
  
  return (
    <>
      <NavbarBuyer />
      <div className="min-h-screen bg-[#f5f7fa]">
        <div className="relative w-full overflow-hidden" style={{height: "200px"}}>
          <img 
            src={cartBg} 
            alt="Profile banner" 
            className="w-full h-full object-cover"
            style={{opacity: 0.8}}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider drop-shadow-lg">
              Buyer Profile
            </h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e503f]"></div>
              </div>
            ) : (
              <>
                {/* Header with avatar */}
                <div className="relative bg-[#5e503f] text-white p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative mb-2 sm:mb-0">
                      {imagePreview || profileData.avatar ? (
                        <img 
                          src={imagePreview || (profileData.avatar.startsWith('http') 
                            ? profileData.avatar 
                            : `${API_BASE}${profileData.avatar}`)} 
                          alt="User avatar" 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          onError={(e) => {
                            console.log("Image failed to load:", e.target.src);
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Profile";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 flex items-center justify-center">
                          <FaUserCircle className="text-gray-500 text-4xl sm:text-5xl" />
                        </div>
                      )}
                      {isEditing && (
                        <button 
                          className="absolute bottom-0 right-0 bg-white text-[#5e503f] rounded-full p-1 shadow-md"
                          onClick={triggerFileInput}
                          aria-label="Change profile picture"
                        >
                          <FaEdit className="text-lg" />
                          <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </button>
                      )}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
                        {isEditing ? (
                          <input 
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="w-full sm:w-auto bg-white/20 border border-white/30 rounded px-2 py-1 text-white focus:outline-none focus:border-white"
                            aria-label="Full Name"
                          />
                        ) : (
                          profileData.name
                        )}
                      </h2>
                      <p className="flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
                        <MdEmail className="flex-shrink-0" />
                        {isEditing ? (
                          <input 
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="w-full sm:w-auto bg-white/20 border border-white/30 rounded px-2 py-1 text-white focus:outline-none focus:border-white"
                            aria-label="Email address"
                          />
                        ) : (
                          <span className="break-all">{profileData.email}</span>
                        )}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      {isEditing ? (
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center">
                          <button 
                            onClick={handleSaveClick}
                            disabled={isSaving}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-150"
                          >
                            {isSaving ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <FaSave />
                                Save
                              </>
                            )}
                          </button>
                          <button 
                            onClick={handleCancelClick}
                            disabled={isSaving}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-150"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={handleEditClick}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-150"
                        >
                          <FaEdit />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#5e503f] flex items-center gap-2">
                        <MdDescription className="flex-shrink-0" />
                        About Me
                      </h3>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5e503f] text-gray-700"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-gray-700 whitespace-pre-wrap break-words">{profileData.bio || "No bio information provided yet."}</p>
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <FaMapMarkerAlt className="text-[#5e503f] flex-shrink-0" />
                          <span className="font-medium text-gray-700">Location:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className="flex-grow border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5e503f]"
                            />
                          ) : (
                            <span className="text-gray-600">{profileData.location}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <FaCalendarAlt className="text-[#5e503f] flex-shrink-0" />
                          <span className="font-medium text-gray-700">Member since:</span>
                          <span className="text-gray-600">{profileData.joined}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-2 text-[#5e503f]">Your Stats</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-[#f5eee6] p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 text-center">
                          <FaShoppingBag className="text-[#5e503f] text-2xl mx-auto mb-2" />
                          <p className="text-gray-700 font-medium text-sm">Orders</p>
                          <p className="text-xl font-bold text-[#5e503f]">{formattedStatistics.completedOrders}</p>
                        </div>
                        <div className="bg-[#f5eee6] p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5e503f] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-700 font-medium text-sm">Spent</p>
                          <p className="text-xl font-bold text-[#5e503f] truncate" title={formattedStatistics.totalSpent}>
                            {formattedStatistics.totalSpent}
                          </p>
                        </div>
                        <div className="bg-[#f5eee6] p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 text-center">
                          <FaStar className="text-[#5e503f] text-2xl mx-auto mb-2" />
                          <p className="text-gray-700 font-medium text-sm">Ratings Given</p>
                          <p className="text-xl font-bold text-[#5e503f]">{formattedStatistics.ratingsCount}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-[#f5eee6] p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-[#5e503f] mb-2">Quick Links</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <a href="/cart" className="text-[#5e503f] hover:text-[#bfa181] transition-colors flex items-center gap-1 p-2 hover:bg-white/50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l2-9" />
                            </svg>
                            <span>View My Cart</span>
                          </a>
                          <a href="/orders" className="text-[#5e503f] hover:text-[#bfa181] transition-colors flex items-center gap-1 p-2 hover:bg-white/50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>My Orders</span>
                          </a>
                          <a href="/buyer" className="text-[#5e503f] hover:text-[#bfa181] transition-colors flex items-center gap-1 p-2 hover:bg-white/50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Browse Products</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerProfile;
