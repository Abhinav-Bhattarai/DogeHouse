import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ActivityIndicator } from "react-native";
import DetailsMapper from "../../details-mapper";
import { LineChart } from "react-native-chart-kit";
import socket from 'socket.io-client';
const { width, height } = Dimensions.get("window");
import { StocksContainer } from "./trades";

const FetchDetails = gql`
  query($id: String!) {
    ShareInfo(id: $id) {
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

const dummy_dataSet = [34, 37, 39, 39, 40, 44, 45, 42, 48, 40, 45, 46, 43, 44, 41, 41, 41, 41, 43, 42, 42, 42, 42, 43, 44, 45, 46];

const DetailsGraph:React.FC<{dataSet: Array<number>}> = props => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
      }}
    >
      <LineChart
        data={{
          labels: ["12:00", "1:00", "2:00", "3:00", "4:00"],
          datasets: [
            {
              data: props.dataSet,
            },
          ],
        }}
        width={width - 5} // from react-native
        height={340}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#2F3136",
          backgroundGradientFrom: "#2F3136",
          backgroundGradientTo: "#2F3136",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 5
          },
          propsForDots: {
            r: "0",
            strokeWidth: "0",
            stroke: "#36393F",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 5,
          paddingHorizontal: '5%'
        }}
      />
    </View>
  );
}

const StockDetails: React.FC<{ navigation: any }> = (props) => {
  const { navigation, route } = props.navigation;
  // @ts-ignore
  const [logo] = useState<{ logo: React.ReactNode; color: string }>(DetailsMapper[route.params.name.toLowerCase()]);
  const [details, SetDetails] = useState<StocksContainer| null | object>(null);

  const { loading } = useQuery(FetchDetails, {
    variables: { id: route.params.id },
    onCompleted: (response) => {
      const data = response.ShareInfo;
      if(data !== null) {
        SetDetails(data);
      }else{
        SetDetails({});
      }
    }
  });

  // @ts-ignore
  const dataSet = JSON.parse(details.DataSet);

  const ConnectToSocket = (uri: string) => {
    const io = socket(uri);
    io.emit('join-room', route.params.id);
  } 

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: route.params.color,
      headerTitle: route.params.name,
      headerRight: () => logo.logo
    });

    ConnectToSocket('http://192.168.0.104:8000');
  }, []);

  if (loading) {
    return <LoadingView/>
  }

  return (
    <View style={Styles.MainContainer}>
      {/* // @ts-ignore */}
      <DetailsGraph dataSet={dummy_dataSet || dataSet}/>
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
    alignItems: "center",
  },
});

export default StockDetails;