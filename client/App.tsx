import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import LoadingPage from "./Components/UI/LoadingPage";
import MainPage from "./Containers/MainPage";
import LandingPage from "./Containers/LandingPage";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import NetInfo from '@react-native-community/netinfo';
enableScreens();

const client = new ApolloClient({
  uri: "http://192.168.0.104:8000/graphql",
  cache: new InMemoryCache(),
});

const AuthenticationGuard: React.FC<{
  user_info: object | null;
  status: boolean;
  internet_connectivity: boolean;
  ChangeAuthentication: (status: boolean) => void;
}> = ({ ChangeAuthentication, status, user_info, internet_connectivity }) => {
  return (
    <>
      {status === true && user_info ? (
        <ApolloProvider client={client}>
          {/* @ts-ignore */}
          <MainPage userInfo={user_info} internet_connectivity={internet_connectivity}/>
        </ApolloProvider>
      ) : (
        <LandingPage ChangeAuthentication={ChangeAuthentication} />
      )}
    </>
  );
};

function App() {
  const [auth_status, SetAuthStatus] = useState<boolean | null>(null);
  const [user_info, SetUserInfo] = useState<object | null>(null);
  const [internet_connectivity, SetInternetConnectivity] = useState<boolean | null>(null);


  useEffect(() => {
    const CheckAuthentication = async () => {
      // await AsyncStorage.clear();
      const Token = await AsyncStorage.getItem("auth-token");
      const Username = await AsyncStorage.getItem("Username");
      const UserID = await AsyncStorage.getItem("UserID");
      if (Token && Username && UserID) {
        const NetworkStatus = await NetInfo.fetch();
        // @ts-ignore
        if (NetworkStatus.isInternetReachable === false) {
          SetAuthStatus(true);
          SetUserInfo({ token: Token, Username, userID: UserID });
          SetInternetConnectivity(false);
        } else {
          const response = await axios.post(
            "http://192.168.0.104:8000/check-auth",
            { Token }
          );
          if (JSON.stringify(response.data) !== JSON.stringify({ error: true })) {
            SetAuthStatus(true);
            SetUserInfo({ token: Token, Username, userID: UserID });
            SetInternetConnectivity(true);
          } else {
            SetAuthStatus(false);
            SetInternetConnectivity(true);
          }
        }
      } else {
        SetAuthStatus(false);
        SetInternetConnectivity(true);
      }
    };

    CheckAuthentication();
  }, []);
  
  return (
    <>
      {auth_status === null || user_info === undefined || internet_connectivity === null? (
        <LoadingPage />
      ) : (
        <AuthenticationGuard
          internet_connectivity={internet_connectivity}
          user_info={user_info}
          status={auth_status}
          ChangeAuthentication={(status: boolean) => SetAuthStatus(status)}
        />
      )}
    </>
  );
}

export default App;