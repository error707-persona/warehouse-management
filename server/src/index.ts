import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import { connectProducer } from "../kafka/producer";
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// import {startConsumer} from "../kafka/consumer"

// ROUTE IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import usersRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import healthCheck from "./routes/healthcheckRoutes";
// CONFIGURATIONS

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cookieParser());
app.use(helmet());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrigins = [
  "https://inventory-management-kappa-red.vercel.app",
  "https://inventory-management-kappa-red.vercel.app/",
  "http://localhost:3000",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

const clients = new Set<WebSocket>();

// wss.on('connection', (ws: WebSocket) => {
//   console.log('🔗 Client connected');
//   clients.push(ws);

//   ws.on('close', () => {
//     const index = clients.indexOf(ws);
//     if (index !== -1) {
//       clients.splice(index, 1);
//     }
//   });
// });

// wss.on('connection', (ws) => {                 
//   console.log('🔗 WebSocket client connected');
//   ws.send('👋 Hello from server!');
// });
// main changes uncomment from here ================================================================================
// wss.on('connection', (ws) => {
//   console.log('🔗 WebSocket client connected');
//   clients.add(ws);
//   ws.on('close', () => {
//     clients.delete(ws); // Clean up closed clients
//   });
// });

// startConsumer((msg: string) => {
//   console.log("number of clients", clients);
//   clients.forEach((ws) => {
//     console.log("number of clients", ws);
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(msg);
//     }
//   });

//   setInterval(() => {
//   clients.forEach((ws) => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.ping();
//     }
//   });
// }, 30000);
// });

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Use this before your routes
app.use(express.json());
// routes
app.get("/", (req, res) => {
  res.send("Server is live ✅");
});

app.use("/dashboard", dashboardRoutes); //http://localhost:8000/dashboard
app.use("/products", productRoutes); //http://localhost:8000/products
app.use("/users", usersRoutes); //http://localhost:8000/users
app.use("/expenses", expenseRoutes); //http://localhost:8000/expenses
app.use("/health", healthCheck);


// server
const port = process.env.PORT || 3001;
server.listen(port, async () => {
  // try {
  //   await connectProducer();
  // } catch (error) {
  //   console.log("kafka error: ",error);
  // }
  
  console.log(`server + WS running on port ${port}`);
});
