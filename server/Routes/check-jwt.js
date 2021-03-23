import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', (req, res) => {
    jwt.verify(req.body.Token, process.env.JWT_AUTH_TOKEN, (err, data) => {
        if(!err){
            if(data !== null){
                return res.json({authenticated: true})
            }else{
                return res.json({ error: true });
            }
        }else{
            return res.json({ error: true });
        }
    })
})

export default router;