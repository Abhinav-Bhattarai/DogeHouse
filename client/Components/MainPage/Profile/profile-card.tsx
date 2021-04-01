import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapItems from '../../mapper';
const { width, height } = Dimensions.get('window');
import { CardHeader } from '../trade-card';
import { PortfolioCardContainer } from './profile';

const ProfileCard: React.FC<PortfolioCardContainer> = props => {
    // @ts-ignore
    const [StockPick, _] = useState<any>(MapItems[props.Name]);
    return (
       <View style={Styles.MainContainer}>
           <CardHeader color={StockPick.color} name={props.Name}>
                {StockPick.logo}
           </CardHeader>
       </View>
    )
};

const Styles = StyleSheet.create({
    MainContainer: {
        width: width - 5,
        borderRadius: 10,
        height: height * (1 / 3),
        backgroundColor: "#2F3136",
        marginVertical: 5,
    }
})

export default ProfileCard;
