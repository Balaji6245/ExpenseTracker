import express from 'express';
import { Controller } from './controller';
import { BankRouter, CategoryRouter, ExpenseRouter } from '../../helpers/path';

let app = express.Router();

app.use('/bank', BankRouter);
app.use('/category', CategoryRouter);
app.use('/expense', ExpenseRouter);

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