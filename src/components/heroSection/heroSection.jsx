import React, { useState, useContext } from 'react';
import { Key, Wallet, FileText, Smartphone, Watch, Backpack, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Found from '../reportLost/found';
import RecoveryRequest from '../reportLost/recoveryRequest';
import MyContext from '../../context/data/myContext';

function HeroSection() {
  // Get theme mode from context
  const context = useContext(MyContext);
  const { mode, setSearchKey, setFilterType } = context;
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Separate state for each modal type
  const [showFound, setShowFound] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Handle found button click
  const handleFoundClick = () => {
    if (user) {
      setShowFound(true);
    } else {
      window.location.href = "/login";
    }
  };

  // Handle lost/request button click
  const handleRequestClick = () => {
    if (user) {
      setShowRequest(true);
    } else {
      window.location.href = "/login";
    }
  };

  // Close modal helper function
  const closeModal = (setStateFunction) => {
    setStateFunction(false);
    
    // Add a small delay to allow for proper unmounting
    setTimeout(() => {
      // Clean up any Google Maps related global state
      if (window.google && window.google.maps) {
        console.log("Cleaning up Google Maps resources");
      }
    }, 100);
  };

  // Handle search submission
  const handleSearch = (e) => {
    setSearchQuery(e.preventDefault());
    setSearchKey(searchQuery);
    setFilterType(""); // Reset filter type
    navigate('/items');
  };

  // Navigate to map view
  const handleExploreMap = () => {
    navigate('/items', { state: { showMap: true } });
    // Using a timeout to ensure navigation completes first
    setTimeout(() => {
      const mapToggleButton = document.querySelector('[data-map-toggle]');
      if (mapToggleButton && !document.querySelector('[data-map-view="true"]')) {
        mapToggleButton.click();
      }
    }, 100);
  };

  // Dynamic theme classes
  const bgColor = mode === 'dark' ? 'bg-gray-950' : 'bg-gray-100';
  const textColor = mode === 'dark' ? 'text-white' : 'text-gray-800';
  const secondaryTextColor = mode === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBgColor = mode === 'dark' ? 'bg-gray-900/50' : 'bg-white/80';
  const inputBgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBorderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const inputTextColor = mode === 'dark' ? 'text-white' : 'text-gray-800';
  const inputPlaceholderColor = mode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const modalBgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const modalOverlay = mode === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50';
  const shadowColor = mode === 'dark' ? 'shadow-black/20' : 'shadow-black/10';

  return (
    <div className={`min-h-screen ${bgColor} relative`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-4xl md:text-6xl font-bold ${textColor} mb-6`}>
              Lost Something?
              <span className="block text-emerald-400 mt-2">We'll Help You Find It</span>
            </h1>
            <p className={`${secondaryTextColor} text-lg md:text-xl mb-8`}>
              Your trusted platform for reconnecting people with their lost belongings.
              Quick, secure, and community-driven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={handleRequestClick}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Report Lost Item
              </button>

              <button 
                onClick={handleFoundClick}  
                className="px-8 py-3 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-lg font-semibold transition-all"
              >
                Found Something?
              </button>
            </div>
          </div>

          {/* Animated Icons Grid */}
          <div className="flex-1 grid grid-cols-3 gap-8 relative">
            {[
              { Icon: Key, delay: '0', label: 'Keys' },
              { Icon: Wallet, delay: '100', label: 'Wallets' },
              { Icon: FileText, delay: '200', label: 'Documents' },
              { Icon: Smartphone, delay: '300', label: 'Phones' },
              { Icon: Watch, delay: '400', label: 'Watches' },
              { Icon: Backpack, delay: '500', label: 'Bags' },
            ].map(({ Icon, delay, label }, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-6 ${cardBgColor}  rounded-xl backdrop-blur-sm transition-all duration-300 animate-fade-in shadow-lg ${shadowColor}`}
                style={{
                  animation: `fadeIn 0.5s ease-out forwards ${delay}ms`,
                }}
              >
                <Icon 
                  className="w-10 h-10 text-emerald-400 animate-bounce"
                  style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
                />
                <span className={`${secondaryTextColor} mt-2 text-sm`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Search Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="text"
                placeholder="Search for lost or found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 pr-4 py-4 w-full rounded-xl outline-none ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} border ${inputBorderColor} shadow-lg focus:ring-2 focus:ring-emerald-400 transition-all`}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-r-xl font-medium transition-all"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Map Explore Button */}
          <div className="flex pt-12 justify-center">
            <button
              onClick={handleExploreMap}
              className="flex items-center gap-2  px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 font-medium transition-all shadow-md"
            >
              <MapPin className="h-5 w-5 text-white" />
              Explore Items on Map
            </button>
          </div>
        </div>
      </div>

      {/* Found Item Modal */}
      {showFound && (
        <div className={`fixed inset-0 z-50 ${modalOverlay} flex items-center justify-center p-4 overflow-hidden`}>
          <div className={`${modalBgColor} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col`}>
            <Found onClose={() => closeModal(setShowFound)} />
          </div>
        </div>
      )}

      {/* Recovery Request Modal */}
      {showRequest && (
        <div className={`fixed inset-0 z-50 ${modalOverlay} flex items-center justify-center p-4 overflow-hidden`}>
          <div className={`${modalBgColor} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col`}>
            <RecoveryRequest onClose={() => closeModal(setShowRequest)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSection;