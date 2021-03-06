import React from 'react';
import { View, StyleSheet, Dimensions, TextInput, VirtualizedList } from 'react-native';
import { StocksContainer } from './trades';
import TradeCard from '../trade-card';
import { AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

interface Props {
    search_value: string;
    stocks_container: Array<StocksContainer>;
    suggestion: Array<any> | null;
    ChangeText: (text: string) => void;
    refreshing: boolean;
    RefreshHandler: () => void;
    CallGQL: () => void;
    navigation: any;
}

interface SearchBarProps {
    value: string;
    Change: (text: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = (props) => {
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

const TradeList: React.FC<Props> = props => {

    const ClickStockCardHandler = (name: string, color: string, id: string): void => {
      props.navigation.navigation.navigate('StockDetails', { name, color, id});
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
          ClickStockCard={(name: string, color: string, id: string) => ClickStockCardHandler(name, color, id)}
        />
      );
    };

    const ItemCount = () => props.search_value.length < 1 ? props.stocks_container.length : props.suggestion?.length

    const GetItem = (data: any, index: number) => data[index];
  
    return (
      <View style={Styles.MainContainer}>
        <View
          style={{ width: width, marginVertical: 10 }}
        >
          <SearchBar
            value={props.search_value}
            Change={(text: string) => props.ChangeText(text)}
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
          data={(props.search_value.length < 1) ? props.stocks_container : props.suggestion}
          keyExtractor={(item) => item._id}
          refreshing={props.refreshing}
          onRefresh={props.RefreshHandler}
          onEndReached={props.CallGQL}
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

export default React.memo(TradeList);