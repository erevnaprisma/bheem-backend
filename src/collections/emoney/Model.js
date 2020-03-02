const mongoose = require('mongoose');

const emoneySchema = new mongoose.Schema({
    user_id:{
        type: mongoose.SchemaTypes.ObjectId
    },
    bill_id: {
        type: String
    },
    transaction_id: {
        type: String
    },
    transaction_amount: {
        type: Number
    },
    saldo: {
        type: Number
    },
    created_at: {
        type: String,
        default: new Date().getTime(),
    },
    updated_at: {
        type: String,
        default: new Date().getTime()
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
    }
});

module.exports = mongoose.model('Emoney', emoneySchema);