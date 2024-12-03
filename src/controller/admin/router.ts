import express from 'express';
import { Controller } from './controller';

let app = express.Router();

app.get('/', (req, res) => {
    Controller.adminDetail(req, res)
});

app.get('/logout', (req, res) => {
    Controller.logout(req, res)
});

app.patch('/', (req, res) => {
    Controller.updateAdmin(req, res)
});

export const AdminRouter = app;