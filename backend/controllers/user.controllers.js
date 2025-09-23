 import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"
const userCooldowns = new Map();

// Cooldown in milliseconds
const COOLDOWN = 3000; // 3 seconds


 export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
return res.status(400).json({message:"user not found"})
        }

   return res.status(200).json(user)     
    } catch (error) {
       return res.status(400).json({message:"get current user error"}) 
    }
}

export const updateAssistant=async (req,res)=>{
   try {
      const {assistantName,imageUrl}=req.body
      let assistantImage;
if(req.file){
   assistantImage=await uploadOnCloudinary(req.file.path)
}else{
   assistantImage=imageUrl
}

const user=await User.findByIdAndUpdate(req.userId,{
   assistantName,assistantImage
},{new:true}).select("-password")
return res.status(200).json(user)

      
   } catch (error) {
       return res.status(400).json({message:"updateAssistantError user error"}) 
   }
}


// export const askToAssistant=async (req,res)=>{
//    try {
//       const {command}=req.body
//       const user=await User.findById(req.userId);
//       user.history.push(command)
//       user.save()
//       const userName=user.name
//       const assistantName=user.assistantName
//       const result=await geminiResponse(command,assistantName,userName)

//       const jsonMatch=result.match(/{[\s\S]*}/)
//       if(!jsonMatch){
//          return res.ststus(400).json({response:"sorry, i can't understand"})
//       }
//       const gemResult=JSON.parse(jsonMatch[0])
//       console.log(gemResult)
//       const type=gemResult.type

//       switch(type){
//          case 'get-date' :
//             return res.json({
//                type,
//                userInput:gemResult.userInput,
//                response:`current date is ${moment().format("YYYY-MM-DD")}`
//             });
//             case 'get-time':
//                 return res.json({
//                type,
//                userInput:gemResult.userInput,
//                response:`current time is ${moment().format("hh:mm A")}`
//             });
//              case 'get-day':
//                 return res.json({
//                type,
//                userInput:gemResult.userInput,
//                response:`today is ${moment().format("dddd")}`
//             });
//             case 'get-month':
//                 return res.json({
//                type,
//                userInput:gemResult.userInput,
//                response:`today is ${moment().format("MMMM")}`
//             });
//       case 'google-search':
//       case 'youtube-search':
//       case 'youtube-play':
//       case 'general':
//       case  "calculator-open":
//       case "instagram-open": 
//        case "facebook-open": 
//        case "weather-show" :
//          return res.json({
//             type,
//             userInput:gemResult.userInput,
//             response:gemResult.response,
//          });

//          default:
//             return res.status(400).json({ response: "I didn't understand that command." })
//       }
     

//    } catch (error) {
//   return res.status(500).json({ response: "ask assistant error" })
//    }
// }



// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body; // ✅ match frontend sending `command`
//     if (!command) {
//       return res.status(400).json({ type: "error", response: "User input is required", userInput: "" });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(400).json({ type: "error", response: "User not found", userInput: command });
//     }

//     // Save to history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;

//     let result;
//     try {
//       result = await geminiResponse(command, assistantName, userName);
//     } catch (err) {
//       console.error("Gemini service error:", err);
//       return res.status(500).json({ type: "error", response: "AI service failed", userInput: command });
//     }

//     if (!result || typeof result !== "string") {
//       return res.status(500).json({ type: "error", response: "AI returned invalid response", userInput: command });
//     }

//     // Parse JSON safely
//     let gemResult;
//     try {
//       const jsonMatch = result.match(/{[\s\S]*}/);
//       if (!jsonMatch) throw new Error("No JSON found in Gemini response");
//       gemResult = JSON.parse(jsonMatch[0]);
//     } catch (err) {
//       console.error("JSON parse error:", err, "Result:", result);
//       return res.status(400).json({ type: "error", response: "Sorry, I can't understand", userInput: command });
//     }

//     const type = gemResult.type || "general";

