import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // ✅ Enable detailed logs
});

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    // console.log("inside api");
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    // console.log(products, "backend products");
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
    const product = await prisma.products.create({
      data: {
        name,
        price: parseInt(price),
        stockQuantity: parseInt(stockQuantity),
        rating: parseFloat(rating),
        imgUrl,
      },
    });

    if (product) {
      const purchase = await prisma.purchases.create({
        data: {
          productId: product?.productId,
          timestamp: new Date(),
          quantity: parseInt(stockQuantity),
          unitCost: parseFloat(price),
          totalCost: stockQuantity * price,
        },
      });
      const purchaseSummary = await prisma.purchaseSummary.create({
        data: {
          date: new Date(),
          totalPurchased: parseInt(stockQuantity),
          changePercentage: purchase.quantity,
        },
      });
    }

    // console.log("after product creation");
    res.status(201).json([product]);
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

export const updateSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // console.log("req.body: ", req.body);
    const { id } = req.params;
    const { stockQuantity, quantity, unitPrice, totalAmount } = req.body;
    // console.log("req.body: ", req.body);
    await prisma.products.update({
      where: {
        productId: id,
      },
      data: {
        stockQuantity: parseInt(stockQuantity),
      },
    });

    const sales = await prisma.sales.create({
      data: {
        timestamp: new Date(),
        productId: id,
        quantity: parseInt(quantity) ?? 0,
        unitPrice: parseFloat(unitPrice) ?? 0,
        totalAmount: parseFloat(totalAmount) ?? 0,
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Update Sales error:", error);
    res.status(500).json({ message: "Error updating Sales" });
  }
};
