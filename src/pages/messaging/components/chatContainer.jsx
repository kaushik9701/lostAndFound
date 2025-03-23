import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { fireDB } from "../../../firebase/FirebaseConfig";
import MyContext from "../../../context/data/myContext";
import { ChatContext } from "../../../context/data/chatContext";

const Chats = ({ setIsChatOpen }) => {
  const [chats, setChats] = useState([]);
  const { userData, mode } = useContext(MyContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!userData || !userData.uid) return; // Prevent running if user is null or undefined

    const getChats = () => {
      const unsub = onSnapshot(doc(fireDB, "userChats", userData.uid), (docSnap) => {
        if (docSnap.exists()) {
          setChats(docSnap.data());
          // console.log(docSnap.data());
        } else {
          setChats({}); // Ensure an empty object if no chats exist
        }
      });

      return () => unsub();
    };

    getChats();
  }, [userData]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    if (setIsChatOpen) {
      setIsChatOpen(true); // Open the chat on mobile when a chat is selected
    }
  };

  return (
    <div className={`rounded-lg shadow-lg p-4 h-[calc(100vh-200px)] overflow-y-auto ${
      mode === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-black shadow-md'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        mode === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Recent Chats
      </h2>

      {chats && Object.keys(chats).length > 0 ? (
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date) // Sorting the chats by date
          .map((chat) => (
            <div
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
              className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition ${
                mode === 'dark'
                  ? 'hover:bg-gray-700 text-white'
                  : 'hover:bg-gray-100 text-black'
              }`}
            >
              <div className="flex-1">
                <span className={`block font-medium ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {chat[1].userInfo.name || "Unknown Person"}
                </span>
                <p className={`text-sm ${
                  mode === 'dark' 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
                } truncate`}>
                  {chat[1].lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))
      ) : (
        <p className={`text-center ${
          mode === 'dark' 
            ? 'text-gray-400' 
            : 'text-gray-500'
        }`}>
          No chats yet
        </p>
      )}
    </div>
  );
};

export default Chats;