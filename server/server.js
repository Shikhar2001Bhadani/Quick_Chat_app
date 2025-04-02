import { app, server } from "./socket/socket.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

connectDB();


app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : [process.env.CLIENT_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    activeStatus: true,
    error: false,
    message: "Server is running 🚀",
  });
});

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
