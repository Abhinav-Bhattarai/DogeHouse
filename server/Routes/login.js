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

const ValidationCheck = async(userInfo) => {
    const { Password, Username } = userInfo;
    const response = await RegisterModel.findOne({Username});
    if (response !== null) {
        bcrypt.compare(Password, response.Password, condition => {
            if (condition === true) {
                const Data = {Username, Password: response.Password};
                GetAuthToken(Data, token => {
                    const MainData = {...Data, token}
                    return MainData
                })
            }else{
                return {Password_donot_match: true};
            }            
        })
    }else{
        return {Invalid_Credential: true};
    }
}

router.post('/', (req, res) => {
    const Username = req.body.Username;
    const Password = req.body.Password;
    ValidationCheck({Username, Password}).then(response => {
        return res.json(response);
    })
});


export default router;