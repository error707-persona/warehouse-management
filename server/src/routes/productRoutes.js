"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productController_1 = require("../controllers/productController");
var router = (0, express_1.Router)();
// change to deploy and seed new data again
router.get("/", productController_1.getProducts);
router.post("/createProduct", productController_1.createProduct);
router.put("/updateProduct/:id", productController_1.updateProduct);
router.put("/updateSales/:id", productController_1.updateSales);
router.delete("/deleteProduct/:id", productController_1.deleteProduct);
exports.default = router;
