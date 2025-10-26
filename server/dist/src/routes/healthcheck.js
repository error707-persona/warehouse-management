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
// src/routes/health.ts (Express example)
const express_1 = require("express");
const healthCheck = (0, express_1.Router)();
healthCheck.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optionally check DB connectivity
        // await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "ok" });
    }
    catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
}));
exports.default = healthCheck;
