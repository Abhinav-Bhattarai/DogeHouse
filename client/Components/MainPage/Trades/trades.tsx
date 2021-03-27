import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, ActivityIndicator, FlatList } from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import TradeCard from "../trade-card";
import LoadingPage from "../../UI/LoadingPage";

const FetchAllShares = gql`
    query($requestCount: Int!) {
        Stocks(request_count: $requestCount) {
            _id,
            Name,
            Ticker,
            High,
            Low,
            Volume,
            limit_reached,
            CurrentTradingValue
        }
    }
`;

const LoadingView = () => {
    return (
        <View style={{flex: 1}}>
            <ActivityIndicator size='large' color='#fff'/>
        </View>
    )
}

export interface StocksContainer {
  _id: string,
  Name: string,
  Ticker: string,
  High: number,
  Low: number,
  Volume: number,
  limit_reached?: boolean,
  CurrentTradingValue: number
}

const Trades = () => {
  const [request_count, SetRequestCount] = useState<number>(0);
  const [stocks_container, SetStocksContainer] = useState<Array<StocksContainer> | null>(null);
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);
  const [refresing, SetRefresh] = useState<boolean>(false);
  const [FetchStocks, { loading, error }] = useLazyQuery(FetchAllShares, {
      onCompleted: response => {
        if (response.Stocks !== null) {
          const { data, limit_reached } = response.Stocks;
          SetStocksContainer(data);
          limit_reached && SetApiLimiter(true);
        }else{
          
        }
      }
  });


  const CallGQL = () => {
    FetchStocks({ variables: { requestCount: request_count } });
  };

  const RefreshHandler = () => {
    SetRefresh(true);
    FetchStocks({ variables: { requestCount: 0 } });
    request_count > 0 && SetRequestCount(0);
    api_limiter === true && SetApiLimiter(false);
  }

  useEffect(() => { CallGQL() }, []);

  if(loading) {
    return <LoadingView/>
  }

  if(error && stocks_container === null) {
    return <LoadingPage/>
  }

  return (
    <View style={Styles.MainContainer}>
      <StatusBar hidden />
      <FlatList
        data={stocks_container}
        keyExtractor= {(element) => element._id}
        refreshing={refresing}
        onRefresh={RefreshHandler}
        renderItem={stock => {
          return( 
            <TradeCard
              Name={stock.item.Name}
              _id={stock.item._id}
              Ticker={stock.item.Ticker}
              High={stock.item.High}
              Low={stock.item.Low}
              Volume={stock.item.Volume}
              CurrentTradingValue={stock.item.CurrentTradingValue}
            />
          )
        }}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
  },
});

export default Trades;