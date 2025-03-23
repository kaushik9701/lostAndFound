import React, { useState, useEffect, useContext, useMemo } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp  } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig";
import MyContext from "../../../context/data/myContext";
import { ChatContext } from "../../../context/data/chatContext";

const ItemList = () => {
  const { mode, userData, product } = useContext(MyContext);
 
  const { dispatch } = useContext(ChatContext);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized function to enhance items with user details
  const enhanceItems = useMemo(() => {
    return async (items) => {
      if (!items || !items.length) return [];
      
      setIsLoading(true);
      
      const enhancedItems = await Promise.all(
        items.map(async (item) => {
          // If username is already present and not "Unknown User", return the item
          if (item.userName && item.userName !== "Unknown User") {
            return item;
          }
          
          // Fetch user details using userId
          let userName = "Unknown User";
          let userId = item.userId || "";
          
          if (userId) {
            try {
              const userRef = doc(fireDB, "users", userId);
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
            userName,
          };
        })
      );
      
      setIsLoading(false);
      return enhancedItems;
    };
  }, []); // Empty dependency array to prevent recreation

  // Handler for starting a chat with the product owner
  const handleChatWithOwner = async (item) => {
    if (!userData || !userData.uid) {
      alert("Please login to chat with the owner");
      return;
    }

    if (userData.uid === item.userId) {
      alert("This is your own product");
      return;
    }

    try {
      const currentUser = userData.uid;
      const productOwner = item.userId;
      
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
              name: item.userName
            },
            [combinedId + ".date"]: serverTimestamp(),
            [combinedId + ".productId"]: item.id,
            [combinedId + ".productTitle"]: item.title
          });
        } else {
          // Create new userChats document
          await setDoc(userChatRef, {
            [combinedId]: {
              userInfo: {
                uid: productOwner,
                name: item.userName
              },
              date: serverTimestamp(),
              productId: item.id,
              productTitle: item.title
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
            [combinedId + ".productId"]: item.id,
            [combinedId + ".productTitle"]: item.title
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
              productId: item.id,
              productTitle: item.title
            }
          });
        }
      }

      // Change selected user in context
      dispatch({ 
        type: "CHANGE_USER", 
        payload: {
          uid: productOwner,
          name: item.userName
        }
      });

      // Navigate to chat page using regular HTML navigation
      window.location.href = "/chat";
      
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  // Determine badge color based on item type
  const getTypeColor = (type) => {
    return type === "found" 
      ? "bg-yellow-500 text-black" 
      : "bg-emerald-500 text-white";
  };

  // Get badge text based on type
  const getTypeText = (type) => {
    return type === "found" ? "Found Item" : "Lost Item";
  };

  // Format bounty display (only for request type)
  const formatBounty = (item) => {
    if (item.type !== "request" || !item.bounty) return null;
    
    return (
      <p className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full inline-block mt-1">
        💰 Reward: {item.bounty}
      </p>
    );
  };
  
  // Use useMemo to enhance items only when product changes
  const enhancedItems = useMemo(() => {
    const fetchEnhancedItems = async () => {
      return await enhanceItems(product);
    };

    // Create a wrapper to handle async operation
    const result = fetchEnhancedItems();
    return result;
  }, [product, enhanceItems]);

  // State to store enhanced items
  const [displayItems, setDisplayItems] = useState([]);

  // Effect to update display items when enhanced items are ready
  useEffect(() => {
    const updateDisplayItems = async () => {
      try {
        const items = await enhancedItems;
        setDisplayItems(items);
      } catch (error) {
        console.error("Error updating display items:", error);
        setDisplayItems([]);
      }
    };

    updateDisplayItems();
  }, [enhancedItems]);

  return (
    <div className="container mx-auto px-4 pb-8">
      <div
        className={`p-5 rounded-lg shadow-lg border ${
          mode === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-black"
        }`}
      >
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        {!isLoading && displayItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium mb-1">No items found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
        
        <ul className="space-y-4">
          {displayItems.map((item) => (
            <li 
              key={item.id} 
              className={`p-4 rounded-lg flex flex-col sm:flex-row gap-4 transition-all duration-200 ${
                mode === "dark" 
                  ? "bg-gray-700 hover:bg-gray-600" 
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {/* Left: Image */}
              <div className="sm:w-24 sm:h-24 flex-shrink-0">
                <img 
                  src={item.imageUrl || null} 
                  alt={item.title} 
                  className="w-full h-24 sm:h-full rounded-lg object-cover" 
                />
              </div>

              {/* Middle: Content */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(item.type)}`}>
                    {getTypeText(item.type)}
                  </span>
                </div>
                <p className={`text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-600"} mb-1 line-clamp-2`}>
                  {item.description}
                </p>
                <div className="mt-2 space-y-1">
                  <p className={`text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    📅 {item.date}
                  </p>
                  <p className={`text-xs ${mode === "dark" ? "text-blue-300" : "text-blue-600"}`}>
                    👤 {item.userName}
                  </p>
                  {formatBounty(item)}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex sm:flex-col justify-end gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleChatWithOwner(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === "dark" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-emerald-500 hover:bg-emerald-600"
                  } text-white transition flex items-center gap-1`}
                >
                  <span>💬</span> Chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemList;