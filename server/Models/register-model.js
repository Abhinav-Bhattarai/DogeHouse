import mongoose from 'mongoose';

const Schema = new mongoose.Schema({

    Username: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true
    },

    RegistryDate: {
        type: String,
        default: new Date(parseInt(Date.now())).toLocaleDateString()
    },

    DogeCount: {
        type: Number,
        default: 1000
    }

});

const RegisterModel = mongoose.model('User', Schema);

export default RegisterModel;