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

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const userId = req.userId;

    if (!command || !command.trim()) {
      return res.status(400).json({
        type: "error",
        response: "User input is required",
        userInput: ""
      });
    }

    const cleanCommand = command.trim();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        type: "error",
        response: "User not found",
        userInput: cleanCommand
      });
    }

    // ==============================
    // SAVE COMMAND TO HISTORY
    // ==============================

    user.history.push(cleanCommand);
    await user.save();

    const assistantName = user.assistantName;
    const userName = user.name;
    const lowerCommand = cleanCommand.toLowerCase();

    // ==============================
    // EXPLICIT COMMON COMMANDS
    // ==============================

    if (
      lowerCommand.includes("what is your name") ||
      lowerCommand.includes("your name")
    ) {
      return res.json({
        type: "get-name",
        userInput: cleanCommand,
        response: `My name is ${
          assistantName || "Assistant"
        }.`
      });
    }

    if (
      lowerCommand.includes("how old are you") ||
      lowerCommand.includes("your age")
    ) {
      return res.json({
        type: "get-age",
        userInput: cleanCommand,
        response:
          "I am an AI assistant, so I don’t have an age like humans."
      });
    }

    if (lowerCommand.includes("how are you")) {
      return res.json({
        type: "get-status",
        userInput: cleanCommand,
        response: "I am doing great! How about you?"
      });
    }

    if (lowerCommand.includes("date")) {
      return res.json({
        type: "get-date",
        userInput: cleanCommand,
        response: `Current date is ${moment().format(
          "YYYY-MM-DD"
        )}`
      });
    }

    if (lowerCommand.includes("time")) {
      return res.json({
        type: "get-time",
        userInput: cleanCommand,
        response: `Current time is ${moment().format(
          "hh:mm A"
        )}`
      });
    }

    if (lowerCommand.includes("day")) {
      return res.json({
        type: "get-day",
        userInput: cleanCommand,
        response: `Today is ${moment().format(
          "dddd"
        )}`
      });
    }

    if (lowerCommand.includes("month")) {
      return res.json({
        type: "get-month",
        userInput: cleanCommand,
        response: `This month is ${moment().format(
          "MMMM"
        )}`
      });
    }

    // ==============================
    // GEMINI / AI REQUEST
    // ==============================

    const callGemini = async (
      retries = 3,
      delay = 3000
    ) => {
      try {
        const result = await geminiResponse(
          cleanCommand,
          assistantName,
          userName
        );

        return result;

      } catch (err) {

        if (
          err.response?.status === 429 &&
          retries > 0
        ) {
          console.warn(
            `Rate limit hit. Retrying in ${
              delay / 1000
            }s...`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, delay)
          );

          return callGemini(
            retries - 1,
            delay * 2
          );
        }

        console.error(
          "Gemini API error:",
          err.response?.data ||
            err.message
        );

        return null;
      }
    };

    const result = await callGemini();

    // ==============================
    // AI FAILED
    // ==============================

    if (!result) {
      return res.json({
        type: "general",
        userInput: cleanCommand,
        response:
          "Sorry, the AI service is temporarily unavailable. Please try again."
      });
    }

    // ==============================
    // SAFE JSON PARSE
    // ==============================

    let gemResult = result;

    if (typeof gemResult === "string") {
      try {
        gemResult = JSON.parse(gemResult);
      } catch {
        gemResult = {
          response: gemResult
        };
      }
    }

    // ==============================
    // FINAL RESPONSE
    // ==============================

    return res.json({
      type:
        gemResult?.type ||
        "general",

      userInput: cleanCommand,

      response:
        gemResult?.response ||
        gemResult?.text ||
        "I couldn't generate a response."
    });

  } catch (error) {

    console.error(
      "askToAssistant error:",
      error
    );

    return res.status(500).json({
      type: "error",
      response:
        "Internal server error. Please try again.",
      userInput:
        req.body?.command || ""
    });
  }
};