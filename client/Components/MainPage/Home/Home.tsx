import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import HomeHeader from './HomeHeader';

const Home = () => {
    return (
        <View style={Styles.MainContainer}>
            <StatusBar hidden/>
            <HomeHeader/>
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

export default Home;
