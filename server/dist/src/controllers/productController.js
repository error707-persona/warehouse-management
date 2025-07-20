"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSales = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"], // ✅ Enable detailed logs
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        // console.log("inside api");
        const products = yield prisma.products.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        // console.log(products, "backend products");
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Error retreiving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, rating, stockQuantity, imgUrl } = req.body;
        const product = yield prisma.products.create({
            data: {
                name,
                price: parseInt(price),
                stockQuantity: parseInt(stockQuantity),
                rating: parseFloat(rating),
                imgUrl,
            },
        });
        if (product) {
            const purchase = yield prisma.purchases.create({
                data: {
                    productId: product === null || product === void 0 ? void 0 : product.productId,
                    timestamp: new Date(),
                    quantity: parseInt(stockQuantity),
                    unitCost: parseFloat(price),
                    totalCost: stockQuantity * price,
                },
            });
            const purchaseSummary = yield prisma.purchaseSummary.create({
                data: {
                    date: new Date(),
                    totalPurchased: parseInt(stockQuantity),
                    changePercentage: purchase.quantity,
                },
            });
        }
        // console.log("after product creation");
        res.status(201).json([product]);
    }
    catch (error) {
        console.log("🔥 Prisma error:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, rating, stockQuantity } = req.body;
        const product = yield prisma.products.update({
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
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prisma.products.delete({
            where: {
                productId: id,
            },
        });
        res.status(200).json({
            message: "Product deleted successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
const updateSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // console.log("req.body: ", req.body);
        const { id } = req.params;
        const { stockQuantity, quantity, unitPrice, totalAmount } = req.body;
        // console.log("req.body: ", req.body);
        yield prisma.products.update({
            where: {
                productId: id,
            },
            data: {
                stockQuantity: parseInt(stockQuantity),
            },
        });
        const sales = yield prisma.sales.create({
            data: {
                timestamp: new Date(),
                productId: id,
                quantity: (_a = parseInt(quantity)) !== null && _a !== void 0 ? _a : 0,
                unitPrice: (_b = parseFloat(unitPrice)) !== null && _b !== void 0 ? _b : 0,
                totalAmount: (_c = parseFloat(totalAmount)) !== null && _c !== void 0 ? _c : 0,
            },
        });
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Update Sales error:", error);
        res.status(500).json({ message: "Error updating Sales" });
    }
});
exports.updateSales = updateSales;
