import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTE IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import usersRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
// CONFIGURATIONS

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CORS_URL,
  credentials: true, 
}));
// app.use(cors({
//   origin: "http://localhost:3000", // or Vercel frontend URL in prod
//   credentials: true,
// }));
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Server is live ✅");
});
app.use("/dashboard", dashboardRoutes); //http://localhost:8000/dashboard
app.use("/products", productRoutes); //http://localhost:8000/products
app.use("/users",usersRoutes); //http://localhost:8000/users
app.use("/expenses",expenseRoutes); //http://localhost:8000/expenses
// server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
