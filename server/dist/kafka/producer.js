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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProductNotification = exports.connectProducer = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'notification-service',
    brokers: ['localhost:9094'], // Use Bitnami's EXTERNAL port
});
const producer = kafka.producer();
const connectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.connect();
});
exports.connectProducer = connectProducer;
const sendProductNotification = (productName) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `🛒 Product "${productName}" was added by `;
    yield producer.send({
        topic: 'product-events',
        messages: [{ value: message }],
    });
    console.log('📤 Kafka Message Sent:', message);
});
exports.sendProductNotification = sendProductNotification;
module.exports = { connectProducer: exports.connectProducer, sendProductNotification: exports.sendProductNotification };
