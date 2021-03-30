import React, { useContext, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import ProfileHeader from './ProfileHeader';
import { gql, useQuery } from '@apollo/client';
import Context from '../../../Containers/Context';
import { LoadingView } from '../Trades/trades';

const AccessPortfolio = gql`
    query($UserID: String!) {
        PorfolioInfo(UserID: $UserID) {
            Portfolio
        }
    }
`;

const Profile = () => {
    const [portfolio, SetPortfolio] = useState<object[] | null>(null);
    const context = useContext(Context);

    const { loading, data, error } = useQuery(AccessPortfolio, {
        variables: { UserID: context.userID },
        onCompleted: response => {
            console.log(response);
        }
    });

    if (loading) {
        return <LoadingView/>
    }

    return (
        <View style={Styles.MainContainer}>
            <StatusBar hidden/>
            <ProfileHeader/>
        </View>
    )
};

const Styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#36393F',
        position: 'relative'
    }
})

export default Profile;
