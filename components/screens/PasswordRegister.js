import React, { useState } from "react";
import {
    View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableHighlight,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import KeyboardWraper from "../common_utils/KeyboardWraper";
import COLORS from "../common_utils/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"
import SnackBarUtil from "../common_utils/SnackBarUtil";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/auth/actions";
import FONTS from "../common_utils/fonts";
import TouchID from "react-native-touch-id";
import passwordCheck from "../common_utils/passwordCheck";
import { PASS_ERR_MSG } from "../common_utils/constants";
import FooterText from "../common_utils/FooterText";
import { fontScaleOfDevice } from "../common_utils/constants";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;


export default function PasswordRegister({ navigation }) {

    // GLOBAL....
    //const {} = useSelector((state)=> state.AuthReducer)
    const { userRegisterDetails } = useSelector((state) => state.AuthReducer);
    const { color } = useSelector((state) => state.ColorThemeReducer);
    const dispatch = useDispatch()


    //boolean
    var [passwordVisible, setPasswordVisible] = useState(true)
    var [newPasswordVisible, setNewPasswordVisible] = useState(true)

    //strings
    var [passwordOne, setPasswordOne] = useState("")
    var [passwordTwo, setPasswordTwo] = useState("")

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    var [toggleColor, setToggleColor] = useState("red");
    var [emojiName, setEmojiName] = useState("emoji-sad");


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
                    AsyncStorage.setItem('finger_enabled', `${success}`)
                }).catch(err => {
                    AsyncStorage.setItem('finger_enabled', 'false')
                })
            }
        }).catch(err => {
        })
    }


    //start the function with redux....
    function handleTheRegister() {
        dispatch({
            type: actions.USER_REGISRTATION,
            payload: {
                UserData: userRegisterDetails, navigation: navigation,
                password: passwordTwo, navigation: navigation
            }
        })
    }

    return (
        <KeyboardWraper>
            <SafeAreaView>
                <View style={{ ...styles.mainContainer, backgroundColor: color.mainColor }}>
                    {/* Main view */}
                    <View style={styles.column}>

                        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                        <Text style={{
                            color: COLORS.DARK_BLUE,
                            fontSize: height * 0.03 / fontScaleOfDevice,
                            fontFamily: FONTS.FONT_BOLD,
                            marginTop: 60,
                            alignSelf: 'center'
                        }}>User Registration</Text>

                        <Text style={{
                            color: '#1b2b51',
                            fontSize: height * 0.02 / fontScaleOfDevice,
                            marginTop: 10,
                            alignSelf: 'center',
                            fontFamily: FONTS.FONT_REGULAR,
                            textAlign: 'center'
                        }}>confidential Information</Text>

                        {/* <Text style={{
                            color: '#1b2b51',
                            fontSize: 11,
                            marginTop: 10,
                            alignSelf: 'center',
                            fontFamily: FONTS.FONT_REGULAR,
                            textAlign:'center',
                            marginHorizontal:20
                        }}>Make your strong password with 1 uppercase , 1 symbol and 1 number</Text> */}

                        {/* mobile number */}
                        <View style={{ ...styles.editTextBorder, marginTop: 40 }}>
                            <Text style={styles.placeHolderText}> Password <Text
                                style={{ color: 'red', fontSize: 12 }}> * </Text></Text>
                            <View style={styles.textRow}>
                                <MaterialIcon name="lock-outline" size={27} color={"#F1C719"} style={{
                                    marginLeft: 10, marginRight: 10
                                }} />
                                <TextInput
                                    secureTextEntry={passwordVisible}
                                    passwordRules="."
                                    numberOfLines={1}
                                    placeholderTextColor={"gray"}
                                    placeholder="Enter password"
                                    maxLength={20}
                                    value={passwordOne}
                                    onChangeText={(e) => {
                                        setPasswordOne(e.replace(" ", ""))
                                    }}
                                    style={styles.editText}
                                />
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <MaterialIcon name={passwordVisible ? "eye-off" : "eye"} size={27} color="gray" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                </TouchableHighlight>
                            </View>
                        </View>
                        {passwordOne !== "" && !passwordCheck(passwordOne) ?
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: 'red',
                                    fontFamily: FONTS.FONT_REGULAR,
                                    marginHorizontal: 20,
                                    marginTop: 5
                                }}
                            >{PASS_ERR_MSG}</Text> : <></>
                        }

                        {/* mobile number */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Retype Password <Text
                                style={{ color: 'red', fontSize: 12 }}> * </Text></Text>
                            <View style={styles.textRow}>
                                <MaterialIcon name="lock-outline" size={27} color={"#F1C719"} style={{
                                    marginLeft: 10, marginRight: 10
                                }} />
                                <TextInput
                                    secureTextEntry={newPasswordVisible}
                                    passwordRules="."
                                    numberOfLines={1}
                                    placeholderTextColor={"gray"}
                                    placeholder="Enter password"
                                    maxLength={20}
                                    value={passwordTwo}
                                    onChangeText={(e) => {
                                        setPasswordTwo(e.replace(" ", ""))
                                    }}
                                    style={styles.editText}
                                />
                                {/* <EmjiIcon name={emojiName} color={toggleColor} size={19} /> */}
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                                    <MaterialIcon name={newPasswordVisible ? "eye-off" : "eye"} size={27} color="gray" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                </TouchableHighlight>
                            </View>
                        </View>
                        {passwordTwo !== "" && (passwordTwo !== passwordOne) ?
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: 'red',
                                    fontFamily: FONTS.FONT_REGULAR,
                                    marginHorizontal: 20,
                                    marginTop: 5
                                }}
                            >Password are miss match</Text> : <></>
                        }

                        {/* Touch id ui */}
                        {/* <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => handleTouchAuth()}
                        >
                            <View style={styles.touchIdRow}>
                                <MaterialIcon name="fingerprint" size={35} color="#1b2b51" style={{
                                    marginLeft: 10, marginRight: 6
                                }} />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 14, color: "#1b2b51", fontFamily: FONTS.FONT_REGULAR }}>
                                        Add Fingerprint Protection
                                    </Text>
                                    <Text style={{ fontSize: 12.5, color: "#1b2b51", fontFamily: FONTS.FONT_REGULAR }}>
                                        Provides More Protection
                                    </Text>
                                </View>
                            </View>
                        </TouchableHighlight> */}


                        {/* login btn */}
                        <TouchableHighlight
                            underlayColor={"#ddd"}
                            onPress={() => {
                                //validate
                                if (passwordOne === "") {
                                    SnackBarUtil({ message: 'Please Enter Password!', isError: true })
                                } else if (passwordTwo === "") {
                                    SnackBarUtil({ message: 'Please Enter Confirm Password!', isError: true })
                                } else if (passwordOne !== passwordTwo) {
                                    SnackBarUtil({ message: 'Passwords Are Miss Match!', isError: true })
                                } else if (passwordOne.length < 8 || passwordTwo.length < 8) {
                                    SnackBarUtil({ message: PASS_ERR_MSG, isError: true })
                                }
                                else if (!passwordCheck(passwordOne)) {
                                    SnackBarUtil({ message: PASS_ERR_MSG, isError: true })
                                }
                                else {
                                    // SnackBarUtil({message:'EnterPasswords Are Miss Match!',isError:false})
                                    //handleUserRegistration()
                                    handleTheRegister()
                                }
                            }}
                            style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                            <Text style={{ ...styles.loginBtnText, color: color.secondaryColor }}>REGISTER</Text>
                        </TouchableHighlight>
                        <FooterText />

                    </View>
                    {/* circular */}
                    <View style={{ ...styles.circleAvatar, backgroundColor: color.mainColor }}>
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
                        {/* <UserSvg height={50} width={50}/> */}
                    </View>
                    <Image source={require('../../assets/images/Layer.png')} style={{ height: height * 0.2, width: width * 0.45 }} />
                </View>
            </SafeAreaView>
        </KeyboardWraper>
    );

}

const styles = StyleSheet.create({
    mainContainer: {
        height: height,
        width: width,
        //backgroundColor: '#c4903b',
        flexDirection: 'column-reverse',
    },
    circleAvatar: {
        //height: 85,
        //width: 85,
        //backgroundColor: 'blue',
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: height * 0.14,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center',
        elevation: 5
    },
    column: {
        height: height * 0.8,
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
        fontSize: height * 0.019 / fontScaleOfDevice,
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
        paddingTop:(Platform.OS ==='ios')?10:0
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
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    loginBtnText: {
        //color: 'white',
        fontSize: 14,
        fontFamily: FONTS.FONT_BOLD
    },

    newRegRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    touchIdRow: {
        marginTop: 25,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
    },
    editText:{
        flex: 1,
        color: '#1b2b51',
        fontFamily: FONTS.FONT_REGULAR,
        fontSize:height*0.02/fontScaleOfDevice
    }
})