import React from "react";
import { SafeAreaView, View, Text, TouchableHighlight, StyleSheet , Dimensions} from "react-native";
import MenuIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import FONTS from "../common_utils/fonts";
import COLORS from "../common_utils/colors";
import ProfileSvg from "../../assets/icons/profile.svg"
import ProfileSvgNew from "../../assets/icons/profile_new.svg"
import { useDispatch, useSelector } from "react-redux";
import MenuSvg from '../../assets/icons/menu.svg'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const size = Dimensions.get('window');
const fScale = Dimensions.get("window").fontScale;

export default function AppBar({ title }) {
    const navigation = useNavigation();
    const { color } = useSelector((state) => state.ColorThemeReducer);
    var secColor = color.secondaryColor
    return (
        <SafeAreaView>
            <View style={{
                paddingHorizontal: 10,
                height: 60,
                paddingVertical: 15,
                backgroundColor: color.mainColor,
                // elevation:5
            }}>
                <View style={appbarStyle.appBarContent}>
                    {
                        (title === 'MY ACCOUNT' || title === 'ABOUT US' || title === 'FAQ' || title === 'MY SCHEMES' || title === 'JOIN SCHEMES'
                            || title === "PAYMENT HISTORY" || title === "THEMES"|| title === "UPDATE ADDRESS"||
                            title === "CHANGE PASSWORD"||title==="PAYMENT"||title==="CATELOGS"||title==='NOTIFICATIONS'||title==="ORDER DETAILS"||
                            title=="Terms & Conditions" || title==="IMAGE" || title==="Transactions") ?
                            <View style={appbarStyle.appbarView}>
                                <TouchableHighlight onPress={() => navigation.goBack()} underlayColor='transparant'>
                                    <MenuIcon name="arrow-back-outline" color={secColor} size={25} />
                                </TouchableHighlight>
                                <Text style={{...appbarStyle.title,color:secColor}}>{title}</Text>
                            </View> :
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableHighlight underlayColor='transparant' onPress={() => navigation.openDrawer()}>
                                    <MenuIcon name="md-menu-outline" color={secColor} size={25} />
                                    {/* <MenuSvg style={{height:30 , width:30}} /> */}
                                </TouchableHighlight>
                                <Text style={{...appbarStyle.title,color:secColor}}>{title}</Text>
                            </View>
                    }

                    {
                        (title === 'MY ACCOUNT' || title === 'ABOUT US' || title === 'FAQ'||title === "THEMES"|| title === "UPDATE ADDRESS"||
                        title === "CHANGE PASSWORD"||title==="PAYMENT"||title==="CATELOGS"||title==='NOTIFICATIONS'||title==="ORDER DETAILS"||
                        title=="Terms & Conditions"|| title==="IMAGE" || title==="Transactions") ?
                            <View />
                            :
                            <View style={{ paddingRight: 8 }}>
                                <TouchableHighlight onPress={() => navigation.navigate('ProfileScreen')} underlayColor='transparent'>
                                    {/* <MenuIcon name="ios-person-circle-outline" color={'black'} size={25} /> */}
                                    {
                                        color.mainColor==="#ffffff"?
                                        <MaterialIcon name="account-circle" color={COLORS.DARK_BLUE} size={30}/>:
                                        <MaterialIcon name="account-circle" color={'#fff'} size={30} />
                                    }
                                </TouchableHighlight>
                            </View>

                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const appbarStyle = StyleSheet.create({
    appBar: {
        paddingHorizontal: 10,
        height: 60,
        paddingVertical: 20,
        backgroundColor: COLORS.BACKGROUND_O,
    },
    appBarContent: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    title: {
        //color: secColor,
        paddingLeft: 10,
        fontSize:size.height*0.025/fScale,
        fontFamily: FONTS.FONT_SEMIMODAL
    },
    appbarView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})