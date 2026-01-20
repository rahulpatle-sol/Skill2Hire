import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../db/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Cookie ya Header se token uthao
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Request" });
        }

        // Token verify karo
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Database se user nikaalo (password mat nikaalna)
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});