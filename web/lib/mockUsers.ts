// Mock user storage for testing (replace with database in production)
// This is a simple in-memory storage that persists during the Next.js dev server runtime

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Initialize with some test users
let mockUsers: User[] = [
  { id: 1, name: 'Test User', email: 'test@example.com', password: 'password123' },
  { id: 2, name: 'Demo User', email: 'demo@example.com', password: 'demo123' }
];

let nextId = 3;

export const getUsers = () => mockUsers;

export const findUserByEmail = (email: string) => {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (name: string, email: string, password: string) => {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    id: nextId++,
    name,
    email,
    password
  };

  mockUsers.push(newUser);
  return newUser;
};

export const authenticateUser = (email: string, password: string) => {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  // Simple password check (in production, use bcrypt)
  if (password !== user.password) {
    return null;
  }

  return user;
};