//     // Handle commands
//     switch (type) {
//       case "get-date":
//         return res.json({ type, userInput: gemResult.userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
//       case "get-time":
//         return res.json({ type, userInput: gemResult.userInput, response: `Current time is ${moment().format("hh:mm A")}` });
//       case "get-day":
//         return res.json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format("dddd")}` });
//       case "get-month":
//         return res.json({ type, userInput: gemResult.userInput, response: `This month is ${moment().format("MMMM")}` });
//       case "google-search":
//       case "youtube-search":
//       case "youtube-play":
//       case "general":
//       case "calculator-open":
//       case "instagram-open":
//       case "facebook-open":
//       case "weather-show":
//         return res.json({ type, userInput: gemResult.userInput, response: gemResult.response || "Done" });
//       default:
//         return res.json({ type: "error", userInput: gemResult.userInput || command, response: "I didn't understand that command." });
//     }
//   } catch (error) {
//     console.error("askToAssistant error:", error);
//     return res.status(500).json({ type: "error", response: "Internal server error. Please try again.", userInput: req.body.command || "" });
//   }
// };











// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;
//     if (!command) {
//       console.log("No command received");
//       return res.status(400).json({ type: "error", response: "Command is required", userInput: "" });
//     }

//     console.log("Received command:", command);

//     const user = await User.findById(req.userId);
//     if (!user) {
//       console.log("User not found for ID:", req.userId);
//       return res.status(400).json({ type: "error", response: "User not found", userInput: command });
//     }

//     // Save to user history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;

//     let result;
//     try {
//       result = await geminiResponse(command, assistantName, userName);
//       console.log("Raw AI result:", result);
//     } catch (aiError) {
//       console.error("Error calling geminiResponse:", aiError);
//       return res.status(500).json({ type: "error", response: "AI failed to respond", userInput: command });
//     }

//     if (!result || typeof result !== "string") {
//       return res.status(500).json({ type: "error", response: "AI returned invalid response", userInput: command });
//     }

//     const jsonMatch = result.match(/{[\s\S]*}/);
//     if (!jsonMatch) {
//       console.log("No JSON found in AI response:", result);
//       return res.status(400).json({ type: "error", response: "Cannot understand AI response", userInput: command });
//     }

//     let gemResult;
//     try {
//       gemResult = JSON.parse(jsonMatch[0]);
//       console.log("Parsed gemResult:", gemResult);
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError, "with data:", jsonMatch[0]);
//       return res.status(500).json({ type: "error", response: "AI returned malformed JSON", userInput: command });
//     }

//     const type = gemResult.type || "default";
//     const userInput = gemResult.userInput || command;
//     const aiResponse = gemResult.response || "Done";

//     switch (type) {
//       case "get-date":
//         return res.json({ type, userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
//       case "get-time":
//         return res.json({ type, userInput, response: `Current time is ${moment().format("hh:mm A")}` });
//       case "get-day":
//         return res.json({ type, userInput, response: `Today is ${moment().format("dddd")}` });
//       case "get-month":
//         return res.json({ type, userInput, response: `This month is ${moment().format("MMMM")}` });
//       case "google-search":
//       case "youtube-search":
//       case "youtube-play":
//       case "general":
//       case "calculator-open":
//       case "instagram-open":
//       case "facebook-open":
//       case "weather-show":
//         return res.json({ type, userInput, response: aiResponse });
//       default:
//         return res.json({ type: "error", userInput, response: "I didn't understand that command." });
//     }
//   } catch (error) {
//     console.error("askToAssistant uncaught error:", error);
//     return res.status(500).json({ type: "error", response: "Internal server error. Please try again.", userInput: req.body.command || "" });
//   }
// };





// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;
//     if (!command) {
//       console.log("No command received");
//       return res.status(400).json({ type: "error", response: "Command is required", userInput: "" });
//     }

//     console.log("Received command:", command);

//     // Ensure req.userId is present (from your auth middleware)
//     if (!req.userId) {
//         console.error("Authentication error: req.userId not found.");
//         return res.status(401).json({ type: "error", response: "User not authenticated." });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       console.log("User not found for ID:", req.userId);
//       return res.status(404).json({ type: "error", response: "User not found", userInput: command });
//     }

//     // Save to user history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;

