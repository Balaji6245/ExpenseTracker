import express from 'express';
import { Controller } from './controller';

let app = express.Router();

app.post('/', (req, res) => {
    Controller.createBank(req, res)
});

app.get('/', (req, res) => {
    Controller.getAllBanks(req, res)
});

app.get('/:id', (req, res) => {
    Controller.getBankDetail(req, res)
});

app.patch('/:id', (req, res) => {
    Controller.updateBank(req, res)
});

app.patch('/delete/:id', (req, res) => {
    Controller.deleteBank(req, res)
});

export const BankRouter = app;