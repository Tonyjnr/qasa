import "dotenv/config"; // Load environment variables first
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite dev server
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
// Auth routes removed for Clerk migration

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
