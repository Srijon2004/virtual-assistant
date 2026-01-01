// import jwt from "jsonwebtoken"
// const isAuth=async (req,res,next)=>{
//     try {
//         const token=req.cookies.token
//         if(!token){
//             return res.status(400).json({message:"token not found"})
//         }
//         const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
//         req.userId=verifyToken.userId

//         next()

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:"is Auth error"})
//     }
// }

// export default isAuth




// okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
// import jwt from "jsonwebtoken";

// const isAuth = (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Token not found" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId; // crucial for askToAssistant

//     next();
//   } catch (error) {
//     console.error("isAuth error:", error.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// export default isAuth;

















// backend/middlewares/isAuth.js
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized — no token" });
    }

    // Verify matches the { userId } payload used in gentoken.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    // Clear cookie if verification fails (e.g., expired)
    res.clearCookie("token");
    return res.status(401).json({ message: "Unauthorized — invalid token" });
  }
};

export default isAuth;