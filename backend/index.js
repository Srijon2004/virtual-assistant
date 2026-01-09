import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://aiassistant-cvjv.onrender.com", // 👈 ADD YOUR LIVE FRONTEND URL
    ],
    credentials: true,
  })
);
// const port=process.env.PORT || 5000
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRoutes);
console.log("GROQ KEY:", process.env.GROQ_API_KEY);

// app.listen(port,()=>{
//     connectDb()
//     console.log(`server started at ${port}`)
// })

app.listen(port, () => {
  connectDb();
  console.log(`Server is now connected on port ${port}`);
});