//     let rawAiResult;
//     try {
//       rawAiResult = await geminiResponse(command, assistantName, userName);
//     } catch (aiError) {
//       // --- IMPROVED LOGGING ---
//       console.error("Error calling geminiResponse for command:", command, aiError);
//       return res.status(500).json({ type: "error", response: "AI service failed to respond", userInput: command });
//     }

//     if (!rawAiResult || typeof rawAiResult !== "string") {
//       console.error("AI returned an invalid or non-string response:", rawAiResult);
//       return res.status(500).json({ type: "error", response: "AI returned an invalid response", userInput: command });
//     }
    
//     console.log("Raw AI result:", rawAiResult);
    
//     let jsonString = rawAiResult;
    
//     // --- SAFER JSON EXTRACTION ---
//     // This handles cases where the AI wraps the JSON in ```json ... ```
//     const jsonMatch = rawAiResult.match(/```json\s*([\s\S]*?)\s*```/);
//     if (jsonMatch && jsonMatch[1]) {
//         jsonString = jsonMatch[1];
//     } else {
//         // Fallback for plain JSON: find the first '{' to the last '}'
//         const firstBrace = rawAiResult.indexOf('{');
//         const lastBrace = rawAiResult.lastIndexOf('}');
//         if (firstBrace !== -1 && lastBrace > firstBrace) {
//             jsonString = rawAiResult.substring(firstBrace, lastBrace + 1);
//         }
//     }

//     let gemResult;
//     try {
//       gemResult = JSON.parse(jsonString);
//       console.log("Parsed gemResult:", gemResult);
//     } catch (parseError) {
//       // --- IMPROVED LOGGING ---
//       console.error("JSON parse error for command:", command, parseError);
//       console.error("Data that failed to parse:", jsonString);
//       return res.status(500).json({ type: "error", response: "AI returned malformed data", userInput: command });
//     }

//     const type = gemResult.type || "default";
//     const userInput = gemResult.userInput || command;
//     const aiResponse = gemResult.response || "Done";

//     // Your switch statement remains the same
//     switch (type) {
//         case "get-date":
//             return res.json({ type, userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
//         case "get-time":
//             return res.json({ type, userInput, response: `Current time is ${moment().format("hh:mm A")}` });
//         // ... include all your other cases here
//         case "weather-show":
//             return res.json({ type, userInput, response: aiResponse });
//         default:
//             return res.json({ type: "error", userInput, response: "I didn't understand that command." });
//     }

//   } catch (error) {
//     // This is the final safety net for any other unexpected errors
//     console.error("askToAssistant uncaught error:", error);
//     return res.status(500).json({ type: "error", response: "An internal server error occurred.", userInput: req.body.command || "" });
//   }
// };


// import { geminiResponse } from "../services/gemini.service.js";
// import moment from "moment";
// You need to import your User model. The path might be different.
// import { User } from "../models/user.model.js"; 
// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;

//     if (!command) {
//       return res
//         .status(400)
//         .json({ type: "error", response: "Command is required" });
//     }

//     // Fetch the authenticated user from the database
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ type: "error", response: "User not found" });
//     }

//     // Save command to user history
//     user.history.push(command);
//     await user.save();

//     // Call your AI service
//     let rawAiResult;
//     try {
//       rawAiResult = await geminiResponse(command, user.assistantName, user.name);
//     } catch (aiError) {
//       console.error("geminiResponse error:", aiError);
//       return res
//         .status(500)
//         .json({ type: "error", response: "AI service failed." });
//     }

//     // Parse JSON safely
//     let gemResult = { type: "default", response: rawAiResult, userInput: command };
//     try {
//       const jsonMatch = rawAiResult.match(/```json\s*([\s\S]*?)\s*```/);
//       let jsonString = jsonMatch ? jsonMatch[1] : rawAiResult;

//       // Try to extract JSON even if AI returns raw object-like text
//       const firstBrace = jsonString.indexOf("{");
//       const lastBrace = jsonString.lastIndexOf("}");
//       if (firstBrace !== -1 && lastBrace > firstBrace) {
//         jsonString = jsonString.substring(firstBrace, lastBrace + 1);
//       }

//       gemResult = JSON.parse(jsonString);
//     } catch (parseError) {
//       console.warn("Could not parse AI JSON, using raw result:", parseError);
//     }

