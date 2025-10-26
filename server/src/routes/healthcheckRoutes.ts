// src/routes/health.ts (Express example)
import { Router } from "express";
const healthCheck = Router();

healthCheck.get("/health", async (req, res) => {
  try {
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

export default healthCheck;
