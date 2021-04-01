import React from "react";
import { StyleSheet, View, Dimensions, Text, Image } from "react-native";

const { width } = Dimensions.get("window");

const ProfileHeader = () => {
  return (
    <View style={Styles.HeaderContainer}>
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
    width: width,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default ProfileHeader;