//     // Extract useful values
//     const type = gemResult.type || "default";
//     const userInput = gemResult.userInput || command;
//     const aiResponse = gemResult.response || rawAiResult || "Done";

//     // Handle special command types
//     switch (type) {
//       case "get-date":
//         return res.json({
//           type,
//           userInput,
//           response: `The date is ${moment().format("MMMM Do, YYYY")}`,
//         });
//       case "get-time":
//         return res.json({
//           type,
//           userInput,
//           response: `The time is ${moment().format("h:mm A")}`,
//         });
//       case "get-day":
//         return res.json({
//           type,
//           userInput,
//           response: `Today is ${moment().format("dddd")}`,
//         });
//       default:
//         return res.json({ type, userInput, response: aiResponse });
//     }
//   } catch (error) {
//     console.error("askToAssistant uncaught error:", error);
//     return res
//       .status(500)
//       .json({ type: "error", response: "An internal server error occurred." });
//   }
// };
















// import moment from "moment";
// import User from "../models/user.model.js";
// import geminiResponse from "../gemini.js";

// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;

//     if (!command) {
//       return res
//         .status(400)
//         .json({ type: "error", response: "Command is required" });
//     }

//     // Fetch the authenticated user
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ type: "error", response: "User not found" });
//     }

//     // Save command to user history
//     user.history.push(command);
//     await user.save();

//     const lowerCommand = command.toLowerCase();

//     // Handle specific commands directly
//     if (lowerCommand.includes("what is your name") || lowerCommand.includes("your name")) {
//       return res.json({
//         type: "get-name",
//         userInput: command,
//         response: `My name is ${user.assistantName || "Assistant"}.`
//       });
//     }

//     if (lowerCommand.includes("date")) {
//       return res.json({
//         type: "get-date",
//         userInput: command,
//         response: `The date is ${moment().format("MMMM Do, YYYY")}`
//       });
//     }

//     if (lowerCommand.includes("time")) {
//       return res.json({
//         type: "get-time",
//         userInput: command,
//         response: `The time is ${moment().format("h:mm A")}`
//       });
//     }

//     if (lowerCommand.includes("day")) {
//       return res.json({
//         type: "get-day",
//         userInput: command,
//         response: `Today is ${moment().format("dddd")}`
//       });
//     }

//     // Call AI service for other commands
//     let rawAiResult;
//     try {
//       rawAiResult = await geminiResponse(command, user.assistantName, user.name);
//     } catch (aiError) {
//       console.error("geminiResponse error:", aiError);
//       return res
//         .status(500)
//         .json({ type: "error", response: "AI service failed." });
//     }

//     // Parse AI response safely
//     let gemResult = { type: "default", response: rawAiResult, userInput: command };
//     try {
//       const jsonMatch = rawAiResult.match(/```json\s*([\s\S]*?)\s*```/);
//       let jsonString = jsonMatch ? jsonMatch[1] : rawAiResult;

//       const firstBrace = jsonString.indexOf("{");
//       const lastBrace = jsonString.lastIndexOf("}");
//       if (firstBrace !== -1 && lastBrace > firstBrace) {
//         jsonString = jsonString.substring(firstBrace, lastBrace + 1);
//       }

//       gemResult = JSON.parse(jsonString);
//     } catch (parseError) {
//       console.warn("Could not parse AI JSON, using raw result:", parseError);
//     }

//     // Return AI result
//     const type = gemResult.type || "default";
//     const userInput = gemResult.userInput || command;
//     const aiResponse = gemResult.response || rawAiResult || "Done";

//     return res.json({ type, userInput, response: aiResponse });
//   } catch (error) {
//     console.error("askToAssistant uncaught error:", error);
//     return res
//       .status(500)
//       .json({ type: "error", response: "An internal server error occurred." });
//   }
// };











// import moment from "moment";
// import User from "../models/user.model.js";
// import geminiResponse from "../gemini.js";

// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;
//     if (!command) {
//       return res.status(400).json({ type: "error", response: "User input is required", userInput: "" });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(400).json({ type: "error", response: "User not found", userInput: command });
//     }

