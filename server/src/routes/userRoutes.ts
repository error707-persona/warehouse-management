import {Router} from "express"
import { getUsers,updateUser, deleteUser, addUser } from "../controllers/userController"

const router = Router();

router.get("/", getUsers);
router.post("/edit/:id", updateUser);
router.post("/addUser", addUser);
router.delete("/delete/:id", deleteUser);

export default router;