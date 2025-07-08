import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaEdit, FaSave, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaStar, FaTrash } from "react-icons/fa";
import { MdEmail, MdDescription, MdCloudUpload } from "react-icons/md";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
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
    
    // Fetch ratings given by the buyer (as rater)
    const ratingsGivenResponse = await axios.get(`${API_BASE}/ratings?buyerId=${buyerId}`);
    const ratingsGiven = Array.isArray(ratingsGivenResponse.data) ? ratingsGivenResponse.data.length : 0;
    
    return {
      completedOrders,
      totalSpent,
      ratingsCount: ratingsGiven
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
    imageRemoved: false,
    imageChanged: false,
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
        // Removed alert for using locally stored profile data
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
  
  // Helper to get the correct avatar URL
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
    return avatar;
  }
  // Remove any leading 'uploads/' or '/uploads/'
  const clean = avatar.replace(/^[/]*uploads[/]*/i, '');
  return `${API_BASE}/uploads/${clean}`;
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
      
      // Handle avatar changes
      if (imageFile) {
        formData.append("avatar", imageFile);
        console.log("Adding new avatar to form data");
      }
      
      // Check if image was removed
      if (profileData.imageRemoved) {
        formData.append("removeAvatar", "true");
        console.log("Marking avatar for removal");
      }
      
      // Make API call to update profile
      const response = await axios.put(`${API_BASE}/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response && response.data) {
        console.log("Profile update response:", response.data);
        
        // Always use the new avatar from the response
        const updatedAvatar = response.data.avatar || null;
        setProfileData(prev => ({
          ...prev,
          avatar: updatedAvatar,
          name: response.data.username || prev.name,
          email: response.data.email || prev.email,
          bio: response.data.bio || prev.bio,
          location: response.data.location || prev.location,
          imageRemoved: false,
          imageChanged: false
        }));
        setImagePreview(null);
        setImageFile(null);
        try {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            user.username = response.data.username || user.username;
            user.email = response.data.email || user.email;
            user.bio = response.data.bio || user.bio;
            user.location = response.data.location || user.location;
            user.avatar = updatedAvatar;
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(user));
          }
        } catch (storageError) {
          console.error("Failed to update profile in storage:", storageError);
        }
        alert("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
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
          avatar: user.avatar || prevData.avatar,
          imageRemoved: false,
          imageChanged: false
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
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Don't show alert, give visual feedback instead
      setProfileData(prevData => ({
        ...prevData,
        imageChanged: true
      }));
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const removeProfilePicture = () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      setImagePreview(null);
      setImageFile(null);
      setProfileData(prevData => ({
        ...prevData,
        avatar: null,
        imageRemoved: true
      }));
      
      if (isEditing) {
        // If in edit mode, just mark for removal when saved
        console.log("Profile picture marked for removal on save");
      } else {
        // If not in edit mode, enter edit mode and mark for removal
        setIsEditing(true);
      }
    }
  };
  
  return (
    <div className="page" style={{ height: '100vh' }}>
      <NavbarBuyer />
      {/* Allow vertical scroll on the page and children */}
      <div className="min-h-screen h-screen bg-[#f8f9fa] w-full text-gray-900 flex flex-col">
        <div className="w-full flex-1 flex flex-col py-0 md:py-0">
          <div className="bg-white w-full px-0 flex-1 flex flex-col">
            <div className="bg-[#5e503f] w-full py-6 flex-shrink-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Buyer Profile
              </h1>
            </div>
            <div className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex justify-center items-center h-64 flex-1">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e503f]" />
                </div>
              ) : (
                <>
                  {/* User info header with controls */}
                  <div className="p-6 md:p-8 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* Profile Avatar Section */}
                      <div className="flex flex-col items-center md:items-start mr-0 md:mr-6">
                        <div className="relative group">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Profile Preview"
                              className="w-32 h-32 object-cover rounded-full border-4"
                              style={{ borderColor: '#5e503f', background: '#eae0d5' }}
                            />
                          ) : profileData.avatar ? (
                            <img
                              src={getAvatarUrl(profileData.avatar)}
                              alt="Profile"
                              className="w-32 h-32 object-cover rounded-full border-4"
                              style={{ borderColor: '#5e503f', background: '#eae0d5' }}
                            />
                          ) : (
                            <FaUserCircle className="w-32 h-32 text-[#5e503f] border-4 rounded-full" style={{ borderColor: '#5e503f', background: '#eae0d5' }} />
                          )}
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={triggerFileInput}
                                className="absolute bottom-2 right-2 p-2 rounded-full border-2 transition-colors"
                                title="Change profile picture"
                                style={{
                                  borderColor: '#fff',
                                  background: 'rgba(94,80,63,0.95)',
                                  color: '#fff',
                                  boxShadow: '0 2px 12px 0 rgba(94,80,63,0.25)'
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.background = '#eae0d5';
                                  e.currentTarget.style.color = '#5e503f';
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.background = 'rgba(94,80,63,0.95)';
                                  e.currentTarget.style.color = '#fff';
                                }}
                              >
                                <MdCloudUpload className="w-6 h-6" />
                              </button>
                              {(profileData.avatar || imagePreview) && (
                                <button
                                  type="button"
                                  onClick={removeProfilePicture}
                                  className="absolute bottom-2 left-2 p-2 rounded-full border-2 transition-colors"
                                  title="Remove profile picture"
                                  style={{
                                    borderColor: '#fff',
                                    background: 'rgba(185,28,28,0.95)',
                                    color: '#fff',
                                    boxShadow: '0 2px 12px 0 rgba(185,28,28,0.25)'
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = '#b91c1c';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.background = 'rgba(185,28,28,0.95)';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          ) : profileData.avatar && (
                            <button
                              type="button"
                              onClick={handleEditClick}
                              className="absolute bottom-2 right-2 p-2 rounded-full border-2 transition-colors"
                              title="Edit profile"
                              style={{
                                borderColor: '#fff',
                                background: 'rgba(94,80,63,0.95)',
                                color: '#fff',
                                boxShadow: '0 2px 12px 0 rgba(94,80,63,0.25)'
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.background = '#eae0d5';
                                e.currentTarget.style.color = '#5e503f';
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.background = 'rgba(94,80,63,0.95)';
                                e.currentTarget.style.color = '#fff';
                              }}
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <span className="mt-2 text-sm text-gray-600">Profile Photo</span>
                        {isEditing && (profileData.avatar || imagePreview) && (
                          <span className="mt-1 text-xs text-gray-500">Click to change or remove</span>
                        )}
                      </div>
                      {/* Name and Email fields */}
                      <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-[#5e503f]">
                          {isEditing ? (
                            <input 
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleInputChange}
                              className="w-full md:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5e503f] text-gray-900 bg-white placeholder-gray-700"
                              aria-label="Full Name"
                            />
                          ) : (
                            <span className="text-gray-900">{profileData.name}</span>
                          )}
                        </h2>
                        <p className="flex items-center justify-center md:justify-start gap-2 mt-2 flex-wrap">
                          <MdEmail className="flex-shrink-0 text-[#5e503f]" />
                          {isEditing ? (
                            <input 
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className="w-full md:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5e503f] text-gray-900 bg-white placeholder-gray-700"
                              aria-label="Email address"
                            />
                          ) : (
                            <span className="break-all text-gray-900">{profileData.email}</span>
                          )}
                        </p>
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex flex-wrap md:flex-nowrap gap-3 justify-center">
                            <button 
                              onClick={handleSaveClick}
                              disabled={isSaving}
                              className="flex items-center gap-2 bg-[#5e503f] hover:bg-[#4c4238] text-white px-6 py-2 rounded-md font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#5e503f] focus:ring-offset-2 shadow text-base"
                              style={{ color: '#fff', backgroundColor: '#5e503f', border: '1px solid #4c4238' }}
                            >
                              {isSaving ? (
                                <>
                                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                                  Saving...
                                </>
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
                              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 shadow text-base"
                              style={{ color: '#fff', backgroundColor: '#374151', border: '1px solid #111827' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={handleEditClick}
                            className="flex items-center gap-2 bg-[#5e503f] hover:bg-[#4c4238] text-white px-6 py-2 rounded-md font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#5e503f] focus:ring-offset-2 shadow text-base"
                            style={{ color: '#fff', backgroundColor: '#5e503f', border: '1px solid #4c4238' }}
                          >
                            <FaEdit />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="p-6 md:p-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left column - Bio and Location Info */}
                      <div className="md:col-span-1">
                        <h3 className="text-xl font-semibold mb-3 text-[#5e503f] flex items-center gap-2">
                          <MdDescription className="flex-shrink-0" />
                          About Me
                        </h3>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#5e503f] text-gray-700"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-700 whitespace-pre-wrap break-words">{profileData.bio || "No bio information provided yet."}</p>
                          </div>
                        )}
                        
                        <div className="mt-6 space-y-3">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-[#5e503f] flex-shrink-0" />
                            <span className="font-medium text-gray-700">Location:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                name="location"
                                value={profileData.location}
                                onChange={handleInputChange}
                                className="flex-grow border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5e503f]"
                              />
                            ) : (
                              <span className="text-gray-600">{profileData.location}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <FaCalendarAlt className="text-[#5e503f] flex-shrink-0" />
                            <span className="font-medium text-gray-700">Member since:</span>
                            <span className="text-gray-600">{profileData.joined || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Center + Right columns - Quick Links only */}
                      <div className="md:col-span-2">
                        <div className="bg-[#f5eee6] p-5 rounded-lg shadow">
                          <h4 className="font-semibold text-lg text-[#5e503f] mb-3">Quick Links</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a href="/cart" className="text-[#5e503f] hover:text-[#bfa181] transition-colors flex items-center gap-2 p-3 hover:bg-white/60 rounded-md border border-[#e0d6c3] bg-white/80 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l2-9" />
                              </svg>
                              <span className="font-medium">View My Cart</span>
                            </a>
                            <a href="/buyer" className="text-[#5e503f] hover:text-[#bfa181] transition-colors flex items-center gap-2 p-3 hover:bg-white/60 rounded-md border border-[#e0d6c3] bg-white/80 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 01-2-2v2m0 0h18" />
                              </svg>
                              <span className="font-medium">Browse Products</span>
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
      </div>
    </div>
  );
};

export default BuyerProfile;
