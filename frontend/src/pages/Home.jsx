
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
//   const shouldListenRef = useRef(true); // 👈 NEW
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

//   useEffect(() => {
//     window.speechSynthesis.onvoiceschanged = () => {};
//   }, []);


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

//   // 2nd new
//   const startRecognition = () => {
//   shouldListenRef.current = true;
//   try {
//     recognitionRef.current?.start();
//     setListening(true);
//   } catch(e) {}
// };

// const stopRecognition = () => {
//   shouldListenRef.current = false;
//   recognitionRef.current?.stop();
//   setListening(false);
// };
//   // 🔹 Speak function
//   const speak = (text) => {
//     lastResponseRef.current = text;
//     // recognitionRef.current?.stop();
//     if (recognitionRef.current) {
//       // recognitionRef.current.abort();   // HARD stop microphone
//       recognitionRef.current.stop();
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
//       setTimeout(() => startRecognition(), 600);
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

//     // 2nd
//     recognition.onend = () => {
//       console.log("⛔ Recognition OFF");
//       setListening(false);

//       // TRUE AUTO-HEAL LOOP
//       if (shouldListenRef.current && !isSpeakingRef.current) {
//         setTimeout(() => {
//           try { recognition.start(); } catch(e) {}
//         }, 700);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("⚠️ Recognition error:", event.error);
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

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
//       setTimeout(() => {
//         speak(`Hello ${userData.name}, what can I help you with?`);
//       }, 600);
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
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const [showInputBox, setShowInputBox] = useState(false);
  const [typedInput, setTypedInput] = useState("");

  // ==============================
  // REFS
  // ==============================

  const shouldListenRef = useRef(true);
  const isSpeakingRef = useRef(false);

  const recognitionRef = useRef(null);
  const restartTimerRef = useRef(null);
  const isMountedRef = useRef(false);

  const lastResponseRef = useRef("");
  const lastTranscriptRef = useRef("");

  // Keep latest API function without recreating SpeechRecognition
  const getGeminiResponseRef = useRef(getGeminiResponse);

  // ==============================
  // UPDATE API FUNCTION REF
  // ==============================

  useEffect(() => {
    getGeminiResponseRef.current = getGeminiResponse;
  }, [getGeminiResponse]);

  // ==============================
  // SPEECH SYNTHESIS
  // ==============================

  const synth = window.speechSynthesis;

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  // ==============================
  // LOG OUT
  // ==============================

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      });

      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  // ==============================
  // START RECOGNITION
  // ==============================

  const startRecognition = () => {
    if (!recognitionRef.current) return;
    if (!isMountedRef.current) return;
    if (isSpeakingRef.current) return;

    shouldListenRef.current = true;

    try {
      recognitionRef.current.start();
    } catch (error) {
      // Ignore "already started" errors
    }
  };

  // ==============================
  // STOP RECOGNITION
  // ==============================

  const stopRecognition = () => {
    shouldListenRef.current = false;

    clearTimeout(restartTimerRef.current);

    try {
      recognitionRef.current?.stop();
    } catch (error) {
      // Recognition may already be stopped
    }

    setListening(false);
  };

  // ==============================
  // SPEAK FUNCTION
  // ==============================

  const speak = (text) => {
    if (!text) return;

    lastResponseRef.current = text;

    // Stop listening while assistant is speaking
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Recognition may already be stopped
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'hi-IN';

    const voices = synth.getVoices();

    const hindiVoice = voices.find(
      (voice) => voice.lang === 'hi-IN'
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      if (!isMountedRef.current) return;

      setAiText("");
      isSpeakingRef.current = false;

      setTimeout(() => {
        if (
          isMountedRef.current &&
          shouldListenRef.current
        ) {
          startRecognition();
        }
      }, 600);
    };

    utterance.onerror = () => {
      if (!isMountedRef.current) return;

      isSpeakingRef.current = false;

      if (shouldListenRef.current) {
        setTimeout(() => {
          if (
            isMountedRef.current &&
            shouldListenRef.current
          ) {
            startRecognition();
          }
        }, 600);
      }
    };

    synth.cancel();
    synth.speak(utterance);
  };

  // ==============================
  // TYPED INPUT
  // ==============================

  const handleTypedSubmit = async () => {
    if (!typedInput.trim()) return;

    const text = typedInput.trim();

    setUserText(text);

    try {
      const result = await getGeminiResponseRef.current(text);

      const response =
        result?.response ||
        "Something went wrong. Please try again.";

      setAiText(response);

      speak(response);
    } catch (error) {
      console.error("❌ Typed input error:", error);

      const response =
        "Something went wrong. Please try again.";

      setAiText(response);
      speak(response);
    }

    setTypedInput("");
  };

  // ==============================
  // SPEECH RECOGNITION SETUP
  // ==============================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "⚠️ Speech Recognition is not supported in this browser."
      );
      return;
    }

    isMountedRef.current = true;
    shouldListenRef.current = true;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    // ==============================
    // RECOGNITION START
    // ==============================

    recognition.onstart = () => {
      if (!isMountedRef.current) return;

      console.log("✅ Recognition ON");

      setListening(true);
    };

    // ==============================
    // RECOGNITION END
    // ==============================

    recognition.onend = () => {
      if (!isMountedRef.current) return;

      console.log("⛔ Recognition OFF");

      setListening(false);

      /*
        If recognition stopped naturally or because the assistant
        finished speaking, restart it only when we actually want
        to listen.
      */

      if (
        shouldListenRef.current &&
        !isSpeakingRef.current
      ) {
        clearTimeout(restartTimerRef.current);

        restartTimerRef.current = setTimeout(() => {
          if (
            isMountedRef.current &&
            shouldListenRef.current &&
            !isSpeakingRef.current
          ) {
            try {
              recognition.start();
            } catch (error) {
              // Ignore "already started" errors
            }
          }
        }, 700);
      }
    };

    // ==============================
    // RECOGNITION ERROR
    // ==============================

    recognition.onerror = (event) => {
      console.warn(
        "⚠️ Recognition error:",
        event.error
      );

      if (!isMountedRef.current) return;

      setListening(false);

      /*
        "aborted" normally happens when recognition is
        intentionally stopped.

        IMPORTANT:
        We do NOT start recognition directly from here.
        onend() handles the restart.

        This prevents:

        ON → OFF → aborted → ON → OFF → aborted → ...
      */

      if (event.error === "aborted") {
        return;
      }

      /*
        For other errors, allow onend to handle recovery.
      */
    };

    // ==============================
    // RECOGNITION RESULT
    // ==============================

    recognition.onresult = async (event) => {
      if (!isMountedRef.current) return;

      if (isSpeakingRef.current) return;

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      transcript = transcript.trim();

      if (!transcript) return;

      // Only accept completed speech
      const isFinal =
        event.results[
          event.results.length - 1
        ].isFinal;

      if (!isFinal) return;

      // Prevent duplicate transcript
      if (
        transcript === lastTranscriptRef.current
      ) {
        return;
      }

      lastTranscriptRef.current = transcript;

      // Prevent assistant voice echo
      if (
        transcript === lastResponseRef.current
      ) {
        return;
      }

      console.log(
        "📝 Final Transcript:",
        transcript
      );

      setUserText(transcript);

      let response = "";

      const lower = transcript.toLowerCase();

      // ==============================
      // UNDERSTANDING COMMAND
      // ==============================

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

        response =
          ackReplies[
            Math.floor(
              Math.random() * ackReplies.length
            )
          ];
      }

      // ==============================
      // REPEAT COMMAND
      // ==============================

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

          response =
            repeatIntros[
              Math.floor(
                Math.random() *
                  repeatIntros.length
              )
            ] +
            " " +
            lastResponseRef.current;
        } else {
          response =
            "I don’t have anything to repeat yet.";
        }
      }

      // ==============================
      // YOUTUBE
      // ==============================

      else if (lower.includes("youtube")) {
        response = "Opening YouTube";

        window.open(
          "https://www.youtube.com",
          "_blank"
        );
      }

      // ==============================
      // LINKEDIN
      // ==============================

      else if (lower.includes("linkedin")) {
        response = "Opening LinkedIn";

        window.open(
          "https://www.linkedin.com",
          "_blank"
        );
      }

      // ==============================
      // GOOGLE
      // ==============================

      else if (lower.includes("google")) {
        response = "Opening Google";

        window.open(
          "https://www.google.com",
          "_blank"
        );
      }

      // ==============================
      // INSTAGRAM
      // ==============================

      else if (lower.includes("instagram")) {
        response = "Opening Instagram";

        window.open(
          "https://www.instagram.com",
          "_blank"
        );
      }

      // ==============================
      // FACEBOOK
      // ==============================

      else if (lower.includes("facebook")) {
        response = "Opening Facebook";

        window.open(
          "https://www.facebook.com",
          "_blank"
        );
      }

      // ==============================
      // CALCULATOR
      // ==============================

      else if (lower.includes("calculator")) {
        response = "Opening calculator";

        window.open(
          "https://www.google.com/search?q=calculator",
          "_blank"
        );
      }

      // ==============================
      // WEATHER
      // ==============================

      else if (lower.includes("weather")) {
        response = "Showing weather";

        window.open(
          "https://www.google.com/search?q=weather",
          "_blank"
        );
      }

      // ==============================
      // GEMINI / AI RESPONSE
      // ==============================

      else {
        try {
          const aiResult =
            await getGeminiResponseRef.current(
              transcript
            );

          console.log(
            "🧠 API RESULT:",
            aiResult
          );

          response = aiResult?.response;

          if (!response) {
            response =
              "I am busy, please try again.";
          }
        } catch (error) {
          console.error(
            "❌ AI response error:",
            error
          );

          response =
            "Something went wrong. Please try again.";
        }
      }

      if (!isMountedRef.current) return;

      setAiText(response);

      speak(response);
    };

    // ==============================
    // INITIAL START
    // ==============================

    try {
      recognition.start();
    } catch (error) {
      console.warn(
        "⚠️ Could not start recognition:",
        error
      );
    }

    // ==============================
    // CLEANUP
    // ==============================

    return () => {
      console.log(
        "🧹 Cleaning up speech recognition"
      );

      /*
        IMPORTANT:

        Tell every pending callback that we no longer
        want recognition to continue.
      */

      isMountedRef.current = false;
      shouldListenRef.current = false;

      // Cancel pending restart
      clearTimeout(
        restartTimerRef.current
      );

      // Remove all event handlers first
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;

      try {
        recognition.stop();
      } catch (error) {
        // Recognition already stopped
      }

      // Clear reference only if this is the same instance
      if (
        recognitionRef.current === recognition
      ) {
        recognitionRef.current = null;
      }

      setListening(false);
    };
  }, []);

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>

      {/* ==============================
          HAMBURGER MENU
      ============================== */}

      <CgMenuRight
        className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
        onClick={() => setHam(true)}
      />

      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
          ham
            ? "translate-x-0"
            : "translate-x-full"
        } transition-transform z-20`}
      >
        <RxCross1
          className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHam(false)}
        />

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]'
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]'
          onClick={() =>
            navigate("/customize")
          }
        >
          Customize Assistant
        </button>

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]'
          onClick={() =>
            setShowInputBox(!showInputBox)
          }
        >
          {showInputBox
            ? "Close Input"
            : "Type Message"}
        </button>

        {showInputBox && (
          <div className="flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">

            <MdOutlineEdit
              className="text-gray-300 ml-2"
              size={22}
            />

            <input
              type="text"
              value={typedInput}
              onChange={(e) =>
                setTypedInput(e.target.value)
              }
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
            />

            <button
              onClick={handleTypedSubmit}
              className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <FiSend />
              Send
            </button>

          </div>
        )}

        <div className='w-full h-[2px] bg-gray-400'></div>

        <h1 className='text-white font-semibold text-[19px]'>
          History
        </h1>

        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
          {userData?.history?.map(
            (his, index) => (
              <div
                key={index}
                className='text-gray-200 text-[18px] w-full h-[30px]'
              >
                {his}
              </div>
            )
          )}
        </div>
      </div>

      {/* ==============================
          DESKTOP SIDEBAR
      ============================== */}

      <div className='absolute top-5 right-5 hidden lg:flex flex-col items-end gap-4 z-10'>

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]'
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]'
          onClick={() =>
            navigate("/customize")
          }
        >
          Customize Assistant
        </button>

        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]'
          onClick={() =>
            setShowInputBox(!showInputBox)
          }
        >
          {showInputBox
            ? "Close Input"
            : "Type Message"}
        </button>

        {showInputBox && (
          <div className='w-[350px]'>

            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg">

              <MdOutlineEdit
                className="text-gray-300 ml-2"
                size={22}
              />

              <input
                type="text"
                value={typedInput}
                onChange={(e) =>
                  setTypedInput(e.target.value)
                }
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
              />

              <button
                onClick={handleTypedSubmit}
                className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              >
                <FiSend />
                Send
              </button>

            </div>
          </div>
        )}
      </div>

      {/* ==============================
          ASSISTANT IMAGE
      ============================== */}

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>

        <img
          src={userData?.assistantImage}
          alt=""
          className='h-full object-cover'
        />

      </div>

      {/* ==============================
          ASSISTANT NAME
      ============================== */}

      <h1 className='text-white text-[18px] font-semibold'>
        I'm {userData?.assistantName}
      </h1>

      {/* ==============================
          USER / AI ANIMATION
      ============================== */}

      {!aiText && (
        <img
          src={userImg}
          alt=""
          className='w-[200px]'
        />
      )}

      {aiText && (
        <img
          src={aiImg}
          alt=""
          className='w-[200px]'
        />
      )}

      {/* ==============================
          TEXT
      ============================== */}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>
        {userText || aiText || null}
      </h1>

    </div>
  );
}

export default Home;