import React, { useContext, useEffect, useState } from "react";
import Messages from "./messages";
import Input from "./input";
import { ChatContext } from "../../../context/data/chatContext";
import MyContext from "../../../context/data/myContext";

const Chat = ({ setIsChatOpen }) => {
  const { data } = useContext(ChatContext);
  const { mode } = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When component mounts, set isChatOpen to true for mobile view
    if (setIsChatOpen) {
      setIsChatOpen(true);
    }

    // Short loading state to ensure chat UI renders properly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [setIsChatOpen]);

  // Determine color scheme based on mode
  const bgClasses = mode === 'dark' 
    ? {
        container: 'bg-gray-900 text-white',
        header: 'bg-gray-800 border-gray-700',
        loadingBg: 'bg-gray-700',
        messageArea: 'bg-gray-900',
        emptyText: 'text-gray-400',
        input: 'bg-gray-800 border-gray-700'
      }
    : {
        container: 'bg-white text-black',
        header: 'bg-gray-100 border-gray-200',
        loadingBg: 'bg-gray-300',
        messageArea: 'bg-white',
        emptyText: 'text-gray-600',
        input: 'bg-gray-50 border-gray-200'
      };

  return (
    <div className={`flex flex-col h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${bgClasses.container}`}>
      {/* Chat Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${bgClasses.header}`}>
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {/* Profile Picture Placeholder */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-6 h-6 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a4 4 0 00-4-4H8a4 4 0 00-4 4v2h8v-2z" 
              />
            </svg>
          </div>

          {/* User Name and Status */}
          <div>
            {loading ? (
              <div className={`animate-pulse h-6 w-40 ${bgClasses.loadingBg} rounded`}></div>
            ) : (
              <>
                <span className="text-lg font-semibold block">
                  {data.user?.name || "Select a chat"}
                </span>
               
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area (Scrollable) */}
      <div className={`flex-1 overflow-y-auto p-4 ${bgClasses.messageArea}`}>
        {data.chatId ? (
          <Messages />
        ) : (
          <div className={`flex items-center justify-center h-full ${bgClasses.emptyText}`}>
            Select a conversation or start a new chat
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className={`border-t p-3 ${bgClasses.input}`}>
        {data.chatId && <Input />}
      </div>
    </div>
  );
};

export default Chat;