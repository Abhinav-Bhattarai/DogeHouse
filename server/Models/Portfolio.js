import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },

    Portfolio: {
        type: [{stockID: String, name: String, Quantity: Number}],
        default: []
    }
});

const PortfolioModel = mongoose.model('Portfolio-Model', Schema);

export default PortfolioModel;