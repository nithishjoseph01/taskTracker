import { Response } from "express";
import { users } from "../storage";
import { v4 as uuid } from "uuid";
import { AuthedRequest } from "../middleware/auth";

export const getTasks = (req: AuthedRequest, res: Response) => {
    const userId = req.userId;
    if (!userId || !users[userId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!users[userId].tasks) users[userId].tasks = [];

    res.json(users[userId].tasks);
};

export const createTask = (req: AuthedRequest, res: Response) => {
    const userId = req.userId;
    if (!userId || !users[userId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const task = {
        id: uuid(),
        title,
        completed: false,
        createdAt: new Date(),
    };

    users[userId].tasks.push(task);
    res.json(task);
};

export const updateTask = (req: AuthedRequest, res: Response) => {
    const userId = req.userId;
    if (!userId || !users[userId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users[userId];
    const task = user.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
};

export const deleteTask = (req: AuthedRequest, res: Response) => {
    const userId = req.userId;
    if (!userId || !users[userId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    users[userId].tasks = users[userId].tasks.filter(
        t => t.id !== req.params.id
    );

    res.json({ message: "Deleted" });
};
