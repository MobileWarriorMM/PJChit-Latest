import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TextInput, SafeAreaView, TouchableHighlight, Platform, ScrollView, Keyboard } from 'react-native';
import COLORS from '../common_utils/colors';
import FONTS from '../common_utils/fonts';
import ImageIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EyeIcon from 'react-native-vector-icons/Entypo'
import KeyboardWraper from '../common_utils/KeyboardWraper';
import actions from '../redux/auth/actions';
import { useDispatch, useSelector } from "react-redux";
import passwordCheck from '../common_utils/passwordCheck';
import { PASS_ERR_MSG } from '../common_utils/constants';
import SnackBarUtil from '../common_utils/SnackBarUtil';
import { fontScaleOfDevice } from '../common_utils/constants';
import FooterText from '../common_utils/FooterText';

const { width, height } = Dimensions.get('window');

export default function ForgotNewPass({ navigation,route }) {

    const dispatch = useDispatch()
    var type = route?.params?.type;
    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { forgetPasswordDetails } = useSelector((state) => state.AuthReducer);
    const [passwordConfirm, setpasswordConfirm] = useState("");
    const [passwordView, setPasswordView] = useState({ Password: true, confirmPassword: true });
    var [password, setPassword] = useState("");
    const [newpass, setNewpass] = useState('');


    const handlePassword = (e) => {
        dispatch({
            type: actions.SET_FORGET_PASSWORD_DETAILS, payload: {
                Cellular: forgetPasswordDetails.Cellular,
                Password: e,
                Type:type==='existUser'?'existUser':"forget"
            }
        });
    }
    const handlePasswordConfirm = (e) => {
        if (forgetPasswordDetails.Password === e) {
            setpasswordConfirm(true)
        } else {
            setpasswordConfirm(false)
        }
    }

    const handleSubmit = () => {
        Keyboard.dismiss()
        if (password !== newpass) {
            SnackBarUtil({ message: 'Passwords are miss match!', isError: true })
        } else if (!passwordCheck(password)) {
            SnackBarUtil({ message: PASS_ERR_MSG, isError: true })
        } else {
            const data = {
                Cellular: forgetPasswordDetails.Cellular,
                Password: newpass,
                Type:"forget"
            }
            dispatch({
                type: actions.GET_FORGET_PASSWORD,
                payload: { Submitdata: data, navigation: navigation,type: type==='existUser'?'existUser':"forget"}
            });
        }

    }

    return (
        <KeyboardWraper>
        <View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
            {/* <SafeAreaView> */}
                <View style={{ backgroundColor: color.mainColor,height:height}}>
                    <Image source={require('../../assets/images/Layer.png')} style={{ height: height * 0.17, width: width * 0.45 }} />

                    {/* Main view */}
                    <View style={pass.column}>
                        {/* circular */}
                        <View style={{ ...pass.circleAvatar, backgroundColor: color.mainColor }}>
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

                        <View style={{ justifyContent: 'space-between', height: height * 0.8 }}>
                            <View>
                                <Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontSize: height * 0.03 / fontScaleOfDevice,
                                    marginTop: 60,
                                    alignSelf: 'center',
                                    fontFamily: FONTS.FONT_BOLD
                                }}>Create New Password</Text>


                                <Text style={{
                                    fontFamily: FONTS.FONT_REGULAR,
                                    color: COLORS.DARK_BLUE,
                                    textAlign: 'center',
                                    paddingTop: 10,
                                    fontSize: height * 0.02 / fontScaleOfDevice,
                                    alignSelf: 'center',
                                }}>
                                    Your New Password Must Be Different{"\n"}From The Previous Password
                                </Text>

                            </View>
                            <View>
                                <View style={{ backgroundColor: '#f2f2f2', height: 130, width: 130, borderRadius: 100, alignSelf: 'center', justifyContent: 'center' }}>
                                    <ImageIcon name="ios-images-outline" color={'black'} size={60} style={{ alignSelf: 'center' }} />
                                </View>

                            </View>

                            <View>
                                {/* mobile number */}
                                <View style={{ ...pass.editTextBorder, }}>
                                    <Text style={pass.placeHolderText}>New Password<Text
                                        style={{ color: 'red', fontSize: 12 }}> * </Text></Text>
                                    <View style={pass.textRow}>
                                        <MaterialIcon name="lock" size={22} color="#c4903b" style={{
                                            marginLeft: 10, marginRight: 10
                                        }} />
                                        <TextInput
                                            style={pass.editText}
                                            numberOfLines={1}
                                            secureTextEntry={passwordView.Password}
                                            maxLength={20}
                                            onChangeText={(e) => {
                                                setPassword(password = e.replace(" ", ""))
                                                handlePassword(e.replace(" ", ""))
                                            }}
                                            value={password}
                                            placeholder="Enter New Password"
                                            placeholderTextColor={"gray"}
                                        />
                                        <EyeIcon onPress={() => setPasswordView({ Password: !(passwordView.Password), confirmPassword: passwordView.confirmPassword })}
                                            name={!(passwordView.Password) ? 'eye' : 'eye-with-line'} color={'grey'} size={25}
                                            style={{ marginRight: 25 }}
                                        />
                                    </View>
                                </View>
                                {password !== "" && !passwordCheck(password) ?
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

                                <View style={{ ...(passwordConfirm === false ? pass.editTextBorderRed : pass.editTextBorder), top: height * 0.03 }}>
                                    <Text style={pass.placeHolderText}>Confirm Password <Text
                                        style={{ color: 'red', fontSize: 12 }}> * </Text></Text>
                                    <View style={pass.textRow}>
                                        <MaterialIcon name="lock" size={22} color="#c4903b" style={{
                                            marginLeft: 10, marginRight: 10
                                        }} />
                                        <TextInput
                                            style={pass.editText}
                                            numberOfLines={1}
                                            value={newpass}
                                            secureTextEntry={passwordView.confirmPassword}
                                            maxLength={20}
                                            onChangeText={(e) => {
                                                setNewpass(e.replace(" ", ""))
                                                handlePasswordConfirm(e.replace(" ", ""))
                                            }}
                                            placeholder="Enter Confirm Password"
                                            placeholderTextColor={"gray"}
                                        />

                                        <EyeIcon onPress={() => setPasswordView({ Password: (passwordView.Password), confirmPassword: !(passwordView.confirmPassword) })} name={!(passwordView.confirmPassword) ? 'eye' : 'eye-with-line'} color={'grey'} size={25} style={{marginRight:15}} />
                                    </View>
                                </View>
                                <Text style={{ top: height * 0.035, marginLeft: 25, color: "red" }}>{passwordConfirm === false ? "Password Doesn't Match" : ""}</Text>
                                {/* {passwordConfirm === false ? <Text>Password Doesn't Match</Text> : <></>} */}
                            </View>


                            <View>

                                {/* login btn */}
                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    disabled={passwordConfirm === true ? false : true}
                                    onPress={handleSubmit}
                                    style={{
                                        ...pass.loginBtn,
                                        backgroundColor: passwordConfirm === true ?
                                            color.mainColor : 'gray'
                                    }}>
                                    <Text style={{ ...pass.loginBtnText, color: color.secondaryColor }}>UPDATE</Text>
                                </TouchableHighlight>

                                <FooterText isPositioned={false} />
                            </View>
                        </View>


                    </View>

                </View>


            {/* </SafeAreaView > */}
            </ScrollView>
        </View>
            
         </KeyboardWraper >
    );
}

const pass = StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        zIndex: 0,
        marginHorizontal: 20,
        flexDirection: 'row',
        borderColor: 'grey',
        height: height * 0.07
    },
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
        height: height * 0.88,
        top: -height * 0.012,
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

    editTextBorder: {
        borderWidth: 1,
        height: 50,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginLeft: 20,
        marginRight: 20,
    },
    editTextBorderRed: {
        borderWidth: 1,
        height: 50,
        // boxShadow:" 0 0 0 0.2rem rgb(241 75 75 / 25%)",
        borderRadius: 10,
        borderColor: 'red',
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
        paddingTop:Platform.OS==='ios'?15:0
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
        marginBottom: 20
    },
    loginBtnText: {
        //color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    iconStyle: {
        alignSelf: "center",
        marginTop: 20
    },
    editText: {
        color: 'black',
        fontFamily: FONTS.FONT_REGULAR,
        flex: 1,
        fontSize: height * 0.02 / fontScaleOfDevice,
    }
})


