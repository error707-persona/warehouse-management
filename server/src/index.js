"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var cookie_parser_1 = require("cookie-parser");
// import { connectProducer } from "../kafka/producer";
var ws_1 = require("ws");
var http_1 = require("http");
// import {startConsumer} from "../kafka/consumer"
// ROUTE IMPORTS
var dashboardRoutes_1 = require("./routes/dashboardRoutes");
var productRoutes_1 = require("./routes/productRoutes");
var userRoutes_1 = require("./routes/userRoutes");
var expenseRoutes_1 = require("./routes/expenseRoutes");
var healthcheckRoutes_1 = require("./routes/healthcheckRoutes");
// CONFIGURATIONS
dotenv_1.default.config();
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var wss = new ws_1.WebSocketServer({ server: server });
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
var allowedOrigins = [
    "https://inventory-management-kappa-red.vercel.app",
    "https://inventory-management-kappa-red.vercel.app/",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.options("*", (0, cors_1.default)());
var clients = new Set();
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
app.get("/", function (req, res) {
    res.send("Server is live ✅");
});
app.use("/dashboard", dashboardRoutes_1.default); //http://localhost:8000/dashboard
app.use("/products", productRoutes_1.default); //http://localhost:8000/products
app.use("/users", userRoutes_1.default); //http://localhost:8000/users
app.use("/expenses", expenseRoutes_1.default); //http://localhost:8000/expenses
app.use("/health", healthcheckRoutes_1.default);
// server
var port = process.env.PORT || 3001;
server.listen(port, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // try {
        //   await connectProducer();
        // } catch (error) {
        //   console.log("kafka error: ",error);
        // }
        console.log("server + WS running on port ".concat(port));
        return [2 /*return*/];
    });
}); });
