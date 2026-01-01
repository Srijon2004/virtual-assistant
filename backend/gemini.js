// import axios from "axios"
// const geminiResponse=async (command,assistantName,userName)=>{
// try {
//     const apiUrl=process.env.GEMINI_API_URL
//     const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
// You are not Google. You will now behave like a voice-enabled assistant.

// Your task is to understand the user's natural language input and respond with a JSON object like this:

// {
//   "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show"
//   ,
//   "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

//   "response": "<a short spoken response to read out loud to the user>"
// }

// Instructions:
// - "type": determine the intent of the user.
// - "userinput": original sentence the user spoke.
// - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

// Type meanings:
// - "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
// - "google-search": if user wants to search something on Google .
// - "youtube-search": if user wants to search something on YouTube.
// - "youtube-play": if user wants to directly play a video or song.
// - "calculator-open": if user wants to  open a calculator .
// - "instagram-open": if user wants to  open instagram .
// - "facebook-open": if user wants to open facebook.
// -"weather-show": if user wants to know weather
// - "get-time": if user asks for current time.
// - "get-date": if user asks for today's date.
// - "get-day": if user asks what day it is.
// - "get-month": if user asks for the current month.

// Important:
// - Use ${userName} agar koi puche tume kisne banaya 
// - Only respond with the JSON object, nothing else.


// now your userInput- ${command}
// `;





//     const result=await axios.post(apiUrl,{
//     "contents": [{
//     "parts":[{"text": prompt}]
//     }]
//     })
// return result.data.candidates[0].content.parts[0].text
// } catch (error) {
//     console.log(error)
// }
// }

// export default geminiResponse













// .8888888888888888888888888888888

// import axios from "axios"

// let lastCall = 0;

// const geminiResponse = async (command, assistantName, userName) => {

//   // ⛔ Anti-spam protection (2 sec gap)
//   if (Date.now() - lastCall < 2000) {
//     return JSON.stringify({
//       type: "general",
//       userInput: command,
//       response: "Please speak slowly."
//     });
//   }

//   lastCall = Date.now();

//   try {

//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`;
//     // const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;
//     //  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_KEY}`;


//     const prompt = `
// Return ONLY this JSON:

// {
//  "type":"general | google-search | youtube-search | youtube-play | get-time | get-date | get-day | get-month | calculator-open | instagram-open | facebook-open | weather-show",
//  "userInput":"${command}",
//  "response":"short voice reply"
// }

// Rules:
// - Assistant name is ${assistantName}
// - Creator is ${userName}
// - Short responses only
// - No extra text
// `;







// //     const prompt = `
// // You are a voice assistant.

// // User asked: "${command}"

// // Return ONLY this JSON:

// // {
// //  "type":"general | google-search | youtube-search | youtube-play | get-time | get-date | get-day | get-month | calculator-open | instagram-open | facebook-open | weather-show",
// //  "userInput":"${command}",
// //  "response":"short clear spoken answer to the user"
// // }

// // Rules:
// // - Assistant name is ${assistantName}
// // - Creator is ${userName}
// // - Keep reply short and friendly
// // - NO extra text. Only JSON.
// // `;

//     const result = await axios.post(apiUrl, {
//       contents: [{ parts: [{ text: prompt }] }]
//     });

//     return result.data.candidates[0].content.parts[0].text;

//   } catch (err) {

//     if (err.response?.status === 429) {
//       return JSON.stringify({
//         type: "general",
//         userInput: command,
//         response: "I am busy, please try again."
//       });
//     }

//     console.log(err);
//   }
// };

// export default geminiResponse;














import axios from "axios";

let lastCall = 0;

const geminiResponse = async (command, assistantName, userName) => {

  if (Date.now() - lastCall < 2000) {
    return {
      type: "general",
      userInput: command,
      response: "Please speak slowly."
    };
  }

  lastCall = Date.now();

  try {
    // const apiUrl =
    //   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
    //   process.env.GEMINI_KEY;
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" +
      process.env.GEMINI_KEY;



    const prompt = `
Return ONLY valid JSON:

{
 "type":"general | google-search | youtube-search | youtube-play | get-time | get-date | get-day | get-month | calculator-open | instagram-open | facebook-open | weather-show",
 "userInput":"${command}",
 "response":"short voice reply"
}

Rules:
- Assistant name is ${assistantName}
- Creator is ${userName}
- Short replies only
- No extra text

User Question: ${command}
`;

    // const result = await axios.post(apiUrl, {
    //   contents: [{ role: "user", parts: [{ text: prompt }] }],
    //   generationConfig: {
    //     temperature: 0.2,
    //     maxOutputTokens: 200
    //   }
    // });

    const result = await axios.post(apiUrl, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt + "\nUser Question: " + command }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200
      }
    });


    const raw = result.data.candidates[0].content.parts[0].text;
    return JSON.parse(raw);

  } catch (err) {
    console.log("Gemini Error:", err.response?.data || err.message);
    return {
      type: "general",
      userInput: command,
      response: "Sorry, the AI service is busy or rate-limited. Please try again in a few seconds."
    };
  }
};

export default geminiResponse;












// ********************************************************
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// const geminiResponse = async (command, assistantName, userName) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `
// User asked: "${command}"
// Reply with a short clear spoken answer.
// `;

//   const result = await model.generateContent(prompt);
//   return {
//     type: "general",
//     userInput: command,
//     response: result.response.text()
//   };
// };

// export default geminiResponse;
