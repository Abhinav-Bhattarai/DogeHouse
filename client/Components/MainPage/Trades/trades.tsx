import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  FlatList,
  TextInput
} from "react-native";
import { gql, useLazyQuery, NetworkStatus } from "@apollo/client";
import TradeCard from "../trade-card";
import LoadingPage from "../../UI/LoadingPage";

const FetchAllShares = gql`
  query($requestCount: Int!) {
    Stocks(request_count: $requestCount) {
      data
      limit_reached
    }
  }
`;

const LoadingView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#36393F', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <TextInput
      placeholder="Search here...."
      onChangeText={(text: string) => props.onChange(text)}
      style={Styles.TextInput}
      value={props.value}
      returnKeyType="done"
      placeholderTextColor='grey'
    />
  );
};

export interface StocksContainer {
  _id: string;
  Name: string;
  Ticker: string;
  High: number;
  Low: number;
  Volume: number;
  limit_reached?: boolean;
  CurrentTradingValue: number;
}

const Trades = () => {
  const [request_count, SetRequestCount] = useState<number>(0);
  const [
    stocks_container,
    SetStocksContainer,
  ] = useState<Array<StocksContainer> | null>(null);
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);
  const [search_value, SetSearchValue] = useState<string>("");
  const [refresing, SetRefresh] = useState<boolean>(false);
  const [FetchStocks, { loading, error, networkStatus }] = useLazyQuery(FetchAllShares, {
    onCompleted: (response) => {
      if (response.Stocks !== null) {
        const { data, limit_reached } = response.Stocks;
        SetStocksContainer(JSON.parse(data));
        limit_reached && SetApiLimiter(true);
      }
      console.log(refresing);
      refresing && SetRefresh(false);
    },
  });

  const CallGQL = () => {
    FetchStocks({ variables: { requestCount: request_count } });
  };

  const RefreshHandler = () => {
    SetRefresh(true);
    FetchStocks();
    request_count > 0 && SetRequestCount(0);
    api_limiter === true && SetApiLimiter(false);
  };

  useEffect(() => { CallGQL() }, []);

  if (loading && networkStatus !== NetworkStatus.refetch) {
    return <LoadingView />;
  }

  if (error && stocks_container === null) {
    return <LoadingPage />;
  }

  return (
    <View style={Styles.MainContainer}>
      <StatusBar hidden />
      <FlatList
        data={stocks_container}
        keyExtractor={element => element._id}
        refreshing={refresing}
        onRefresh={RefreshHandler}
        onEndReached={CallGQL}
        renderItem={(stock) => {
          return (
            <TradeCard
              Name={stock.item.Name}
              _id={stock.item._id}
              Ticker={stock.item.Ticker}
              High={stock.item.High}
              Low={stock.item.Low}
              Volume={stock.item.Volume}
              CurrentTradingValue={stock.item.CurrentTradingValue}
            />
          );
        }}
        // contentContainerStyle={Styles.FlatList}
        ListHeaderComponent={() => (
          <SearchBar
            value={search_value}
            onChange={(text: string) => SetSearchValue(text)}
          />
        )}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
    alignItems: 'center',
    justifyContent: 'center'
  },

  FlatList: {
    flex: 1,
  },

  TextInput: {
    backgroundColor: '#202225',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: '3%',
    marginVertical: 5,
    color: '#fff'
  },
});

export default Trades;
