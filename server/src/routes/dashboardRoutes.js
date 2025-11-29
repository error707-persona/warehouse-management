"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dashboardController_1 = require("../controllers/dashboardController");
var router = (0, express_1.Router)();
router.get("/", dashboardController_1.getDashboardMetrics);
exports.default = router;
