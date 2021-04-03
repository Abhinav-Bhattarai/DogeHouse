import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const StockDetails: React.FC<{navigation: any}> = props => {
    useEffect(() => {
        props.navigation.navigation.setOptions({
            headerTintColor: props.navigation.route.params.color
        })
    }, [])

  return (
    <View style={Styles.MainContainer}>

    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StockDetails;
