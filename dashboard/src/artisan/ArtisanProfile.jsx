import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSave, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaStar } from "react-icons/fa";
import { MdEmail, MdDescription } from "react-icons/md";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { toast } from "react-toastify";
import cartBg from '../images/2.jpg';

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
      salesCompleted: 0
    }
  });
  
  const [userId, setUserId] = useState(null);
  
  // Get user ID from localStorage or sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!user) return;
        
        const userData = JSON.parse(user);
        if (userData && userData._id) {
          setUserId(userData._id);
        } else {
          // Fallback for development/testing
          setIsLoading(false);
          setProfileData({
            name: userData?.username || "Artisan Name",
            email: userData?.email || "artisan@email.com",
            bio: "This is your artisan profile. Update your information to let buyers know more about you and your craft!",
            avatar: null,
            location: "Philippines",
            joined: "2024-01-01",
            statistics: {
              totalProducts: 24,
              averageRating: 4.8,
              salesCompleted: 152
            }
          });
        }
      } catch (e) {
        console.error("Error loading user data:", e);
        setIsLoading(false);
      }
    };
    
    // Execute immediately for faster UI update
    loadUserData();
  }, []);

  // Fetch profile data from API when userId is available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/users/profile/${userId}`);
        const formattedDate = new Date(response.data.joined).toISOString().split('T')[0];
        
        setProfileData({
          name: response.data.name,
          email: response.data.email,
          bio: response.data.bio || "This is your artisan profile. Update your information to let buyers know more about you and your craft!",
          avatar: response.data.avatar,
          location: response.data.location || "Philippines",
          joined: formattedDate,
          statistics: {
            totalProducts: response.data.statistics?.totalProducts || 0,
            averageRating: response.data.statistics?.averageRating || 0,
            salesCompleted: response.data.statistics?.salesCompleted || 0
          }
        });
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Failed to load profile data");
        
        // Fallback to local storage data
        const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
        setProfileData(prev => ({
          ...prev,
          name: user.username || prev.name || "Artisan Name",
          email: user.email || prev.email || "artisan@email.com",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

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
      const response = await axios.put(`/api/users/profile/${userId}`, {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        avatar: profileData.avatar
      });
      
      // Update local storage with new user data to keep it in sync
      const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
      if (user) {
        user.username = response.data.name;
        user.email = response.data.email;
        
        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(user));
        } else if (sessionStorage.getItem("user")) {
          sessionStorage.setItem("user", JSON.stringify(user));
        }
      }
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full">
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
        
        <div className={`w-full p-6 md:p-8 ${isDarkMode ? 'bg-[#18181b] text-white' : 'bg-white text-gray-800'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                disabled={isLoading}
                className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition bg-white hover:bg-purple-50 border-purple-400 text-purple-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaEdit /> <span>Edit Profile</span>
              </button>
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
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className={`rounded-xl shadow-md overflow-hidden mb-6 border ${isDarkMode ? 'bg-[#23232b] border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Profile Content */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    {/* Avatar */}
                    <div className="mb-6 md:mb-0 flex flex-col items-center">
                      {/* Avatar Container with fixed size and no scroll */}
                      <div className="relative w-28 h-28 overflow-hidden">
                        {/* Avatar or Icon */}
                        {profileData.avatar ? (
                          <img 
                            src={profileData.avatar} 
                            alt="Profile" 
                            className="w-28 h-28 rounded-full object-cover border-2 border-white select-none pointer-events-none" 
                            loading="eager"
                          />
                        ) : (
                          <FaUserCircle className={`w-28 h-28 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} bg-white rounded-full select-none pointer-events-none`} />
                        )}
                        {isEditing && (
                          <div className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer">
                            <FaEdit />
                          </div>
                        )}
                      </div>
                      <span className={`text-center mt-4 font-medium text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.name}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Artisan</span>
                    </div>
                    
                    {/* Info Fields */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md ${
                                isDarkMode ? 'bg-[#23232b] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaUserCircle className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div className="space-y-2">
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md ${
                                isDarkMode ? 'bg-[#23232b] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <MdEmail className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.email}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Location */}
                        <div className="space-y-2">
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Location</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md ${
                                isDarkMode ? 'bg-[#23232b] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaMapMarkerAlt className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Join Date */}
                        <div className="space-y-2">
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Joined</label>
                          <div className="flex items-center space-x-2">
                            <FaCalendarAlt className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.joined}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bio */}
                      <div className="mt-6 space-y-2">
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>About Me</label>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md ${
                              isDarkMode ? 'bg-[#23232b] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                            }`}
                          />
                        ) : (
                          <div className="flex items-start space-x-2">
                            <MdDescription className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'} mt-1`} />
                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{profileData.bio}</p>
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
                <div className={`rounded-xl shadow-md p-4 border ${isDarkMode ? 'bg-[#23232b] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Products</p>
                      <h3 className="text-2xl font-semibold">{profileData.statistics.totalProducts}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                      <FaShoppingBag className={`text-2xl ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    </div>
                  </div>
                </div>
                
                {/* Rating Card */}
                <div className={`rounded-xl shadow-md p-4 border ${isDarkMode ? 'bg-[#23232b] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Average Rating</p>
                      <h3 className="text-2xl font-semibold">{profileData.statistics.averageRating}/5</h3>
                    </div>
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                      <FaStar className="text-2xl text-yellow-500" />
                    </div>
                  </div>
                </div>
                
                {/* Sales Card */}
                <div className={`rounded-xl shadow-md p-4 border ${isDarkMode ? 'bg-[#23232b] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Sales Completed</p>
                      <h3 className="text-2xl font-semibold">{profileData.statistics.salesCompleted}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                      <FaSave className={`text-2xl ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
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
