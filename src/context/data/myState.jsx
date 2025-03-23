import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { fireDB, auth } from '../../firebase/FirebaseConfig'; // Make sure to import auth
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import this
import { useProductsState } from './productState';


function MyState(props) {
  const [mode, setMode] = useState('dark');  
  const [loading, setLoading] = useState(false); 

  // Add auth state
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'rgb(17, 24, 39)';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  };

  // Authentication observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(fireDB, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            
            setUserData(userDoc.data());
          } else {
            console.log("No user document found!");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const productsState = useProductsState(user, userData, setLoading);
  

  const value = {
    mode,
    toggleMode, 
    loading, 
    setLoading,
    user,
    userData,
    authLoading,
    ...productsState
  };

  return (
    <MyContext.Provider value={value}>
      {props.children}
    </MyContext.Provider>
  );
}

export default MyState;