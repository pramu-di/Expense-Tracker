const mongoose = require('mongoose');

// Schema එකක් කියන්නේ data තියෙන්න ඕනේ layout එක
const expenseSchema = new mongoose.Schema({
    text: { type: String, required: true }, // වියදම මොකක්ද (උදා: Lunch)
    amount: { type: Number, required: true }, // කීයක් ගියාද (උදා: 500)
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    category: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isRecurring: { type: Boolean, default: false },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    nextBillingDate: { type: Date },
    date: { type: Date, default: Date.now } // දිනය (අද දිනය auto වැටෙයි)
});


module.exports = mongoose.model('Expense', expenseSchema);