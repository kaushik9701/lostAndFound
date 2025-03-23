import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState, useRef } from "react";
import { ChatContext } from "../../../context/data/chatContext";
import MyContext from "../../../context/data/myContext";
import Message from "./message";
import { fireDB } from "../../../firebase/FirebaseConfig";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { mode } = useContext(MyContext);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!data.chatId) return; // Prevent unnecessary Firebase query

    const unSub = onSnapshot(doc(fireDB, "chats", data.chatId), (doc) => {
      doc.exists() ? setMessages(doc.data().messages) : setMessages([]);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // Render empty state or messages
  const renderContent = () => {
    if (!data.chatId) {
      return (
        <div className={`flex items-center justify-center h-full text-center ${
          mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-16 w-16 ${
                mode === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.9C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <p>No chat selected</p>
        </div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className={`flex items-center justify-center h-full text-center ${
          mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-16 w-16 ${
                mode === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.9C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <p>No messages yet. Start a conversation!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 py-2">
        {messages.map((m) => (
          <Message 
            key={m.id} 
            message={m} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <div className={`h-full overflow-y-auto ${
      mode === 'dark' 
        ? 'bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800' 
        : 'bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
    } px-4 pt-2 pb-4`}>
      {renderContent()}
    </div>
  );
};

export default Messages;