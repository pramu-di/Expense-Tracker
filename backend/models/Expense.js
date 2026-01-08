const mongoose = require('mongoose');

// Schema එකක් කියන්නේ data තියෙන්න ඕනේ layout එක
const expenseSchema = new mongoose.Schema({
    text: { type: String, required: true }, // වියදම මොකක්ද (උදා: Lunch)
    amount: { type: Number, required: true }, // කීයක් ගියාද (උදා: 500)
    category: { type: String, default: 'Other' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now } // දිනය (අද දිනය auto වැටෙයි)
});


module.exports = mongoose.model('Expense', expenseSchema);