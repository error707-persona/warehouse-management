import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getOneUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("email for login: ", email);

    const user = await prisma.users.findUnique({
      where: {
        email: email as string,
      },
    });

    if (!user || !user.password) {
      res.status(401).json({ message: "User Not found" }); // ✅ return
      return;
    }
    if (user && user.password) {
       let isMatch = false;
      if (user.password.startsWith("$2")) {
        isMatch = await bcrypt.compare(password, user.password); // hashed comparison
      } else {
        isMatch = password === user.password; // plain text fallback
      }
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials!" }); // ✅ return
        return;
      }
    }

    const token = jwt.sign(
      { id: user?.userId, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log("token generated", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login user successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await prisma.users.update({
      where: {
        userId: id,
      },
      data: {
        name,
        email,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    // password encrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await prisma.users.delete({
      where: {
        userId: id,
      },
    });

    res.status(200).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // optionally attach to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in logging out user!" });
  }
};
