import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter);
import jobRouter from "./routes/job.routes.js";
app.use("/api/v1/jobs", jobRouter);
// app.js mein ye add karo
import adminRouter from "./routes/admin.routes.js" // Naya admin router
app.use("/api/v1/admin", adminRouter);
import managerRouter from "./routes/manager.routes.js";
app.use("/api/v1/manager", managerRouter);
export { app };