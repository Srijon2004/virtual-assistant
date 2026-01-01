// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { userDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import aiImg from "../assets/ai.gif"
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import userImg from "../assets/user.gif"
// function Home() {
//   const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
//   const navigate=useNavigate()
//   const [listening,setListening]=useState(false)
//   const [userText,setUserText]=useState("")
//   const [aiText,setAiText]=useState("")
//   const isSpeakingRef=useRef(false)
//   const recognitionRef=useRef(null)
//   const [ham,setHam]=useState(false)
//   const isRecognizingRef=useRef(false)
//   const synth=window.speechSynthesis

//   const handleLogOut=async ()=>{
//     try {
//       const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
//       setUserData(null)
//       navigate("/signin")
//     } catch (error) {
//       setUserData(null)
//       console.log(error)
//     }
//   }

//   const startRecognition = () => {
    
//    if (!isSpeakingRef.current && !isRecognizingRef.current) {
//     try {
//       recognitionRef.current?.start();
//       console.log("Recognition requested to start");
//     } catch (error) {
//       if (error.name !== "InvalidStateError") {
//         console.error("Start error:", error);
//       }
//     }
//   }
    
//   }

//   const speak=(text)=>{
//     const utterence=new SpeechSynthesisUtterance(text)
//     utterence.lang = 'hi-IN';
//     const voices =window.speechSynthesis.getVoices()
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) {
//       utterence.voice = hindiVoice;
//     }


//     isSpeakingRef.current=true
//     utterence.onend=()=>{
//         setAiText("");
//   isSpeakingRef.current = false;
//   setTimeout(() => {
//     startRecognition(); // ⏳ Delay se race condition avoid hoti hai
//   }, 800);
//     }
//    synth.cancel(); // 🛑 pehle se koi speech ho to band karo
// synth.speak(utterence);
//   }

//   const handleCommand=(data)=>{
//     const {type,userInput,response}=data
//       speak(response);
    
//     if (type === 'google-search') {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.google.com/search?q=${query}`, '_blank');
//     }
//      if (type === 'calculator-open') {
  
//       window.open(`https://www.google.com/search?q=calculator`, '_blank');
//     }
//      if (type === "instagram-open") {
//       window.open(`https://www.instagram.com/`, '_blank');
//     }
//     if (type ==="facebook-open") {
//       window.open(`https://www.facebook.com/`, '_blank');
//     }
//      if (type ==="weather-show") {
//       window.open(`https://www.google.com/search?q=weather`, '_blank');
//     }

//     if (type === 'youtube-search' || type === 'youtube-play') {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
//     }

//   }

// useEffect(() => {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = new SpeechRecognition();

//   recognition.continuous = true;
//   recognition.lang = 'en-US';
//   recognition.interimResults = false;

//   recognitionRef.current = recognition;

//   let isMounted = true;  // flag to avoid setState on unmounted component

//   // Start recognition after 1 second delay only if component still mounted
//   const startTimeout = setTimeout(() => {
//     if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognition.start();
//         console.log("Recognition requested to start");
//       } catch (e) {
//         if (e.name !== "InvalidStateError") {
//           console.error(e);
//         }
//       }
//     }
//   }, 1000);

//   recognition.onstart = () => {
//     isRecognizingRef.current = true;
//     setListening(true);
//   };

//   recognition.onend = () => {
//     isRecognizingRef.current = false;
//     setListening(false);
//     if (isMounted && !isSpeakingRef.current) {
//       setTimeout(() => {
//         if (isMounted) {
//           try {
//             recognition.start();
//             console.log("Recognition restarted");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }
//       }, 1000);
//     }
//   };

//   recognition.onerror = (event) => {
//     console.warn("Recognition error:", event.error);
//     isRecognizingRef.current = false;
//     setListening(false);
//     if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//       setTimeout(() => {
//         if (isMounted) {
//           try {
//             recognition.start();
//             console.log("Recognition restarted after error");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }
//       }, 1000);
//     }
//   };

//   recognition.onresult = async (e) => {
//     const transcript = e.results[e.results.length - 1][0].transcript.trim();
//     if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
//       setAiText("");
//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);
//       const data = await getGeminiResponse(transcript);
//       handleCommand(data);
//       setAiText(data.response);
//       setUserText("");
//     }
//   };


//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
   
//     window.speechSynthesis.speak(greeting);
 

//   return () => {
//     isMounted = false;
//     clearTimeout(startTimeout);
//     recognition.stop();
//     setListening(false);
//     isRecognizingRef.current = false;
//   };
// }, []);




//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
//  <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
//  <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

// <div className='w-full h-[2px] bg-gray-400'></div>
// <h1 className='text-white font-semibold text-[19px]'>History</h1>

// {/* <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//   {userData.history?.map((his)=>(
//     <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
//   ))}
  

// </div> */}
// <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//   {userData.history?.map((his, index) => (
//     <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//   ))}
// </div>


//       </div>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
// <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
//       </div>
//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}
    
//     <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
      
//     </div>
//   )
// }

// export default Home











// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import userImg from "../assets/user.gif";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const isRecognizingRef = useRef(false);
//   const recognitionRef = useRef(null);

//   const synth = window.speechSynthesis;

//   // Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // Start speech recognition
//   const startRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         console.log("Voice recognition started...");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") console.error("Start error:", error);
//       }
//     }
//   };

//   // Speak function
//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;
//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // Initialize Speech Recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//       console.log("Recognition ON");
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (isMounted && !isSpeakingRef.current) setTimeout(() => startRecognition(), 1000);
//     };

//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) setTimeout(() => startRecognition(), 1000);
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
//       console.log("Voice input:", transcript);

//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);

//       let response = "";

//       // ================= Command Handling =================
//       if (transcript.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (transcript.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (transcript.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (transcript.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (transcript.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (transcript.includes("twitter")) {
//         response = "Opening Twitter";
//         window.open("https://www.twitter.com", "_blank");
//       } else if (transcript.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (transcript.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         // Fallback to AI
//         response = await getGeminiResponse(transcript);
//       }
//       // ====================================================

//       setAiText(response);
//       speak(response);
//     };

//     // Optional: Greet user on page load
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     synth.speak(greeting);
//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, [getGeminiResponse, userData.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}

//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;










// CCCCCCCCCCCCCCCCCCCCCCCCCc


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const isRecognizingRef = useRef(false);
//   const recognitionRef = useRef(null);

//   const synth = window.speechSynthesis;

//   // Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // Start speech recognition
//   const startRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         console.log("Voice recognition started...");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") console.error("Start error:", error);
//       }
//     }
//   };

//   // Speak function
//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;
//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//       console.log("Recognition ON");
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (isMounted && !isSpeakingRef.current) setTimeout(() => startRecognition(), 1000);
//     };

//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) setTimeout(() => startRecognition(), 1000);
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       console.log("Transcript:", transcript);

//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);

//       let response = "";

//       const lower = transcript.toLowerCase();

//       // ================= Command Handling =================
//       if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         // Fallback to AI
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }
//       // ====================================================

