import express from 'express';
import { Controller } from './controller';

let app = express.Router();

app.post('/', (req, res) => {
    Controller.createCategory(req, res)
});

app.get('/', (req, res) => {
    Controller.categories(req, res)
});

app.get('/:id', (req, res) => {
    Controller.Category(req, res)
});

app.patch('/:id', (req, res) => {
    Controller.updateCategory(req, res)
});

app.patch('/delete/:id', (req, res) => {
    Controller.deleteCategory(req, res)
});

export const CategoryRouter = app;