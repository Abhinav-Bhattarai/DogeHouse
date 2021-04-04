import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DetailsMapper from "../../details-mapper";
import { CardGraph } from "../trade-card";

const StockDetails: React.FC<{ navigation: any }> = (props) => {
  const { navigation, route } = props.navigation;
  // @ts-ignore
  const [logo] = useState<{ logo: React.ReactNode; color: string }>(DetailsMapper[route.params.name.toLowerCase()]);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: route.params.color,
      headerTitle: route.params.name,
      headerRight: () => logo.logo
    });
  }, []);

  return (
    <View style={Styles.MainContainer}>
      <CardGraph/>
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