//       setAiText(response);
//       speak(response);
//     };

//     // Optional: greet user on load
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     synth.speak(greeting);
//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;













// // CCCCCCCCCCCCCCCCCCCc

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const isRecognizingRef = useRef(false);
//   const recognitionRef = useRef(null);

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start speech recognition
//   const startRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         isRecognizingRef.current = true;
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") console.error("Start error:", error);
//       }
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;
//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800); // restart listening
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       isRecognizingRef.current = false;
//       setListening(false);

//       // 🔄 Restart automatically if not speaking
//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       console.log("📝 Transcript:", transcript);

//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       // 🔹 Command handling
//       if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         // 🔹 AI Fallback
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     // 🔹 Greet user on load
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     synth.speak(greeting);
//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;






















// Ccccccccccccccccccccccccccccccccccc


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const isRecognizingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef(""); // ✅ remembers last spoken response

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start speech recognition
//   const startRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         isRecognizingRef.current = true;
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") console.error("Start error:", error);
//       }
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text; // ✅ save last spoken output

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;
//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800); // restart listening
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       isRecognizingRef.current = false;
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       console.log("📝 Transcript:", transcript);

//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       // ✅ Acknowledgment triggers
//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       }

//       // 🔁 Repeat triggers
//       else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatFillers = [
//             "Okay.",
//             "Sure.",
//             "Alright.",
//             "Got it.",
//             "No problem."
//           ];
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again.",
//             "Okay, repeating that for you.",
//             "Sure, I'll go over it again.",
//             "Alright, let me say that once more."
//           ];

//           const useFiller = Math.random() < 0.4;
//           const intro = useFiller
//             ? repeatFillers[Math.floor(Math.random() * repeatFillers.length)]
//             : repeatIntros[Math.floor(Math.random() * repeatIntros.length)];

//           response = intro + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       }

//       // 🌐 Command handling
//       else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       }

//       // 🤖 AI fallback
//       else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     // 🔹 Greet user on load
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     synth.speak(greeting);
//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;


















// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();

//       // Prevent duplicate transcripts
//       if (transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       // ✅ Acknowledgment triggers
//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       }

//       // 🔁 Repeat triggers
//       else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       }

//       // 🌐 Command handling
//       else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       }

//       // 🤖 AI fallback
//       else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     // 🔹 Greet user on load
//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;











