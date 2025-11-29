"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var expenseController_1 = require("../controllers/expenseController");
var router = (0, express_1.Router)();
router.get("/", expenseController_1.getExpensesByCategory);
exports.default = router;
