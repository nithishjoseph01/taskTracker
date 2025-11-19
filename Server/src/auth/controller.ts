import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../storage";
import { JWT_SECRET } from "../middleware/auth";
import { v4 as uuid } from "uuid";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const exists = Object.values(users).find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const userId = uuid();

  users[userId] = { email, passwordHash: hashed, tasks: [] };

  res.json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const entry = Object.entries(users).find(([_, u]) => u.email === email);
  if (!entry) return res.status(400).json({ error: "Invalid credentials" });

  const [userId, user] = entry;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};
