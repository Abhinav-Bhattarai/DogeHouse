import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery, gql } from "@apollo/client";
import Context from "./Context";
import LoadingPage from "../Components/UI/LoadingPage";
import Profile from "../Components/MainPage/Profile/profile";
import Home from "../Components/MainPage/Home/Home";
import Trades from "../Components/MainPage/Trades/trades";
import { AntDesign, Ionicons } from "@expo/vector-icons";
const Tabs = createMaterialTopTabNavigator();

const UserInfo = gql`
  query($id: String!, $token: String!) {
    UserInfo(id: $id, auth_token: $token) {
      _id
    }
  }
`;

interface PROPS {
  userInfo: { userID: string; token: string; Username: string };
}

const MainPage: React.FC<PROPS> = (props) => {
  const [doge_available, SetDoge] = useState<0 | number>(0);
  const { loading, error } = useQuery(UserInfo, {
    variables: { id: props.userInfo.userID, token: props.userInfo.token },
    onCompleted: (res) => {
    },
  });

  if (loading === true) {
    return <LoadingPage />;
  }

  if (error) {
    return <LoadingPage />;
  }

  const NavigationComponent = () => {
    return (
      <Tabs.Navigator
        lazy={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          indicatorStyle: {
            height: 3,
            backgroundColor: "#ff385c",
          },
          showIcon: true,
          showLabel: false,
          iconStyle: {
            height: 26,
            width: 26,
          },
          tabStyle: {
            padding: 0,
            backgroundColor: "#2F3136",
          },
          activeTintColor: "#ff385c",
          inactiveTintColor: "grey",
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: (status) => (
              <AntDesign color={status.color} size={26} name="home" />
            ),
          }}
        >
          {() => <Home />}
        </Tabs.Screen>

        <Tabs.Screen
          name="Trades"
          options={{
            tabBarIcon: (status) => (
              <Ionicons name="analytics" size={26} color={status.color} />
            ),
          }}
        >
          {() => <Trades />}
        </Tabs.Screen>

        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: (status) => (
              <AntDesign color={status.color} size={26} name="profile" />
            ),
          }}
        >
          {() => <Profile />}
        </Tabs.Screen>

      </Tabs.Navigator>
    );
  };

  // @ts-ignore
  const ContextComponent = (inner_props) => {
    return (
      <Context.Provider
        value={{
          userID: props.userInfo.userID,
          auth_token: props.userInfo.token,
          username: props.userInfo.Username,
        }}
      >
        {inner_props.children}
      </Context.Provider>
    );
  };

  return (
    <ContextComponent>
      <NavigationContainer>
        <NavigationComponent />
      </NavigationContainer>
    </ContextComponent>
  );
};

export default MainPage;