//     // Save to history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;
//     const lowerCommand = command.toLowerCase();

//     // ----- Explicit personal info commands -----
//     if (lowerCommand.includes("what is your name") || lowerCommand.includes("your name")) {
//       return res.json({ type: "get-name", userInput: command, response: `My name is ${assistantName || "Assistant"}.` });
//     }

//     if (lowerCommand.includes("how old are you") || lowerCommand.includes("your age")) {
//       return res.json({ type: "get-age", userInput: command, response: "I am an AI assistant, so I don’t have an age like humans." });
//     }

//     // ----- Call AI service for other commands -----
//     let result;
//     try {
//       result = await geminiResponse(command, assistantName, userName);
//     } catch (err) {
//       console.error("Gemini service error:", err);
//       return res.status(500).json({ type: "error", response: "AI service failed", userInput: command });
//     }

//     if (!result || typeof result !== "string") {
//       return res.status(500).json({ type: "error", response: "AI returned invalid response", userInput: command });
//     }

//     // Parse JSON safely
//     let gemResult;
//     try {
//       const jsonMatch = result.match(/{[\s\S]*}/);
//       if (!jsonMatch) throw new Error("No JSON found in Gemini response");
//       gemResult = JSON.parse(jsonMatch[0]);
//     } catch (err) {
//       console.error("JSON parse error:", err, "Result:", result);
//       return res.status(400).json({ type: "error", response: "Sorry, I can't understand", userInput: command });
//     }

//     const type = gemResult.type || "general";

//     // ----- Handle AI response types -----
//     switch (type) {
//       case "get-date":
//         return res.json({ type, userInput: gemResult.userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
//       case "get-time":
//         return res.json({ type, userInput: gemResult.userInput, response: `Current time is ${moment().format("hh:mm A")}` });
//       case "get-day":
//         return res.json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format("dddd")}` });
//       case "get-month":
//         return res.json({ type, userInput: gemResult.userInput, response: `This month is ${moment().format("MMMM")}` });
//       case "google-search":
//       case "youtube-search":
//       case "youtube-play":
//       case "general":
//       case "calculator-open":
//       case "instagram-open":
//       case "facebook-open":
//       case "weather-show":
//         return res.json({ type, userInput: gemResult.userInput, response: gemResult.response || "Done" });
//       default:
//         return res.json({ type: "error", userInput: gemResult.userInput || command, response: "I didn't understand that command." });
//     }
//   } catch (error) {
//     console.error("askToAssistant error:", error);
//     return res.status(500).json({ type: "error", response: "Internal server error. Please try again.", userInput: req.body.command || "" });
//   }
// };











// import moment from "moment";
// import User from "../models/user.model.js";
// import geminiResponse from "../gemini.js";

// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;

//     if (!command) {
//       return res.status(400).json({
//         type: "error",
//         response: "User input is required",
//         userInput: ""
//       });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(400).json({
//         type: "error",
//         response: "User not found",
//         userInput: command
//       });
//     }

//     // Save command to user history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;
//     const lowerCommand = command.toLowerCase();

//     // ----- Explicit common commands -----

//     if (lowerCommand.includes("what is your name") || lowerCommand.includes("your name")) {
//       return res.json({
//         type: "get-name",
//         userInput: command,
//         response: `My name is ${assistantName || "Assistant"}.`
//       });
//     }

//     if (lowerCommand.includes("how old are you") || lowerCommand.includes("your age")) {
//       return res.json({
//         type: "get-age",
//         userInput: command,
//         response: "I am an AI assistant, so I don’t have an age like humans."
//       });
//     }

//     if (lowerCommand.includes("how are you")) {
//       return res.json({
//         type: "get-status",
//         userInput: command,
//         response: "I am doing great! How about you?"
//       });
//     }

//     if (lowerCommand.includes("date")) {
//       return res.json({
//         type: "get-date",
//         userInput: command,
//         response: `Current date is ${moment().format("YYYY-MM-DD")}`
//       });
//     }

//     if (lowerCommand.includes("time")) {
//       return res.json({
//         type: "get-time",
//         userInput: command,
//         response: `Current time is ${moment().format("hh:mm A")}`
//       });
//     }

//     if (lowerCommand.includes("day")) {
//       return res.json({
//         type: "get-day",
//         userInput: command,
//         response: `Today is ${moment().format("dddd")}`
//       });
//     }

//     if (lowerCommand.includes("month")) {
//       return res.json({
//         type: "get-month",
//         userInput: command,
//         response: `This month is ${moment().format("MMMM")}`
//       });
//     }

//     // ----- Fallback to AI -----
//     let result = "";
//     try {
//       result = await geminiResponse(command, assistantName, userName);
//     } catch (err) {
//       console.error("Gemini service error:", err);
//       return res.status(500).json({
//         type: "error",
//         response: "AI service failed",
//         userInput: command
//       });
//     }

//     // ----- Safe JSON parse with fallback -----
//     let gemResult;
//     try {
//       const jsonMatch = result.match(/{[\s\S]*}/);
//       if (jsonMatch) {
//         gemResult = JSON.parse(jsonMatch[0]);
//       } else {
//         gemResult = { type: "general", response: result, userInput: command };
//       }
//     } catch (err) {
//       console.warn("JSON parse error, using raw result:", err);
//       gemResult = { type: "general", response: result || "I couldn't understand that.", userInput: command };
//     }

//     // ----- Return final response -----
//     return res.json({
//       type: gemResult.type || "general",
//       userInput: gemResult.userInput || command,
//       response: gemResult.response || "Done"
//     });

//   } catch (error) {
//     console.error("askToAssistant error:", error);
//     return res.status(500).json({
//       type: "error",
//       response: "Internal server error. Please try again.",
//       userInput: req.body.command || ""
//     });
//   }
// };











// export const askToAssistant = async (req, res) => {
//   try {
//     const { command } = req.body;

//     if (!command) {
//       return res.status(400).json({
//         type: "error",
//         response: "User input is required",
//         userInput: ""
//       });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(400).json({
//         type: "error",
//         response: "User not found",
//         userInput: command
//       });
//     }

//     // Save command to user history
//     user.history.push(command);
//     await user.save();

//     const assistantName = user.assistantName;
//     const userName = user.name;
//     const lowerCommand = command.toLowerCase();

//     // ----- Explicit common commands -----
//     if (lowerCommand.includes("what is your name") || lowerCommand.includes("your name")) {
//       return res.json({ type: "get-name", userInput: command, response: `My name is ${assistantName || "Assistant"}.` });
//     }
//     if (lowerCommand.includes("how old are you") || lowerCommand.includes("your age")) {
//       return res.json({ type: "get-age", userInput: command, response: "I am an AI assistant, so I don’t have an age like humans." });
//     }
//     if (lowerCommand.includes("how are you")) {
//       return res.json({ type: "get-status", userInput: command, response: "I am doing great! How about you?" });
//     }
//     if (lowerCommand.includes("date")) {
//       return res.json({ type: "get-date", userInput: command, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
//     }
//     if (lowerCommand.includes("time")) {
//       return res.json({ type: "get-time", userInput: command, response: `Current time is ${moment().format("hh:mm A")}` });
//     }
//     if (lowerCommand.includes("day")) {
//       return res.json({ type: "get-day", userInput: command, response: `Today is ${moment().format("dddd")}` });
//     }
//     if (lowerCommand.includes("month")) {
//       return res.json({ type: "get-month", userInput: command, response: `This month is ${moment().format("MMMM")}` });
//     }

//     // ----- Fallback to AI with retry for 429 -----
//     const callGemini = async (retries = 3, delay = 3000) => {
//       try {
//         return await geminiResponse(command, assistantName, userName);
//       } catch (err) {
//         if (err.response?.status === 429 && retries > 0) {
//           console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
//           await new Promise(r => setTimeout(r, delay));
//           return callGemini(retries - 1, delay * 2); // exponential backoff
//         }
//         throw err;
//       }
//     };

//     let result = "";
//     try {
//       result = await callGemini();
//     } catch (err) {
//       console.error("Gemini service error:", err);
//       return res.json({ type: "general", userInput: command, response: "Sorry, the AI service is busy. Please try again in a few seconds." });
//     }

