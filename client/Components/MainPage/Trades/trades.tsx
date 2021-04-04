import React, { useState } from "react";
import { View, ActivityIndicator, Vibration } from "react-native";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import LoadingPage from "../../UI/LoadingPage";
import { createStackNavigator } from "@react-navigation/stack";
import TradeList from "./TradeList";
import StockDetails from "./StockDetails";

const Stack = createStackNavigator();
// interfaces;
export interface StocksContainer {
  _id: string;
  Name: string;
  Ticker: string;
  High: number;
  Low: number;
  Volume: number;
  limit_reached?: boolean;
  CurrentTradingValue: number;
  DataSet: Array<number>;
  ClickStockCard?: (name: string, color: string) => void;
}

// ApolloClient gql request;

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
        DataSet
      }
      limit_reached
    }
  }
`;

export let StockInfo: Array<StocksContainer> | null = null;

const StockInfoHandler = (info: Array<StocksContainer>): void => {
  StockInfo = info;
};

// Sub-Intra Components;
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

const Trades = () => {
  const [request_count, SetRequestCount] = useState<number>(0);
  const [
    stocks_container,
    SetStocksContainer,
  ] = useState<Array<StocksContainer> | null>(null);
  const [suggestion, SetSuggestion] = useState<Array<StocksContainer> | null>(
    null
  );
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);
  const [search_value, SetSearchValue] = useState<string>("");
  const [refresing, SetRefresh] = useState<boolean>(false);
  const [FetchStocks] = useLazyQuery(FetchAllShares, {
    onCompleted: (response) => {
      FetchCompleteHandler(response);
    },
  });
  const { loading, error, refetch } = useQuery(FetchAllShares, {
    variables: { requestCount: 0 },
    onCompleted: (response) => {
      Vibration.vibrate(25)
      StockInfoHandler(response.Stocks.data);
      FetchCompleteHandler(response);
    },
  });

  const FetchCompleteHandler = (response: any) => {
    if (response.Stocks !== null) {
      const { data, limit_reached } = response.Stocks;
      SetStocksContainer(data);
      limit_reached && SetApiLimiter(true);
      SetRequestCount(request_count + 1);
    }
    refresing && SetRefresh(false);
  };

  const CallGQL = () => {
    api_limiter === false &&
      FetchStocks({ variables: { requestCount: request_count } });
  };

  const ChangeText = (text: string): void => {
    const regex = new RegExp(`^${text}`, "gi");
    if (stocks_container !== null) {
      const dummy = [...stocks_container];
      const suggestion_container = [];
      for (let i of dummy) {
        regex.exec(i.Name) && suggestion_container.push(i);
        regex.test(i.Name);
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

  return (
    <Stack.Navigator>
      <Stack.Screen name="TradeList" options={{ headerShown: false }}>
        {(navigation) => (
          <TradeList
            search_value={search_value}
            ChangeText={(text: string) => ChangeText(text)}
            refreshing={refresing}
            RefreshHandler={RefreshHandler}
            CallGQL={CallGQL}
            suggestion={suggestion}
            stocks_container={stocks_container}
            navigation={navigation}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="StockDetails"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2F3136",
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        }}
      >
        {(navigation) => <StockDetails navigation={navigation}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default React.memo(Trades);
