import {Router} from "express"
import { createProduct, getProducts,updateProduct, deleteProduct, updateSales } from "../controllers/productController";

const router = Router();
// change to deploy and seed new data again
router.get("/", getProducts);
router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.put("/updateSales/:id", updateSales);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;