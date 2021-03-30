import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import TradeCard from "../trade-card";
import LoadingPage from "../../UI/LoadingPage";
import { AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const FetchAllShares = gql`
  query($requestCount: Int!) {
    Stocks(request_count: $requestCount) {
      data {
        _id
        Name
        Ticker
        High
        Low
        Volume
        CurrentTradingValue
        OutstandingStocks
      }
      limit_reached
    }
  }
`;

const LoadingView = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#36393F",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

interface SearchBarProps {
  value: string;
  Change: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <TextInput
      placeholder="Search stocks here...."
      onChangeText={(text: string) => props.Change(text)}
      style={Styles.TextInput}
      defaultValue={props.value}
      placeholderTextColor="grey"
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
  const [FetchStocks, { loading, error }] = useLazyQuery(FetchAllShares, {
    onCompleted: (response) => {
      if (response.Stocks !== null) {
        const { data, limit_reached } = response.Stocks;
        SetStocksContainer(data);
        limit_reached && SetApiLimiter(true);
        SetRequestCount(request_count + 1);
      }
      refresing && SetRefresh(false);
    },
  });


  const CallGQL = () => {
    FetchStocks({ variables: { requestCount: request_count } });
  };

  const ChangeText = (text: string): void => {
    SetSearchValue(text);
  };

  const RefreshHandler = () => {
    SetRefresh(true);
    request_count > 0 && SetRequestCount(0);
    FetchStocks({ variables: { requestCount: request_count } });
    api_limiter === true && SetApiLimiter(false);
  };

  useEffect(() => {
    CallGQL();
  }, []);

  if (loading || stocks_container === null) {
    return <LoadingView />;
  }

  if (error) {
    return <LoadingPage />;
  }

  return (
    <View style={Styles.MainContainer}>
      <StatusBar hidden />
      <View
        style={{ width: width, marginVertical: 10 }}
      >
        <SearchBar
          value={search_value}
          Change={(text: string) => ChangeText(text)}
        />
        <AntDesign
          color="grey"
          size={26}
          name="search1"
          style={{ position: "absolute", top: 11, right: "5%" }}
        />
      </View>
      <FlatList
        data={stocks_container}
        keyExtractor={(element) => element._id}
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
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
    alignItems: "center",
    justifyContent: "center",
  },

  FlatList: {
    flex: 1,
  },

  TextInput: {
    backgroundColor: "#2F3136", //'#202225',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: "6%",
    color: "#fff",
    width: "100%",
  },
});

export default React.memo(Trades);
