import {Router} from "express"
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.post("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;