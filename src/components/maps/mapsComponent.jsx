import React, { useEffect, useRef, useState, useContext } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { loadGoogleMapsScript } from './mapsScriptLoader';
import { fireDB } from '../../firebase/FirebaseConfig';
import MyContext from '../../context/data/myContext';
import { ChatContext } from '../../context/data/chatContext';
import { setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const MapsComponent = ({ 
  apiKey, 
  center = { lat: 40.7128, lng: -74.006 }, 
  zoom = 12 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);

  const context = useContext(MyContext);
  const { mode, userData } = context;
  const { dispatch } = useContext(ChatContext);

  // Handle starting a chat with the item owner
  const handleChatWithOwner = async (ownerId, ownerName, itemId, itemTitle) => {
    if (!userData || !userData.uid) {
      alert("Please login to chat with the owner");
      return;
    }

    if (userData.uid === ownerId) {
      alert("This is your own item");
      return;
    }

    try {
      const currentUser = userData.uid;
      const productOwner = ownerId;
      
      // Create a unique chat ID combining both users (sorted to ensure consistency)
      const combinedId = currentUser > productOwner 
        ? currentUser + productOwner 
        : productOwner + currentUser;

      // Check if the chat already exists
      const chatRef = doc(fireDB, "chats", combinedId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Create a chat in the chats collection
        await setDoc(chatRef, { messages: [] });

        // Create or update userChats entries for both users
        const userChatRef = doc(fireDB, "userChats", currentUser);
        const ownerChatRef = doc(fireDB, "userChats", productOwner);

        // Get current user chats data
        const userChatSnap = await getDoc(userChatRef);
        
        // Create/update user chat data
        if (userChatSnap.exists()) {
          // Update existing userChats document
          await updateDoc(userChatRef, {
            [combinedId + ".userInfo"]: {
              uid: productOwner,
              name: ownerName
            },
            [combinedId + ".date"]: serverTimestamp(),
            [combinedId + ".productId"]: itemId,
            [combinedId + ".productTitle"]: itemTitle
          });
        } else {
          // Create new userChats document
          await setDoc(userChatRef, {
            [combinedId]: {
              userInfo: {
                uid: productOwner,
                name: ownerName
              },
              date: serverTimestamp(),
              productId: itemId,
              productTitle: itemTitle
            }
          });
        }

        // Get owner chats data
        const ownerChatSnap = await getDoc(ownerChatRef);
        
        // Create/update owner chat data
        if (ownerChatSnap.exists()) {
          // Update existing userChats document
          await updateDoc(ownerChatRef, {
            [combinedId + ".userInfo"]: {
              uid: currentUser,
              name: userData.name || "User"
            },
            [combinedId + ".date"]: serverTimestamp(),
            [combinedId + ".productId"]: itemId,
            [combinedId + ".productTitle"]: itemTitle
          });
        } else {
          // Create new userChats document
          await setDoc(ownerChatRef, {
            [combinedId]: {
              userInfo: {
                uid: currentUser,
                name: userData.name || "User"
              },
              date: serverTimestamp(),
              productId: itemId,
              productTitle: itemTitle
            }
          });
        }
      }

      // Change selected user in context
      dispatch({ 
        type: "CHANGE_USER", 
        payload: {
          uid: productOwner,
          name: ownerName
        }
      });

      // Navigate to chat page
      window.location.href = "/chat";
      
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  // Generate HTML content for info windows including chat functionality
  const generateInfoWindowContent = (item) => {
    return `
      <div class="p-3 rounded-lg ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}" style="min-width: 200px;">
        <h3 class="font-bold text-lg mb-1">${item.title}</h3>
        <div class="flex items-center mb-2">
          <span class="inline-block px-2 py-1 text-xs rounded-full ${
            item.type === 'found' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-red-100 text-red-800'
          } mr-2">
            ${item.type === 'found' ? 'Found Item' : 'Lost Item'}
          </span>
          ${item.bounty ? `<span class="text-emerald-500 font-medium text-sm">Reward: ${item.bounty}</span>` : ''}
        </div>
        ${item.description ? `<p class="text-sm mb-2">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>` : ''}
        <div class="flex items-center mt-2 text-xs mb-1">
          <span class="${mode === 'dark' ? 'text-gray-300' : 'text-gray-500'}">Posted by: ${item.userName || 'Unknown User'}</span>
        </div>
        <div class="mt-3">
          <button 
            onclick="window.startChatWithUser('${item.userId}', '${item.userName}', '${item.id}', '${item.title.replace(/'/g, "\\'")}')"
            class="w-full py-2 px-3 rounded-lg text-white font-medium bg-emerald-500 hover:bg-emerald-600 text-sm flex items-center justify-center"
            style="background-color: #10b981; transition: all 0.2s; cursor: pointer;"
            onmouseover="this.style.backgroundColor='#059669'"
            onmouseout="this.style.backgroundColor='#10b981'"
          >
            <span style="margin-right: 6px;">💬</span> Chat with ${item.userName || 'Owner'}
          </button>
        </div>
      </div>
    `;
  };

  // Create a global function to handle the chat button click from the info window
  useEffect(() => {
    window.startChatWithUser = (userId, userName, itemId, itemTitle) => {
      handleChatWithOwner(userId, userName, itemId, itemTitle);
    };

    return () => {
      // Clean up global function when component unmounts
      delete window.startChatWithUser;
    };
  }, [userData]);

  // Fetch items from Firestore
  const fetchItemsForMap = async () => {
    try {
      const productsRef = collection(fireDB, "products");
      const snapshot = await getDocs(productsRef);
      
      // First get all items
      const items = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          // Only add markers with valid location data
          return data.location?.latitude && data.location?.longitude;
        })
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            lat: data.location.latitude,
            lng: data.location.longitude,
            title: data.title,
            type: data.type,
            description: data.description,
            userId: data.userId,
            bounty: data.bounty,
            userName: data.userName || null
          };
        });
      
      // Then fetch user names for items that don't have them
      const enhancedItems = await Promise.all(
        items.map(async (item) => {
          if (item.userName) return item;
          
          let userName = "Unknown User";
          if (item.userId) {
            try {
              const userRef = doc(fireDB, "users", item.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                userName = userSnap.data().name;
              }
            } catch (err) {
              console.error("Error fetching user details:", err);
            }
          }
          
          return {
            ...item,
            userName
          };
        })
      );
      
      setMarkers(enhancedItems);
    } catch (err) {
      console.error('Error fetching items for map:', err);
      setError('Failed to fetch map items');
    }
  };

  // Load Google Maps API and initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setLoading(true);

        // Load Google Maps API (will only load once across components)
        await loadGoogleMapsScript(apiKey);

        // Create map instance
        const mapOptions = {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: mode === 'dark' ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }]
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }]
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }]
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }]
            }
          ] : []
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        setLoading(false);

        // Fetch items after map is initialized
        fetchItemsForMap();
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
        setLoading(false);
      }
    };

    initMap();
  }, [apiKey, center, zoom, mode]);

  // Add markers to the map
  useEffect(() => {
    if (!map || !markers.length) return;

    // Array to track current markers for cleanup
    const mapMarkers = [];

    // Info window reference to ensure only one is open at a time
    let currentInfoWindow = null;

    // Add markers
    markers.forEach(markerData => {
      const markerColor = markerData.type === 'found' 
        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map,
        title: markerData.title || '',
        icon: markerColor,
        animation: window.google.maps.Animation.DROP
      });

      // Create info window with enhanced content
      const infoWindow = new window.google.maps.InfoWindow({
        content: generateInfoWindowContent(markerData),
        maxWidth: 300
      });

      marker.addListener('click', () => {
        // Close previous info window if any
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        
        // Open this info window and store reference
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
      });

      mapMarkers.push(marker);
    });

    // Clean up markers when component unmounts or markers change
    return () => {
      mapMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers, mode, userData]);

  return (
    <div className={`google-map-container ${mode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg p-2`}>
      {loading && (
        <div className={`map-loading p-8 text-center ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-3"></div>
          <p>Loading map...</p>
        </div>
      )}
      {error && (
        <div className={`map-error p-4 text-red-500 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
          <p className="font-medium mb-2">Error:</p>
          <p>{error}</p>
        </div>
      )}
      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden"
        style={{
          width: '100%',
          height: '500px',
          display: loading ? 'none' : 'block'
        }}
      />
      {!loading && markers.length > 0 && (
        <div className={`flex justify-between items-center p-3 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg mt-2`}>
          <p className="text-sm flex gap-1">
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Found Items</span>
            <span className="mx-2">|</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span> Lost Items</span>
          </p>
          <p className="text-sm font-medium">{markers.length} items on map</p>
        </div>
      )}
      {!loading && markers.length === 0 && (
        <div className={`p-4 text-center ${mode === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-100'} rounded-lg mt-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="font-medium">No items found on the map</p>
          <p className="text-sm mt-1">Try adjusting your search criteria or add a new item</p>
        </div>
      )}
    </div>
  );
};

export default MapsComponent;