//     // ----- Safe JSON parse -----
//     let gemResult;
//     try {
//       const jsonMatch = result.match(/{[\s\S]*}/);
//       if (jsonMatch) {
//         gemResult = JSON.parse(jsonMatch[0]);
//       } else {
//         gemResult = { type: "general", response: result, userInput: command };
//       }
//     } catch (err) {
//       console.warn("JSON parse error, using raw result:", err);
//       gemResult = { type: "general", response: result || "I couldn't understand that.", userInput: command };
//     }

//     return res.json({
//       type: gemResult.type || "general",
//       userInput: gemResult.userInput || command,
//       response: gemResult.response || "Done"
//     });

//   } catch (error) {
//     console.error("askToAssistant error:", error);
//     return res.status(500).json({
//       type: "error",
//       response: "Internal server error. Please try again.",
//       userInput: req.body.command || ""
//     });
//   }
// };









export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const userId = req.userId;

    if (!command) {
      return res.status(400).json({
        type: "error",
        response: "User input is required",
        userInput: ""
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        type: "error",
        response: "User not found",
        userInput: command
      });
    }

    // ----- Check cooldown -----
    const lastRequest = userCooldowns.get(userId);
    const now = Date.now();
    if (lastRequest && now - lastRequest < COOLDOWN) {
      return res.json({
        type: "general",
        userInput: command,
        response: "Please wait a few seconds before sending another request."
      });
    }

    // Update last request time
    userCooldowns.set(userId, now);

    // Save command to user history
    user.history.push(command);
    await user.save();

    const assistantName = user.assistantName;
    const userName = user.name;
    const lowerCommand = command.toLowerCase();

    // ----- Explicit common commands -----
    if (lowerCommand.includes("what is your name") || lowerCommand.includes("your name")) {
      return res.json({ type: "get-name", userInput: command, response: `My name is ${assistantName || "Assistant"}.` });
    }
    if (lowerCommand.includes("how old are you") || lowerCommand.includes("your age")) {
      return res.json({ type: "get-age", userInput: command, response: "I am an AI assistant, so I don’t have an age like humans." });
    }
    if (lowerCommand.includes("how are you")) {
      return res.json({ type: "get-status", userInput: command, response: "I am doing great! How about you?" });
    }
    if (lowerCommand.includes("date")) {
      return res.json({ type: "get-date", userInput: command, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
    }
    if (lowerCommand.includes("time")) {
      return res.json({ type: "get-time", userInput: command, response: `Current time is ${moment().format("hh:mm A")}` });
    }
    if (lowerCommand.includes("day")) {
      return res.json({ type: "get-day", userInput: command, response: `Today is ${moment().format("dddd")}` });
    }
    if (lowerCommand.includes("month")) {
      return res.json({ type: "get-month", userInput: command, response: `This month is ${moment().format("MMMM")}` });
    }

    // ----- Fallback to AI with retry for 429 -----
    const callGemini = async (retries = 3, delay = 3000) => {
      try {
        const result = await geminiResponse(command, assistantName, userName);
        return result;
      } catch (err) {
        if (err.response?.status === 429 && retries > 0) {
          console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
          return callGemini(retries - 1, delay * 2);
        }
        console.error("Gemini API error:", err.response?.data || err.message);
        return null;
      }
    };

    let result = await callGemini();

    if (!result) {
      return res.json({
        type: "general",
        userInput: command,
        response: "Sorry, the AI service is busy or rate-limited. Please try again in a few seconds."
      });
    }

    // ----- Safe JSON parse -----
    let gemResult;
    try {
      const jsonMatch = result.match(/{[\s\S]*}/);
      gemResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { type: "general", response: result, userInput: command };
    } catch (err) {
      console.warn("JSON parse error, using raw result:", err);
      gemResult = { type: "general", response: result || "I couldn't understand that.", userInput: command };
    }

    return res.json({
      type: gemResult.type || "general",
      userInput: gemResult.userInput || command,
      response: gemResult.response || "Done"
    });

  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({
      type: "error",
      response: "Internal server error. Please try again.",
      userInput: req.body.command || ""
    });
  }
};