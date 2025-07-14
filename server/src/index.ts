import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser"


// ROUTE IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import usersRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
// CONFIGURATIONS

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrigins = [
  "https://inventory-management-kappa-red.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// Use this before your routes
app.use(express.json());
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
