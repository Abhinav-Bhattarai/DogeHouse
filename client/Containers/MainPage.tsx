import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery, gql } from "@apollo/client";
import Context from "./Context";
import LoadingPage from "../Components/UI/LoadingPage";
const Tabs = createMaterialTopTabNavigator();

const UserInfo = gql`
    query($id: String! auth_token: String!) {
        UserInfo{id: $id, auth_token: !auth_token) {
            _id,
            Username,
            DogeAvailable
        }
    }
`;

interface PROPS {
  userInfo: { userID: string; token: string; Username: string };
}

const MainPage: React.FC<PROPS> = (props) => {
  const [doge_available, SSeDoge] = useState<0 | number>(0);

  const { loading, error, data, refetch, previousData } = useQuery(UserInfo, {
    variables: { id: props.userInfo.userID, auth_token: props.userInfo.token },
    onCompleted: (res) => {
      console.log(res);
    },
  });

  if(loading === true) {
      return <LoadingPage/>
  }

  const NavigationComponent = () => {
    return (
      <Tabs.Navigator
        lazy={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          indicatorStyle: {
            height: 3,
            backgroundColor: "",
          },
          showIcon: true,
          showLabel: false,
          iconStyle: {
            height: 30,
            width: 30,
          },
          tabStyle: {
            padding: 0,
          },
          activeTintColor: "",
          inactiveTintColor: "",
        }}
      >
        <Tabs.Screen name="Profile">{() => <h1></h1>}</Tabs.Screen>
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
