import { useState, useEffect, useCallback, useRef } from 'react';
import { fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useProductsState = (user, userData, setLoading) => {
  const [filterType, setFilterType] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [products, setProducts] = useState({
    userId: user ? user.uid : "",
    title: "",
    location: {
      address: "",
      latitude: null, 
      longitude: null
    },
    imageUrl: "",
    category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    type: "found", // Default type is "found", can be switched to "request"
    bounty: ""
  });

  const categories = [
    "electronics",
    "jewelry",
    "keys",
    "wallets",
    "documents",
    "clothing",
    "bags",
    "accessories",
    "pets",
    "other"
  ];

  const setItemType = (type) => {
    setProducts(prev => ({
      ...prev,
      type
    }));
  };

  // Function to handle location selection from map picker
  const handleLocationSelect = (locationData) => {
    setProducts(prev => ({
      ...prev,
      location: locationData
    }));
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get address from coordinates
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
            );
            const data = await response.json();
            let address = "";
            
            if (data.results && data.results.length > 0) {
              address = data.results[0].formatted_address;
            }

            // Update product state with coordinates and address
            setProducts(prev => ({
              ...prev,
              location: {
                address: address,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }));
            setLoading(false);
            toast.success("Location detected");
          } catch (error) {
            console.error("Error getting address: ", error);
            // Still set coordinates even if address lookup fails
            setProducts(prev => ({
              ...prev,
              location: {
                address: "Unknown location",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }));
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast.error("Could not get your location");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  // ********************** Add Product Section  **********************
  const addProduct = async () => {
    const isRequest = products.type === "request";
    // Updated validation to check for location object properties
    if (!products.title || 
        !products.location.address || 
        !products.location.latitude || 
        !products.category || 
        !products.description) {
      return toast.error('Please fill all fields and set a location');
    }
    if (products.type === "found" && !products.imageUrl) {
      return toast.error('Please upload an image of the found item');
    }

    // Check if user is logged in
    if (!user) {
      return toast.error('You must be logged in to add a product');
    }
        
    // Make sure we have the current user ID
    const productToAdd = {
      ...products,
      userId: user.uid,
      username: userData?.name || user.displayName || "Anonymous"
    };
        
    const productRef = collection(fireDB, "products");
    setLoading(true);
    try {
      await addDoc(productRef, productToAdd);
      toast.success(isRequest ? "Recovery request added successfully" : "Product added successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    
    // Reset products state after adding but keep user ID
    setProducts({
      userId: user.uid,
      username: userData?.username || user.name || "Anonymous",
      title: "",
      // Reset location object
      location: {
        address: "",
        latitude: null,
        longitude: null
      },
      imageUrl: "",
      category: "",
      description: "",
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      type: "found", // Reset to default type
      bounty: ""
    });
  };

  const [product, setProduct] = useState([]);
  const [loading, setProductLoading] = useState(true);
  
  // Use a ref to track if we've already set up the listener
  const listenerRef = useRef(null);

  // ****** Get Product Data
  const getProductData = useCallback(() => {
    // If we already have a listener, unsubscribe first
    if (listenerRef.current) {
      listenerRef.current();
    }

    try {
      setProductLoading(true);
      let q = query(
        collection(fireDB, "products"),
        orderBy("time")
      );

      // Modify query based on filters
      if (filterType) {
        q = query(
          collection(fireDB, "products"),
          where("type", "==", filterType),
          orderBy("time")
        );
      }

      // Set up the listener and store the unsubscribe function
      listenerRef.current = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Apply search key filter if exists
          if (!searchKey || 
              data.title.toLowerCase().includes(searchKey.toLowerCase())) {
            // Ensure all necessary fields exist
            productsArray.push({ 
              ...data, 
              id: doc.id,
              type: data.type || "found", // Default to "found" if not specified
              category: data.category || "other" // Default category if not specified
            });
          }
        });
        
        // Use functional update to ensure we're not causing unnecessary re-renders
        setProduct(prevProducts => {
          // Only update if the array has actually changed
          const isEqual = prevProducts.length === productsArray.length && 
            prevProducts.every((prod, index) => prod.id === productsArray[index].id);
          
          return isEqual ? prevProducts : productsArray;
        });
        
        setProductLoading(false);
      }, (error) => {
        console.error("Snapshot error:", error);
        setProductLoading(false);
      });
    } catch (error) {
      console.error("Error setting up product data listener:", error);
      setProductLoading(false);
    }

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, [filterType, searchKey]);
  // Set up the listener when the component mounts
  useEffect(() => {
    const unsubscribe = getProductData();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [getProductData]);

  return { 
    products, 
    setProducts, 
    addProduct,
    product, 
    setProduct,
    handleLocationSelect,
    getCurrentLocation,
    setItemType,
    categories,
    setFilterType, 
    filterType,
    setSearchKey,
    searchKey, 
    productLoading: loading
  };
};