import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import ProfileHeader from './ProfileHeader';

const Profile = () => {
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
