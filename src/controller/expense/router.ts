import express from 'express';
import { Controller } from './controller';

let app = express.Router();

app.post('/', (req, res) => {
    Controller.createExpense(req, res)
});

app.get('/:id', (req, res) => {
    Controller.expense(req, res);
});

app.get('/', (req, res) => {
    Controller.expenses(req, res)
});

app.get('/group-by', (req, res) => {
    Controller.groupByExpense(req, res);
});

app.patch('/update/:id', (req, res) => {
    Controller.updateExpense(req, res)
});

app.patch('/delete/:id', (req, res) => {
    Controller.deleteExpense(req, res)
});

export const ExpenseRouter = app;