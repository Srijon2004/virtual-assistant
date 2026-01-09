// import axios from 'axios'
// import React, { createContext, useEffect, useState } from 'react'
// export const userDataContext=createContext()
// function UserContext({children}) {
//     const serverUrl="http://localhost:8000"
//     const [userData,setUserData]=useState(null)
//     const [frontendImage,setFrontendImage]=useState(null)
//      const [backendImage,setBackendImage]=useState(null)
//      const [selectedImage,setSelectedImage]=useState(null)
//     const handleCurrentUser=async ()=>{
//         try {
//             const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
//             setUserData(result.data)
//             console.log(result.data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getGeminiResponse=async (command)=>{
// try {
//   const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
//   return result.data
// } catch (error) {
//   console.log(error)
// }
//     }

//     useEffect(()=>{
// handleCurrentUser()
//     },[])
//     const value={
// serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage,getGeminiResponse
//     }
//   return (
//     <div>
//     <userDataContext.Provider value={value}>
//       {children}
//       </userDataContext.Provider>
//     </div>
//   )
// }

// export default UserContext











// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';

// export const userDataContext = createContext();

// function UserContext({ children }) {
//   const serverUrl = "http://localhost:8000";
//   const [userData, setUserData] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [backendImage, setBackendImage] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);

//   // Get current user
//   const handleCurrentUser = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
//       setUserData(result.data);
//       console.log(result.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Safe Gemini response
//   const getGeminiResponse = async (userInput) => {
//     if (!userInput) return { type: "error", response: "No input provided", userInput: "" };

//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/user/asktoassistant`,
//         { userInput }, // ✅ correct key
//         { withCredentials: true }
//       );

//       if (result.data && result.data.response) {
//         return result.data;
//       } else {
//         return { type: "error", response: "Sorry, I couldn't understand that.", userInput };
//       }
//     } catch (error) {
//       console.error("getGeminiResponse error:", error);
//       return { type: "error", response: "Something went wrong. Please try again.", userInput };
//     }
//   };

//   useEffect(() => {
//     handleCurrentUser();
//   }, []);

//   const value = {
//     serverUrl,
//     userData,
//     setUserData,
//     backendImage,
//     setBackendImage,
//     frontendImage,
//     setFrontendImage,
//     selectedImage,
//     setSelectedImage,
//     getGeminiResponse,
//   };

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   );
// }

// export default UserContext;














// okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';

// export const userDataContext = createContext();

// function UserContext({ children }) {
//   const serverUrl = "http://localhost:8000";
//   const [userData, setUserData] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [backendImage, setBackendImage] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);

//   // Get current user
//   const handleCurrentUser = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
//       setUserData(result.data);
//       console.log(result.data);
//     } catch (error) {
//       console.error("Current user error:", error);
//     }
//   };

//   // Safe Gemini response
//   const getGeminiResponse = async (userInput) => {
//     if (!userInput) return { type: "error", response: "No input provided", userInput: "" };

//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/user/asktoassistant`,
//         { command: userInput }, // ✅ correct key
//         { withCredentials: true }
//       );

//       if (result.data && result.data.response) {
//         return result.data;
//       } else {
//         return { type: "error", response: "Sorry, I couldn't understand that.", userInput };
//       }
//     } catch (error) {
//       console.error("getGeminiResponse error:", error);
//       return { type: "error", response: "Something went wrong. Please try again.", userInput };
//     }
//   };

//   useEffect(() => {
//     handleCurrentUser();
//   }, []);

//   const value = {
//     serverUrl,
//     userData,
//     setUserData,
//     backendImage,
//     setBackendImage,
//     frontendImage,
//     setFrontendImage,
//     selectedImage,
//     setSelectedImage,
//     getGeminiResponse,
//   };

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   );
// }

// export default UserContext;
























import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const userDataContext = createContext();

function UserContext({ children }) {
  // Centralized server URL
  // const serverUrl = "http://localhost:8000"; 
  const serverUrl = "https://virtual-assistant-uijf.onrender.com"; 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track auth status to prevent redirect flicker
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch current user session on mount
  const handleCurrentUser = async () => {
    try {
      // Ensure withCredentials is true to send/receive cookies
      const result = await axios.get(`${serverUrl}/api/user/current`, { 
        withCredentials: true 
      });
      setUserData(result.data);
      console.log("Current user authenticated:", result.data);
    } catch (error) {
      console.error("Current user authentication error:", error);
      setUserData(null);
    } finally {
      // This allows App.jsx to stop the loading spinner even if the request fails
      setLoading(false); 
    }
  };

  // Logic to interact with your AI assistant endpoint
  const getGeminiResponse = async (userInput) => {
    if (!userInput) return { type: "error", response: "No input provided", userInput: "" };

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command: userInput }, // Uses the 'command' key expected by backend
        { withCredentials: true }
      );

      if (result.data && result.data.response) {
        return result.data;
      } else {
        return { type: "error", response: "Sorry, I couldn't understand that.", userInput };
      }
    } catch (error) {
      console.error("getGeminiResponse error:", error);
      return { type: "error", response: "Something went wrong. Please try again.", userInput };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading, // Exported so App.jsx can protect routes
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;