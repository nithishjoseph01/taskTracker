import express from "express";
import cors from "cors";
import authRoutes from "./auth/route";
import taskRoutes from "./task/route";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
