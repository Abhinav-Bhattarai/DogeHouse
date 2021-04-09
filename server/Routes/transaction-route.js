import express from "express";
import PortfolioModel from "../Models/Portfolio.js";
import TickerModel from "../Models/Ticker-model.js";
const router = express.Router();

const PortfolioManagement = async({ seller }, stockid) => {
  const response = PortfolioModel.findOne({UserID: seller});
  if (response) {
    const dummy = [...response.Portfolio];
    if (dummy.length > 0) {
      for (let i in dummy) {
        if (dummy[i].stockID === stockid) {
          dummy.splice(i, 1);
          break
        };
      };
      response.Portfolio = dummy;
      await response.save();
    }
  }
}

const HandleBuyRequest = async (data) => {
  const { userID, stockID, quantity, price } = data;
  const response = await TickerModel.findOne({
    _id: stockID,
  });
  if (response) {
    const dummy_data = [...response.SellQueue];
    const seller_details = null;
  
    if (dummy_data.length > 0) {
      for (let i in dummy_data) {
        if (dummy[i].price === price && dummy[i].quantity === quantity) {
          seller_details = dummy_data[i];
          dummy_data.splice(i, 1);
          break;
        }
      }
      response.BuyQueue = dummy_data;
      seller_details !== null && PortfolioManagement(response, stockID);
    } else {
      response.BuyQueue = [
        {
          buyer_id: userID,
          price,
          quantity: quantity,
        },
      ];
    }
    await response.save();
    return
  }else {
    return {no_user: true};
  }
};

const HandleSellRequest = async (data) => {
  const { userID, stockID, quantity, price } = data;
  const response = await TickerModel.findOne({
    _id: stockID,
  });
  if (response) {
    const dummy_data = [...response.SellQueue];

    if (dummy_data.length > 0) {
      for (let i in dummy_data) {
        if (dummy[i].price === price && dummy[i].quantity === quantity) {
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
          quantity: quantity,
        },
      ];
    }
    await response.save();
    return
  }else {
    return {no_user: true};
  }
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


export default router;