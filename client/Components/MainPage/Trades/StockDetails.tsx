import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  Vibration
} from "react-native";
import DetailsMapper from "../../details-mapper";
import { LineChart } from "react-native-chart-kit";
const { width, height } = Dimensions.get("window");
import Websocket from "socket.io-client";
import { StocksContainer } from "./trades";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";

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

const Information: React.FC<{ name: string; value: number }> = (props) => {
  const { name, value } = props;
  return (
    <View style={Styles.CardFooterContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 17, color: "grey" }}>
          {name} :
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            color: "#90ee90",
            marginLeft: "4%",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const TransactionButton: React.FC<{
  Click: () => void;
  type: string;
  color: string;
}> = (props) => {
  return (
    <TouchableOpacity
      style={{ width: width / 2.3, borderRadius: 5 }}
      onPress={props.Click}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: props.color,
          paddingVertical: 15,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{props.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const dummy_dataSet = [34, 37, 39, 40, 42, 43, 42, 45, 46, 43, 44, 43, 44];

const InputContainer: React.FC<{
  ChangeText: (text: string) => void;
  placeholder: string;
  value: string;
}> = (props) => {
  return (
    <TextInput
      style={Styles.Input}
      placeholder={`${props.placeholder} ....`}
      spellCheck={false}
      onChangeText={(text: string) => props.ChangeText(text)}
      keyboardType="number-pad"
      placeholderTextColor="grey"
      value={props.value}
    />
  );
};

const DetailsGraph: React.FC<{ dataSet: Array<number> }> = (props) => {
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
        height={height / 1.94}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#34363a",
          backgroundGradientFrom: "#34363a",
          backgroundGradientTo: "#34363a",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 5,
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
          paddingHorizontal: "5%",
        }}
      />
    </View>
  );
};

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
  CardFooterContainer: {
    marginVertical: 5,
    width: width,
    paddingHorizontal: "5%",
  },
  Input: {
    backgroundColor: "#34363a",
    paddingVertical: 15,
    color: "#fff",
    borderRadius: 10,
    width: "95%",
    paddingHorizontal: "5%",
    marginVertical: 5,
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
