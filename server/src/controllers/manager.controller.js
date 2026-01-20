import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { prisma } from "../db/index.js";

// 1. Get Team Members
const getMyTeam = asyncHandler(async (req, res) => {
    if (req.user.role !== "MANAGER" && req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only Managers can view team members" });
    }

    const team = await prisma.user.findMany({
        where: { managerId: req.user.id },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profilePic: true,
            isVerified: true // Ye bhi add kar diya taaki status dikhe
        }
    });

    return res.status(200).json(new ApiResponse(200, team, "Team fetched successfully"));
});

// 2. Verify Talent (Iska use Manager karega talent ko active karne ke liye)
const verifyTalent = asyncHandler(async (req, res) => {
    const { talentId } = req.body; // Frontend se talent ki ID aayegi

    if (!talentId) {
        throw new ApiError(400, "Talent ID is required");
    }

    // Check if user is MANAGER or ADMIN
    if (req.user.role !== "MANAGER" && req.user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized: Only Managers can verify talent");
    }

    // DB mein user ko find karke update karo
    const updatedUser = await prisma.user.update({
        where: { 
            id: talentId,
            managerId: req.user.id // Security check: Sirf apne hi team member ko verify kar sake
        },
        data: {
            isVerified: true
        }
    });

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Talent verified successfully")
    );
});

export { getMyTeam, verifyTalent };