const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    settings: {
        currency: { type: String, default: 'LKR' },
        darkMode: { type: Boolean, default: false },
        savingGoal: { type: Number, default: 50000 },
        overallBudget: { type: Number, default: 0 }
    },
    customCategories: [{ type: String }],
    budgets: { type: Map, of: Number, default: {} },
    avatar: { type: String, default: "👩‍💻" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);