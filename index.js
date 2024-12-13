const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

mongoose.connect('mongodb+srv://nikita:<db_password>@expense-tracker.ynyx0.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    category: String,
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);


server.post('/api/expenses', (req, res) => {
    const { description, amount, category } = req.body;
    const newExpense = new Expense({ description, amount, category });
    newExpense.save().then(() => {
        res.status(200).send('Expense Added');
    });
});

server.get('/api/expenses', (req, res) => {
    Expense.find().then((expenses) => {
        res.status(200).json(expenses);
    });
});

server.get('/api/summary', (req, res) => {
    Expense.aggregate([
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]).then((summary) => {
        res.status(200).json(summary);
    });
});

server.listen(8055, () => {
    console.log("Server is running on port 8055");
});
