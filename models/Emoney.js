const mongoose = require('mongoose');

const emoneySchema = new mongoose.Schema({
    user_id:{
        type: mongoose.SchemaTypes.ObjectId
    },
    transaction_amount: {
        type: String
    },
    billing_id: {
        type: String
    },
    transaction_id: {
        type: String
    }
});

module.exports = mongoose.model('Emoney', emoneySchema);