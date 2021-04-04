import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery, gql } from "@apollo/client";
import Context from "./Context";
import LoadingPage from "../Components/UI/LoadingPage";
import Home from '../Components/MainPage/Home/home';
import Profile from "../Components/MainPage/Profile/profile";
import Trades from "../Components/MainPage/Trades/trades";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Settings from '../Components/MainPage/Settings/settings';
const Tabs = createMaterialTopTabNavigator();

const UserInfo = gql`
  query($id: String!, $token: String!) {
    UserInfo(id: $id, auth_token: $token) {
      DogeCount
    }
  }
`;

interface PROPS {
  userInfo: { userID: string; token: string; Username: string };
}

const MainPage: React.FC<PROPS> = (props) => {
  const [doge_available, SetDoge] = useState<number>(0);
  const { loading, error } = useQuery(UserInfo, {
    variables: { id: props.userInfo.userID, token: props.userInfo.token },
    onCompleted: (res) => {
      const { DogeCount } = res.UserInfo;
      SetDoge(DogeCount);
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
        initialRouteName='Trades'
        tabBarPosition="bottom"
        sceneContainerStyle={{backgroundColor: '#36393F', flex: 1}}
        tabBarOptions={{
          indicatorStyle: {
            height: 3,
            backgroundColor: "#ff385c",
          },
          showIcon: true,
          showLabel: false,
          iconStyle: {
            height: 28,
            width: 28,
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
          name="Profile"
          options={{
            tabBarIcon: (status) => (
              <AntDesign color={status.color} size={28} name="profile" />
            ),
          }}
        >
          {() => <Profile />}
        </Tabs.Screen>

        <Tabs.Screen
          name="Trades"
          options={{
            tabBarIcon: (status) => (
              <MaterialCommunityIcons name="graph-outline" size={31} color={status.color} />
            ),
          }}
        >
          {() => <Trades />}
        </Tabs.Screen>

        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: (status) => (
              <AntDesign color={status.color} size={28} name="home" />
            ),
          }}
        >
          {() => <Home />}
        </Tabs.Screen>

        <Tabs.Screen
          name="Settings"
          options={{
            tabBarIcon: (status) => (
              <AntDesign color={status.color} size={28} name="setting" />
            ),
          }}
        >
          {() => <Settings/>}
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
          dogeCount: doge_available
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
 