// ===================


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function (fixed)
//   const speak = (text) => {
//     lastResponseRef.current = text;

//     // stop recognition before speaking (prevent echo)
//     recognitionRef.current?.stop();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       // restart recognition after speaking
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();

//       // ignore empty or duplicate transcripts
//       if (!transcript || transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       // ignore AI’s own spoken response
//       if (transcript === lastResponseRef.current) return;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       // ✅ Acknowledgment triggers
//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       }

//       // 🔁 Repeat triggers
//       else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       }

//       // 🌐 Command handling
//       else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       }

//       // 🤖 AI fallback
//       else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     // 🔹 Greet user on load
//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;
















// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   // 🆕 new states for typed input
//   const [showInputBox, setShowInputBox] = useState(false);
//   const [typedInput, setTypedInput] = useState("");

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     recognitionRef.current?.stop();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🆕 handle typed input
//   const handleTypedSubmit = async () => {
//     if (!typedInput.trim()) return;

//     setUserText(typedInput);
//     let response = await getGeminiResponse(typedInput);
//     response = response.response || "Something went wrong. Please try again.";

//     setAiText(response);
//     speak(response);
//     setTypedInput("");
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       if (!transcript || transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       if (transcript === lastResponseRef.current) return;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       } else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       } else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         {/* 🆕 Mobile input toggle */}
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
//         {showInputBox && (
//           <div className='flex gap-2 w-full'>
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="px-4 py-2 rounded-lg border border-gray-300 flex-1"
//             />
//             <button onClick={handleTypedSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//               Send
//             </button>
//           </div>
//         )}
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>
//       {/* 🆕 Desktop typed input */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[180px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => setShowInputBox(!showInputBox)}>
//         {showInputBox ? "Close Input" : "Type Message"}
//       </button>
//       {showInputBox && (
//         <div className='absolute top-[260px] right-[20px] flex gap-2'>
//           <input
//             type="text"
//             value={typedInput}
//             onChange={(e) => setTypedInput(e.target.value)}
//             placeholder="Type your message..."
//             className="px-4 py-2 rounded-lg border border-gray-300"
//           />
//           <button onClick={handleTypedSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Send
//           </button>
//         </div>
//       )}

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;





// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import { FiSend } from "react-icons/fi";
// import { MdOutlineEdit } from "react-icons/md";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   // 🆕 new states for typed input
//   const [showInputBox, setShowInputBox] = useState(false);
//   const [typedInput, setTypedInput] = useState("");

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     recognitionRef.current?.stop();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🆕 handle typed input
//   const handleTypedSubmit = async () => {
//     if (!typedInput.trim()) return;

//     setUserText(typedInput);
//     let response = await getGeminiResponse(typedInput);
//     response = response.response || "Something went wrong. Please try again.";

