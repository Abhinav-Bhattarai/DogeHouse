import React, { useContext, useState } from "react";
import { View, StyleSheet, StatusBar, VirtualizedList, Text } from "react-native";
import ProfileHeader from "./ProfileHeader";
import { gql, useQuery } from "@apollo/client";
import Context from "../../../Containers/Context";
import { LoadingView } from "../Trades/trades";
import ProfileCard from "./profile-card";
import LoadingPage from "../../UI/LoadingPage";

const AccessPortfolio = gql`
  query($UserID: String!) {
    PorfolioInfo(UserID: $UserID) {
      Portfolio
    }
  }
`;

export interface PortfolioCardContainer {
    Name: string;
    Quantity: number;
    _id: string
}

const dummyArray = [{Name: 'react', Quantity: 10, _id: '10'}, {Name: 'Vue', Quantity: 20, _id: '20'}, {Name: 'Node', Quantity: 30, _id: '30'}]

const Profile = () => {
  const [portfolio, SetPortfolio] = useState<Array<PortfolioCardContainer> | null>(dummyArray);
  const context = useContext(Context);

  const { loading, data, error } = useQuery(AccessPortfolio, {
    variables: { UserID: context.userID },
    // onCompleted: (response) => {
    //   const { Portfolio } = response.PorfolioInfo;
    //   SetPortfolio(JSON.parse(Portfolio));
    // },
  });

  if (loading && portfolio === null) {
    return <LoadingView />;
  }

  if(portfolio) {
    if (portfolio.length === 0) {
      return <LoadingPage/>
    }
  }

  const ItemCount = () => portfolio !== null ? portfolio.length : 0

  const GetItem = (data: any, index: number) => {
    return data[index];
  }

  return (
    <View style={Styles.MainContainer}>
      <StatusBar hidden/>
      <ProfileHeader />
      <VirtualizedList
        data={portfolio}
        initialNumToRender={1}
        renderItem={({ item }) => {
          return <ProfileCard Name={item.Name} Quantity={item.Quantity} _id={item._id}/>
        }}
        keyExtractor={(item) => item._id}
        getItemCount={ItemCount}
        getItem={GetItem}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#36393F",
    position: "relative",
  },
});

export default Profile;
