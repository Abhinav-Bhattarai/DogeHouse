import express from 'express';
import TickerModel from '../Models/Ticker-model.js';

const router = express.Router();

const ModifyData = data => {
    const newData = [];
    data.forEach(ticker => {
        const dummy = {...ticker};
        ticker.High = dummy.CurrentTradingValue + dummy.CurrentTradingValue * 0.1;
        ticker.Low = dummy.CurrentTradingValue - dummy.CurrentTradingValue * 0.1;
        ticker.DataSet = [dummy.CurrentTradingValue];
        ticker.Volume = 0;
        newData.push(ticker);
    });
    return newData;
}

router.delete('/', async(_, res) => {
    const response = await TickerModel.find({});
    const modified_data = ModifyData(response);
    await TickerModel.remove();
    const new_data = await TickerModel.insertMany(modified_data);
    return res.json({data: new_data, updated: true});
})

export default router;