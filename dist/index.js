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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const xss_1 = __importDefault(require("xss"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv = __importStar(require("dotenv"));
require("colors");
let app = (0, express_1.default)();
dotenv.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Express middleware that can be used to enable CORS with various options.
app.use((0, hpp_1.default)()); // Express middleware to protect against HTTP Parameter Pollution attacks.
app.use((0, express_mongo_sanitize_1.default)()); // Expree middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use((0, helmet_1.default)()); //Help secure Express apps by setting HTTP response headers.
let html = (0, xss_1.default)('<script>alert("xss");</script>'); // Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist.
let limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // 100 request per 10 mins
});
app.use(limiter);
let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`We are running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
