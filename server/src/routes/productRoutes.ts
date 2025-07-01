import {Router} from "express"
import { createProduct, getProducts,updateProduct, deleteProduct } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;