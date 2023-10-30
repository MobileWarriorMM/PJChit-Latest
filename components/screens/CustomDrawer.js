import React, { useEffect, useState } from 'react';
import {
    View, Text, SafeAreaView, Dimensions, TouchableHighlight, StyleSheet,
    Modal, Pressable, Image, ScrollView, Platform,
} from 'react-native';
import Lock from 'react-native-vector-icons/EvilIcons';
import COLORS from '../common_utils/colors';
import GiftIcon from 'react-native-vector-icons/AntDesign'
import FONTS from '../common_utils/fonts';
import ThemeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from "react-redux";
import OffersW from '../../assets/nav bar/offers.svg';
import Offers from '../../assets/offers.svg';
import Theme from '../../assets/nav bar/theme.svg';
import TransWhite from '../../assets/transtion_white.svg';
import TransBlack from '../../assets/transtion_black.svg';
import JoinSchemeW from '../../assets/nav bar/join scheme.svg';
import JoinScheme from '../../assets/icons/join scheame.svg';
import MySchemeW from '../../assets/nav bar/my scheme.svg';
import MyScheme from '../../assets/icons/myscheme.svg';
import OrderDetails from '../../assets/nav bar/order details.svg';
import OrderDetailsNew from '../../assets/nav bar/order_gold.svg';
import ThemedStatusBar from '../common_utils/ThemedStatusBar';
import axios from 'react-native-axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileAction from '../redux/profile_screen_redux/actions'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { API_URL, IMG_URL } from '../common_utils/constants';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FooterText from '../common_utils/FooterText'

let { width, height } = Dimensions.get('window');
const fScale = Dimensions.get("window").fontScale;

