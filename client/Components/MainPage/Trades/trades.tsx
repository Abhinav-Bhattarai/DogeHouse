import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

const Trades = () => {
    return (
        <View style={Styles.MainContainer}>
            <StatusBar hidden/>
        </View>
    )
};

const Styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#36393F'
    }
})

export default Trades;