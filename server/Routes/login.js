import express from 'express';
import jwt from 'jsonwebtoken';
import RegisterModel from '../Models/register-model.js';

const router = express.Router();

const GetAuthToken = (data, cb) => {
    jwt.sign(data, process.env.JWT_AUTH_TOKEN, (err, token) => {
        if(!err){
            return cb(token)
        }
        return
    })
};

router.post('/', (req, res) => {
    const Username = req.body.Username;
    const Password = req.body.Password;
    return res.json({sorry: true});
});


export default router;