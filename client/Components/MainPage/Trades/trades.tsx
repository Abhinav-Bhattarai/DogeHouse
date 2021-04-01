import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Vibration,
  TextInput,
  Dimensions,
  VirtualizedList,
} from "react-native";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
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

export const LoadingView = () => {
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
  const [stocks_container, SetStocksContainer] = useState<Array<StocksContainer> | null>(null);
  const [suggestion, SetSuggestion] = useState<Array<StocksContainer> | null>(null);
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);
  const [search_value, SetSearchValue] = useState<string>("");
  const [refresing, SetRefresh] = useState<boolean>(false);
  const [FetchStocks] = useLazyQuery(FetchAllShares, {
    onCompleted: (response) => {
      FetchCompleteHandler(response);
    },
  });
  const { loading, error, refetch, data } = useQuery(FetchAllShares, {
    variables: {requestCount: 0},
    onCompleted: (response) => {
      Vibration.vibrate(100);
      FetchCompleteHandler(response);
    },
    onError: (err) => console.log(err)
  });

  const FetchCompleteHandler = (response: any) => {
    if (response.Stocks !== null) {
      const { data, limit_reached } = response.Stocks;
      SetStocksContainer(data);
      limit_reached && SetApiLimiter(true);
      SetRequestCount(request_count + 1);
    }
    refresing && SetRefresh(false);
  }

  const CallGQL = () => {
    api_limiter === false && FetchStocks({ variables: { requestCount: request_count } });
  };

  const ChangeText = (text: string): void => {
    const regex = new RegExp(`^${text}`, 'gi');
    if(stocks_container !== null) {
      const dummy = [...stocks_container];
      const suggestion_container = [];
      for (let i of dummy) {
        regex.exec(i.Name) && suggestion_container.push(i);
        regex.test(i.Name)
      }
      SetSuggestion(suggestion_container);
    }
    SetSearchValue(text);
  };

  const RefreshHandler = () => {
    refetch();
    SetRefresh(true);
    request_count > 0 && SetRequestCount(0);
    api_limiter === true && SetApiLimiter(false);
  };

  if (loading || stocks_container === null) {
    return <LoadingView />;
  }

  if (error) {
    return <LoadingPage />;
  }

  const ItemCount = () => stocks_container !== null ? stocks_container.length : 0

  const GetItem = (data: any, index: number) => {
    return data[index];
  }

  const RenderItem = (stock: any) => {
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
      <VirtualizedList
        initialNumToRender={1}
        data={(search_value.length < 1) ? stocks_container : suggestion}
        keyExtractor={(item) => item._id}
        refreshing={refresing}
        onRefresh={RefreshHandler}
        onEndReached={CallGQL}
        renderItem={RenderItem}
        getItemCount={ItemCount}
        getItem={GetItem}
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