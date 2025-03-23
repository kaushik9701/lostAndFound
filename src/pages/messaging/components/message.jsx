import React, { useContext, useEffect, useRef } from "react";
import MyContext from "../../../context/data/myContext";
import { ChatContext } from "../../../context/data/chatContext";

const Message = ({ message }) => {
  const ref = useRef();
  const { userData } = useContext(MyContext);
  const { data } = useContext(ChatContext);
  const { mode } = useContext(MyContext);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Convert Firestore timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMinutes = Math.round((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const hours = Math.floor(diffMinutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    
    return date.toLocaleDateString();
  };

  // Determine if the message is from the current user
  const isOwn = message.senderId === userData.uid;

  return (
    <div 
      ref={ref} 
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-3`}
    >
      <div className={`flex items-center ${isOwn ? 'flex-row-reverse' : ''} space-x-2`}>
        {/* User Avatar */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
          mode === 'dark' 
            ? 'bg-gray-700 text-gray-300' 
            : 'bg-gray-300 text-gray-600'
        } flex items-center justify-center`}>
          {isOwn 
            ? (userData?.name?.[0] || 'U') 
            : (data.user?.name?.[0] || 'U')
          }
        </div>

        {/* Message Container */}
        <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${
          isOwn 
            ? (mode === 'dark' 
                ? 'bg-emerald-800 text-white' 
                : 'bg-emerald-500 text-white')
            : (mode === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-black')
        } break-words`}>
          <p>{message.text}</p>
        </div>
      </div>

      {/* Timestamp */}
      <span className={`text-xs mt-1 ${
        mode === 'dark' 
          ? 'text-gray-400' 
          : 'text-gray-500'
      } ${isOwn ? 'mr-10' : 'ml-10'}`}>
        {formatTime(message.date)}
      </span>
    </div>
  );
};

export default Message;