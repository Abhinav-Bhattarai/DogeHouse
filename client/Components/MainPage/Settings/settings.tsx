import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Colors = {
  poweroff: '#ff385c',
  user: 'grey',
  barschart: 'grey',
  notification: 'grey',
  delete: 'grey'
}

const SettingsHeader = () => {
  return (
    <View style={Styles.Header}>
      <AntDesign size={40} color="grey" name="setting" />
      <Text style={Styles.HeaderText}>Settings</Text>
    </View>
  );
};

interface TypeCardProps {
  logo_name: "user" | "barschart" | "notification" | "delete" | "poweroff";
  name: string;
  Click: () => void;
}

const SettingsTypeCard: React.FC<TypeCardProps> = (props) => {
  return (
    <TouchableOpacity onPress={props.Click}>
      <View style={Styles.SettingsTypeCard}>
        <AntDesign name={props.logo_name} size={35} color={Colors[props.logo_name]}/>
        <Text
          style={{
            fontWeight: "bold",
            color: '#fff',
            marginLeft: '4%'
          }}
        >
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Settings = () => {
  const LogoutHandler = () => {
    Alert.alert('Logout', 'Are you sure you wantto logout from this account', [
      {
        text: 'Confirm',
        onPress: () => console.log('confirm')
      },
      {
        text: 'Cancel',
        onPress: () => console.log('cancelled')
      }
    ]);
  };
  const UserInfoClickHandler = () => {};
  const AnalysisHandler = () => {};
  const NotificationHandler = () => {};
  const DeleteHandler = () => {};

  return (
    <View style={Styles.MainContainer}>
      <SettingsHeader />
      <SettingsTypeCard
        logo_name="user"
        name="User Info"
        Click={UserInfoClickHandler}
      />
      <SettingsTypeCard
        logo_name="barschart"
        name="Analysis"
        Click={AnalysisHandler}
      />
      <SettingsTypeCard
        logo_name="notification"
        name="Notification"
        Click={NotificationHandler}
      />
      <SettingsTypeCard
        logo_name="delete"
        name="Delete Account"
        Click={DeleteHandler}
      />
      <SettingsTypeCard
        logo_name="poweroff"
        name="Logout"
        Click={LogoutHandler}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  Header: {
    paddingVertical: 20,
    paddingHorizontal: "4%",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: '#2F3136',
    marginBottom: 20
  },
  HeaderText: {
    color: "#fff",
    marginLeft: "3%",
    fontWeight: "bold",
    fontSize: 18,
  },
  SettingsTypeCard: {
    paddingVertical: 20,
    paddingHorizontal: "3%",
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default Settings;
