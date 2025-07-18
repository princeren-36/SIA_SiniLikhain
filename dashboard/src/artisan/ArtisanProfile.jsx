import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaEdit, FaSave, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaStar } from "react-icons/fa";
import { MdEmail, MdDescription, MdCloudUpload } from "react-icons/md";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { getArtisanProducts, getAverageBuyerRating } from "../utils/artisan";

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
import { toast } from "react-toastify";
import cartBg from '../images/2.jpg';

// Function to fetch statistics for an artisan
const fetchArtisanStatistics = async (artisanId, artisanUsername) => {
  try {
    // Fetch products created by this artisan (by username for consistency)
    const products = await getArtisanProducts(artisanUsername);
    const totalProducts = products.length;
    
    // Calculate average buyer rating (across all product ratings)
    const averageRating = getAverageBuyerRating(products);
    
    // Fetch completed sales (still by artisanId)
    const completedOrdersResponse = await api.get(`/orders?artisanId=${artisanId}&status=delivered`);
    const salesCompleted = completedOrdersResponse.data?.length || 0;
    
    // Fetch total orders count
    const totalOrdersResponse = await api.get(`/orders/artisan/${artisanId}`);
    const totalOrders = totalOrdersResponse.data?.length || 0;
    
    return {
      totalProducts,
      averageRating,
      salesCompleted,
      totalOrders
    };
  } catch (error) {
    console.error("Error fetching artisan statistics:", error);
    return {
      totalProducts: 0,
      averageRating: 0,
      salesCompleted: 0
    };
  }
};

const ArtisanProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: null,
    location: "",
    joined: "",
    statistics: {
      totalProducts: 0,
      averageRating: 0,
      salesCompleted: 0,
      totalOrders: 0
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const avatarFileInputRef = useRef(null);
  
  // Get user ID and username from localStorage or sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStorage = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!userStorage) {
          setIsLoading(false);
          return;
        }
        const userData = JSON.parse(userStorage);
        if (userData && userData._id) {
          setUserId(userData._id);
          setUsername(userData.username);
          setProfileData(prevData => ({
            ...prevData,
            name: userData.username || prevData.name,
            email: userData.email || prevData.email,
            bio: userData.bio || prevData.bio,
            location: userData.location || prevData.location,
            avatar: userData.avatar || prevData.avatar,
          }));
        } else {
          setIsLoading(false);
          setProfileData({
            name: userData?.username || "Artisan Name",
            email: userData?.email || "artisan@email.com",
            bio: userData?.bio || "This is your artisan profile. Update your information to let buyers know more about you and your craft!",
            avatar: userData?.avatar || null,
            location: userData?.location || "Philippines",
            joined: "2024-01-01",
            statistics: {
              totalProducts: userData?.statistics?.totalProducts || 24,
              averageRating: userData?.statistics?.averageRating || 4.8,
              salesCompleted: userData?.statistics?.salesCompleted || 152,
              totalOrders: userData?.statistics?.totalOrders || 180
            }
          });
        }
      } catch (e) {
        setIsLoading(false);
      }
    };
    
    // Execute immediately for faster UI update
    loadUserData();
  }, []);

  // Fetch profile data from API when userId and username are available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || !username) return;
      
      setIsLoading(true);
      try {
        // Try to fetch user data from server
        const response = await api.get(`/users/profile/${userId}`).catch(error => {
          throw error;
        });
        
        // Fetch real-time statistics (even if profile API fails)
        let stats = {
          totalProducts: 0,
          averageRating: 0,
          salesCompleted: 0,
          totalOrders: 0
        };
        
        try {
          stats = await fetchArtisanStatistics(userId, username);
        } catch (statsError) {
          console.warn("Could not fetch statistics, using fallback data", statsError);
        }
        
        if (response && response.data) {
          // Format the date
          const dateStr = response.data.joined;
          let formattedDate;
          try {
            formattedDate = new Date(dateStr).toISOString().split('T')[0];
          } catch (dateError) {
            console.warn("Invalid date format from API", dateStr);
            formattedDate = "N/A";
          }
          
          // Update profile data from API response with real-time statistics
          setProfileData({
            name: response.data.name,
            email: response.data.email,
            bio: response.data.bio || "This is your artisan profile. Update your information to let buyers know more about you and your craft!",
            avatar: response.data.avatar,
            location: response.data.location || "Philippines",
            joined: formattedDate,
            statistics: stats
          });
          
          // Update the user's statistics in local storage as well
          try {
            const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              user.statistics = stats;
              const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
              storage.setItem("user", JSON.stringify(user));
            }
          } catch (storageError) {
            console.error("Failed to update statistics in storage:", storageError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile data from API:", error);
        toast.info("Using locally stored profile data");
        
        // Try to fetch real-time statistics even if profile API fails
        let stats = {
          totalProducts: 0,
          averageRating: 0,
          salesCompleted: 0,
          totalOrders: 0
        };
        
        try {
          stats = await fetchArtisanStatistics(userId, username);
        } catch (statsError) {
          console.warn("Could not fetch statistics, using fallback data", statsError);
        }
        
        // Fallback to local storage data
        try {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            
            // Update the user's statistics in local storage
            if (stats.totalProducts > 0 || stats.averageRating > 0 || stats.salesCompleted > 0) {
              user.statistics = stats;
              const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
              storage.setItem("user", JSON.stringify(user));
            }
            
            setProfileData(prev => ({
              ...prev,
              name: user.username || prev.name || "Artisan Name",
              email: user.email || prev.email || "artisan@email.com",
              bio: user.bio || prev.bio || "This is your artisan profile. Update your information to let buyers know more about you and your craft!",
              location: user.location || prev.location || "Philippines",
              avatar: user.avatar || prev.avatar || null,
              joined: user.joined ? new Date(user.joined).toISOString().split('T')[0] : "2024-01-01",
              statistics: stats.totalProducts > 0 || stats.averageRating > 0 || stats.salesCompleted > 0 
                ? stats 
                : {
                    totalProducts: user.statistics?.totalProducts || prev.statistics?.totalProducts || 0,
                    averageRating: user.statistics?.averageRating || prev.statistics?.averageRating || 0,
                    salesCompleted: user.statistics?.salesCompleted || prev.statistics?.salesCompleted || 0,
                    totalOrders: user.statistics?.totalOrders || prev.statistics?.totalOrders || 0
                  }
            }));
          }
        } catch (storageError) {
          console.error("Failed to parse user from storage:", storageError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, username]);

  // Fetch statistics from the server
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!userId || !username) return;
      
      try {
        const statistics = await fetchArtisanStatistics(userId, username);
        setProfileData(prevData => ({
          ...prevData,
          statistics
        }));
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [userId, username]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Handle image upload if there's a new image
      let avatarUrl = profileData.avatar;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
          // Upload the image
          const uploadResponse = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/products/upload`, 
            formData, 
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          if (uploadResponse.data && uploadResponse.data.url) {
            avatarUrl = uploadResponse.data.url;
          } else {
            toast.warning("Could not upload profile image. Profile will be updated without the new image.");
          }
        } catch (uploadError) {
          console.error("Failed to upload profile image:", uploadError);
          toast.warning("Could not upload profile image. Profile will be updated without the new image.");
        }
      }
      
      // Always update local storage first for immediate feedback
      const updateLocalStorage = () => {
        try {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (!userStr) return false;
          
          const user = JSON.parse(userStr);
          // Update profile fields
          user.bio = profileData.bio;
          user.location = profileData.location;
          user.username = profileData.name;
          
          // Only update avatar if we have a new image
          if (avatarUrl) {
            user.avatar = avatarUrl;
            user.profileImage = avatarUrl;
          }
          
          // Store back in the same storage
          const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
          storage.setItem("user", JSON.stringify(user));
          
          // Dispatch event to notify NavbarArtisan
          window.dispatchEvent(new Event('profileUpdated'));
          
          return true;
        } catch (storageError) {
          console.error("Failed to update local storage:", storageError);
          return false;
        }
      };
      
      // Update local storage right away for immediate feedback
      const localUpdateSuccess = updateLocalStorage();
      
      // Prepare data to send to the server
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        avatar: avatarUrl
      };
      
      // Try to make API call
      const response = await api.put(`/users/profile/${userId}`, updateData)
        .catch(error => {
          console.warn("API not available, using local storage only");
          throw error; // Re-throw to be caught by outer catch
        });
      
      if (response && response.data) {
        // Server update successful
        toast.success("Profile updated successfully");
        
        // Clear image states
        setImageFile(null);
        setImagePreview(null);
        
        // Update profileData with the new avatar URL
        setProfileData(prev => ({
          ...prev,
          avatar: avatarUrl
        }));
        
        // Dispatch event again to ensure UI is updated
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        // Response empty but no error
        if (localUpdateSuccess) {
          toast.success("Profile updated locally");
        } else {
          toast.warning("Unable to save profile changes");
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile on server:", error);
      
      // Check if we had at least updated locally
      const localUpdateSuccess = updateLocalStorage();
      
      // Already updated locally, so just inform the user
      if (localUpdateSuccess) {
        toast.info("Profile saved locally only. Server update will happen when connection is restored.");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, GIF or WebP image.");
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };



  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Basic validation
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("Avatar image size should be less than 2MB");
      return;
    }
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    try {
      setIsSaving(true);
      // Upload the file to the server
      const response = await api.post(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.avatar) {
        // Update the avatar in the profile data
        setProfileData(prev => ({
          ...prev,
          avatar: response.data.avatar
        }));
        
        // Update local storage
        try {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            user.avatar = response.data.avatar;
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(user));
          }
        } catch (e) {
          console.error("Failed to update avatar in storage:", e);
        }
        
        toast.success("Avatar updated successfully");
      } else {
        toast.error("Failed to update avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading avatar. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete profile image
  const handleDeleteAvatar = async () => {
    if (!userId || !profileData.avatar) return;
    setIsSaving(true);
    try {
      await api.delete(`/users/profile/${userId}/avatar`);
      setProfileData(prev => ({ ...prev, avatar: null }));
      setImageFile(null);
      setImagePreview(null);
      // Update local storage
      try {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.avatar = null;
          user.profileImage = null;
          const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
          storage.setItem("user", JSON.stringify(user));
        }
      } catch (e) {
        console.error("Failed to update avatar in storage:", e);
      }
      toast.success("Profile image deleted");
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      toast.error("Failed to delete profile image");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes for profile editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper to get full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    // Remove leading slash if present
    const cleanPath = avatar.replace(/^\\|\//, '');
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${cleanPath}`;
  };

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full min-h-screen bg-[#18181b]">
        <div className="relative w-full overflow-hidden" style={{height: '200px'}}>
          <img 
            src={cartBg}
            alt="Profile Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 select-none pointer-events-none" 
            loading="eager"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">MY PROFILE</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Manage your personal information and profile settings</p>
          </div>
        </div>
        
        <div className="w-full p-6 md:p-8 bg-[#18181b] text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    setIsLoading(true);
                    toast.info("Refreshing statistics...");
                    try {
                      if (userId) {
                        const stats = await fetchArtisanStatistics(userId, username);
                        setProfileData(prev => ({
                          ...prev,
                          statistics: stats
                        }));
                        toast.success("Statistics updated!");
                        
                        // Update local storage
                        try {
                          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
                          if (userStr) {
                            const user = JSON.parse(userStr);
                            user.statistics = stats;
                            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
                            storage.setItem("user", JSON.stringify(user));
                          }
                        } catch (e) {
                          console.error("Failed to update statistics in storage:", e);
                        }
                      }
                    } catch (error) {
                      console.error("Failed to refresh statistics:", error);
                      toast.error("Couldn't update statistics");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition bg-white hover:bg-[#5e503f]/10 border-[#5e503f] text-[#5e503f] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Stats</span>
                </button>
                <button 
                  onClick={handleEdit}
                  disabled={isLoading}
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition bg-white hover:bg-[#5e503f]/10 border-[#5e503f] text-[#5e503f] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaEdit /> <span>Edit Profile</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition bg-white hover:bg-gray-50 border-gray-400 text-gray-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition bg-white hover:bg-green-50 border-green-400 text-green-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaSave /> <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <span className="sr-only">Loading...</span>
                <span className="absolute inline-block w-16 h-16 rounded-full border-4 border-[#5e503f] border-t-transparent animate-spin"></span>
                <span className="absolute inline-block w-10 h-10 rounded-full border-2 border-white border-t-transparent opacity-60 animate-spin-slow"></span>
              </div>
              <span className="mt-4 text-[#5e503f] font-semibold text-lg animate-pulse">Loading profile...</span>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className="rounded-xl shadow-md overflow-hidden mb-6 border bg-[#18181b] border-gray-700">
                {/* Profile Content */}
                <div className="p-6" style={{ backgroundColor: '#18181b' }}>
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    {/* Avatar */}
                    <div className="mb-6 md:mb-0 flex flex-col items-center">
                      {/* Avatar Container with fixed size and no scroll */}
                      <div className="relative w-28 h-28 overflow-hidden">
                        {/* Avatar or Icon */}
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="w-28 h-28 rounded-full object-cover border-2 border-white"
                            loading="eager"
                          />
                        ) : profileData.avatar ? (
                          <img 
                            src={getAvatarUrl(profileData.avatar)} 
                            alt="Profile" 
                            className="w-28 h-28 rounded-full object-cover border-2 border-white"
                            loading="eager"
                          />
                        ) : (
                          <FaUserCircle className="w-28 h-28 text-[#5e503f] bg-white rounded-full" />
                        )}
                        {/* Delete avatar button */}
                        {isEditing && profileData.avatar && !imagePreview && (
                          <button
                            type="button"
                            onClick={handleDeleteAvatar}
                            className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                            title="Delete profile image"
                            disabled={isSaving}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                        {isEditing && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer transition-opacity opacity-0 hover:opacity-100"
                            onClick={handleImageClick}
                          >
                            <MdCloudUpload className="text-white text-3xl" />
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleImageChange} 
                              accept="image/*"
                              className="hidden" 
                            />
                          </div>
                        )}
                      </div>
                      <span className="text-center mt-4 font-medium text-xl text-white">{profileData.name}</span>
                      <span className="text-sm text-white">Artisan</span>
                    </div>
                    
                    {/* Info Fields */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md bg-[#18181b] border-gray-600 text-white`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaUserCircle className="text-[#5e503f]" />
                              <span className="text-white">{profileData.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md bg-[#18181b] border-gray-600 text-white`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <MdEmail className="text-[#5e503f]" />
                              <span className="text-white">{profileData.email}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Location */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Location</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md bg-[#18181b] border-gray-600 text-white`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaMapMarkerAlt className="text-[#5e503f]" />
                              <span className="text-white">{profileData.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Join Date */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Joined</label>
                          <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="text-[#5e503f]" />
                            <span className="text-white">{profileData.joined}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bio */}
                      <div className="mt-6 space-y-2">
                        <label className="block text-sm font-medium text-white">About Me</label>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md bg-[#18181b] border-gray-600 text-white`}
                          />
                        ) : (
                          <div className="flex items-start space-x-2">
                            <MdDescription className="text-[#5e503f] mt-1" />
                            <p className="text-white">{profileData.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Products Card */}
                <div className="rounded-xl shadow-md p-4 border bg-[#18181b] border-gray-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Total Products</p>
                      <h3 className="text-2xl font-semibold text-white">
                        {isLoading ? (
                          <span className="inline-block w-12 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
                        ) : (
                          (profileData.statistics && typeof profileData.statistics.totalProducts === 'number') ? profileData.statistics.totalProducts : 0
                        )}
                      </h3>
                      <div className="text-xs mt-1 text-white">
                        Products you've created
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-white flex items-center justify-center shadow" style={{ minWidth: '48px', minHeight: '48px' }}>
                      <FaShoppingBag className="text-2xl text-[#5e503f]" style={{ filter: 'drop-shadow(0 0 2px #5e503f)' }} />
                    </div>
                  </div>
                </div>
                
                {/* Rating Card */}
                <div className="rounded-xl shadow-md p-4 border bg-[#18181b] border-gray-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Average Rating</p>
                      <h3 className="text-2xl font-semibold text-white">
                        {isLoading ? (
                          <span className="inline-block w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
                        ) : (
                          <>
                            {(profileData.statistics && typeof profileData.statistics.averageRating === 'number') ? profileData.statistics.averageRating : 0}
                            <span className="text-lg">/5</span>
                            <div className="flex mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar 
                                  key={star} 
                                  className={`text-sm mr-0.5 ${
                                    star <= Math.round((profileData.statistics && typeof profileData.statistics.averageRating === 'number') ? profileData.statistics.averageRating : 0) 
                                      ? 'text-yellow-500' 
                                      : 'text-[#5e503f]'
                                  }`} 
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </h3>
                      <div className="text-xs mt-1 text-white">
                        Based on customer reviews
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-white flex items-center justify-center shadow" style={{ minWidth: '48px', minHeight: '48px' }}>
                      <FaStar className="text-2xl text-yellow-500" style={{ filter: 'drop-shadow(0 0 2px #eab308)' }} />
                    </div>
                  </div>
                </div>
                
                {/* Sales Card */}
                <div className="rounded-xl shadow-md p-4 border bg-[#18181b] border-gray-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Orders</p>
                      <h3 className="text-2xl font-semibold text-white flex items-baseline">
                        {isLoading ? (
                          <span className="inline-block w-12 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
                        ) : (
                          <>
                            <span>{(profileData.statistics && typeof profileData.statistics.totalOrders === 'number') ? profileData.statistics.totalOrders : 0}</span>
                            <span className="text-sm ml-2 text-gray-300">
                              ({(profileData.statistics && typeof profileData.statistics.salesCompleted === 'number') ? profileData.statistics.salesCompleted : 0} completed)
                            </span>
                          </>
                        )}
                      </h3>
                      <div className="text-xs mt-1 text-white">
                        Total orders / Successfully delivered
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-white flex items-center justify-center shadow" style={{ minWidth: '48px', minHeight: '48px' }}>
                      <FaShoppingBag className="text-2xl text-[#5e503f]" style={{ filter: 'drop-shadow(0 0 2px #5e503f)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanProfile;
