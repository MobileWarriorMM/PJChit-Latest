import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, Text, TextInput, Dimensions, TouchableHighlight, Platform, Keyboard } from "react-native";
import AppBar from "../Appbar";
import { useSelector, useDispatch } from "react-redux";
import FONTS from "../../common_utils/fonts";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import KeyboardWraper from "../../common_utils/KeyboardWraper";
import SnackBarUtil from "../../common_utils/SnackBarUtil";
import actions from '../../redux/auth/actions'
import BGsvg from '../../../assets/images/bottom-img.svg'
import COLORS from "../../common_utils/colors";
import checkThePassword from '../../common_utils/passwordCheck';
import { PASS_ERR_MSG } from "../../common_utils/constants";
import { fontScaleOfDevice } from "../../common_utils/constants";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function ChangePassword({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { UserData } = useSelector(state => state.ProfileReducer)
    const dispatch = useDispatch()

    var [showCurPassword, setShowCurPassword] = useState(true)
    var [showNewPassword, setShowNewPassword] = useState(true)
    var [showReNewPassword, setReNewCurPassword] = useState(true)

    var [currentPass, setCurrePassword] = useState("")
    var [newPass, setNewPass] = useState("")
    var [reNewPass, setReNewPass] = useState("")

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: color.mainColor
            }}
        >
            {/* <KeyboardWraper> */}
            <SafeAreaView>
                <AppBar navigation={navigation} title='CHANGE PASSWORD' />
                <View style={styles.column}>
                    <ScrollView keyboardShouldPersistTaps='handled'>

                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Current Password <Text
                                style={{ color: 'red',  fontSize: height * 0.018 / fontScaleOfDevice,}}> * </Text></Text>
                            <View style={styles.textRow}>
                                <MaterialIcon name="account-key" size={27} color={COLORS.DARK_BLUE} style={{
                                    marginLeft: 10, marginRight: 10,
                                }} />
                                <TextInput
                                    secureTextEntry={showCurPassword}
                                    passwordRules="*"
                                    numberOfLines={1}
                                    value={currentPass}
                                    onChangeText={(e) => {
                                        setCurrePassword(e);
                                    }}
                                    placeholderTextColor={"gray"}
                                    maxLength={20}
                                    placeholder="Enter Current Password"
                                    style={styles.editor}
                                />
                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    onPress={() =>
                                        setShowCurPassword(!showCurPassword)
                                    }
                                >
                                    {
                                        showCurPassword ?
                                            <MaterialIcon name="eye-off" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} /> :
                                            <MaterialIcon name="eye" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} />
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>

                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> New Password <Text
                                style={{ color: 'red', fontSize: height * 0.018 / fontScaleOfDevice,}}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <MaterialIcon name="shield-key" size={27} color={COLORS.DARK_BLUE} style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
                                <TextInput
                                    secureTextEntry={showNewPassword}
                                    passwordRules="*"
                                    value={newPass}
                                    onChangeText={(e) => {
                                        setNewPass(e.replace(" ", ""))
                                    }}
                                    maxLength={20}
                                    placeholderTextColor={"gray"}
                                    placeholder="Enter New Password"
                                    style={styles.editor}
                                />
                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    onPress={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                >
                                    {
                                        showNewPassword ?
                                            <MaterialIcon name="eye-off" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} /> :
                                            <MaterialIcon name="eye" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} />
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>
                        {newPass !== "" && !checkThePassword(newPass) ?
                            <Text
                                style={{
                                    fontSize: height * 0.017 / fontScaleOfDevice,
                                    color: 'red',
                                    fontFamily: FONTS.FONT_REGULAR,
                                    marginHorizontal: 20,
                                    marginTop: 5
                                }}
                            >{PASS_ERR_MSG}</Text> : <></>
                        }

                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Retype New Password <Text
                                style={{ color: 'red',  fontSize: height * 0.018 / fontScaleOfDevice,}}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <MaterialIcon name="shield-key" size={27} color={COLORS.DARK_BLUE} style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
                                <TextInput
                                    secureTextEntry={showReNewPassword}
                                    passwordRules="*"
                                    value={reNewPass}
                                    onChangeText={(e) => {
                                        setReNewPass(e.replace(" ", ""))
                                    }}
                                    placeholderTextColor={"gray"}
                                    placeholder="Retype New Password"
                                    maxLength={20}
                                    style={styles.editor}
                                />
                                <TouchableHighlight
                                    underlayColor={"#ddd"}
                                    onPress={() =>
                                        setReNewCurPassword(!showReNewPassword)
                                    }
                                >
                                    {
                                        showReNewPassword ?
                                            <MaterialIcon name="eye-off" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} /> :
                                            <MaterialIcon name="eye" size={27} color={'gray'} style={{
                                                marginLeft: 10, marginRight: 10,
                                            }} />
                                    }
                                </TouchableHighlight>
                            </View>
                            {
                                reNewPass !== "" && (reNewPass !== newPass) ?
                                    <Text style={{
                                        color: 'red',
                                        fontSize: height * 0.017 / fontScaleOfDevice,
                                        fontFamily: FONTS.FONT_REGULAR,
                                        marginTop: 5,
                                        paddingTop: Platform.OS === 'ios' ? 10 : 0
                                    }}>Passwords Are Mis Match!</Text> : <View></View>
                            }
                        </View>

                        <View style={{ height: 20 }} />

                        <TouchableHighlight
                            underlayColor={"#ddd"}
                            onPress={() => {
                                Keyboard.dismiss()
                                // Validate the inputs
                                if (currentPass === "" || newPass === "" || reNewPass === "") {
                                    SnackBarUtil({ message: 'Make Sure Fields Are Not Empty!', isError: true })
                                } else if (newPass.length < 8 || reNewPass.length < 8) {
                                    SnackBarUtil({ message: 'Enter Passwords Length At Least 8!', isError: true })
                                }
                                else if (newPass !== reNewPass) {
                                    SnackBarUtil({ message: 'Entered Passwords Are Not match!', isError: true })
                                } else if (!checkThePassword(newPass)) {
                                    SnackBarUtil({ message: PASS_ERR_MSG, isError: true })
                                }
                                else {
                                    dispatch({
                                        type: actions.SET_NEW_PASSWORD,
                                        payload: {
                                            navigation: navigation,
                                            Submitdata: {
                                                Cellular: UserData.cellular,
                                                OldPassword: currentPass,
                                                Password: reNewPass,
                                                Type: "update"
                                            }
                                        }
                                    })
                                }

                            }}
                            style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                            <Text style={{ ...styles.loginBtnText, color: color.secondaryColor }}>UPDATE</Text>
                        </TouchableHighlight>

                    </ScrollView>
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            {/* </KeyboardWraper> */}
        </View>
    )
}

const styles = StyleSheet.create({
    column: {
        height: height * 0.9,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        marginTop: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        fontFamily: FONTS.FONT_REGULAR,
        color: "#000000",
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        paddingLeft: Platform.OS === 'ios' ? 10 : 0,
    },
    placeHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: height * 0.018 / fontScaleOfDevice,
        paddingLeft: 5,
        paddingRight: 5,
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: FONTS.FONT_REGULAR
    },
    loginBtn: {
        height: 50,
        //backgroundColor: '#bf7a08',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6
    },
    loginBtnText: {
        //color: 'white',
        fontSize: height * 0.02 / fontScaleOfDevice,
        fontFamily: FONTS.FONT_MEDIUM
    },
    editor: {
        flex: 1,
        fontFamily: FONTS.FONT_REGULAR,
        color: 'black',
        fontSize: height * 0.02 / fontScaleOfDevice,
    }
})