import {Router} from "express"
import { getUsers,updateUser, deleteUser } from "../controllers/userController"

const router = Router();

router.get("/", getUsers);
router.post("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;