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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verifyToken = exports.deleteUser = exports.userActivity = exports.addUser = exports.updateUser = exports.getOneUsers = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = require("cookie");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getUsers = getUsers;
const getOneUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // console.log("email for login: ", email);
        const user = yield prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!user || !user.password) {
            res.status(401).json({ message: "User Not found" }); // ✅ return
            return;
        }
        if (user && user.password) {
            let isMatch = false;
            if (user.password.startsWith("$2")) {
                isMatch = yield bcryptjs_1.default.compare(password, user.password); // hashed comparison
            }
            else {
                isMatch = password === user.password; // plain text fallback
            }
            if (!isMatch) {
                res.status(401).json({ message: "Invalid credentials!" }); // ✅ return
                return;
            }
        }
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.userId, email: user.email }, JWT_SECRET, {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getOneUsers = getOneUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, email, role, salary } = req.body;
        const user = yield prisma.users.update({
            where: {
                userId: id,
            },
            data: {
                name,
                email,
                role,
                salary: (_a = parseInt(salary)) !== null && _a !== void 0 ? _a : 0,
            },
        });
        res.status(200).json({
            message: "User updated successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateUser = updateUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // console.log(name, email, password);
        const isUserExists = yield prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (isUserExists) {
            res.status(401).json({
                message: "User already exists",
                data: isUserExists,
            });
            return;
        }
        res.setHeader("Set-Cookie", (0, cookie_1.serialize)("userId", name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
        }));
        // password encrypt
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.users.create({
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
    }
    catch (error) {
        console.error("Create error:", error);
        res.status(500).json({
            message: "An error occurred while creating the user in the database.",
            // @ts-expect-error error can be undefined
            error: error.message,
        });
    }
});
exports.addUser = addUser;
const userActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, userId, userId2, username1, username2 } = req.body;
        const user = yield prisma.activityLogs.create({
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
    }
    catch (error) {
        console.error("Create error:", error);
        res.status(500).json({
            message: "An error occurred while creating the user in the database.",
            // @ts-expect-error error can be undefined
            error: error.message,
        });
    }
});
exports.userActivity = userActivity;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // console.log(id);
        const user = yield prisma.users.delete({
            where: {
                userId: id,
            },
        });
        res.status(200).json({
            message: "User deleted successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});
exports.deleteUser = deleteUser;
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // optionally attach to req
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error in logging out user!" });
    }
});
exports.logout = logout;
