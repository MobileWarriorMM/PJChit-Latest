import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight, Image, Platform } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import TouchID from "react-native-touch-id";
import KeyboardWraper from "../common_utils/KeyboardWraper";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../common_utils/colors";
import FONTS from "../common_utils/fonts";
import EyeIcon from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/auth/actions";
import DeviceInfo from 'react-native-device-info';
import { useForm, Controller } from "react-hook-form";
import ColorAction from "../redux/color_theme_redux/actions"
import SnackBarUtil from "../common_utils/SnackBarUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fontScaleOfDevice } from '../common_utils/constants'
import FooterText from "../common_utils/FooterText";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default function LoginScreen({ navigation }) {
    const { loginInputDetails } = useSelector((state) => state.AuthReducer);
    const { color } = useSelector((state) => state.ColorThemeReducer);

    var secColor = color.secondaryColor;

    const dispatch = useDispatch()
    var [rememberMe, setRememberMe] = useState(false)
    const [passwordView, setPasswordView] = useState(true);
    const [deviceIP, setDeviceIP] = useState("")
    const [deviceName, setDeviceName] = useState("")
    var [num, setNum] = useState("");
    var [tempString, setTempString] = useState("")
    var [logState, setLogState] = useState("logout")

    const { handleSubmit, control, formState: { errors, isValid }, reset, register } = useForm();

    // remember me
    async function handleRememberMe() {
        setRememberMe(!rememberMe)
    }

    //navigations
    function handleNavigation() {
        navigation.navigate('Register')
    }

    //touch id configs..
    const optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: '#e00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    //touch id auth
    function handleTouchAuth() {

        var phone = null
        var pass = null

        AsyncStorage.getItem('current_phone').then(res => {
            if (res != null) {
                phone = res
                setTempString(tempString = res)
                //setNum(num = phone)
            } else {

            }
        }).catch(e => {

        })

        AsyncStorage.getItem('current_pass').then(res => {
            if (res != null) {
                pass = res
            } else {

            }
        }).catch(e => {

        })

        if (pass !== "" || pass !== null && phone !== "" || phone !== null) {

            TouchID.isSupported(optionalConfigObject).then(bio => {
                if (bio == "FaceID") {
                    dispatch({
                        type: 'DIALOG_VISIBLE',
                        payload: {
                            visible: true,
                            msg: "No Fingerprint Was Found!",
                            title: "Alert"
                        }
                    })
                } else {
                    TouchID.authenticate("", optionalConfigObject).then(success => {

                        if (phone.toString() !== num.toString()) {
                            SnackBarUtil({ message: "No bio found for this number , please login using password.", isError: true })
                        } else {
                            dispatch(
                                {
                                    type: "SET_PROFILE", payload: {
                                        cellular: phone
                                    }
                                })
                            navigation.replace('Drawer')
                        }
                        // dispatch({
                        //     type: actions.SET_LOGIN_INPUT_DETAILS, payload: {
                        //         Cellular: phone,
                        //         Password: pass,
                        //     }
                        // })
                        // dispatch({
                        //     type: actions.GET_LOGIN, payload: {
                        //         Submitdata: {
                        //             Cellular: phone,
                        //             Password: pass,
                        //             IPAddress: deviceIP,//User IP
                        //             SystemName: deviceName //User device name
                        //         },
                        //         navigation: navigation,
                        //     }
                        // })

                    }).catch(err => {

                    })
                }
            }).catch(err => {
                dispatch({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: "No Fingerprint Was Found!",
                        title: "Alert"
                    }
                })
            })

        }


    }


    const Login = (data) => {
        dispatch({
            type: actions.SET_LOGIN_INPUT_DETAILS, payload: {
                Cellular: data?.Cellular,
                Password: data?.Password,
            }
        })
        dispatch({
            type: actions.GET_LOGIN, payload: {
                Submitdata: {
                    Cellular: data?.Cellular,
                    Password: data?.Password,
                    IPAddress: deviceIP,//User IP
                    SystemName: deviceName //User device name
                },
                navigation: navigation,
            }
        })
    }

    const getIp = () => {
        DeviceInfo.getIpAddress().then((ip) => {
            setDeviceIP(ip)
        });
    }
    const getDeviceName = () => {
        DeviceInfo.getDeviceName().then((deviceName) => {
            // iOS: "Becca's iPhone 6"
            setDeviceName(deviceName)
            // Android: ?
            // Windows: ?
        });
    }

    useEffect(() => {
        // Get Local IP
        // dispatch({
        //     type: "GET_INITIAL_OF_IMAGES",
        // })
        // dispatch({
        //     type: "GET_INITIAL_NA_IMAGES",
        // })
        // dispatch({
        //     type: "GET_INITIAL_HP_IMAGES",
        // })
        dispatch({
            type: "GET_GOLD_SILVER_RATES",
        },)

        dispatch({
            type: "GET_LOCATION",
        },)
        getIp()
        getDeviceName()
        AsyncStorage.getItem('current_phone').then(res => {
            if (res != null) {
                setNum(num = res)
                setTempString(tempString = res)
                let defaultValues = { Cellular: num };
                reset({ ...defaultValues });
            } else {

            }
        }).catch(e => {

        })

        AsyncStorage.getItem("log_state").then(res => {
            if (res !== null) {
                setLogState(logState = res)
                //handleTouchAuth()
            }

        }).catch(e => {

        })

    }, [])

    useEffect(() => {
        AsyncStorage.getItem('@saved_color').then(res => {
            if (res !== null) {
                dispatch({
                    type: ColorAction.SET_COLOR,
                    payload: JSON.parse(res)
                })
            } else {
            }
        })
            .catch(err => { });
    }, [AsyncStorage])


    return (
        <KeyboardWraper>
            <SafeAreaView>
                <View style={{ backgroundColor: color.mainColor, height: height }}>
                    <Image source={require('../../assets/images/Layer.png')} style={{ height: height * 0.17, width: width * 0.45 }} />

                    <View style={styles.mainContainer}>

                        {/* Main view */}
                        <View style={styles.column}>

                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.03 / fontScaleOfDevice,
                                marginTop: 70,
                                alignSelf: 'center',
                                fontFamily: FONTS.FONT_BOLD
                            }}>Login</Text>

                            <View
                                style={{
                                    height: 40
                                }}
                            />

                            {/* mobile number */}
                            <View style={errors.Cellular ? styles.errorTextBorder : styles.editTextBorder}>
                                <Text style={styles.placeHolderText}> Mobile No <Text
                                    style={{ color: 'red', fontSize: height * 0.019 / fontScaleOfDevice, }}> * </Text></Text>
                                <View style={styles.textRow}>
                                    <MaterialIcon name="account-circle-outline" size={30} color="#c4903b" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                    <Controller
                                        control={control}
                                        name="Cellular"
                                        rules={{
                                            required: {
                                                value: false,
                                                message: ' Enter Valid Mobile Number!'
                                            }
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                keyboardType="phone-pad"
                                                // numberOfLines={1}
                                                {...register("Cellular")}
                                                maxLength={10}
                                                name="Cellular"
                                                value={value}
                                                onChangeText={value => {
                                                    onChange(value)
                                                    setNum(num = value)
                                                }}
                                                placeholder="Enter mobile number"
                                                placeholderTextColor={"gray"}
                                                style={{
                                                    flex: 1,
                                                    color: 'black',
                                                    fontFamily: FONTS.FONT_REGULAR,
                                                    fontSize: height * 0.02 / fontScaleOfDevice
                                                }}
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                            {errors.Cellular ? <Text style={{
                                color: 'red', fontSize: 11,
                                marginLeft: 20, marginTop: 4, fontFamily: FONTS.FONT_REGULAR
                            }}>
                                {errors?.Cellular?.message}
                            </Text> : null}

                            <View
                                style={{
                                    height: 30
                                }}
                            />

                            {/* password */}
                            <View style={styles.passwordRow}>
                                <View style={[errors.Password ? styles.errorTextBorder : styles.editTextBorder, { flexGrow: 1 }]}>
                                    <Text style={styles.placeHolderText}> Password <Text
                                        style={{ color: 'red', fontSize: height * 0.019 / fontScaleOfDevice, }}> * </Text></Text>
                                    <View style={styles.textRow}>
                                        <MaterialIcon name="lock-outline" size={28} color="#c4903b" style={{
                                            marginLeft: 10, marginRight: 10
                                        }} />
                                        <Controller
                                            control={control}
                                            name="Password"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'Password Not Be Empty!'
                                                },

                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput
                                                    numberOfLines={1}
                                                    {...register("Password")}
                                                    placeholder="Enter your password"
                                                    secureTextEntry={passwordView}
                                                    passwordRules="*"
                                                    name="Password"
                                                    value={value}
                                                    onChangeText={value => onChange(value)}
                                                    placeholderTextColor={"gray"}
                                                    style={{
                                                        flex: 1,
                                                        color: 'black',
                                                        fontFamily: FONTS.FONT_REGULAR,
                                                        fontSize: height * 0.02 / fontScaleOfDevice
                                                    }}
                                                />
                                            )}
                                        />

                                        {
                                            (passwordView) ?
                                                <EyeIcon onPress={() => setPasswordView(!passwordView)} name='eye-with-line' style={{ marginRight: 15 }} color={'grey'} size={25} />
                                                :
                                                <EyeIcon onPress={() => setPasswordView(!passwordView)} name='eye' style={{ marginRight: 15 }} color={COLORS.BACKGROUND_O} size={25} />

                                        }

                                    </View>
                                </View>

                                {/* <Text style={{
                                    fontSize: 17,
                                    color: 'black',
                                    marginTop: 28
                                }}>OR</Text> */}

                                {/* <TouchableHighlight
                                    onPress={() => handleTouchAuth()}
                                    underlayColor="transparent"
                                >
                                    <View style={{
                                        flexDirection: 'column',
                                        marginTop: 28,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        alignContent: 'center',
                                        alignItems: 'center'
                                    }}>

                                        <View style={{
                                            backgroundColor: 'white',
                                            height: 40,
                                            width: 40,
                                            borderRadius: 80 / 2,
                                            elevation: 5,
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <MaterialIcon name="fingerprint" size={30} color="#c4903b" />
                                        </View>

                                        <Text style={{
                                            fontSize: 10,
                                            color: 'black',
                                            marginTop: 3
                                        }}>Use Touch ID</Text>

                                    </View>
                                </TouchableHighlight> */}

                            </View>
                            {errors.Password ? <Text style={{
                                color: 'red', fontSize: 11,
                                marginLeft: 20, marginTop: 4, fontFamily: FONTS.FONT_REGULAR
                            }}>
                                {errors.Password.message}
                            </Text> : null}

                            <View
                                style={{
                                    height: 20
                                }}
                            />

                            {/* Touch id ui */}
                            {
                                logState === "login" ?
                                    <TouchableHighlight
                                        onPress={() => handleTouchAuth()}
                                        underlayColor={'transparent'}
                                    >
                                        <View style={styles.touchIdRow}>
                                            <MaterialIcon name="fingerprint" size={35} color="#1b2b51" style={{
                                                marginLeft: 10, marginRight: 6,
                                            }} />
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{
                                                    fontSize: height * 0.021 / fontScaleOfDevice,
                                                    color: "#1b2b51",
                                                    fontFamily: FONTS.FONT_REGULAR
                                                }}>
                                                    Use Fingerprint ID
                                                </Text>
                                                <Text style={{ fontSize: height * 0.021 / fontScaleOfDevice, color: "#1b2b51", fontFamily: FONTS.FONT_REGULAR }}>
                                                    Provides More Protection
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight> : <></>
                            }

                            {/* forgot handler */}
                            <View style={styles.forgotRow}>
                                {/* <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => handleRememberMe()}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center'
                                    }}>

                                        <MaterialIcon name={rememberMe ? "checkbox-outline" : "checkbox-blank-outline"} size={23} color="#c4903b" />
                                        <Text style={{
                                            fontSize: 13.5,
                                            color: 'black',
                                            marginLeft: 8,
                                            fontFamily: FONTS.FONT_REGULAR
                                        }}>
                                            Remember Me
                                        </Text>
                                    </View>
                                </TouchableHighlight> */}
                            </View>

                            {/* login btn */}
                            <TouchableHighlight
                                underlayColor={"#ddd"}
                                onPress={
                                    handleSubmit(Login)
                                    //()=>navigation.navigate('PasswordRegister')
                                }
                                style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                                <Text style={{ ...styles.loginBtnText, color: secColor }}>LOGIN</Text>
                            </TouchableHighlight>



                            {/* new user */}
                            <View style={styles.newRegRow}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontFamily: FONTS.FONT_REGULAR,
                                        fontSize: height * 0.018 / fontScaleOfDevice,
                                    }}
                                >New User ?  </Text>
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => handleNavigation()}
                                >
                                    <Text
                                        style={{
                                            color: "blue",
                                            textDecorationLine: 'underline',
                                            fontFamily: FONTS.FONT_REGULAR,
                                            fontSize: height * 0.018 / fontScaleOfDevice,
                                        }}
                                    >Register Here</Text>
                                </TouchableHighlight>
                            </View>

                            {/* new user */}
                            <View style={styles.newRegRow}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontFamily: FONTS.FONT_REGULAR,
                                        fontSize: height * 0.018 / fontScaleOfDevice,
                                    }}
                                >Existing User?  </Text>
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => {
                                        navigation.navigate('forgotpass', { type: 'existUser' })
                                        let defaultValues = { Password: "", Cellular: num };
                                        reset({ ...defaultValues });
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "blue",
                                            textDecorationLine: 'underline',
                                            fontFamily: FONTS.FONT_REGULAR,
                                            fontSize: height * 0.018 / fontScaleOfDevice,
                                        }}
                                    >Continue</Text>
                                </TouchableHighlight>
                            </View>

                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={() => {
                                    navigation.navigate('forgotpass', { type: 'forgot' })
                                    let defaultValues = { Password: "", Cellular: num };
                                    reset({ ...defaultValues });
                                }}
                                style={{
                                    alignSelf: 'center',
                                    marginTop: 10
                                }}
                            >
                                <Text style={{
                                    fontSize: height * 0.017 / fontScaleOfDevice,
                                    color: 'black',
                                    //marginLeft: 8,
                                    textDecorationLine: 'underline',
                                    fontFamily: FONTS.FONT_REGULAR
                                }}>
                                    Forgot Password
                                </Text>
                            </TouchableHighlight>


                            <FooterText />

                        </View>

                        {/* circular */}
                        <View style={{ ...styles.circleAvatar, }}>
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
                        </View>

                    </View>

                    {Platform.OS === 'ios' ?
                        <TouchableHighlight
                            underlayColor={'#ddd'}
                            style={{
                                position: 'absolute',
                                right: 20,
                                top: 20,
                            }}
                            onPress={() => {
                                AsyncStorage.setItem('is_login_skipped','yes');
                                navigation.replace('Drawer')
                            }}
                        >
                            <Text style={{
                                color:color.secondaryColor,
                                fontSize: height * 0.02
                            }}>SKIP</Text>
                        </TouchableHighlight> : <></>
                    }

                </View>
            </SafeAreaView>
        </KeyboardWraper>
    );

}

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        //backgroundColor: '#bf7a08',
    },
    circleAvatar: {
        // height: 85,
        // width: 85,
        //backgroundColor: '#0e4dfb',
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: -height * 0.05,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center',
        elevation: 3
    },
    column: {
        height: height * 0.85,
        backgroundColor: 'white',
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
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
    errorTextBorder: {
        borderWidth: 1,
        height: 50,
        borderRadius: 10,
        borderColor: 'red',
        marginLeft: 20,
        marginRight: 20,
    },
    inputeEditor: {
        paddingLeft: 10,
        fontFamily: 'Poppins-Regular',
        color: "#000000",
    },

    placeHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: height * 0.019 / fontScaleOfDevice,
        paddingLeft: 5,
        paddingRight: 5,
        top: -13,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: FONTS.FONT_REGULAR
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
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
        //backgroundColor: '#c4903b',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        marginBottom: 10
    },
    loginBtnText: {
        //color: 'white',
        fontSize: height * 0.022 / fontScaleOfDevice,
        fontFamily: FONTS.FONT_BOLD
    }, newRegRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    touchIdRow: {
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
    }
})