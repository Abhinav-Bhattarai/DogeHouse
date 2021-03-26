import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { gql, useLazyQuery } from "@apollo/client";

const FetchAllShares = gql`
    query($requestCount: Int!) {
        Stocks(request_count: $requestCount): {
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

const Trades = () => {
  const [request_count, SetRequestCount] = useState<number>(0);
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);

  const [FetchStocks, { loading, data, error }] = useLazyQuery(FetchAllShares, {
      onCompleted: response => {
        console.log(response);
      }
  });

  const CallGQL = () => {
    FetchStocks({ variables: { requestCount: request_count } });
  };

  useEffect(() => {
    if (api_limiter === false) {
      CallGQL();
    }
  }, []);

  if(loading) {
    return <LoadingView/>
  }

  return (
    <View style={Styles.MainContainer}>
      <StatusBar hidden />
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
