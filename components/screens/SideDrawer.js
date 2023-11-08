import React, { useEffect, useState } from 'react';
import {
    View, Text, SafeAreaView, Dimensions, TouchableHighlight, StyleSheet,
    Modal, Pressable, Image, ScrollView, Platform, TouchableOpacity,
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

const size = Dimensions.get('window');
const { height, width } = Dimensions.get('window');
const fScale = Dimensions.get("window").fontScale;

console.log(height)

const SideDrawer = (props) => {

    //global vars
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

    //handle drawer is opened...
    //login skip : 
    var [loginSkip, setLoginSkip] = useState('');

    //list items
    var listItems = [
        {
            icon: <JoinSchemeW height={22} width={22} />,
            title: 'Join scheme'
        },
        {
            icon: <MySchemeW height={26} width={26} />,
            title: 'My schemes'
        },
        {
            icon: <OffersW height={22} width={22} />,
            title: 'Offers'
        },
        {
            icon: <OrderDetails height={22} width={22} />,
            title: 'Order details'
        },
        {
            icon: <IonIcon name='location-outline' size={23} color="white" />,
            title: 'Store locator'
        },
        {
            icon: <IonIcon name='notifications-outline' size={23} color="white" />,
            title: 'Notifications'
        },
        {
            icon: <Theme height={23} width={23} />,
            title: 'Change theme'
        },
    ];

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

    return (
        <View>
            <SafeAreaView>

                <ThemedStatusBar />
                {/* container */}
                <View style={[styles.container, { backgroundColor: myColor }]}>

                    {/* header view */}
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
                                        <View style={styles.editIcon}>
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
                                        <View style={styles.editIcon}>
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
                        <View style={{ flexDirection: 'column', marginTop: 20 }}>
                            <Text style={{ ...styles.nameText, color: secColor }}>{UserData?.cardName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...styles.schemeText, color: secColor }}>Active Scheme </Text>
                                <Text style={{ ...styles.schemenumber, color: secColor, textAlign: 'right', marginTop: -2 }}>: {UserData?.activeSchemeCount}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...styles.schemeText, color: secColor }}>Pending Amount</Text>
                                <Text style={{ ...styles.schemenumber, color: secColor, marginTop: -2 }}> : {UserData?.pendingAmount}</Text>
                            </View>

                        </View>
                    }
                    <View style={{ height: 20 }} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            listItems.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <ListTile
                                            item={item}
                                            color={secColor}
                                            mainColor={myColor}
                                            onTap={(val) => {
                                                if (val === 'Join scheme') {
                                                    props.navigation.navigate('joinScheme')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'My schemes') {
                                                    props.navigation.navigate('myscheme')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'Offers') {
                                                    props.navigation.navigate('offers')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'Order details') {
                                                    props.navigation.navigate('OrderDetails')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'Store locator') {
                                                    props.navigation.navigate('MapScreen')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'Notifications') {
                                                    props.navigation.navigate('NotificationScreen')
                                                    props.navigation.closeDrawer()
                                                }
                                                else if (val === 'Change theme') {
                                                    props.navigation.navigate('ColorsScreen')
                                                    props.navigation.closeDrawer()
                                                }
                                            }}
                                        />
                                    </View>
                                )
                            })
                        }
                    </ScrollView>

                </View>

                {/* footer view */}
                <View style={styles.footerView}>
                    {
                        loginSkip === 'yes' ?
                            <TouchableHighlight underlayColor={'transparent'}
                                onPress={async () => {
                                    props.navigation.closeDrawer()
                                    props.navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Splash' }]
                                    })
                                }}>
                                <Text style={{
                                    color: secColor, textDecorationLine: 'underline',
                                    fontFamily: FONTS.FONT_BOLD
                                }}>LOGIN</Text>
                            </TouchableHighlight> :
                            <TouchableHighlight onPress={() => {
                                Alert.alert('Logout', 'Are you sure you want to logout?', [
                                    { text: 'cancel', onPress: () => null },
                                    {
                                        text: 'logout', onPress: async () => {
                                            props.navigation.closeDrawer()
                                            props.navigation.reset({
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
                            }} underlayColor={'#ddd'}>
                                <Text style={{
                                    color: secColor,
                                    textDecorationLine: 'underline',
                                    fontWeight: 'bold',
                                    fontSize: size.height * 0.02
                                }}>LOGOUT</Text>
                            </TouchableHighlight>
                    }
                    <Text style={{
                        color: 'grey',
                        fontSize: size.height * 0.017,
                        marginTop: 5,
                        marginBottom: 5
                    }}>App Version : {DeviceInfo.getVersion()}</Text>
                    <FooterText isPositioned={false} />
                </View>

            </SafeAreaView>
        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        height: size.height - 20,
        borderTopRightRadius: Platform.OS === 'ios' ? 0 : 20,
        borderBottomRightRadius: Platform.OS === 'ios' ? 0 : 20,
        padding: 17
    },
    footerView: {
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 12 : height <= 700 ? 15 : 90,
        alignSelf: 'center',
        alignItems: 'center'
    },
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
    editIcon: {
        position: 'absolute',
        top: 0,
        left: 60,
        height: 25, width: 25,
        borderRadius: 20, backgroundColor: "#efd6bb",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
    }

});

const ListTile = (props) => {

    const { item, onTap, color, mainColor } = props;

    return (
        <View style={{ marginVertical: 6 }}>
            <TouchableOpacity onPress={() => onTap(item?.title)}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Leading title={item?.title} color={mainColor} />
                    <View style={{ marginLeft: 15 }} />
                    <Text style={{
                        color: color,
                        fontSize: size.height * 0.021 / fScale,
                        fontFamily: FONTS.FONT_MEDIUM
                    }}>{item?.title}</Text>
                </View>
            </TouchableOpacity>
            <View style={{
                height: 1,
                backgroundColor: '#c7b79b',
                marginTop: 8,
                marginBottom: 5
            }} />
        </View>
    )

}

const Leading = ({ title, color }) => {

    if (title === 'Join scheme') {

        return (
            <View>
                {
                    color === '#ffffff' ?
                        <JoinScheme height={22} width={22} /> :
                        <JoinSchemeW height={22} width={22} />
                }
            </View>
        )

    } else if (title === 'My schemes') {
        return (
            <View>
                {
                    color === '#ffffff' ?
                        <MyScheme height={26} width={26} /> :
                        <MySchemeW height={26} width={26} />
                }
            </View>
        )
    } else if (title === 'Offers') {
        return (
            <View>
                {
                    color === '#ffffff' ?
                        <Offers height={22} width={22} />
                        : <OffersW height={22} width={22} />
                }
            </View>
        )
    } else if (title === 'Order details') {
        return (
            <View>
                {
                    color === '#ffffff' ?
                        <OrderDetailsNew height={22} width={22} />
                        : <OrderDetails height={22} width={22} />
                }
            </View>
        )
    } else if (title === 'Store locator') {
        return (
            <View>
                {
                    color === '#ffffff' ?
                        <IonIcon name='location-outline' size={23} color="#e49e2b" /> :
                        <IonIcon name='location-outline' size={23} color="white" />
                }
            </View>
        )
    } else if (title === 'Notifications') {
        return (
            <View>
                {
                    color === '#ffffff' ?
                        <IonIcon name='notifications-outline' size={23} color="#e49e2b" /> :
                        <IonIcon name='notifications-outline' size={23} color="white" />
                }
            </View>
        )
    } else if (title === 'Change theme') {
        return (
            <View>
                <Theme height={23} width={23} />
            </View>
        )
    }


    return (
        <></>
    )
}

export default SideDrawer;