import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    
    Ticker: {
        type: String,
        required: true
    },

    High: {
        type: Number,
        default: 10
    },

    Low: {
        type: Number,
        default: 5
    },

    Volume: {
        type: Number,
        default: 0
    },

    OutstandingStocks: {
        type: Number,
        default: 2000000
    },

    CurrentTradingValue: {
        type: Number,
        default: 10
    },

    Logo: {
        type: String,
        data: Buffer,
        required: true
    }
});

const TickerModel = mongoose.Model('Ticker-Name', Schema);

export default TickerModel;