export default function CustomDrawer(props) {

    const { profile } = props
    const { color } = useSelector((state) => state.ColorThemeReducer);
    var myColor = color.mainColor;
    var secColor = color.secondaryColor;
    const { UserData } = useSelector(state => state.ProfileReducer)
    var [imgUrl, setImageUrl] = useState("")
    const dispatch = useDispatch()
    const [status, setStatus] = useState()
    var [username, setUserName] = useState("");
    var [profileDoc, setProfileDoc] = useState()
    var [profileImgUrl, setProfileImgUrl] = useState("")
    var state = props.navigation.getState()

    //login skip : 
    var [loginSkip, setLoginSkip] = useState('');

    if (state.history[1] !== undefined) {
        try {
            axios.get(`${API_URL}PJjewels/Api/Admin/FileAttach/Profile/AbsEntry/${UserData?.docEntry}/ObjType/${UserData?.objType}`).then(
                (res) => {
                    if (res.status == 200) {
                        if (res?.data?.docEntry !== undefined) {
                            setProfileDoc(profileDoc = res?.data?.docEntry)
                            getFinalImageUrl(profileDoc)
                        }
                    } else {
                        setProfileImgUrl(profileImgUrl = "")
                    }
                }
            ).catch((e) => {

            })
        } catch (e) {
        }
        AsyncStorage.getItem('is_login_skipped').then(res => {

            if (res !== null) {
                setLoginSkip(res);
            }

            console.log('Log ', loginSkip)

        })
    }

    const getFinalImageUrl = async (doc) => {

        try {

            axios.get(`${IMG_URL}${doc}`)
                .then((res) => {
                    if (res.status === 200) {
                        setProfileImgUrl(profileImgUrl = `${IMG_URL}${doc}`)
                    } else {
                        setProfileImgUrl(profileImgUrl = "")
                    }
                }).catch((e) => {

                })

        } catch (e) {

        }

    }

    const LogAndFooter = ({ navigation }) => {
        return (
            <View style={{ marginTop: Platform.OS === 'ios' ? height * 0.058 : height * 0.04 }}>
                <View style={{ alignSelf: 'center' }}>
                    {loginSkip === 'yes' ?
                        <TouchableHighlight underlayColor={'transparent'}
                            onPress={async () => {
                                props.navigation.closeDrawer()
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Splash' }]
                                })
                            }}>
                            <Text style={{
                                color: secColor, textDecorationLine: 'underline',
                                fontFamily: FONTS.FONT_BOLD
                            }}>LOGIN</Text>
                        </TouchableHighlight> :
                        <TouchableHighlight underlayColor={'transparent'}
                            onPress={async () => {
                                Alert.alert('Logout', 'Are you sure you want to logout?', [
                                    { text: 'cancel', onPress: () => null },
                                    {
                                        text: 'logout', onPress: async () => {
                                            props.navigation.closeDrawer()
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Splash' }]
                                            })
                                            dispatch({
                                                type: 'SET_SCHEMES_DATA_LIST',
                                                payload: { schemeListData: [] }
                                            })
                                            dispatch({
                                                type: 'GET_PROFILE', payload: {}
                                            })
                                            await AsyncStorage.setItem("is_login_skipped", "yes")
                                            await AsyncStorage.setItem("log_state", "logout")
                                        }
                                    },
                                ])
                            }}>
                            <Text style={{
                                color: secColor, textDecorationLine: 'underline',
                                fontFamily: FONTS.FONT_BOLD
                            }}>LOGOUT</Text>
                        </TouchableHighlight>}
                </View>
                <Text style={{
                    color: 'grey',
                    alignSelf: 'center',
                    fontSize: height * 0.014,
                    marginTop: 10,
                    marginBottom: Platform.OS === 'ios' ? 20 : 10,
                    fontFamily: FONTS.FONT_REGULAR
                }}>{'App Version : ' + DeviceInfo.getVersion()}</Text>
                <FooterText isPositioned={false} />
                <View style={{ height: height * 0.035 }} />
            </View>
        )
    }

    return (
        <View {...props}>
            <ThemedStatusBar />
            <SafeAreaView>
                <View style={{
                    justifyContent: 'space-between',
                    //height: height,
                    flexDirection: 'column',
                    backgroundColor: myColor,
                    borderTopRightRadius: Platform.OS === 'ios' ? 0 : 20,
                    borderBottomRightRadius: Platform.OS === 'ios' ? 0 : 20,
                }}>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ marginLeft: 15, marginTop: 40, marginRight: 20, flex: 1 }}>

                            {/* profile image... */}
                            {loginSkip === 'yes' ?
                                <></> :
                                <View>
                                    {
                                        profileImgUrl === "" ?
                                            <View>
                                                <View style={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 160,
                                                    backgroundColor: color.secondaryColor,
                                                    borderWidth: 1,
                                                    borderColor: 'gray',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text style={{
                                                        color: color.mainColor,
                                                        fontSize: (height * 0.12 / 2) / fScale,
                                                        fontFamily: FONTS.FONT_BOLD
                                                    }}>
                                                        {UserData?.cardName === undefined || UserData?.cardName === null ?
                                                            "NO" : UserData?.cardName[0].toString().toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 60,
                                                    height: 25, width: 25,
                                                    borderRadius: 20, backgroundColor: "#efd6bb",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: 'white',
                                                }}>
                                                    <TouchableHighlight
                                                        underlayColor={"#ddd"}
                                                        onPress={() => {
                                                            props.navigation.navigate('ProfileScreen')
                                                            props.navigation.closeDrawer()
                                                        }}
                                                    >
                                                        <Lock name='pencil' size={20} color={"#be7a08"} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                            : <View>
                                                <Image
                                                    source={{ uri: profileImgUrl }}
                                                    style={{
                                                        height: 80,
                                                        width: 80,
                                                        borderRadius: 160,
                                                        backgroundColor: color.mainColor,
                                                        borderWidth: 1,
                                                        borderColor: 'gray',
                                                    }}
                                                />
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 60,
                                                    height: 25, width: 25,
                                                    borderRadius: 20, backgroundColor: "#efd6bb",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: 'white',
                                                }}>
                                                    <TouchableHighlight
                                                        underlayColor={"#ddd"}
                                                        onPress={() => {
                                                            props.navigation.navigate('ProfileScreen')
                                                            props.navigation.closeDrawer()
                                                        }}
                                                    >
                                                        <Lock name='pencil' size={20} color={"#be7a08"} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                    }
                                </View>}

                            {loginSkip === 'yes' ?
                                <></> :
                                <View style={{ flexDirection: 'column', paddingTop: 25 }}>
                                    <Text style={{ ...drawerStyle.nameText, color: secColor }}>{UserData?.cardName}</Text>
                                    <View style={{ flexDirection: 'row', width: width * 0.5 }}>
                                        <Text style={{ ...drawerStyle.schemeText, color: secColor }}> Active Scheme </Text>
                                        <Text style={{ ...drawerStyle.schemenumber, color: secColor, textAlign: 'right', marginTop: -2 }}>: {UserData?.activeSchemeCount}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ ...drawerStyle.schemeText, color: secColor }}> Pending Amount</Text>
                                        <Text style={{ ...drawerStyle.schemenumber, color: secColor, marginTop: -2 }}> : {UserData?.pendingAmount}</Text>
                                    </View>

                                </View>}

                            <View>
                                <TouchableHighlight onPress={() => {
                                    props.navigation.navigate('joinScheme')
                                    props.navigation.closeDrawer()
                                }} underlayColor='transparent'>
                                    <View style={{ flexDirection: 'row', paddingTop: 25, paddingLeft: 5 }}>

                                        {(color?.mainColor === '#ffffff') ? <JoinScheme height={22} width={22} />
                                            : <JoinSchemeW height={22} width={22} />
                                        }

                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Join Scheme</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />


                                <TouchableHighlight onPress={() => {
                                    props.navigation.navigate('myscheme')
                                    props.navigation.closeDrawer()
                                }} underlayColor='transparent'>
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>

                                        {(color?.mainColor === '#ffffff') ? <MyScheme height={26} width={26} />
                                            : <MySchemeW height={26} width={26} />
                                        }
                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>My Scheme</Text>

                                    </View>
                                </TouchableHighlight>
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 15 }} />


                                <TouchableHighlight onPress={() => {
                                    props.navigation.navigate('offers')
                                    props.navigation.closeDrawer()
                                }} underlayColor='transparent'>
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>

                                        {(color?.mainColor === '#ffffff') ? <Offers height={22} width={22} />
                                            : <OffersW height={22} width={22} />
                                        }
                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Offers</Text>


                                    </View>
                                </TouchableHighlight>
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />

                                <TouchableHighlight
                                    onPress={() => {
                                        props.navigation.navigate('OrderDetails')
                                        props.navigation.closeDrawer()
                                    }}
                                    underlayColor="transparent"
                                >
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>

                                        {(color?.mainColor === '#ffffff') ? <OrderDetailsNew height={22} width={22} />
                                            : <OrderDetails height={22} width={22} />
                                        }
                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Order Details</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />

                                {loginSkip === 'no' ?
                                    <TouchableHighlight
                                        onPress={() => {
                                            props.navigation.navigate('MapScreen')
                                            props.navigation.closeDrawer()
                                        }}
                                        underlayColor="transparent"
                                    >
                                        <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>

                                            {(color?.mainColor === '#ffffff') ? <IonIcon name='location-outline' size={23} color="#e49e2b" /> :
                                                <IonIcon name='location-outline' size={23} color="white" />
                                            }
                                            <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Store Locator</Text>
                                        </View>
                                    </TouchableHighlight> : <></>}

                                {loginSkip === 'no' ?    
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />: <></>}

                                <TouchableHighlight
                                    onPress={() => {
                                        props.navigation.navigate('NotificationScreen')
                                        props.navigation.closeDrawer()
                                    }}
                                    underlayColor="transparent"
                                >
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>

                                        {(color?.mainColor === '#ffffff') ? <IonIcon name='notifications-outline' size={23} color="#e49e2b" /> :
                                            <IonIcon name='notifications-outline' size={23} color="white" />
                                        }
                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Notifications</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />

                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => {
                                        props.navigation.navigate('ColorsScreen')
                                        props.navigation.closeDrawer()
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>
                                        <Theme height={23} width={23} />

                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Change Theme</Text>


                                    </View>
                                </TouchableHighlight>
                                {/* <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => {
                                        props.navigation.navigate('TransactionList')
                                        props.navigation.closeDrawer()
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 5 }}>
                                        {(color?.mainColor === '#ffffff') ? <TransWhite height={22} width={22} />
                                            : <TransBlack height={22} width={22} />
                                        }
                                        <Text style={{ ...drawerStyle.navbtnStyle, color: secColor }}>Transactions</Text>


                                    </View>
                                </TouchableHighlight> */}
                                <View style={{ ...drawerStyle.viewDivider, marginTop: 10 }} />


                            </View>
                        </View>

                    </ScrollView>

                    <LogAndFooter navigation={props.navigation} />

                </View>
            </SafeAreaView>
        </View>
    )
}


const drawerStyle = StyleSheet.create({
    nameText: {
        fontFamily: FONTS.FONT_BOLD,
        fontSize: height * 0.025 / fScale,
    },
    schemeText: {
        fontFamily: FONTS.FONT_REGULAR,
        color: 'white',
        fontSize: height * 0.02 / fScale
    },
    schemenumber: {
        fontFamily: FONTS.FONT_BOLD,
        color: 'white',
        fontSize: height * 0.02 / fScale
    },
    navbtnStyle: {
        fontFamily: FONTS.FONT_SEMIMODAL,
        //color: 'white',
        paddingLeft: 15,
        fontSize: height * 0.021 / fScale
    },
    viewDivider: {
        backgroundColor: '#c7b79b',
        height: 0.8,
    },
    ProfileImage: {
        backgroundColor: 'white',
        height: 60,
        width: 60,
        borderRadius: 100,
        // position: 'absolute',
        // top: height * 0.08,
        // left: width * 0.011,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 0.5
    },

})