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
        default: 50000
    },

    CurrentTradingValue: {
        type: Number,
        default: 10
    },

    DataSet: {
        type: String,
        default: "[10]"
    },

    BuyerQueue: {
        type: [{buyer: String, price: Number, quantity: Number}],
        default: []
    },

    SellerQueue: {
        type: [{seller: String, price: Number, quantity: Number}],
        default: []
    }
});

const TickerModel = mongoose.model('Ticker-Name', Schema);

export default TickerModel;