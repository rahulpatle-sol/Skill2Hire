import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/mailSender.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, role, companyName } = req.body;

    if ([fullName, email, password, role].some((field) => field?.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase().trim() } 
    });
    
    if (existedUser) return res.status(400).json({ message: "User already exists" });

    // --- OTP LOGIC & DEBUG LOG ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Ye raha tera debug log terminal ke liye
    console.log("------------------------------------------");
    console.log(`🚀 DEBUG: OTP for ${email} is [ ${otp} ]`);
    console.log("------------------------------------------");

    const profilePicLocalPath = req.file?.path;
    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                fullName: fullName.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role,
                profilePic: profilePic || null,
                otp,            
                otpExpiry,      
                isVerified: false 
            },
        });

        if (role === "TALENT") {
            await tx.talent.create({ data: { userId: newUser.id } });
        } else if (role === "HR") {
            await tx.recruiter.create({ 
                data: { userId: newUser.id, companyName: companyName || "Independent" } 
            });
        }
        return newUser;
    });

    // Email sending ko non-blocking rakha hai
    sendEmail({
        email: user.email,
        subject: "Welcome to sKILL2HIRE - Verify OTP",
        html: `<h1>Hi ${user.fullName}</h1><p>Your verification OTP is: <b>${otp}</b></p>`
    }).catch(err => console.error("📧 Email send failed:", err.message));

    return res.status(201).json(
        new ApiResponse(201, { userId: user.id }, "User registered. Check console for OTP.")
    );
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase().trim() } 
    });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    await prisma.user.update({
        where: { email: user.email },
        data: { isVerified: true, otp: null, otpExpiry: null }
    });

    return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase().trim() } 
    });
    
    if (!user) return res.status(404).json({ message: "User nahi mila" });

    if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user, accessToken }, "Login successful!"));
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = { httpOnly: true, secure: true };
    return res.status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, verifyOTP, loginUser, logoutUser, getCurrentUser };