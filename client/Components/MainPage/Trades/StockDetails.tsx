import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ScrollView
} from "react-native";
import DetailsMapper from "../../details-mapper";
import { TransactionButton, Information, InputContainer, DetailsGraph, LoadingView, dummy_dataSet } from './StockDetails-helper';
const { width, height } = Dimensions.get("window");
import Websocket from "socket.io-client";
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



const StockDetails: React.FC<{ navigation: any }> = (props) => {
  const { navigation, route } = props.navigation;
  // @ts-ignore
  const [logo] = useState<{ logo: React.ReactNode; color: string }>(DetailsMapper[route.params.name.toLowerCase()]);
  const [details, SetDetails] = useState<StocksContainer | null | false>(null);
  const [socket, SetSocket] = useState<any>(null);
  const [quantity, SetQuantity] = useState<string>("");
  const [price, SetPrice] = useState<string>("");

  const { loading } = useQuery(FetchDetails, {
    variables: { id: route.params.id },
    onCompleted: (response) => {
      const data = response.ShareInfo;
      if (data !== null) {
        SetDetails(data);
      } else {
        SetDetails(false);
      }
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: route.params.color,
      headerTitle: route.params.name,
      headerRight: () => logo.logo,
    });
    ConnectToSocket("http://192.168.0.104:8000", route.params.redundancy);
  }, []);

  const ConnectToSocket = (uri: string, status: boolean) => {
    const io = Websocket(uri);
    status === true && io.emit("join-room", route.params.id);
    SetSocket(io);
  };

  useEffect(() => {
    if (socket) {
      socket.on("client-trade", (data: number) => {
        if (details) {
          const dummy = { ...details };
          if (dummy.DataSet !== undefined) {
            const dataSet_arr = JSON.parse(dummy.DataSet);
            dataSet_arr.push(data);
            dummy["DataSet"] = JSON.stringify(dataSet_arr);
            SetDetails(dummy);
          }
        }
      });

      return () => {
        socket.removeAllListeners();
      };
    }
  });

  if (loading || details === null) {
    return <LoadingView />;
  };

  const TriggerSell = () => {
    console.log('sell');
    Vibration.vibrate(25);
  };

  const TriggerBuy = () => {
    console.log('buy');
    Vibration.vibrate(25);
  }

  // Inner React Components;
  let InformationContainer = null;
  if (details !== false) {
    InformationContainer = () => (
      <>
        <Information name="High" value={details.High} />
        <Information name="Low" value={details.Low} />
        <Information name="Volume" value={details.Volume} />
        <Information
          name="Last Traded Price"
          value={details.CurrentTradingValue}
        />
      </>
    );
  }

  const InputWrapper = () => (
    <>
      <Text
        style={{
          fontWeight: "bold",
          color: route.params.color,
          fontSize: 18,
          marginVertical: 20,
        }}
      >
        Trading Options
      </Text>
      <InputContainer
        ChangeText={(text: string) => SetQuantity(text)}
        placeholder="Quantity"
        value={quantity}
      />
      <InputContainer
        ChangeText={(text: string) => SetPrice(text)}
        placeholder="Price"
        value={price}
      />
    </>
  );

  const ButtonContainer = () => (
    <View style={Styles.BtnContainer}>
      <TransactionButton
        color="#34A853"
        type="Buy"
        Click={TriggerBuy}
      />
      <TransactionButton
        color="#EA4335"
        type="Sell"
        Click={TriggerSell}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={60}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <ScrollView
        style={Styles.MainContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <DetailsGraph dataSet={dummy_dataSet} />
        {InformationContainer && <InformationContainer />}
        {/* <InputWrapper /> */}
        <ButtonContainer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
  },

  BtnContainer: {
    width: width,
    paddingHorizontal: "4%",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20
  },
});

export default StockDetails;