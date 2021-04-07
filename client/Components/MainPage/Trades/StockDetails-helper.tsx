import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
const { width, height } = Dimensions.get("window");

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

export const Information: React.FC<{ name: string; value: number }> = (
  props
) => {
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

export const TransactionButton: React.FC<{
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

export const dummy_dataSet = [34, 37, 39, 40, 42, 43, 42, 45, 46, 43, 44, 43, 44];

export const InputContainer: React.FC<{
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

export const DetailsGraph: React.FC<{ dataSet: Array<number> }> = (props) => {
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

const Styles = StyleSheet.create({
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
});