//     setAiText(response);
//     speak(response);
//     setTypedInput("");
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       if (!transcript || transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       if (transcript === lastResponseRef.current) return;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       } else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       } else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         {/* 🆕 Mobile input toggle */}
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
//         {showInputBox && (
//           <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//             <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTypedSubmit}
//               className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//             >
//               <FiSend /> Send
//             </button>
//           </div>
//         )}
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* Desktop buttons */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>
//       {/* 🆕 Desktop typed input */}
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[180px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={() => setShowInputBox(!showInputBox)}>
//         {showInputBox ? "Close Input" : "Type Message"}
//       </button>
//       {showInputBox && (
//         <div className='absolute top-[260px] right-[20px] w-[350px]'>
//           <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//             <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTypedSubmit}
//               className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//             >
//               <FiSend /> Send
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;





















// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import { FiSend } from "react-icons/fi";
// import { MdOutlineEdit } from "react-icons/md";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const [showInputBox, setShowInputBox] = useState(false);
//   const [typedInput, setTypedInput] = useState("");

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     recognitionRef.current?.stop();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🆕 handle typed input
//   const handleTypedSubmit = async () => {
//     if (!typedInput.trim()) return;

//     setUserText(typedInput);
//     let response = await getGeminiResponse(typedInput);
//     response = response.response || "Something went wrong. Please try again.";

//     setAiText(response);
//     speak(response);
//     setTypedInput("");
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       if (!transcript || transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       if (transcript === lastResponseRef.current) return;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       } else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       } else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-20`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
//         {showInputBox && (
//           <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//             <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTypedSubmit}
//               className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//             >
//               <FiSend /> Send
//             </button>
//           </div>
//         )}
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* START: Desktop Sidebar Container */}
//       <div className='absolute top-5 right-5 hidden lg:flex flex-col items-end gap-4 z-10'>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
//           onClick={handleLogOut}
//         >
//           Log Out
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => navigate("/customize")}
//         >
//           Customize Assistant
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => setShowInputBox(!showInputBox)}
//         >
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
        
//         {showInputBox && (
//           <div className='w-[350px]'>
//             <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//               <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//               <input
//                 type="text"
//                 value={typedInput}
//                 onChange={(e) => setTypedInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//               />
//               <button
//                 onClick={handleTypedSubmit}
//                 className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//               >
//                 <FiSend /> Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* END: Desktop Sidebar Container */}


//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;





























// ****************************************************************************************************

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import { FiSend } from "react-icons/fi";
// import { MdOutlineEdit } from "react-icons/md";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const [showInputBox, setShowInputBox] = useState(false);
//   const [typedInput, setTypedInput] = useState("");

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     recognitionRef.current?.stop();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🆕 handle typed input
//   const handleTypedSubmit = async () => {
//     if (!typedInput.trim()) return;

//     setUserText(typedInput);
//     let response = await getGeminiResponse(typedInput);
//     response = response.response || "Something went wrong. Please try again.";

//     setAiText(response);
//     speak(response);
//     setTypedInput("");
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       if (!transcript || transcript === lastTranscriptRef.current) return;
//       lastTranscriptRef.current = transcript;

//       if (transcript === lastResponseRef.current) return;

//       console.log("📝 Transcript:", transcript);
//       setUserText(transcript);

//       let response = "";
//       const lower = transcript.toLowerCase();

//       if (
//         lower.includes("did you understand") ||
//         lower.includes("do you understand") ||
//         lower.includes("understand me") ||
//         lower.includes("are you getting it")
//       ) {
//         const ackReplies = [
//           "Okay, I understand.",
//           "Got it.",
//           "Alright, I see.",
//           "Sure, I understand.",
//           "I got that."
//         ];
//         response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//       } else if (
//         lower.includes("say it again") ||
//         lower.includes("repeat that") ||
//         lower.includes("again please") ||
//         lower.includes("can you repeat") ||
//         lower.includes("one more time") ||
//         lower.includes("repeat once more")
//       ) {
//         if (lastResponseRef.current) {
//           const repeatIntros = [
//             "Sure, here it is once more.",
//             "Of course, let me repeat that for you.",
//             "Alright, I'll say it again.",
//             "No problem, one more time.",
//             "Got it, here it goes again."
//           ];
//           response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//         } else {
//           response = "I don’t have anything to repeat yet.";
//         }
//       } else if (lower.includes("youtube")) {
//         response = "Opening YouTube";
//         window.open("https://www.youtube.com", "_blank");
//       } else if (lower.includes("linkedin")) {
//         response = "Opening LinkedIn";
//         window.open("https://www.linkedin.com", "_blank");
//       } else if (lower.includes("google")) {
//         response = "Opening Google";
//         window.open("https://www.google.com", "_blank");
//       } else if (lower.includes("instagram")) {
//         response = "Opening Instagram";
//         window.open("https://www.instagram.com", "_blank");
//       } else if (lower.includes("facebook")) {
//         response = "Opening Facebook";
//         window.open("https://www.facebook.com", "_blank");
//       } else if (lower.includes("calculator")) {
//         response = "Opening calculator";
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//       } else if (lower.includes("weather")) {
//         response = "Showing weather";
//         window.open("https://www.google.com/search?q=weather", "_blank");
//       } else {
//         const aiResult = await getGeminiResponse(transcript);
//         response = aiResult.response || "Something went wrong. Please try again.";
//       }

//       setAiText(response);
//       speak(response);
//     };

//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-20`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
//         {showInputBox && (
//           <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//             <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTypedSubmit}
//               className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//             >
//               <FiSend /> Send
//             </button>
//           </div>
//         )}
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* START: Desktop Sidebar Container */}
//       <div className='absolute top-5 right-5 hidden lg:flex flex-col items-end gap-4 z-10'>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
//           onClick={handleLogOut}
//         >
//           Log Out
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => navigate("/customize")}
//         >
//           Customize Assistant
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => setShowInputBox(!showInputBox)}
//         >
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
        
//         {showInputBox && (
//           <div className='w-[350px]'>
//             <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//               <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//               <input
//                 type="text"
//                 value={typedInput}
//                 onChange={(e) => setTypedInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//               />
//               <button
//                 onClick={handleTypedSubmit}
//                 className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//               >
//                 <FiSend /> Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* END: Desktop Sidebar Container */}


//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;























// +++++++++++++++++++++++++++++++
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import { FiSend } from "react-icons/fi";
// import { MdOutlineEdit } from "react-icons/md";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const [showInputBox, setShowInputBox] = useState(false);
//   const [typedInput, setTypedInput] = useState("");

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const lastResponseRef = useRef("");
//   const lastTranscriptRef = useRef("");

