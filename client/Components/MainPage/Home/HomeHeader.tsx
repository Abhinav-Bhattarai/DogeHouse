import React from "react";
import { StyleSheet, View, Dimensions, Text, Image } from "react-native";

const { width } = Dimensions.get("window");

const HomeHeader = () => {
  return (
    <View style={Styles.HeaderContainer}>
      {/* <Text style={{fontWeight: 'bold', fontSize: 22, color: '#fff', marginHorizontal: 'auto'}}>
                DogeHouse
            </Text> */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../../assets/doge.jpg")}
          style={{ width: 50, height: 50, borderRadius: 25, borderColor: '#36393F' }}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: "#90ee90",
            marginLeft: "6%"
          }}
        >
          1000
        </Text>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  HeaderContainer: {
    position: "absolute",
    width: width,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    top: 0,
    left: 0,
    justifyContent: "flex-end",
  },
});

export default HomeHeader;
