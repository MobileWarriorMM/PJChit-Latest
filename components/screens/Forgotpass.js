import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight, Image, Platform, Alert } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../common_utils/colors";
import FONTS from "../common_utils/fonts";
import actions from "../redux/auth/actions";
import ImageIcon from 'react-native-vector-icons/Ionicons';
import KeyboardWraper from "../common_utils/KeyboardWraper";
import { useDispatch, useSelector } from "react-redux";
import SnackBarUtil from "../common_utils/SnackBarUtil";
import axois from 'react-native-axios'
import { API_URL } from "../common_utils/constants";
import { fontScaleOfDevice } from "../common_utils/constants";
import FooterText from "../common_utils/FooterText";
import LoaderAction from '../redux/loader_redux/actions';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default function Forgotpass({ navigation, route }) {


    const type = route?.params?.type

    const dispatch = useDispatch()
    const { forgetPasswordDetails } = useSelector((state) => state.AuthReducer);
    const { color } = useSelector((state) => state.ColorThemeReducer);

    var [userMobile, setUserMobile] = useState("")

    const handleDetails = (e) => {
        dispatch({
            type: actions.SET_FORGET_PASSWORD_DETAILS, payload: {
                Cellular: e,
                Password: "",
                Type: (type === 'existUser') ? "existUser" : "forget"
            }
        });
        navigation.navigate('VerifyScreen', { type: (type === 'existUser') ? "existUser" : "forgot", num: e.trim() })
    }

    //check phone number
    const checkValidPhone = async (num) => {

        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })

        try {

            axois.get(`${API_URL}PJjewels/Api/Masters/BP/CustomerVerification/Cellular/${num}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then(response => {
                dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })

                if (response.status === 200) {
                    if (response?.data === false) {
                        // handleDetails()

                        if (Platform.OS === 'ios') {
                            Alert.alert("Message", `No account was found with this number (${num})`)
                        } else {
                            dispatch({
                                type: LoaderAction.DIALOG_VISIBLE,
                                payload: {
                                    visible: true,
                                    msg: `No account was found with this number (${num})`,
                                    title: "Alert"
                                }
                            })
                        }

                    } else {
                        handleDetails(num)
                    }
                }

            }).catch(e => {
                dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
            })

        } catch (e) {
            dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
        }

    }


    return (
        <KeyboardWraper>
            <SafeAreaView>
                <View style={{
                    backgroundColor: color.mainColor, height: height
                }}>
                    <Image source={require('../../assets/images/Layer.png')}
                        style={{ height: height * 0.17, width: width * 0.45 }} />

                    {/* Main view */}
                    <View style={styles.column}>
                        {/* circular */}
                        <View style={{ ...styles.circleAvatar }}>
                            <Image
                                source={require('../../assets/images/pjlogocrop.png')}
                                resizeMode='contain'
                                //resizeMethod='resize'
                                style={{
                                    height: 80, width: 80,
                                    borderRadius: 160,
                                    backgroundColor: color.mainColor,
                                }}
                            />
                            {/* <Icon name="user" size={45} color={color.secondaryColor} style={styles.iconStyle} /> */}
                            {/* <UserIcon height={80} width={80}/> */}
                        </View>



                        <View style={{ justifyContent: 'space-between', height: height * 0.75 }}>
                            <View>
                                <Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontSize: height * 0.03 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_BOLD,
                                    marginTop: 60,
                                    alignSelf: 'center'
                                }}>{type === 'existUser' ? 'Exists user login' : 'Forgot Password'}</Text>

                                <Text style={{
                                    fontFamily: FONTS.FONT_REGULAR,
                                    color: COLORS.DARK_BLUE,
                                    textAlign: 'center',
                                    paddingTop: 10,
                                    fontSize: height * 0.02 / fontScaleOfDevice,
                                    width: width * 0.7,
                                    alignSelf: 'center'
                                }}>
                                    Please enter your Mobile Number
                                    to Send a verification code
                                </Text>

                            </View>
                            <View style={{
                                backgroundColor: '#f2f2f2', height: 125, width: 125, borderRadius: 250,
                                alignSelf: 'center', justifyContent: 'center', marginBottom: 25
                            }}>
                                <ImageIcon name="ios-images-outline" color={'black'} size={60} style={{ alignSelf: 'center' }} />
                            </View>

                            <View>
                                {/* mobile number */}
                                <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                    <Text style={styles.placeHolderText}> Mobile No <Text
                                        style={{ color: 'red', fontSize: height * 0.02 / fontScaleOfDevice }}> * </Text></Text>
                                    <View style={styles.textRow}>
                                        <MaterialIcon name="phone-message-outline" size={27} color="#bf7a08" style={{
                                            marginLeft: 10, marginRight: 10
                                        }} />
                                        <TextInput
                                            keyboardType="phone-pad"
                                            numberOfLines={1}
                                            value={userMobile}
                                            maxLength={10}
                                            onChangeText={(e) => {
                                                // handleDetails(e)
                                                setUserMobile(e)
                                            }}
                                            placeholderTextColor={"gray"}
                                            placeholder="Enter mobile number"
                                            style={{
                                                flex: 1,
                                                fontFamily: FONTS.FONT_REGULAR,
                                                color: 'black',
                                                fontSize: height * 0.02 / fontScaleOfDevice
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View>

                                {/* login btn */}
                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    onPress={async () => {
                                        if (userMobile === "") {
                                            SnackBarUtil({ message: 'Mobile Number Is Required!', isError: true })
                                        }
                                        else if (userMobile.length < 10) {
                                            SnackBarUtil({ message: 'Enter Valid Mobile Number!', isError: true })
                                        }
                                        else {
                                            if (type === 'existUser') {
                                                dispatch({
                                                    type: actions.HANDLE_EXIST_VALID_PHONENUMBER,
                                                    payload: {
                                                        number: userMobile,
                                                        navigation: navigation,
                                                        type: type
                                                    }
                                                })
                                            } else {
                                                dispatch({
                                                    type: actions.HANDLE_VALID_PHONENUMBER,
                                                    payload: {
                                                        number: userMobile,
                                                        navigation: navigation,
                                                        type: type
                                                    }
                                                })
                                            }
                                        }
                                    }}
                                    style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                                    <Text style={{ ...styles.loginBtnText, color: color.secondaryColor }}>NEXT</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <FooterText />
                </View>
            </SafeAreaView>
        </KeyboardWraper>
    );

}

const styles = StyleSheet.create({
    circleAvatar: {
        // height: 85,
        // width: 85,
        //backgroundColor: '#0e4dfb',
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: -40,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center',
        elevation: 5
    },
    column: {
        height: height * 0.9,
        //top: -height * 0.012,
        backgroundColor: 'white',
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 3
    },
    iconStyle: {
        alignSelf: "center",
        marginTop: 20
    },
    editTextBorder: {
        borderWidth: 1,
        height: 50,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginLeft: 20,
        marginRight: 20,
    },

    placeHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: height * 0.02 / fontScaleOfDevice,
        paddingLeft: 5,
        paddingRight: 5,
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: "Poppins-Regular"
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 10 : 0
    },
    loginBtn: {
        height: 50,
        //backgroundColor: COLORS.BACKGROUND_O,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 15,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        marginBottom: 25
    },
    loginBtnText: {
        fontWeight: 'bold',
        fontSize: height * 0.023 / fontScaleOfDevice
    },

})