//   const synth = window.speechSynthesis;

//   // 🔹 Log Out
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   // 🔹 Start recognition
//   const startRecognition = () => {
//     try {
//       if (!isSpeakingRef.current) {
//         recognitionRef.current?.start();
//         setListening(true);
//         console.log("🎤 Voice recognition started...");
//       }
//     } catch (error) {
//       if (error.name !== "InvalidStateError") console.error("Start error:", error);
//     }
//   };

//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     // recognitionRef.current?.stop();
//     if (recognitionRef.current) {
//       recognitionRef.current.abort();   // HARD stop microphone
//     }


//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = synth.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => startRecognition(), 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // 🆕 handle typed input
//   const handleTypedSubmit = async () => {
//     if (!typedInput.trim()) return;

//     setUserText(typedInput);
//     let response = await getGeminiResponse(typedInput);
//     response = response.response || "Something went wrong. Please try again.";

//     setAiText(response);
//     speak(response);
//     setTypedInput("");
//   };

//   // 🔹 Setup recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
//     recognitionRef.current = recognition;

//     let isMounted = true;

//     recognition.onstart = () => {
//       console.log("✅ Recognition ON");
//       setListening(true);
//     };

//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         // setTimeout(() => startRecognition(), 1000);
//         setTimeout(() => startRecognition(), 1500);

//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     // recognition.onresult = async (e) => {
//     //   const transcript = e.results[e.results.length - 1][0].transcript.trim();
//     //   if (!transcript || transcript === lastTranscriptRef.current) return;
//     //   lastTranscriptRef.current = transcript;

//     //   if (transcript === lastResponseRef.current) return;

//     //   console.log("📝 Transcript:", transcript);
//     //   setUserText(transcript);

//     //   let response = "";
//     //   const lower = transcript.toLowerCase();

//     //   if (
//     //     lower.includes("did you understand") ||
//     //     lower.includes("do you understand") ||
//     //     lower.includes("understand me") ||
//     //     lower.includes("are you getting it")
//     //   ) {
//     //     const ackReplies = [
//     //       "Okay, I understand.",
//     //       "Got it.",
//     //       "Alright, I see.",
//     //       "Sure, I understand.",
//     //       "I got that."
//     //     ];
//     //     response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//     //   } else if (
//     //     lower.includes("say it again") ||
//     //     lower.includes("repeat that") ||
//     //     lower.includes("again please") ||
//     //     lower.includes("can you repeat") ||
//     //     lower.includes("one more time") ||
//     //     lower.includes("repeat once more")
//     //   ) {
//     //     if (lastResponseRef.current) {
//     //       const repeatIntros = [
//     //         "Sure, here it is once more.",
//     //         "Of course, let me repeat that for you.",
//     //         "Alright, I'll say it again.",
//     //         "No problem, one more time.",
//     //         "Got it, here it goes again."
//     //       ];
//     //       response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//     //     } else {
//     //       response = "I don’t have anything to repeat yet.";
//     //     }
//     //   } else if (lower.includes("youtube")) {
//     //     response = "Opening YouTube";
//     //     window.open("https://www.youtube.com", "_blank");
//     //   } else if (lower.includes("linkedin")) {
//     //     response = "Opening LinkedIn";
//     //     window.open("https://www.linkedin.com", "_blank");
//     //   } else if (lower.includes("google")) {
//     //     response = "Opening Google";
//     //     window.open("https://www.google.com", "_blank");
//     //   } else if (lower.includes("instagram")) {
//     //     response = "Opening Instagram";
//     //     window.open("https://www.instagram.com", "_blank");
//     //   } else if (lower.includes("facebook")) {
//     //     response = "Opening Facebook";
//     //     window.open("https://www.facebook.com", "_blank");
//     //   } else if (lower.includes("calculator")) {
//     //     response = "Opening calculator";
//     //     window.open("https://www.google.com/search?q=calculator", "_blank");
//     //   } else if (lower.includes("weather")) {
//     //     response = "Showing weather";
//     //     window.open("https://www.google.com/search?q=weather", "_blank");
//     //   } else {
//     //     const aiResult = await getGeminiResponse(transcript);
//     //     response = aiResult.response || "Something went wrong. Please try again.";
//     //   }

//     //   setAiText(response);
//     //   speak(response);
//     // };

//   recognition.onresult = async (event) => {
//     if (isSpeakingRef.current) return;

//     let transcript = "";

//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       transcript += event.results[i][0].transcript;
//     }

//     transcript = transcript.trim();
//     if (!transcript) return;

