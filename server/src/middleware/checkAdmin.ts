
// import { Request, Response } from "express";
// // middleware/checkAdmin.ts
// export const checkAdmin = (req:Request, res:Response, next) => {
//   const user = req.body.user; // Assuming decoded from JWT/session

//   if (!user || user.role !== "Admin") {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }

//   next();
// };
