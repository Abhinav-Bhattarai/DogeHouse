import express from "express";
import PortfolioModel from "../Models/Portfolio.js";
import TickerModel from "../Models/Ticker-model.js";

const router = express.Router();

const SellerPortfolioManagement = async(userID, stockID) => {
  const response = await PortfolioModel.findOne({userID});
  const dummy = [...response.Portfolio];
  for (let i in dummy) {
    if (dummy[i].stockID === stockID) {
      dummy.splice(i, 1);
      break;
    }
  };
  response.Portfolio = dummy;
  await response.save();
  return {seller_portfolio_updated: true};
}

const BuyerPortfolioManagement = async(userID, stockID, quantity) => {
  const response = await PortfolioModel.findOne({userID});
  const dummy = [...response.Portfolio];
  dummy.push({stockID, name: '', Quantity: quantity})
  response.Portfolio = dummy;
  await response.save();
  return {buyer_portfolio_updated: true};
}

const CheckStocksQueue = async (type, id, quantity, price) => {
  const StocksData = await TickerModel.findOne({ _id: id });
  const dummy_data = null;
  type === "buy"
    ? (dummy_data = [...StocksData.SellerQueue])
    : (dummy_data = [...StocksData.BuyerQueue]);
  const QueueMatch = false;
  const MatchInfo = null;
  for (let i in dummy_data) {
    if (dummy_data[i].price === price && dummy_data[i].quantity === quantity) {
      MatchInfo = dummy_data[i];
      dummy_data.splice(i, 1);
      QueueMatch = true;
      break;
    }
  };
  return {QueueMatch, StocksData, dummy_data, MatchInfo};
};

const BuyStocks = async ({ quantity, userID, stockID, price }) => {
  const { QueueMatch, StocksData, dummy_data, MatchInfo } = await CheckStocksQueue("buy", stockID, quantity, price);
  if (QueueMatch === true) {
    const dummy = [...StocksData];
    dummy.push({buyer: userID, price, quantity});
    StocksData.BuyerQueue = dummy;
    await StocksData.save();
    return { added_to_queue: true };
  }else {
    StocksData.SellerQueue = dummy_data;
    await StocksData.save();
    // Remove that stock from Seller's Portfolio
    await SellerPortfolioManagement(MatchInfo.seller, stockID);
    await BuyerPortfolioManagement(userID, stockID, quantity);
    return { stocks_bought: true };
  }
};

const SellStocks = async ({ quantity, userID, stockID, price }) => {
  const { QueueMatch, StocksData, dummy_data } = await CheckStocksQueue("sell", stockID, quantity, price);
  if (QueueMatch === true) {
    const dummy = [...StocksData];
    dummy.push({seller: userID, price, quantity});
    StocksData.SellerQueue = dummy;
    await StocksData.save();
    return { added_to_queue: true };
  }else {
    // Remove the seller Queue;
    StocksData.SellerQueue = dummy_data;
    await StocksData.save();
    // Remove that stock from Seller's Portfolio
    await SellerPortfolioManagement(userID, stockID);
    await BuyerPortfolioManagement(userID, stockID, quantity);
    return { stocks_sold: true };
  }
};

router.post("/:type", async (req, res) => {
  const type = req.params.type;
  if (type === "buy") {
    const response = await BuyStocks(req.body);
    return res.json(response);
  } else {
    const response = await SellStocks(req.body);
    return res.json(response);
  }
});

export default router;