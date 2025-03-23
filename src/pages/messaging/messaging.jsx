import Layout from "../../components/Layout/layout";
import Search from "./components/searchContact";
import Chats from "./components/chatContainer";
import Chat from "./components/chat";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/data/chatContext";
import MyContext from "../../context/data/myContext";

const ChatPage = () => {
  const { data } = useContext(ChatContext);
  const { mode } = useContext(MyContext);
  const [isChatOpen, setIsChatOpen] = useState(false); // Track if a chat is open

  // Auto-open chat on mobile if a user is selected (e.g., when coming from products page)
  useEffect(() => {
    if (data.chatId) {
      setIsChatOpen(true);
    }
  }, [data.chatId]);

  return (
    <Layout>
      <div className={`min-h-screen ${
        mode === 'dark' 
          ? 'bg-gray-950 text-white' 
          : 'bg-gray-100 text-black'
      }`}>
        <div className="container mx-auto px-4 py-6">
          <h1 className={`text-3xl font-semibold ${
            mode === 'dark' 
              ? 'text-emerald-400' 
              : 'text-emerald-600'
          } mb-6 text-center lg:text-left`}>
            Chat with Users
          </h1>

          {/* Mobile Layout */}
          <div className={`lg:hidden ${
            mode === 'dark' 
              ? 'bg-gray-800' 
              : 'bg-white shadow-md'
          } rounded-lg p-4 mb-4`}>
            {!isChatOpen ? (
              // Show search and chats when no chat is open
              <>
                <Search />
                <Chats setIsChatOpen={setIsChatOpen} />
              </>
            ) : (
              // Show chat when a chat is open
              <div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`mb-4 px-4 py-2 ${
                    mode === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  } rounded-lg transition`}
                >
                  ← Back
                </button>
                <Chat setIsChatOpen={setIsChatOpen} />
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6">
            {/* Left Side - Chat List & Search */}
            <div className={`col-span-2 ${
              mode === 'dark' 
                ? 'bg-gray-800' 
                : 'bg-white shadow-md'
            } rounded-lg p-4 h-[calc(100vh-150px)] overflow-y-auto`}>
              <Search />
              <Chats />
            </div>

            {/* Right Side - Chat Window */}
            <div className={`col-span-3 ${
              mode === 'dark' 
                ? 'bg-gray-800' 
                : 'bg-white shadow-md'
            } rounded-lg p-4 h-[calc(100vh-150px)]`}>
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;