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
exports.logout = exports.verifyToken = exports.deleteUser = exports.userActivity = exports.addUser = exports.updateUser = exports.getOneUsers = exports.getUsers = void 0;
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var cookie_1 = require("cookie");
var prisma = new client_1.PrismaClient();
var JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.users.findMany()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var getOneUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma.users.findUnique({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user || !user.password) {
                    res.status(401).json({ message: "User Not found" }); // ✅ return
                    return [2 /*return*/];
                }
                if (!(user && user.password)) return [3 /*break*/, 5];
                isMatch = false;
                if (!user.password.startsWith("$2")) return [3 /*break*/, 3];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isMatch = _b.sent(); // hashed comparison
                return [3 /*break*/, 4];
            case 3:
                isMatch = password === user.password; // plain text fallback
                _b.label = 4;
            case 4:
                if (!isMatch) {
                    res.status(401).json({ message: "Invalid credentials!" }); // ✅ return
                    return [2 /*return*/];
                }
                _b.label = 5;
            case 5:
                token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.userId, email: user.email }, JWT_SECRET, {
                    expiresIn: "1d",
                });
                // console.log("token generated", token);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    path: "/login",
                });
                res.setHeader("Set-Cookie", (0, cookie_1.serialize)("userId", user === null || user === void 0 ? void 0 : user.userId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600,
                    path: "/",
                }));
                res.status(200).json({
                    message: "Login user successfully",
                    data: user,
                });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).json({ message: "Server error", error: error_2 });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getOneUsers = getOneUsers;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_1, email, role, salary, user, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name_1 = _a.name, email = _a.email, role = _a.role, salary = _a.salary;
                return [4 /*yield*/, prisma.users.update({
                        where: {
                            userId: id,
                        },
                        data: {
                            name: name_1,
                            email: email,
                            role: role,
                            salary: (_b = parseInt(salary)) !== null && _b !== void 0 ? _b : 0,
                        },
                    })];
            case 1:
                user = _c.sent();
                res.status(200).json({
                    message: "User updated successfully",
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                console.error("Update error:", error_3);
                res.status(500).json({ message: "Error updating product" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var addUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, email, password, isUserExists, hashedPassword, user, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_2 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma.users.findUnique({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                isUserExists = _b.sent();
                if (isUserExists) {
                    res.status(401).json({
                        message: "User already exists",
                        data: isUserExists,
                    });
                    return [2 /*return*/];
                }
                res.setHeader("Set-Cookie", (0, cookie_1.serialize)("userId", name_2, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600,
                    path: "/",
                }));
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, prisma.users.create({
                        data: {
                            name: name_2,
                            email: email,
                            password: hashedPassword,
                            role: "Admin",
                            salary: 0,
                        },
                    })];
            case 3:
                user = _b.sent();
                res.status(200).json({
                    message: "User created successfully",
                    data: user,
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error("Create error:", error_4);
                res.status(500).json({
                    message: "An error occurred while creating the user in the database.",
                    // @ts-expect-error error can be undefined
                    error: error_4.message,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addUser = addUser;
var userActivity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, action, userId, userId2, username1, username2, user, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, action = _a.action, userId = _a.userId, userId2 = _a.userId2, username1 = _a.username1, username2 = _a.username2;
                return [4 /*yield*/, prisma.activityLogs.create({
                        data: {
                            action: action,
                            userId: userId,
                            userId2: userId2,
                            username1: username1,
                            username2: username2,
                            timestamp: new Date(),
                        },
                    })];
            case 1:
                user = _b.sent();
                res.status(200).json({
                    message: "Activity Logged successfully",
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error("Create error:", error_5);
                res.status(500).json({
                    message: "An error occurred while creating the user in the database.",
                    // @ts-expect-error error can be undefined
                    error: error_5.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.userActivity = userActivity;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.users.delete({
                        where: {
                            userId: id,
                        },
                    })];
            case 1:
                user = _a.sent();
                res.status(200).json({
                    message: "User deleted successfully",
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Delete error:", error_6);
                res.status(500).json({ message: "Error deleting user" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var verifyToken = function (req, res, next) {
    var token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // optionally attach to req
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.clearCookie("token");
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error in logging out user!" });
        }
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
