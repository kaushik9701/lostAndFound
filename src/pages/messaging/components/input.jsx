import React, { useContext, useState, useRef } from "react";
import MyContext from "../../../context/data/myContext";
import { ChatContext } from "../../../context/data/chatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { fireDB } from "../../../firebase/FirebaseConfig";

const Input = () => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const { userData, mode } = useContext(MyContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    // Trim the text and prevent sending empty messages
    const trimmedText = text.trim();
    if (!trimmedText) {
      inputRef.current?.focus();
      return;
    }

    if (!data.chatId) {
      console.error("No chatId found!");
      return;
    }

    const chatRef = doc(fireDB, "chats", data.chatId);
    const chatSnap = await getDoc(chatRef);

    // Create chat document if it doesn't exist
    if (!chatSnap.exists()) {
      await setDoc(chatRef, { messages: [] });
    }

    // Add the new message
    await updateDoc(chatRef, {
      messages: arrayUnion({
        id: uuid(),
        text: trimmedText,
        senderId: userData.uid,
        date: Timestamp.now(),
      }),
    });

    // Update "userChats" instead of "chats/userId"
    const senderChatRef = doc(fireDB, "userChats", userData.uid);
    const receiverChatRef = doc(fireDB, "userChats", data.user.uid);

    await setDoc(senderChatRef, {}, { merge: true });
    await updateDoc(senderChatRef, {
      [data.chatId + ".lastMessage"]: {
        text: trimmedText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await setDoc(receiverChatRef, {}, { merge: true });
    await updateDoc(receiverChatRef, {
      [data.chatId + ".lastMessage"]: {
        text: trimmedText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // Clear input and refocus
    setText("");
    inputRef.current?.focus();
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Additional attachment button */}
      <button 
        className={`p-2 rounded-full transition ${
          mode === 'dark'
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-200 text-gray-600'
        }`}
      >
      </button>

      {/* Input Field */}
      <div className="flex-grow">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          value={text}
          className={`w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 transition duration-300 ${
            mode === 'dark'
              ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-emerald-600'
              : 'bg-gray-100 text-black placeholder-gray-500 focus:ring-emerald-500'
          }`}
        />
      </div>

      {/* Send Button */}
      <button 
        onClick={handleSend}
        disabled={!text.trim()}
        className={`p-2 rounded-full transition duration-300 ${
          text.trim() 
            ? (mode === 'dark'
                ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                : 'bg-emerald-500 text-white hover:bg-emerald-600')
            : (mode === 'dark'
                ? 'bg-gray-700 text-gray-500'
                : 'bg-gray-300 text-gray-400')
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 5l7 7-7 7M5 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  );
};

export default Input;