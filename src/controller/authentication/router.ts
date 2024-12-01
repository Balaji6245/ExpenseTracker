import express from 'express';
import { Controller } from './controller';
let app = express.Router();

app.post('/register', (req, res) => {
    Controller.register(req, res)
});

app.post('/login', (req, res) => {
    Controller.login(req, res)
});

app.patch('/forget_password', (req, res) => {
    Controller.forgetPassword(req, res)
});

export const AuthRouter = app;