import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import LoadingPage from "./Components/UI/LoadingPage";
import MainPage from "./Containers/MainPage";
import LandingPage from "./Containers/LandingPage";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
enableScreens();

const client = new ApolloClient({
  uri: "http://192.168.1.143:8000/graphql",
  cache: new InMemoryCache(),
});

const AuthenticationGuard: React.FC<{
  user_info: object | null;
  status: boolean;
  ChangeAuthentication: (status: boolean) => void;
}> = ({ ChangeAuthentication, status, user_info }) => {
  return (
    <>
      {status === true && user_info ? (
        <ApolloProvider client={client}>
          {/* @ts-ignore */}
          <MainPage userInfo={user_info} />
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

  useEffect(() => {
    const CheckAuthentication = async () => {
      // await AsyncStorage.clear();
      const Token = await AsyncStorage.getItem("auth-token");
      const Username = await AsyncStorage.getItem("Username");
      const UserID = await AsyncStorage.getItem("UserID");
      if (Token && Username && UserID) {
        const response = await axios.post(
          "http://192.168.1.143:8000/check-auth",
          { Token }
        );
        if (JSON.stringify(response.data) !== JSON.stringify({ error: true })) {
          SetAuthStatus(true);
          SetUserInfo({ token: Token, Username, userID: UserID });
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
      {auth_status === null || user_info === undefined ? (
        <LoadingPage />
      ) : (
        <AuthenticationGuard
          user_info={user_info}
          status={auth_status}
          ChangeAuthentication={(status: boolean) => SetAuthStatus(status)}
        />
      )}
    </>
  );
}

export default App;