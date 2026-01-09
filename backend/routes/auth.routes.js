import express from "express"
import { Login, logOut, signUp, googleLogin } from "../controllers/auth.controllers.js"

const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.get("/logout",logOut)
authRouter.post("/google", googleLogin)
export default authRouter