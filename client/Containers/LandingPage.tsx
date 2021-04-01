import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import Login from "../Components/LandingPage/login";
import Signup from "../Components/LandingPage/signup";
import { Ionicons, AntDesign } from "@expo/vector-icons";
const Tabs = createMaterialTopTabNavigator();

interface PROPS {
  ChangeAuthentication: (status: boolean) => void;
}

const LandingPage: React.FC<PROPS> = ({ ChangeAuthentication }) => {
  const [username_login, SetUsernameLogin] = useState<string>("");
  const [password_login, SetPasswordLogin] = useState<string>("");
  const [username_signup, SetUsernameSignup] = useState<string>("");
  const [password_signup, SetPasswordSignup] = useState<string>("");
  const [confirm_signup, SetConfirmSignup] = useState<string>("");
  const [phone_signup, SetPhoneSignup] = useState<string>("");
  const [username_login_err, SetUsernameLoginErr] = useState<boolean>(false);
  const [password_login_err, SetPasswordLoginErr] = useState<boolean>(false);
  const [username_signup_err, SetUsernameSignupErr] = useState<boolean>(false);
  const [password_signup_err, SetPasswordSignupErr] = useState<boolean>(false);
  const [confirm_signup_err, SetConfirmSignupErr] = useState<boolean>(false);
  const [phone_signup_err, SetPhoneSignupErr] = useState<boolean>(false);

  const ChangeUsernameSignup = (value: string): void => {
    SetUsernameSignup(value);
  };
  const ChangePasswordSignup = (value: string): void => {
    SetPasswordSignup(value);
  };
  const ChangeCorfirmSignup = (value: string): void => {
    SetConfirmSignup(value);
  };
  const ChangePhoneSignup = (value: string): void => {
    SetPhoneSignup(value);
  };
  const ChangeUsernameLogin = (value: string): void => {
    SetUsernameLogin(value);
  };
  const ChangePasswordLogin = (value: string): void => {
    SetPasswordLogin(value);
  };

  const LoginHandler = async (): Promise<void> => {
    if (password_login.length >= 8 && username_login.length >= 5) {
      const number_regex = /[0-9]/;
      if (number_regex.exec(password_login) !== null) {
        const context = { Username: username_login, Password: password_login };
        const response = await axios.post("http://192.168.0.106:8000/login", context);
        const error = { authentication_failed: true };
        if (JSON.stringify(response.data) !== JSON.stringify(error)) {
          await AsyncStorage.setItem("Username", username_signup);
          await AsyncStorage.setItem("UserID", response.data.UserID);
          await AsyncStorage.setItem("auth-token", response.data.token);
          ChangeAuthentication(true);
        }
      }
    }
  };

  const SignupHandler = async (): Promise<void> => {
    if (
      password_signup === confirm_signup &&
      password_signup.length > 7 &&
      username_signup.length > 4 &&
      phone_signup.length >= 10
    ) {
      const number_regex = /[0-9]/;
      if (number_regex.exec(password_signup) !== null) {
        const context = {
          Username: username_signup,
          Password: password_signup,
          Phone: phone_signup,
          Confirm: confirm_signup,
        };
        const response = await axios.post("http://192.168.0.106:8000/signup", context);
        const error = { authentication_failed: true };
        const UsernameTaken = { username_already_taken: true };
        if (JSON.stringify(response.data) !== JSON.stringify(error)) {
          if (JSON.stringify(response.data) !== JSON.stringify(UsernameTaken)) {
            await AsyncStorage.setItem("Username", username_signup);
            await AsyncStorage.setItem("UserID", response.data.UserID);
            await AsyncStorage.setItem("auth-token", response.data.token);
            ChangeAuthentication(true);
          }
        }
      }
    }
  };

  return (
    <NavigationContainer>
      <Tabs.Navigator
        tabBarPosition="bottom"
        lazy={true}
        backBehavior='initialRoute'
        tabBarOptions={{
          indicatorStyle: { height: 2, backgroundColor: "#ff5B2D" },
          activeTintColor: "#ff5B2D",
          showIcon: true,
          iconStyle: {
            height: 30,
            width: 30,
          },
          labelStyle: { fontWeight: "bold", textTransform: "capitalize" },
          inactiveTintColor: "grey",
          tabStyle: { padding: 0, backgroundColor: "#ECEDF1" },
          pressColor: "grey",
          bounces: true,
        }}
      >
        <Tabs.Screen
          name="Login"
          options={{
            tabBarIcon: (status) => (
              <Ionicons color={status.color} size={30} name="ios-star" />
            ),
          }}
        >
          {() => (
            <Login
              username={username_login}
              password={password_login}
              ChangeUsername={(text: string) => ChangeUsernameLogin(text)}
              ChangePassword={(text: string) => ChangePasswordLogin(text)}
              Submit={LoginHandler}
            />
          )}
        </Tabs.Screen>

        <Tabs.Screen
          name="Signup"
          options={{
            tabBarIcon: (status) => (
              <AntDesign name="adduser" size={30} color={status.color} />
            ),
          }}
        >
          {() => (
            <Signup
              username={username_signup}
              password={password_signup}
              confirm={confirm_signup}
              phone={phone_signup}
              ChangeUsername={(text: string) => ChangeUsernameSignup(text)}
              ChangePassword={(text: string) => ChangePasswordSignup(text)}
              ChangeConfirm={(text: string) => ChangeCorfirmSignup(text)}
              ChangePhone = {(text: string) => ChangePhoneSignup(text)}
              Submit={SignupHandler}
            />
          )}
        </Tabs.Screen>
      </Tabs.Navigator>
    </NavigationContainer>
  );
};

export default LandingPage;