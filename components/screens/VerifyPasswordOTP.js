import React, { useEffect, useReducer, useState } from "react";
import { Text, View, Dimensions, StyleSheet, SafeAreaView, TouchableHighlight, Image, Alert, PermissionsAndroid, TouchableOpacity, Platform, ScrollView } from "react-native";
import KeyboardWraper from "../common_utils/KeyboardWraper";
import COLORS from "../common_utils/colors";
import UserSvg from '../../assets/icons/user.svg'
import LockSvg from '../../assets/images/forgotpass.svg'
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch, useSelector } from "react-redux";
import FONTS from "../common_utils/fonts";
import Icon from "react-native-vector-icons/AntDesign";
import axois from 'react-native-axios'
import OTPTextField from "../common_utils/OtpTextField";
import SnackUtil from '../common_utils/SnackBarUtil'
import DeviceInfo from 'react-native-device-info'
import TestPing from "../common_utils/pingTest";
import { API_URL } from "../common_utils/constants";
import { fontScaleOfDevice } from "../common_utils/constants";
import FooterText from "../common_utils/FooterText";
import actions from "../redux/auth/actions";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function VerifyPasswordOTP({ navigation, route }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { userRegisterDetails, userOTP } = useSelector((state) => state.AuthReducer);
    var [phoneNum, setPhoneNum] = useState(route.params.num.toString().replaceAll("+91", ""))
    var [tempSave, setTempSave] = useState("")
    var [enteredOtp, setEnterOtp] = useState("")
    var [deviceNumber, setDeviceNumber] = useState("")
    const dispatch = useDispatch()
    var [timerInt, setTimerInt] = useState(60)

    const generateOTP = (length) => {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < length; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    };

    const requestPermission = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
                {
                    title: "Please Grant Phone State",
                    message: "Please grant the read the phone number permission to auto read otp.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
            }
        } catch (err) {
        }

    }

    const sendTheOtp = () => {

        DeviceInfo.getPhoneNumber().then((e) => {
            setDeviceNumber(deviceNumber = e.toString().replaceAll("+91", ""))
        }).catch((e) => {
        })

        setTempSave(tempSave = generateOTP(4))
        if (tempSave.length === 4) {
            handleSendOtp(tempSave)
        }
        //setEnterOtp(enteredOtp = tempSave)
    }

    useEffect(() => {
        if (Platform.OS !== 'ios') {
            requestPermission()
        }

        sendTheOtp()
    }, [])

    const handleSendOtp = (code) => {

        // dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })

        //1207165064372100222
        //message>>&number=<<number>>&istamil=<<0or1>>&dlttemplateid=<<dlttemplateid>>

        // var message = `${code} is your OTP for Account creation. For security reasons,DO NOT share the OTP with anyone.Poongulazhi Jewellers Pvt.Ltd.`;

        // var baseUrl = `https://pjapilive.avaniko.com/PJjewels/Api/Masters/BP/OnHandSmsResponse`;

        // console.log('Code ', code)

        var apiCode = "";
        var apiType = "REGISTER";

        if (route.params.type === "register") {
            apiCode = "Register";
            apiType = "REGISTER";
        } else {
            apiCode = "ForgetPassword";
            apiType = "PASSWORD";
        }

        dispatch({
            type: actions.SET_HANDLE_OTP,
            payload: {
                phoneNum: phoneNum,
                code: code,
                apiType: apiType,
                apiCode: apiCode,
                deviceNumber: deviceNumber,
                type: route.params.type,
                navigation: navigation
            }
        })

        console.log('OTP ',code)

        // try {
        //     TestPing("www.google.com")
        //     axois.post(`${API_URL}PJjewels/Api/Admin/SMS/Send`,
        //         JSON.stringify({
        //             "MobileNo": phoneNum,
        //             "OTP": code,
        //             //added
        //             "ObjType": "C",
        //             "Type": apiType,
        //             "Code": apiCode,
        //         }),
        //         { headers: { 'Content-type': 'application/json' } }
        //     ).then((res) => {
        //         if (res.status === 200) {
        //             if (res?.data === true) {
        //                 dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })


        //                 if(Platform.OS === 'ios'){
        //                     Alert.alert('Message',`"OTP Code Sent To " + ${phoneNum}`)

        //                 }else{
        //                     dispatch({
        //                         type: 'DIALOG_VISIBLE',
        //                         payload: {
        //                             visible: true,
        //                             msg: "OTP Code Sent To " + phoneNum,
        //                             title: "Alert"
        //                         }
        //                     })
        //                 }


        //                 setTimeout(() => {
        //                     //dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
        //                     if (phoneNum === deviceNumber) {
        //                         setEnterOtp(enteredOtp = code.toString())
        //                         if (route.params.type === "register") {
        //                             navigation.navigate("PasswordRegister")
        //                         } else {
        //                             navigation.navigate("forgotnewpass")
        //                         }
        //                         //dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        //                     }
        //                 }, 3000)

        //             } else {

        //                 if(Platform.OS === 'ios'){
        //                     Alert.alert('Message',"Unable To Send OTP")

        //                 }else{
        //                 dispatch({
        //                     type: 'DIALOG_VISIBLE',
        //                     payload: {
        //                         visible: true,
        //                         msg: "Unable To Send OTP",
        //                         title: "Alert"
        //                     }
        //                 })
        //             }
        //             }
        //         } else {
        //             dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        //             SnackUtil({ message: 'Something went wrong!', isError: true })
        //         }
        //     }).catch(e => {
        //         dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        //         SnackUtil({ message: 'Something went wrong!', isError: true })
        //     })


        // } catch (e) {
        //     dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        //     SnackUtil({ message: 'Something went wrong!', isError: true })
        // }

    }

    return (
        <KeyboardWraper>
            {/* <SafeAreaView> */}
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{ ...styles.mainContainer, backgroundColor: color.mainColor }}>
                        <Image source={require('../../assets/images/Layer.png')} style={{ height: height * 0.18, width: width * 0.45 }} />
                        <View style={styles.column}>
                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.027 / fontScaleOfDevice,
                                marginTop: 60,
                                alignSelf: 'center',
                                fontFamily: FONTS.FONT_BOLD
                            }}>Verification Code</Text>

                            <Text style={{
                                color: 'gray',
                                fontSize: height * 0.017 / fontScaleOfDevice,
                                marginTop: 10,
                                alignSelf: 'center',
                                textAlign: "center",
                                fontFamily: FONTS.FONT_REGULAR
                            }}>We have sent the code verification{"\n"}to your Mobile Number</Text>

                            <LockSvg style={{
                                alignSelf: 'center',
                                marginTop: 40
                            }} height={height * 0.13} width={height * 0.13} />

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 30,
                                justifyContent: 'center'
                            }}>

                                <Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontFamily: FONTS.FONT_BOLD,
                                    fontSize: height * 0.027 / fontScaleOfDevice,
                                    alignSelf: 'center',
                                    marginRight: 6
                                }}>******{phoneNum[6]}{phoneNum[7]}{phoneNum[8]}{phoneNum[9]}</Text>

                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    onPress={() => navigation.goBack()}
                                >
                                    <MaterialIcons name="circle-edit-outline" size={30} color={'gray'} />
                                </TouchableHighlight>

                            </View>

                            <View style={{ height: 25 }} />

                            {/* otp field */}
                            <OTPTextField
                                value={userOTP}
                                onChange={(e) => {
                                    dispatch({
                                        type: "HANDLE_OTP",
                                        payload: e
                                    })
                                    // setEnterOtp(enteredOtp = e)
                                }}
                            />

                            {/* login btn */}
                            <TouchableHighlight
                                underlayColor={"#ddd"}
                                onPress={() => {
                                    if (userOTP === "") {
                                        SnackUtil({ message: 'Please Enter the OTP!', isError: true })
                                    } else if (userOTP.length < 4) {
                                        SnackUtil({ message: 'Enter the Valid OTP!', isError: true })
                                    } else {
                                        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
                                        setTimeout(() => {
                                            dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                                            if (userOTP === tempSave) {
                                                if (route.params.type === "register") {
                                                    navigation.navigate("PasswordRegister")
                                                } else {
                                                    navigation.navigate("forgotnewpass", { type: (route.params.type === 'existUser' ? "existUser" : "forgot") })
                                                }
                                            } else {
                                                dispatch({
                                                    type: 'DIALOG_VISIBLE',
                                                    payload: {
                                                        visible: true,
                                                        msg: "OTP is invalid \nEnter correct OTP.",
                                                        title: "Alert"
                                                    }
                                                })
                                            }
                                        }, 2000)
                                    }
                                }}
                                style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                                <Text style={{ ...styles.loginBtnText, color: color.secondaryColor, fontSize: height * 0.022 / fontScaleOfDevice }}>SUBMIT</Text>
                            </TouchableHighlight>

                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("Resend?", "Do you want to resend the OTP?", [
                                        {
                                            text: 'CANCEL',
                                            onPress: () => null
                                        },
                                        {
                                            text: 'YES',
                                            onPress: () => {
                                                setEnterOtp("")
                                                sendTheOtp()
                                            }
                                        }
                                    ])
                                }}
                                underlayColor="transparent"
                            // disabled={ timerInt==0?true:false}
                            >
                                <Text style={{
                                    color: 'black',
                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                    fontSize: height * 0.018 / fontScaleOfDevice,
                                    marginVertical: 10,
                                    alignSelf: 'center'
                                }}>Resend</Text>
                            </TouchableOpacity>

                            <FooterText isPositioned={false} />

                            <View style={{ height: 20 }} />


                        </View>

                        {/* circular */}
                        <View style={{ ...styles.circleAvatar }}>
                            {/* <Icon name="user" size={45} color={color.secondaryColor} style={styles.iconStyle} /> */}
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
                        </View>
                    </View>
                </View>
            </ScrollView>
            {/* </SafeAreaView> */}
        </KeyboardWraper>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        height: height,
        width: width,
        // backgroundColor:'red'
    },
    circleAvatar: {
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: height * 0.12,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center',
        elevation: 10
    },
    column: {
        flexGrow: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        elevation: 10,
        // marginBottom: 2,
        justifyContent: 'space-between',
        // flex:1
    },
    iconStyle: {
        alignSelf: "center",
    },
    editTextBorder: {
        borderWidth: 1,
        // height: 50,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginLeft: 20,
        marginRight: 20
    },

    inputeEditor: {
        paddingLeft: 10,
        fontFamily: 'Poppins-Regular',
        color: "#000000",
    },

    placeHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: 13,
        paddingLeft: 5,
        paddingRight: 5,
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: "Poppins-Regular"
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    passwordRow: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotRow: {
        flexDirection: 'row',
        margin: 23,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    loginBtn: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    loginBtnText: {
        fontFamily: FONTS.FONT_SEMIMODAL,
        fontSize: height * 0.018 / fontScaleOfDevice,
    },
})