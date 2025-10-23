"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const producer_1 = require("../kafka/producer");
const ws_1 = __importStar(require("ws"));
const http_1 = __importDefault(require("http"));
const consumer_1 = require("../kafka/consumer");
// ROUTE IMPORTS
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
// CONFIGURATIONS
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const allowedOrigins = [
    "https://inventory-management-kappa-red.vercel.app",
    "http://localhost:3000",
];
const clients = new Set();
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
wss.on('connection', (ws) => {
    console.log('🔗 WebSocket client connected');
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws); // Clean up closed clients
    });
});
(0, consumer_1.startConsumer)((msg) => {
    console.log("number of clients", clients);
    clients.forEach((ws) => {
        console.log("number of clients", ws);
        if (ws.readyState === ws_1.default.OPEN) {
            ws.send(msg);
        }
    });
    setInterval(() => {
        clients.forEach((ws) => {
            if (ws.readyState === ws_1.default.OPEN) {
                ws.ping();
            }
        });
    }, 30000);
});
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Use this before your routes
app.use(express_1.default.json());
// routes
app.get("/", (req, res) => {
    res.send("Server is live ✅");
});
app.use("/dashboard", dashboardRoutes_1.default); //http://localhost:8000/dashboard
app.use("/products", productRoutes_1.default); //http://localhost:8000/products
app.use("/users", userRoutes_1.default); //http://localhost:8000/users
app.use("/expenses", expenseRoutes_1.default); //http://localhost:8000/expenses
// server
const port = process.env.PORT || 3001;
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, producer_1.connectProducer)();
    }
    catch (error) {
        console.log("kafka error: ", error);
    }
    console.log(`server + WS running on port ${port}`);
}));
