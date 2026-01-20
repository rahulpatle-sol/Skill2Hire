import { Router } from "express";
import { 
    registerUser, 
    verifyOTP,   // NAYA: Import kiya
    loginUser, 
    logoutUser, 
    getCurrentUser 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Public Routes ---

router.route("/register").post(
    upload.single("profilePic"), // Ye hona chahiye FormData handle karne ke liye
    registerUser
);

// NAYA: OTP Verification route
router.route("/verify-otp").post(verifyOTP);

router.route("/login").post(loginUser);

// --- Protected Routes ---

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;