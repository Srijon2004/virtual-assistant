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