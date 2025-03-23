import {
    createContext,
    useContext,
    useReducer,
  } from "react";
import MyContext from "./myContext";
 
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { userData } = useContext(MyContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:
              userData.uid > action.payload.uid
                ? userData.uid + action.payload.uid
                : action.payload.uid + userData.uid,
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    

    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };