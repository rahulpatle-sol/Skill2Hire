import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { emailQueue } from "../queues/emailQueue.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// Generate JWT Token Helper
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// 1. REGISTER
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, role, companyName } = req.body;

    if ([fullName, email, password, role].some(f => f?.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existedUser) return res.status(400).json({ message: "User exists" });

    const profilePicLocalPath = req.file?.path;
    let profilePicUrl = null;
    if (profilePicLocalPath) {
        const cloud = await uploadOnCloudinary(profilePicLocalPath);
        profilePicUrl = cloud?.url;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email.toLowerCase()}`, otp, "EX", 300); // 5 min expiry

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: { fullName, email: email.toLowerCase(), password: hashedPassword, role, profilePic: profilePicUrl, isVerified: false }
        });
        if (role === "TALENT") await tx.talent.create({ data: { userId: newUser.id } });
        else if (role === "HR") await tx.recruiter.create({ data: { userId: newUser.id, companyName: companyName || "Independent" } });
        return newUser;
    });

    await emailQueue.add("sendOTP", {
        email: user.email,
        subject: "Verify Your Account",
        html: `<h1>Code: ${otp}</h1><p>Valid for 5 mins.</p>`
    });

    return res.status(201).json(new ApiResponse(201, { email: user.email }, "User registered. OTP sent."));
});

// 2. VERIFY OTP
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = await redis.get(`otp:${email.toLowerCase()}`);

    if (!storedOtp || storedOtp !== otp) return res.status(400).json({ message: "Invalid/Expired OTP" });

    await redis.del(`otp:${email.toLowerCase()}`);
    await prisma.user.update({ where: { email: email.toLowerCase() }, data: { isVerified: true } });

    return res.status(200).json(new ApiResponse(200, {}, "Verified!"));
});

// 3. GOOGLE CALLBACK
const googleAuthSuccess = asyncHandler(async (req, res) => {
    const user = req.user;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${user.email}`, otp, "EX", 300);

    await emailQueue.add("googleOTP", {
        email: user.email,
        subject: "Security Verification",
        html: `<h1>Security Code: ${otp}</h1>`
    });

    res.redirect(`http://localhost:5173/verify-otp?email=${user.email}&source=google`);
});

// 4. FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = Math.random().toString(36).substring(2);
    await redis.set(`reset:${resetToken}`, email.toLowerCase(), "EX", 600); // 10 min

    const link = `http://localhost:5173/reset-password/${resetToken}`;
    await emailQueue.add("resetPass", { email, subject: "Reset Password", html: `<a href="${link}">Reset Now</a>` });

    res.status(200).json(new ApiResponse(200, {}, "Reset link sent."));
});

// LOGIN, LOGOUT & GET_CURRENT (Baki logic as it is)
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify email" });

    const accessToken = generateToken(user);
    return res.status(200).cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { user, accessToken }, "Login success"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
    // req.user humein auth middleware (JWT verify) se milta hai
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
    
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export { registerUser, verifyOTP, googleAuthSuccess, forgotPassword, loginUser,
    getCurrentUser,
    logoutUser
 };