const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Expense = require('./models/Expense'); // අපි දැන් හදපු model එක
const User = require('./models/User'); // අලුත් User model එක
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/expenseDB')
    .then(() => console.log("Database Connected!"))
    .catch(err => console.error(err));

// --- API Routes ---


// --- API ROUTES ---

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User Created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, id: user._id } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get All Expenses for a User
app.get('/api/expenses/:userId', async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.params.userId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Add New Expense
app.post('/api/expenses', async (req, res) => {
    const { text, amount, category, userId } = req.body;
    try {
        const newExpense = new Expense({ text, amount, category, userId });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update Existing Expense (මෙන්න මේකයි වැදගත්ම කොටස)
app.put('/api/expenses/:id', async (req, res) => {
    const { text, amount, category } = req.body;
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { text, amount, category },
            { new: true }
        );
        res.json(updatedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Delete Expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server එක Start කිරීම (එක් වරක් පමණක් ලියන්න)
app.listen(5000, () => console.log("Server running on port 5000"));
// 1. තියෙන ඔක්කොම වියදම් ටික ගන්න (GET)
app.get('/api/expenses/:userId', async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.params.userId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. වියදමක් Save කරද්දී userId එකත් එක්කම save කරන්න (POST)
// backend/index.js ඇතුළේ
app.post('/api/expenses', async (req, res) => {
    console.log("Data received at Backend:", req.body); // Terminal එකේ මේක පේනවද බලන්න
    const { text, amount, userId } = req.body;
    
    try {
        if (!text || !amount || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const newExpense = new Expense({ text, amount, userId });
        const savedExpense = await newExpense.save();
        console.log("Data saved successfully!");
        res.status(201).json(savedExpense);
    } catch (err) {
        console.log("Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// 3. වියදමක් මකා දැමීම (DELETE)
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));