import { Router } from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  addUser,
  getOneUsers,
  logout,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/edit/:id", updateUser);
router.post("/addUser", addUser);
router.post("/getOneUser", getOneUsers);
router.delete("/delete/:id", deleteUser);
router.post("/logout", logout);

export default router;
