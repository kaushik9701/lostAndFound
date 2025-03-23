import React, { useContext, useState, useEffect } from 'react';
import Layout from '../../components/Layout/layout';
import MyContext from '../../context/data/myContext';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

const Profile = () => {
  const { userData, authLoading, mode } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState('lost');
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    bounty: '',
    category: ''
  });
  const [updating, setUpdating] = useState(false);

  // Fetch user's items from Firestore
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!userData?.uid) return;
      
      try {
        setLoading(true);
        const itemsRef = collection(fireDB, "products");
        const q = query(itemsRef, where("userId", "==", userData.uid));
        const querySnapshot = await getDocs(q);
        
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setUserItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user items:", error);
        setLoading(false);
      }
    };

    if (userData) {
      fetchUserItems();
    }
  }, [userData]);

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(fireDB, "products", itemId));
        // Filter out the deleted item
        setUserItems(userItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  // Open edit modal
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setEditFormData({
      title: item.title || '',
      description: item.description || '',
      bounty: item.bounty || '',
      category: item.category || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Save edited item
  const handleSaveItem = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title) {
      alert("Title is required");
      return;
    }

    try {
      setUpdating(true);
      const itemRef = doc(fireDB, "products", currentItem.id);
      
      await updateDoc(itemRef, {
        title: editFormData.title,
        description: editFormData.description,
        bounty: editFormData.bounty,
        category: editFormData.category,
        // Add updated timestamp if needed
        updatedAt: new Date().toISOString()
      });

      // Update the item in the local state
      setUserItems(userItems.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              title: editFormData.title,
              description: editFormData.description,
              bounty: editFormData.bounty,
              category: editFormData.category
            } 
          : item
      ));

      setUpdating(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
      setUpdating(false);
    }
  };

  // Get filtered items based on active tab
  const filteredItems = userItems.filter(item => {
    if (activeTab === 'lost') return item.type === 'request';
    if (activeTab === 'found') return item.type === 'found';
    return true;
  });

  if (authLoading) {
    return (
      <Layout>
        <div className={`min-h-screen ${
          mode === 'dark'
            ? 'bg-gray-950 text-white'
            : 'bg-gray-100 text-black'
        } flex justify-center items-center`}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Layout>
      <div className={`min-h-screen ${
        mode === 'dark'
          ? 'bg-gray-950 text-white'
          : 'bg-gray-100 text-black'
      }`}>
        {/* Profile Header */}
        <div className={`w-full py-12 ${
          mode === 'dark'
            ? 'bg-gray-900'
            : 'bg-emerald-50'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              {/* User Avatar (using initials) */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                mode === 'dark' 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' 
                  : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
              }`}>
                {getInitials(userData?.name)}
              </div>
              
              {/* User Info */}
              <h1 className="text-3xl font-bold mt-4">
                {userData?.name || "User"}
              </h1>
              <p className={`${
                mode === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              } mt-1`}>
                {userData?.email || "No email available"}
              </p>
              
              {/* Stats */}
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {userItems.filter(item => item.type === 'request').length}
                  </p>
                  <p className={`${
                    mode === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  } text-sm`}>
                    Lost Items
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {userItems.filter(item => item.type === 'found').length}
                  </p>
                  <p className={`${
                    mode === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  } text-sm`}>
                    Found Items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Item Tabs */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex border-b mb-6">
            <button 
              className={`py-2 px-4 font-medium ${
                activeTab === 'lost'
                  ? mode === 'dark'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-emerald-600 border-b-2 border-emerald-600'
                  : mode === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('lost')}
            >
              Lost Items
            </button>
            <button 
              className={`py-2 px-4 font-medium ${
                activeTab === 'found'
                  ? mode === 'dark'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-emerald-600 border-b-2 border-emerald-600'
                  : mode === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('found')}
            >
              Found Items
            </button>
            <button 
              className={`py-2 px-4 font-medium ${
                activeTab === 'all'
                  ? mode === 'dark'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-emerald-600 border-b-2 border-emerald-600'
                  : mode === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Items
            </button>
          </div>
          
          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
              <p>Loading your items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={`text-center py-12 ${
              mode === 'dark'
                ? 'bg-gray-900'
                : 'bg-gray-50'
            } rounded-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-medium mb-1">No items found</h3>
              <p className={`${
                mode === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              } max-w-md mx-auto`}>
                You haven't posted any {activeTab !== 'all' ? activeTab + ' ' : ''}items yet.
              </p>
              <button 
                className={`mt-4 px-4 py-2 rounded-lg ${
                  mode === 'dark'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                Add New Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  className={`rounded-lg overflow-hidden shadow-md ${
                    mode === 'dark'
                      ? 'bg-gray-800'
                      : 'bg-white'
                  }`}
                >
                  {/* Item Image */}
                  <div className="relative h-48">
                    <img 
                      src={item.imageUrl || "/placeholder-image.jpg"} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.type === 'found'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.type === 'found' ? 'Found Item' : 'Lost Item'}
                      </span>
                    </div>
                    {item.bounty && (
                      <div className="absolute bottom-2 right-2">
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Reward: {item.bounty}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      mode === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`}>
                      {item.description || "No description provided"}
                    </p>
                    
                    {/* Location */}
                    {item.location && (
                      <div className={`text-xs mb-3 ${
                        mode === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      } flex items-start`}>
                        <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">
                          {typeof item.location === 'object' 
                            ? (item.location.address || `Lat: ${item.location.latitude}, Lng: ${item.location.longitude}`)
                            : item.location}
                        </span>
                      </div>
                    )}
                    
                    {/* Date Posted */}
                    <div className={`text-xs mb-4 ${
                      mode === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Posted: {item.date || "Unknown date"}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                          mode === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                          mode === 'dark'
                            ? 'bg-red-900 hover:bg-red-800 text-white'
                            : 'bg-red-100 hover:bg-red-200 text-red-800'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
            <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
              mode === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Item</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className={`${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-xl`}
                >
                  ×
                </button>
              </div>
              
              {/* Edit Form */}
              <form onSubmit={handleSaveItem}>
                <div className="mb-4">
                  <label className={`block ${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-medium mb-1`}>
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg ${
                      mode === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                
                <div className="mb-4">
                  <label className={`block ${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-medium mb-1`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg ${
                      mode === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className={`block ${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-medium mb-1`}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      mode === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="keys">Keys</option>
                    <option value="wallets">Wallets</option>
                    <option value="documents">Documents</option>
                    <option value="clothing">Clothing</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                    <option value="pets">Pets</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {currentItem?.type === 'request' && (
                  <div className="mb-4">
                    <label className={`block ${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-medium mb-1`}>
                      Reward Amount
                    </label>
                    <input
                      type="text"
                      name="bounty"
                      value={editFormData.bounty}
                      onChange={handleInputChange}
                      placeholder="e.g. $50"
                      className={`w-full px-3 py-2 rounded-lg ${
                        mode === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      mode === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      mode === 'dark'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    } flex items-center justify-center`}
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;