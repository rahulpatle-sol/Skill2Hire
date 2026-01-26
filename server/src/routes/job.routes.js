import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postJob, getMyJobs, getJobApplicants,updateApplicationStatus } from "../controllers/job.controller.js";

const router = Router();

// Saare routes protected hain (Sirf logged-in users ke liye)
router.use(verifyJWT); 

router.route("/post-job").post(postJob);
router.route("/my-jobs").get(getMyJobs);
router.route("/applicants/:jobId").get(getJobApplicants);
router.route("/status/:applicationId").patch(updateApplicationStatus);

export default router;