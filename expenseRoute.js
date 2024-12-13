server.post('/api/expenses', (req, res) => {
    const { description, amount, category } = req.body;
    const newExpense = new Expense({ description, amount, category });
    newExpense.save().then(() => {
        res.status(201).send('Expense Added');
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

module.exports = router;