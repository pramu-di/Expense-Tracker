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

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expenseDB';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        if (!MONGO_URI) throw new Error("MONGO_URI is missing in environment variables");

        const db = await mongoose.connect(MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("Database Connected!");
    } catch (err) {
        console.error("Database Connection Error:", err);
        throw err;
    }
};

// Serverless-safe Database connection middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

// --- API Routes ---
app.get('/api', (req, res) => {
    res.json({ status: "API is running" });
});

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key", { expiresIn: '1h' });
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
    const { text, amount, category, userId, type, isRecurring, billingCycle, nextBillingDate } = req.body;
    try {
        const newExpense = new Expense({ text, amount, category, userId, type, isRecurring, billingCycle, nextBillingDate });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update Existing Expense (මෙන්න මේකයි වැදගත්ම කොටස)
app.put('/api/expenses/:id', async (req, res) => {
    const { text, amount, category, type, isRecurring, billingCycle, nextBillingDate } = req.body;
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { text, amount, category, type, isRecurring, billingCycle, nextBillingDate },
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

// 7. Get User Details (Settings & Custom Categories)
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Update User Settings
app.put('/api/user/:id/settings', async (req, res) => {
    const { settings } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { settings: settings } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Update Custom Categories
app.put('/api/user/:id/categories', async (req, res) => {
    const { customCategories } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { customCategories: customCategories } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Update User Budgets
app.put('/api/user/:id/budgets', async (req, res) => {
    const { budgets } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { budgets: budgets } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Update User Profile (Avatar & Name)
app.put('/api/user/:id/profile', async (req, res) => {
    const { name, avatar } = req.body;
    try {
        const updateData = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 404 Handler for undefined API routes
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

const PORT = 5000;
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
