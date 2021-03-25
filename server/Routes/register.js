import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import RegisterModel from '../Models/register-model.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const GetAuthToken = (data, cb) => {
    jwt.sign(data, process.env.JWT_AUTH_TOKEN, (err, token) => {
        if(!err){
            return cb(token)
        }
        return
    })
};

const HashPassword = (password, cb) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (!err) {
            return cb(hash)
        }
        return
    })
}

const Register = async (Username, Password, Confirm, callback) => {
    if (Username.length > 5 && Password === Confirm && Password.length > 7) {
        const number_regex = /[0-9]/;
        if (number_regex.exec(Password) !== null) {
            const response = await RegisterModel.findOne({Username});
            if (response === null) {
                HashPassword(Password, hash => {
                    const Data = {
                        Username,
                        Password: hash,
                        RegistryDate: new Date(parseInt(Date.now())).toLocaleDateString
                    }
                    const RegistrationData = new RegisterModel(Data);
                    RegistrationData.save().then(user => {
                        GetAuthToken(Data, token => {
                            return callback({token, UserID: user._id })
                        })
                    });
                });
            }else{
                return callback({username_already_taken: true});
            }
        }else{
            return callback({invalid_credential: true});
        }
    }else{
        return callback({invalid_credential: true});
    }
}

router.post('/', (req, res) => {
    const Username = req.body.Username;
    const Password = req.body.Password;
    const Confirm = req.body.Confirm;
    Register(Username, Password, Confirm, response => {
        return res.json(response)
    });
});

export default router;