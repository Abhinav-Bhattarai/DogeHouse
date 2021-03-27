import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StocksContainer } from './Trades/trades';
import MapItems from "../mapper";

const { width, height } = Dimensions.get("window");

interface CardProps {
    color: string,
    name: string
}

const CardHeader: React.FC<CardProps> = props => {
  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: '5%',
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* <FontAwesome5 name="react" size={40} color="#00acee" /> */}
      {/* <FontAwesome5 name="vuejs" size={40} color="#3FB27F" /> */}
      {/* <FontAwesome5 name="node" size={50} color="#76AE63" /> */}
      {/* <FontAwesome5 name="angular" size={40} color="#D6002F"/> */}
      {props.children}
      <Text
        style={{
          fontWeight: "bold",
          color: props.color,
          fontSize: 18,
          marginLeft: "3%",
          textTransform: 'uppercase'
        }}
      >
        {props.name}
      </Text>
    </View>
  );
};

const TradeCard: React.FC<StocksContainer> = props => {
  // @ts-ignore
  const StockPick = MapItems[props.Name];
  return (
    <View style={Styles.MainContainer}>
      <CardHeader color={StockPick.color} name={props.Name}>
          {StockPick.logo}
      </CardHeader>
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    width: width - 5,
    borderRadius: 10,
    height: height * (1 / 2),
    backgroundColor: "#2F3136",
    marginVertical: 5,
  },
});

export default TradeCard;