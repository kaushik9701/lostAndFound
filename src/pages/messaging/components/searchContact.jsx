import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs, getDoc, setDoc, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../../firebase/FirebaseConfig';
import MyContext from '../../../context/data/myContext';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Store authenticated user

  // Ensure currentUser is properly set
  const { userData, mode } = useContext(MyContext);

  useEffect(() => {
    setCurrentUser(userData);
  }, [userData]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term.');
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(fireDB, "users");
      const q = query(usersRef, where("name", "==", searchTerm));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.info("No contacts found.");
        setContact(null);
      } else {
        querySnapshot.forEach((docSnap) => {
          setContact({ ...docSnap.data(), uid: docSnap.id });
        });
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      toast.error("Failed to search contacts");
    }
    setLoading(false);
  };

  const handleSelect = async () => {
    if (!currentUser || !contact || !contact.uid) {
      toast.error("Missing user or contact data.");
      console.log("uid:", contact.uid, "name:", contact.name);
      return;
    }

    const combinedId =
      currentUser.uid > contact.uid
        ? currentUser.uid + contact.uid
        : contact.uid + currentUser.uid;

    try {
      const chatRef = doc(fireDB, "chats", combinedId);
      const res = await getDoc(chatRef);

      if (!res.exists()) {
        // Create the chat document only if it doesn't exist
        await setDoc(chatRef, { messages: [] });

        const senderChatRef = doc(fireDB, "userChats", currentUser.uid);
        const receiverChatRef = doc(fireDB, "userChats", contact.uid);

        // Ensure that both userChats documents exist (merging if they do)
        await setDoc(senderChatRef, {}, { merge: true });
        await setDoc(receiverChatRef, {}, { merge: true });

        // Update sender's userChats with the receiver's info
        await updateDoc(senderChatRef, {
          [combinedId + ".userInfo"]: {
            uid: contact.uid,
            name: contact.name || "Unknown bep",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Update receiver's userChats with the sender's info
        await updateDoc(receiverChatRef, {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.name || "Unknown bup",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error in handleSelect:", err);
      toast.error("Failed to create or update chat");
    }

    setContact(null);
    setSearchTerm("");
  };

  return (
    <div className="search mb-4">
      <div className="searchForm mb-3">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className={`w-full px-3 py-2 rounded-lg border ${
            mode === 'dark'
              ? 'bg-gray-700 text-white border-gray-600 focus:ring-emerald-500'
              : 'bg-white text-black border-gray-300 focus:ring-emerald-400'
          } focus:outline-none focus:ring-2 transition duration-300`}
        />
      </div>

      {contact && (
        <div 
          onClick={handleSelect} 
          className={`cursor-pointer p-3 rounded-lg transition duration-300 ${
            mode === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-black'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${
              mode === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
            <span className="font-medium">{contact.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;