//     // 🧠 Only accept COMPLETED speech
//     const isFinal = event.results[event.results.length - 1].isFinal;
//     if (!isFinal) return;

//     // prevent echo loops
//     if (transcript === lastTranscriptRef.current) return;
//     lastTranscriptRef.current = transcript;
//     if (transcript === lastResponseRef.current) return;

//     console.log("📝 Final Transcript:", transcript);
//     setUserText(transcript);

//     let response = "";
//     const lower = transcript.toLowerCase();

//     if (
//       lower.includes("did you understand") ||
//       lower.includes("do you understand") ||
//       lower.includes("understand me") ||
//       lower.includes("are you getting it")
//     ) {
//       const ackReplies = [
//         "Okay, I understand.",
//         "Got it.",
//         "Alright, I see.",
//         "Sure, I understand.",
//         "I got that."
//       ];
//       response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
//     }
//     else if (
//       lower.includes("say it again") ||
//       lower.includes("repeat that") ||
//       lower.includes("again please") ||
//       lower.includes("can you repeat") ||
//       lower.includes("one more time") ||
//       lower.includes("repeat once more")
//     ) {
//       if (lastResponseRef.current) {
//         const repeatIntros = [
//           "Sure, here it is once more.",
//           "Of course, let me repeat that for you.",
//           "Alright, I'll say it again.",
//           "No problem, one more time.",
//           "Got it, here it goes again."
//         ];
//         response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
//       } else {
//         response = "I don’t have anything to repeat yet.";
//       }
//     }
//     else if (lower.includes("youtube")) {
//       response = "Opening YouTube";
//       window.open("https://www.youtube.com", "_blank");
//     }
//     else if (lower.includes("linkedin")) {
//       response = "Opening LinkedIn";
//       window.open("https://www.linkedin.com", "_blank");
//     }
//     else if (lower.includes("google")) {
//       response = "Opening Google";
//       window.open("https://www.google.com", "_blank");
//     }
//     else if (lower.includes("instagram")) {
//       response = "Opening Instagram";
//       window.open("https://www.instagram.com", "_blank");
//     }
//     else if (lower.includes("facebook")) {
//       response = "Opening Facebook";
//       window.open("https://www.facebook.com", "_blank");
//     }
//     else if (lower.includes("calculator")) {
//       response = "Opening calculator";
//       window.open("https://www.google.com/search?q=calculator", "_blank");
//     }
//     else if (lower.includes("weather")) {
//       response = "Showing weather";
//       window.open("https://www.google.com/search?q=weather", "_blank");
//     }
//     else {
//       // const aiResult = await getGeminiResponse(transcript);
//       // response = aiResult?.response || "Something went wrong. Please try again.";
//       // const aiResult = await getGeminiResponse(transcript);
//       // response = aiResult?.response || "I am busy, please try again.";


//       const aiResult = await getGeminiResponse(transcript);
//       console.log("🧠 API RESULT:", aiResult);   // <-- ADD THIS

//       response = aiResult?.response;

//       if (!response) {
//         response = "I am busy, please try again.";
//       }

//     }

//     setAiText(response);
//     speak(response);
//   };


//     if (userData?.name) {
//       const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//       greeting.lang = 'hi-IN';
//       synth.speak(greeting);
//     }

//     startRecognition();

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//     };
//   }, [getGeminiResponse, userData?.name]);

