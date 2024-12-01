import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import xss from 'xss';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import 'colors';
import { connectDB } from './src/connection/dbConnection';
import { AuthRouter } from './src/helpers/path';

let app = express();
dotenv.config();

app.use(express.json());

app.use(cors()); // Express middleware that can be used to enable CORS with various options.

app.use(hpp()); // Express middleware to protect against HTTP Parameter Pollution attacks.

app.use(ExpressMongoSanitize()); // Expree middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.

app.use(helmet()); //Help secure Express apps by setting HTTP response headers.

let html = xss('<script>alert("xss");</script>'); // Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist.

let limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // 100 request per 10 mins
});

app.use(limiter);

connectDB(); // Connect our database here

app.use('/api/v1/auth', AuthRouter);

let PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`We are running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
});