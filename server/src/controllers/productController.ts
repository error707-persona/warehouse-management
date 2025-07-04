import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    console.log("inside api");
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    console.log(products, "backend products");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retreiving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, rating, stockQuantity, imgUrl } = req.body;
    
    // ✅ Input validation with early return
    // if (!name || price === undefined || stockQuantity === undefined) {
    //    res.status(400).json({ message: "Missing required fields" });
    // }

    const product = await prisma.products.create({
      data: {
        name,
        price,
        rating,
        stockQuantity,
        imgUrl,
      },
    });

    res.status(201).json(product); // ✅ Always return after sending response
  } catch (error: any) {
    console.log("🔥 Prisma error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: error.message || "Internal server error" });
  
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    const product = await prisma.products.update({
      where: {
        productId: id,
      },
      data: {
        name,
        price,
        rating,
        stockQuantity,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.products.delete({
      where: {
        productId: id,
      },
    });

    res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
