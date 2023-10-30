const mongoose = require("mongoose");

const validationCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    expirationTime: {
        type: Date,
        required: true,
    },
});

const ValidationCode = mongoose.model("ValidationCode", validationCodeSchema);

module.exports = ValidationCode;
