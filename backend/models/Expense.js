const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
    text: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    category: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isRecurring: { type: Boolean, default: false },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    nextBillingDate: { type: Date },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Stressed', 'Impulsive', ''], default: '' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
