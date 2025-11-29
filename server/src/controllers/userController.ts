import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

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
    // console.log("email for login: ", email);

    const user = await prisma.users.findUnique({
      where: {
        email: email as string,
      },
    });

    if (!user || !user.password) {
      res.status(401).json({ message: "User Not found" }); // ✅ return
      return;
    }
    console.log("user: ", user);
    if (user && user.password) {
      let isMatch = false;
      console.log("inside", user.password);
      console.log(JSON.stringify(user.password));
      console.log(user.password.charCodeAt(0));
      

      if (user.password.startsWith("$")) {
        isMatch = await argon2.verify(user.password, password); // hashed comparison
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
    // console.log("token generated", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/login",
    });

    res.setHeader(
      "Set-Cookie",
      serialize("userId", user?.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      })
    );

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
    const { name, email, role, salary } = req.body;
    const user = await prisma.users.update({
      where: {
        userId: id,
      },
      data: {
        name,
        email,
        role,
        salary: parseInt(salary) ?? 0,
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
    // console.log(name, email, password);

    const isUserExists = await prisma.users.findUnique({
      where: {
        email: email as string,
      },
    });

    if (isUserExists) {
      res.status(401).json({
        message: "User already exists",
        data: isUserExists,
      });
      return;
    }

    res.setHeader(
      "Set-Cookie",
      serialize("userId", name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      })
    );

    // password encrypt
    const hashedPassword = await argon2.hash(password);
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        salary: 0,
      },
    });

    res.status(200).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      message: "An error occurred while creating the user in the database.",
      // @ts-expect-error error can be undefined
      error: error.message,
    });
  }
};

export const userActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { action, userId, userId2, username1, username2  } = req.body;

    const user = await prisma.activityLogs.create({
      data: {
        action,
        userId,
        userId2,
        username1,
        username2,
        timestamp: new Date(),
      },
    });

    res.status(200).json({
      message: "Activity Logged successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      message: "An error occurred while creating the user in the database.",
      // @ts-expect-error error can be undefined
      error: error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // console.log(id);
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

export const verifyToken = (req: Request, res: Response, next: any) => {
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
