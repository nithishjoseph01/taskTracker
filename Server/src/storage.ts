export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface User {
  email: string;
  passwordHash: string;
  tasks: Task[];
}

export const users: Record<string, User> = {};
