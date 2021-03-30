import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { StocksContainer } from "./Trades/trades";
import MapItems from "../mapper";
import { LineChart } from "react-native-chart-kit";
const { width, height } = Dimensions.get("window");

interface CardProps {
  color: string;
  name: string;
}

const CardHeader: React.FC<CardProps> = (props) => {
  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: "5%",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {props.children}
      <Text
        style={{
          fontWeight: "bold",
          color: props.color,
          fontSize: 18,
          marginLeft: "3%",
          textTransform: "uppercase",
        }}
      >
        {props.name}
      </Text>
    </View>
  );
};

const CardFooter: React.FC<{ name: string; value: number }> = ({name, value}) => {
  return (
    <View style={Styles.CardFooterContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{ fontWeight: "bold", fontSize: 14, color: "grey" }}>
          { name } :
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#90ee90", marginLeft: '4%' }}>
          { value }
        </Text>
      </View>
    </View>
  );
};

const CardGraph = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
      <LineChart
        data={{
          labels: ["12:00", "1:00", "2:00", "3:00", "4:00"],
          datasets: [
            {
              data: [
                10, 20, 30, 40, 50
              ],
            },
          ],
        }}
        width={width - 10} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#2F3136",
          backgroundGradientFrom: "#2F3136",
          backgroundGradientTo: "#2F3136",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 5,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#36393F",
            onPress: () => console.log("pressed"),
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 10,
          paddingVertical: 5,
        }}
      />
    </View>
  );
};

const TradeCard: React.FC<StocksContainer> = (props) => {
  // @ts-ignore
  const StockPick = MapItems[props.Name];
  return (
    <View style={Styles.MainContainer}>
      <CardHeader color={StockPick.color} name={props.Name}>
        {StockPick.logo}
      </CardHeader>
      <CardGraph />
      <CardFooter name={'Last Traded Price'} value={props.CurrentTradingValue}/>
      <CardFooter name={'High'} value={props.High}/>
      <CardFooter name={'Low'} value={props.Low}/>
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    width: width - 5,
    borderRadius: 10,
    height: height * (1.4 / 2),
    backgroundColor: "#2F3136",
    marginVertical: 5,
  },

  CardFooterContainer: {
    marginVertical: 5,
    paddingHorizontal: '5%'
  },
});

export default React.memo(TradeCard);