import React, { useState } from "react";
import { Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import * as Fonts from "expo-font";

const FetchFonts = () => {
    return Fonts.loadAsync({
      cursive: require("../../assets/Fonts/Mission-Script.otf"),
    });
};

const Header: React.FC<{text: string}> = ({ text }) => {
  const [load_fonts, SetFontLoader] = useState<boolean>(false);

  if (load_fonts === false) {
    return (
      <AppLoading
        onError={(err) => console.log(err)}
        startAsync={FetchFonts}
        onFinish={() => SetFontLoader(true)}
      />
    );
  }

  return (
    <View
      style={{
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {load_fonts === true ? (
        <Text
          style={{
            fontSize: 37,
            color: "#ff5B2D",
            fontFamily: 'cursive',
          }}
        >
          { text }
        </Text>
      ) : null}
    </View>
  );
};

export default Header;