import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// --- HR Job Post Karega ---
const postJob = asyncHandler(async (req, res) => {
    const { title, description, location, salary } = req.body;

    // 1. Check karo ki login user HR hai ya nahi (Auth Middleware handle karega par safety ke liye)
    if (req.user.role !== "HR") {
        return res.status(403).json({ message: "Only HRs can post jobs" });
    }

    // 2. HR ki profile dhundo (Kyuki Job Recruiter table se link hai)
    const hrProfile = await prisma.recruiter.findUnique({
        where: { userId: req.user.id }
    });

    if (!hrProfile) return res.status(404).json({ message: "HR profile not found" });

    // 3. Job create karo
    const job = await prisma.job.create({
        data: {
            title,
            description,
            location,
            salary,
            postedById: hrProfile.id
        }
    });

    return res.status(201).json(new ApiResponse(201, job, "Job posted successfully!"));
});

// --- HR apni post ki hui Jobs monitor karega ---
const getMyJobs = asyncHandler(async (req, res) => {
    const hrProfile = await prisma.recruiter.findUnique({
        where: { userId: req.user.id },
        include: {
            jobs: {
                include: {
                    _count: { select: { applications: true } } // Count kitne logo ne apply kiya
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse(200, hrProfile.jobs, "Jobs fetched successfully"));
});

// --- Job details with all applicants (HR dashboard ke liye) ---
const getJobApplicants = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const jobWithApplicants = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            applications: {
                include: {
                    talent: {
                        include: { user: true } // Applicant ka naam, email, pic sab mil jayega
                    }
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse(200, jobWithApplicants, "Applicants fetched"));
});

export { postJob, getMyJobs, getJobApplicants };