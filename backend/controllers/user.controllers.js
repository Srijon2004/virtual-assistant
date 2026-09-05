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
    // let gemResult;
    // try {
    //   const jsonMatch = result.match(/{[\s\S]*}/);
    //   gemResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { type: "general", response: result, userInput: command };
    // } catch (err) {
    //   console.warn("JSON parse error, using raw result:", err);
    //   gemResult = { type: "general", response: result || "I couldn't understand that.", userInput: command };
    // }


    let gemResult = result;

    if (typeof gemResult === "string") {
      try { gemResult = JSON.parse(gemResult); } catch {
        gemResult = { response: gemResult };
      }
    }



    // return res.json({
    //   type: gemResult.type || "general",
    //   userInput: gemResult.userInput || command,
    //   response: gemResult.response || "Done"
    // });

    return res.json({
      type: gemResult.type || "general",
      userInput: command,
      response: gemResult.response || gemResult.text || "I am busy, please try again."
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