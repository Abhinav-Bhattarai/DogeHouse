import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import LoadingPage from "./Components/UI/LoadingPage";
import MainPage from "./Containers/MainPage";
import LandingPage from "./Containers/LandingPage";
enableScreens();

const AuthenticationGuard: React.FC<{
  status: boolean;
  ChangeAuthentication: (status: boolean) => void;
}> = ({ ChangeAuthentication, status }) => {
  return (
    <>
      {status === true ? (
        <MainPage />
      ) : (
        <LandingPage ChangeAuthentication={ChangeAuthentication} />
      )}
    </>
  );
};

function App() {
  const [auth_status, SetAuthStatus] = useState<boolean | null>();

  useEffect(() => {
    const CheckAuthentication = async () => {
      const Token = await AsyncStorage.getItem("auth-token");
      const Username = await AsyncStorage.getItem("Username");
      const UserID = await AsyncStorage.getItem("UserID");
      if (Token && Username && UserID) {
        const response = await axios.post("http://192.168.0.106:8000/check-auth", {Token});
        if (JSON.stringify(response.data) !== JSON.stringify({ error: true })) {
          SetAuthStatus(true);
        } else {
          SetAuthStatus(false);
        }
      } else {
        SetAuthStatus(false);
      }
    };

    CheckAuthentication();
  }, []);

  return (
    <>
      {auth_status === null || auth_status === undefined ? (
        <LoadingPage />
      ) : (
        <AuthenticationGuard
          status = {auth_status}
          ChangeAuthentication = {(status: boolean) => SetAuthStatus(status) }
        />
      )}
    </>
  );
}

export default App;