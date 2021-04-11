import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, VirtualizedList, ActivityIndicator, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import TradeCard from "../trade-card";
import { StocksContainer } from "../Trades/trades";
const { width } = Dimensions.get('window');

interface SearchBarProps {
    value: string;
    Change: (text: string) => void;
};

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

const CachedTrade = () => {
  const [stocks_container, SetStocksContainer] = useState<Array<StocksContainer> | null>(null);
  const [suggestion, SetSuggestion] = useState<Array<StocksContainer> | null>(null);
  const [search_value, SetSearchValue] = useState<string>('');

  useEffect(() => {
    const GetData = async() => {
        const StocksData = await AsyncStorage.getItem('Stocks-data');
        StocksData && SetStocksContainer(JSON.parse(StocksData));
    };
    GetData();
  }, []);

  if (stocks_container === null) {
      return <LoadingView/>
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
        DataSet={stock.item.DataSet}
      />
    );
  };

  const ChangeText = (text: string): void => {
    const regex = new RegExp(`^${text}`, 'gi');
    if (stocks_container !== null) {
        const dummy = [...stocks_container];
        const suggestion_container = dummy.filter((element) => {
            return regex.exec(element.Name) !== null;
        });
        SetSuggestion(suggestion_container);
    }
    SetSearchValue(text)
  };

  console.log('CachedTrade rendered')

  const ItemCount = () => search_value.length < 1 ? stocks_container?.length : suggestion?.length

  const GetItem = (data: any, index: number) => data[index];

  return (
    <View style={Styles.MainContainer}>
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
        initialNumToRender={3}
        data={(search_value.length < 1) ? stocks_container : suggestion}
        keyExtractor={(item) => item._id}
        renderItem={RenderItem}
        // @ts-ignore
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

export default React.memo(CachedTrade);
