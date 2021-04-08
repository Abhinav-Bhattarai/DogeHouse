import express from "express";
import TickerModel from "../Models/Ticker-model";
const router = express.Router();

const HandleBuyRequest = async (data) => {
  const { userID, stockID, buyQuantity, price } = data;
  const response = await TickerModel.findOne({
    _id: stockID,
  });
  const dummy_data = [...response.SellQueue];

  if (dummy_data.length > 0) {
    for (let i in dummy_data) {
      if (dummy[i].price === price && dummy[i].quantity === buyQuantity) {
        dummy_data.splice(i, 1);
        break;
      }
    }
    response.BuyQueue = dummy_data;
  } else {
    response.BuyQueue = [
      {
        buyer_id: userID,
        price,
        quantity: buyQuantity,
      },
    ];
  }
  response.save();
};

const HandleSellRequest = async (data) => {
  const { userID, stockID, sellQuantity, price } = data;
  const response = await TickerModel.findOne({
    _id: stockID,
  });
  const dummy_data = [...response.SellQueue];

  if (dummy_data.length > 0) {
    for (let i in dummy_data) {
      if (dummy[i].price === price && dummy[i].quantity === sellQuantity) {
        dummy_data.splice(i, 1);
        break;
      }
    }
    response.SellQueue = dummy_data;
  } else {
    response.SellQueue = [
      {
        seller_id: userID,
        price,
        quantity: sellQuantity,
      },
    ];
  }
  response.save();
};

router.post("/:type", (req, res) => {
  const type = req.params.type;
  if (type === "buy") {
    HandleBuyRequest(req.body);
    return res.json({buy_added: true});
  } else {
    HandleSellRequest(req.body);
    return res.json({sell_added: true});
  }
});
