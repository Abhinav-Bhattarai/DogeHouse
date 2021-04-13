import React, { useState } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import { View, ActivityIndicator, Alert } from "react-native";
import { gql, useLazyQuery, useQuery, NetworkStatus } from "@apollo/client";
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
  DataSet: string;
  ClickStockCard?: (name: string, color: string, id: string) => void;
};

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
  const [stocks_container, SetStocksContainer] = useState<Array<StocksContainer> | null>(null);
  const [suggestion, SetSuggestion] = useState<Array<StocksContainer> | null>(null);
  const [api_limiter, SetApiLimiter] = useState<boolean>(false);
  const [search_value, SetSearchValue] = useState<string>("");
  const [refresing, SetRefresh] = useState<boolean>(false);
  const [FetchStocks] = useLazyQuery(FetchAllShares, {
    onCompleted: (response) => {
      FetchCompleteHandler(response);
    },
    fetchPolicy: 'cache-and-network'
  });
  const { loading, error, refetch, networkStatus } = useQuery(FetchAllShares, {
    variables: { requestCount: 0 },
    onCompleted: (response) => {
      StockInfoHandler(response.Stocks.data);
      FetchCompleteHandler(response);
    },
    fetchPolicy: 'cache-and-network',
    onError: err => {
      Alert.alert('No Network Connectivity', 'Network is not found. Check the internet connectivity and try again', [
        {
          text: 'Refetch',
          onPress: () => refetch()
        },
        {
          text: 'Cancel',
        }
      ])
    }
  });

  const FetchCompleteHandler = async(response: any) => {
    if (response.Stocks !== null) {
      const { data, limit_reached } = response.Stocks;
      const AsyncCheck = await AsyncStorage.getItem('Stocks-data');
      (AsyncCheck === null) && AsyncStorage.setItem('Stocks-data', JSON.stringify(data));
      SetStocksContainer(data);
      refresing && SetRefresh(false);
      limit_reached && SetApiLimiter(true);
      SetRequestCount(request_count + 1);
    }
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
    SetRefresh(true);
    refetch();
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