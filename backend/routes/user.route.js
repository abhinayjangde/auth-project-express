import express from "express"
import { getMe, loginUser, logoutUser, registerUser, verifyUser } from "../controllers/user.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.get("/verify/:token", verifyUser)
router.post("/login", loginUser)
router.get("/me", isLoggedIn, getMe )
router.get("/logout", isLoggedIn, logoutUser )


export default router