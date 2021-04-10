import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ScrollView,
  Modal,
  TouchableOpacity
} from "react-native";
import DetailsMapper from "../../details-mapper";
import {
  TransactionButton,
  Information,
  InputContainer,
  ModalHeader,
  DetailsGraph,
  LoadingView,
  dummy_dataSet,
} from "./StockDetails-helper";
const { width } = Dimensions.get("window");
import Websocket from "socket.io-client";
import { StocksContainer } from "./trades";
import axios from "axios";
import Context from "../../../Containers/Context";

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

const InputWrapper: React.FC<{}> = (props) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 50,
        marginBottom: 20,
      }}
    >
      {props.children}
    </View>
  );
};

const TransactionFinalizationButton: React.FC<{
  type: string;
  color: string;
  Click: () => void
}> = (props) => {
  return (
    <TouchableOpacity
      style={{ width: width - 23, borderRadius: 5, marginVertical: 5 }}
      onPress={props.Click}
    >
      <View
        style={{
          paddingVertical: 27,
          flex: 1,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: props.color,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {props.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const StockDetails: React.FC<{ navigation: any }> = (props) => {
  const { navigation, route } = props.navigation;
  // @ts-ignore
  const [logo] = useState<{ logo: React.ReactNode; color: string }>(DetailsMapper[route.params.name.toLowerCase()]);
  const [details, SetDetails] = useState<StocksContainer | null | false>(null);
  const [socket, SetSocket] = useState<any>(null);
  const [modal_popup, SetModalPopup] = useState<boolean>(false);
  const [quantity, SetQuantity] = useState<string>("");
  const [price, SetPrice] = useState<string>("");
  const UserContext = useContext(Context);

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
    ConnectToSocket("http://192.168.0.104:8000");
  }, []);

  const ConnectToSocket = (uri: string) => {
    const io = Websocket(uri);
    io.emit("join-room", route.params.id);
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
    const context = {
      quantity,
      stockID: route.params.id,
      userID: UserContext.userID,
      price,
      name: route.params.name
    }
    axios.post('http://192.168.0.104:8000/transaction/sell', context);
  };

  const TriggerBuy = () => {
    const context = {
      quantity,
      stockID: route.params.id,
      userID: UserContext.userID,
      price
    }
    axios.post('http://192.168.0.104:8000/transaction/buy', context);
  };

  const TriggerModal = () => {
    Vibration.vibrate(25);
    SetModalPopup(true);
  };

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

  const ButtonContainer = () => ( 
    <View style={Styles.BtnContainer}>
      <TransactionButton color="#34A853" type="Buy" Click={TriggerModal} />
      <TransactionButton color="#EA4335" type="Sell" Click={TriggerModal} />
    </View>
  );

  const ModalContainer = (
    <Modal visible={modal_popup} animationType="fade">
      <View
        style={{ flex: 1, backgroundColor: "#36393F", alignItems: "center" }}
      >
        <ModalHeader value="Transaction Options" />

        <InputWrapper>
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
        </InputWrapper>
        <TransactionFinalizationButton color="#34A853" type="Buy" Click={TriggerBuy}/>
        <TransactionFinalizationButton color="#EA4335" type="Sell" Click={TriggerSell}/>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={60}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      { ModalContainer }
      <ScrollView
        style={Styles.MainContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <DetailsGraph dataSet={dummy_dataSet} />
        {InformationContainer && <InformationContainer />}
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
    marginVertical: 20,
  },
});

export default StockDetails;
