import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapItems from "../../mapper";
const { width, height } = Dimensions.get("window");
import { CardHeader } from "../trade-card";
import { StockInfo, StocksContainer } from "../Trades/trades";
import { PortfolioCardContainer } from "./profile";

const Information: React.FC<{ Title: string; value: number }> = (props) => {
  return (
    <View
      style={{
        marginTop: 10,
        paddingVertical: 3,
        paddingHorizontal: "4%",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text style={Styles.title}> {props.Title} </Text>
      <Text style={Styles.value}> {props.value} </Text>
    </View>
  );
};

const ProfileCard: React.FC<PortfolioCardContainer> = (props) => {
  // @ts-ignore
  const [StockPick, _] = useState<any>(MapItems[props.Name.toLowerCase()]);
  // @ts-ignore
  const [info] = useState<any>(StockInfo !== null ? (
    StockInfo.filter((element: StocksContainer) => element.Name.toLowerCase() === props.Name.toLowerCase())
  ) : null);

  if(!info) {
      return <></>;
  }
  
  return (
    <View style={Styles.MainContainer}>
      <CardHeader color={StockPick.color} name={props.Name}>
        {StockPick.logo}
      </CardHeader>
      <Information Title="Quantity" value={props.Quantity} />
      <Information Title="Last Traded Price" value={info[0].CurrentTradingValue} />
      <Information
        Title="Asset Value"
        value={info[0].CurrentTradingValue * props.Quantity}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    width: width - 5,
    borderRadius: 10,
    height: height * (1 / 3),
    backgroundColor: "#2F3136",
    marginVertical: 5,
  },

  title: {
    fontWeight: "bold",
    color: 'grey',
    fontSize: 18
  },

  value: {
    fontWeight: "bold",
    color: '#90ee90',
    fontSize: 19
  },
});

export default ProfileCard;
