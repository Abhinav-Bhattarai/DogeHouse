import express from 'express';
import TickerModel from '../Models/Ticker-model.js';

const router = express.Router();

router.post('/', async(req, res) => {
    const Name = req.body.Name;
    const Ticker = req.body.Ticker;
    const Data = { Name, Ticker };
    const TickerRegisterData = new TickerModel(Data);
    const response = await TickerRegisterData.save();
    return res.json(response);
});

router.delete('/', (req, res) => {
    TickerModel.remove().then(() => {
        return res.json({deleted: true})
    })
})

export default router;