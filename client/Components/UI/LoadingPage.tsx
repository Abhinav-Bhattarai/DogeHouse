import React from 'react';
import { Image, StyleSheet, View, Text, StatusBar } from 'react-native';

const LoadingPage = () => {
    return (
        <View style={Styles.MainContainer}>
            <StatusBar hidden={true}/>
            <Image source={require('../../assets/doge.jpg')} style={Styles.Image}/>
            <Text style={Styles.Text}>DogeHouse</Text>
        </View>
    )
};

const Styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#2F3136',
        alignItems: 'center',
        justifyContent: 'center'
    },

    Image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2F3136'
    },

    Text: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff'
    }
})

export default LoadingPage;