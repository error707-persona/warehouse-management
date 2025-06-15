import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
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

export const addUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password
      },
    });

    res.status(201).json({
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
    console.log(id)
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
