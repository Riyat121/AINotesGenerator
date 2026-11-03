import "dotenv/config";
import express from "express";
import connectDB from "./utils/connectdb.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/generate.route.js";
import pdfRouter from "./routes/pdf.route.js";
import creditRouter from "./routes/credits.route.js";
import { stripeWebhook } from "./controllers/credits.controller.js";

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Webhook sabse pehle, express.json() se pehle (raw body chahiye)
app.post("/api/credits/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("backend is running");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/credits", creditRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});