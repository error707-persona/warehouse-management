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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSales = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
var client_1 = require("@prisma/client");
// import { sendProductNotification } from "../../kafka/producer";
var cookie = require("cookie");
// import {startConsumer} from "../../kafka/consumer"
// import WebSocket, { WebSocketServer } from 'ws';
// import http from 'http';
var prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"], // ✅ Enable detailed logs
});
var getProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, products, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
                return [4 /*yield*/, prisma.products.findMany({
                        where: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    })];
            case 1:
                products = _b.sent();
                // console.log(products, "backend products");
                res.status(200).json(products);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error retrieving products:", error_1);
                res.status(500).json({ message: "Error retreiving products" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, price, rating, stockQuantity, imgUrl, cookies, userId, product, purchase, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, name_1 = _a.name, price = _a.price, rating = _a.rating, stockQuantity = _a.stockQuantity, imgUrl = _a.imgUrl;
                cookies = cookie.parse(req.headers.cookie || "");
                userId = cookies.userId;
                return [4 /*yield*/, prisma.products.create({
                        data: {
                            name: name_1,
                            price: parseInt(price),
                            stockQuantity: parseInt(stockQuantity),
                            rating: parseFloat(rating),
                            imgUrl: imgUrl,
                        },
                    })];
            case 1:
                product = _b.sent();
                if (!product) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.purchases.create({
                        data: {
                            productId: product === null || product === void 0 ? void 0 : product.productId,
                            timestamp: new Date(),
                            quantity: parseInt(stockQuantity),
                            unitCost: parseFloat(price),
                            totalCost: stockQuantity * price,
                        },
                    })];
            case 2:
                purchase = _b.sent();
                return [4 /*yield*/, prisma.purchaseSummary.create({
                        data: {
                            date: new Date(),
                            totalPurchased: parseInt(stockQuantity),
                            changePercentage: purchase.quantity,
                        },
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                // try {
                //   await sendProductNotification(name);
                // } catch (error) {
                //   console.error("❌ Kafka Error:", error);
                // }
                // console.log("after product creation");
                res.status(201).json(product);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.log("🔥 Prisma error:", JSON.stringify(error_2, null, 2));
                res.status(500).json({ message: error_2.message || "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, price, rating, stockQuantity, product, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name_2 = _a.name, price = _a.price, rating = _a.rating, stockQuantity = _a.stockQuantity;
                return [4 /*yield*/, prisma.products.update({
                        where: {
                            productId: id,
                        },
                        data: {
                            name: name_2,
                            price: price,
                            rating: rating,
                            stockQuantity: stockQuantity,
                        },
                    })];
            case 1:
                product = _b.sent();
                res.status(200).json(product);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Update error:", error_3);
                res.status(500).json({ message: "Error updating product" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
var deleteProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                console.log(id);
                return [4 /*yield*/, prisma.purchases.deleteMany({
                        where: {
                            productId: id,
                        },
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, prisma.sales.deleteMany({
                        where: {
                            productId: id,
                        },
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, prisma.products.delete({
                        where: {
                            productId: id,
                        },
                    })];
            case 3:
                product = _a.sent();
                res.status(200).json({
                    message: "Product deleted successfully",
                    data: product,
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Delete error:", error_4);
                res.status(500).json({ message: "Error deleting product" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
var updateSales = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, stockQuantity, quantity, unitPrice, totalAmount, sales, lastQuantity, changePercentage, error_5;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a = req.body, stockQuantity = _a.stockQuantity, quantity = _a.quantity, unitPrice = _a.unitPrice, totalAmount = _a.totalAmount;
                // console.log("req.body: ", req.body);
                return [4 /*yield*/, prisma.products.update({
                        where: {
                            productId: id,
                        },
                        data: {
                            stockQuantity: parseInt(stockQuantity),
                        },
                    })];
            case 1:
                // console.log("req.body: ", req.body);
                _j.sent();
                return [4 /*yield*/, prisma.sales.create({
                        data: {
                            timestamp: new Date(),
                            productId: id,
                            quantity: (_b = parseInt(quantity)) !== null && _b !== void 0 ? _b : 0,
                            unitPrice: (_c = parseFloat(unitPrice)) !== null && _c !== void 0 ? _c : 0,
                            totalAmount: (_d = parseFloat(totalAmount)) !== null && _d !== void 0 ? _d : 0,
                        },
                    })];
            case 2:
                sales = _j.sent();
                return [4 /*yield*/, prisma.salesSummary.findFirst({
                        orderBy: {
                            date: "desc",
                        },
                    })];
            case 3:
                lastQuantity = _j.sent();
                changePercentage = (Math.abs((_e = lastQuantity === null || lastQuantity === void 0 ? void 0 : lastQuantity.totalValue) !== null && _e !== void 0 ? _e : 0 - quantity) /
                    ((_f = lastQuantity === null || lastQuantity === void 0 ? void 0 : lastQuantity.totalValue) !== null && _f !== void 0 ? _f : 1)) *
                    100;
                if ((_g = lastQuantity === null || lastQuantity === void 0 ? void 0 : lastQuantity.totalValue) !== null && _g !== void 0 ? _g : 0 > quantity)
                    changePercentage -= changePercentage;
                console.log("calculated changepercentage for salessummary: ", changePercentage);
                return [4 /*yield*/, prisma.salesSummary.create({
                        data: {
                            date: new Date(),
                            changePercentage: changePercentage,
                            totalValue: (_h = parseInt(quantity)) !== null && _h !== void 0 ? _h : 0,
                        },
                    })];
            case 4:
                _j.sent();
                res.status(200).json(sales);
                return [3 /*break*/, 6];
            case 5:
                error_5 = _j.sent();
                console.error("Update Sales error:", error_5);
                res.status(500).json({ message: "Error updating Sales" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateSales = updateSales;
