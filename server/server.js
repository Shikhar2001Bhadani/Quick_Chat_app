import { app, server } from "./socket/socket.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// ✅ Error Handling Middleware
import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