//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>
//       {/* Hamburger Menu */}
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-20`}>
//         <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
//         {showInputBox && (
//           <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//             <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//             <input
//               type="text"
//               value={typedInput}
//               onChange={(e) => setTypedInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTypedSubmit}
//               className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//             >
//               <FiSend /> Send
//             </button>
//           </div>
//         )}
//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData?.history?.map((his, index) => (
//             <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       {/* START: Desktop Sidebar Container */}
//       <div className='absolute top-5 right-5 hidden lg:flex flex-col items-end gap-4 z-10'>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
//           onClick={handleLogOut}
//         >
//           Log Out
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => navigate("/customize")}
//         >
//           Customize Assistant
//         </button>
//         <button 
//           className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
//           onClick={() => setShowInputBox(!showInputBox)}
//         >
//           {showInputBox ? "Close Input" : "Type Message"}
//         </button>
        
//         {showInputBox && (
//           <div className='w-[350px]'>
//             <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
//               <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
//               <input
//                 type="text"
//                 value={typedInput}
//                 onChange={(e) => setTypedInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
//               />
//               <button
//                 onClick={handleTypedSubmit}
//                 className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
//               >
//                 <FiSend /> Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* END: Desktop Sidebar Container */}


//       {/* Assistant Image */}
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
//       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
//     </div>
//   );
// }

// export default Home;
























import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const [showInputBox, setShowInputBox] = useState(false);
  const [typedInput, setTypedInput] = useState("");

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const lastResponseRef = useRef("");
  const lastTranscriptRef = useRef("");

  const synth = window.speechSynthesis;

  // 🔹 Log Out
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  // 🔹 Start recognition
  const startRecognition = () => {
    try {
      if (!isSpeakingRef.current) {
        recognitionRef.current?.start();
        setListening(true);
        console.log("🎤 Voice recognition started...");
      }
    } catch (error) {
      if (error.name !== "InvalidStateError") console.error("Start error:", error);
    }
  };

  // 🔹 Speak function
  const speak = (text) => {
    lastResponseRef.current = text;
    // recognitionRef.current?.stop();
    if (recognitionRef.current) {
      // recognitionRef.current.abort();   // HARD stop microphone
      recognitionRef.current.stop();

    }


    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;

    // utterance.onend = () => {
    //   setAiText("");
    //   isSpeakingRef.current = false;
    //   setTimeout(() => startRecognition(), 800);
    // };

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => startRecognition(), 600);
    };


    synth.cancel();
    synth.speak(utterance);
  };

  // 🆕 handle typed input
  const handleTypedSubmit = async () => {
    if (!typedInput.trim()) return;

    setUserText(typedInput);
    let response = await getGeminiResponse(typedInput);
    response = response.response || "Something went wrong. Please try again.";

    setAiText(response);
    speak(response);
    setTypedInput("");
  };

  // 🔹 Setup recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    let isMounted = true;

    recognition.onstart = () => {
      console.log("✅ Recognition ON");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("⛔ Recognition OFF");
      setListening(false);

      // if (isMounted && !isSpeakingRef.current) {
      //   // setTimeout(() => startRecognition(), 1000);
      //   setTimeout(() => startRecognition(), 1500);

      // }
    };

    recognition.onerror = (event) => {
      console.warn("⚠️ Recognition error:", event.error);
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => startRecognition(), 1000);
      }
    };

    // recognition.onresult = async (e) => {
    //   const transcript = e.results[e.results.length - 1][0].transcript.trim();
    //   if (!transcript || transcript === lastTranscriptRef.current) return;
    //   lastTranscriptRef.current = transcript;

    //   if (transcript === lastResponseRef.current) return;

    //   console.log("📝 Transcript:", transcript);
    //   setUserText(transcript);

    //   let response = "";
    //   const lower = transcript.toLowerCase();

    //   if (
    //     lower.includes("did you understand") ||
    //     lower.includes("do you understand") ||
    //     lower.includes("understand me") ||
    //     lower.includes("are you getting it")
    //   ) {
    //     const ackReplies = [
    //       "Okay, I understand.",
    //       "Got it.",
    //       "Alright, I see.",
    //       "Sure, I understand.",
    //       "I got that."
    //     ];
    //     response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
    //   } else if (
    //     lower.includes("say it again") ||
    //     lower.includes("repeat that") ||
    //     lower.includes("again please") ||
    //     lower.includes("can you repeat") ||
    //     lower.includes("one more time") ||
    //     lower.includes("repeat once more")
    //   ) {
    //     if (lastResponseRef.current) {
    //       const repeatIntros = [
    //         "Sure, here it is once more.",
    //         "Of course, let me repeat that for you.",
    //         "Alright, I'll say it again.",
    //         "No problem, one more time.",
    //         "Got it, here it goes again."
    //       ];
    //       response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
    //     } else {
    //       response = "I don’t have anything to repeat yet.";
    //     }
    //   } else if (lower.includes("youtube")) {
    //     response = "Opening YouTube";
    //     window.open("https://www.youtube.com", "_blank");
    //   } else if (lower.includes("linkedin")) {
    //     response = "Opening LinkedIn";
    //     window.open("https://www.linkedin.com", "_blank");
    //   } else if (lower.includes("google")) {
    //     response = "Opening Google";
    //     window.open("https://www.google.com", "_blank");
    //   } else if (lower.includes("instagram")) {
    //     response = "Opening Instagram";
    //     window.open("https://www.instagram.com", "_blank");
    //   } else if (lower.includes("facebook")) {
    //     response = "Opening Facebook";
    //     window.open("https://www.facebook.com", "_blank");
    //   } else if (lower.includes("calculator")) {
    //     response = "Opening calculator";
    //     window.open("https://www.google.com/search?q=calculator", "_blank");
    //   } else if (lower.includes("weather")) {
    //     response = "Showing weather";
    //     window.open("https://www.google.com/search?q=weather", "_blank");
    //   } else {
    //     const aiResult = await getGeminiResponse(transcript);
    //     response = aiResult.response || "Something went wrong. Please try again.";
    //   }

    //   setAiText(response);
    //   speak(response);
    // };

  recognition.onresult = async (event) => {
    if (isSpeakingRef.current) return;

    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    transcript = transcript.trim();
    if (!transcript) return;

    // 🧠 Only accept COMPLETED speech
    const isFinal = event.results[event.results.length - 1].isFinal;
    if (!isFinal) return;

    // prevent echo loops
    if (transcript === lastTranscriptRef.current) return;
    lastTranscriptRef.current = transcript;
    if (transcript === lastResponseRef.current) return;

    console.log("📝 Final Transcript:", transcript);
    setUserText(transcript);

    let response = "";
    const lower = transcript.toLowerCase();

    if (
      lower.includes("did you understand") ||
      lower.includes("do you understand") ||
      lower.includes("understand me") ||
      lower.includes("are you getting it")
    ) {
      const ackReplies = [
        "Okay, I understand.",
        "Got it.",
        "Alright, I see.",
        "Sure, I understand.",
        "I got that."
      ];
      response = ackReplies[Math.floor(Math.random() * ackReplies.length)];
    }
    else if (
      lower.includes("say it again") ||
      lower.includes("repeat that") ||
      lower.includes("again please") ||
      lower.includes("can you repeat") ||
      lower.includes("one more time") ||
      lower.includes("repeat once more")
    ) {
      if (lastResponseRef.current) {
        const repeatIntros = [
          "Sure, here it is once more.",
          "Of course, let me repeat that for you.",
          "Alright, I'll say it again.",
          "No problem, one more time.",
          "Got it, here it goes again."
        ];
        response = repeatIntros[Math.floor(Math.random() * repeatIntros.length)] + " " + lastResponseRef.current;
      } else {
        response = "I don’t have anything to repeat yet.";
      }
    }
    else if (lower.includes("youtube")) {
      response = "Opening YouTube";
      window.open("https://www.youtube.com", "_blank");
    }
    else if (lower.includes("linkedin")) {
      response = "Opening LinkedIn";
      window.open("https://www.linkedin.com", "_blank");
    }
    else if (lower.includes("google")) {
      response = "Opening Google";
      window.open("https://www.google.com", "_blank");
    }
    else if (lower.includes("instagram")) {
      response = "Opening Instagram";
      window.open("https://www.instagram.com", "_blank");
    }
    else if (lower.includes("facebook")) {
      response = "Opening Facebook";
      window.open("https://www.facebook.com", "_blank");
    }
    else if (lower.includes("calculator")) {
      response = "Opening calculator";
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }
    else if (lower.includes("weather")) {
      response = "Showing weather";
      window.open("https://www.google.com/search?q=weather", "_blank");
    }
    else {
      // const aiResult = await getGeminiResponse(transcript);
      // response = aiResult?.response || "Something went wrong. Please try again.";
      // const aiResult = await getGeminiResponse(transcript);
      // response = aiResult?.response || "I am busy, please try again.";


      const aiResult = await getGeminiResponse(transcript);
      console.log("🧠 API RESULT:", aiResult);   // <-- ADD THIS

      response = aiResult?.response;

      if (!response) {
        response = "I am busy, please try again.";
      }

    }

    setAiText(response);
    speak(response);
  };


    if (userData?.name) {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = 'hi-IN';
      synth.speak(greeting);
    }

    startRecognition();

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
    };
  }, [getGeminiResponse, userData?.name]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>
      {/* Hamburger Menu */}
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-20`}>
        <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={() => setShowInputBox(!showInputBox)}>
          {showInputBox ? "Close Input" : "Type Message"}
        </button>
        {showInputBox && (
          <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
            <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
            />
            <button
              onClick={handleTypedSubmit}
              className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <FiSend /> Send
            </button>
          </div>
        )}
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
          {userData?.history?.map((his, index) => (
            <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
          ))}
        </div>
      </div>

      {/* START: Desktop Sidebar Container */}
      <div className='absolute top-5 right-5 hidden lg:flex flex-col items-end gap-4 z-10'>
        <button 
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button 
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>
        <button 
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' 
          onClick={() => setShowInputBox(!showInputBox)}
        >
          {showInputBox ? "Close Input" : "Type Message"}
        </button>
        
        {showInputBox && (
          <div className='w-[350px]'>
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">
              <MdOutlineEdit className="text-gray-300 ml-2" size={22} />
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
              />
              <button
                onClick={handleTypedSubmit}
                className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              >
                <FiSend /> Send
              </button>
            </div>
          </div>
        )}
      </div>
      {/* END: Desktop Sidebar Container */}


      {/* Assistant Image */}
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>

      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
    </div>
  );
}

export default Home;




