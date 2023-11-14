import React, { useEffect, useState } from "react";
import {
    View, SafeAreaView, Image, Text, StyleSheet, Dimensions,
    Pressable, TouchableHighlight, Modal, PermissionsAndroid,
    Linking,
    Share,
    TouchableOpacity
} from 'react-native';
import COLORS from '../../common_utils/colors';
import FONTS from "../../common_utils/fonts";
import AppBar from '../Appbar';
import Lock from 'react-native-vector-icons/EvilIcons';
import Credit from 'react-native-vector-icons/AntDesign';
import FontAwsome from 'react-native-vector-icons/FontAwesome5';
import Users from '../../../assets/icons/user.svg';
import AboutUs from '../../../assets/profil/About us.svg';
import ReferFriend from '../../../assets/profil/Refer your Friend.svg';
import FAQ from '../../../assets/profil/faq.svg';
import UpdateAddress from '../../../assets/profil/update address.svg';
import axios from 'react-native-axios';
import { useDispatch, useSelector } from "react-redux";
import actions from "../../redux/profile_screen_redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import GalleryIcon from 'react-native-vector-icons/Ionicons';
import CancelIcon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import SnackBarUtil from "../../common_utils/SnackBarUtil";
import RNFS from 'react-native-fs';
import Snackbar from "react-native-snackbar"
import BGsvg from '../../../assets/images/bottom-img.svg'
import TestPing from "../../common_utils/pingTest";
import { API_URL, IMG_URL } from "../../common_utils/constants";
import { Alert } from "react-native";
import { Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

let { width, height } = Dimensions.get('window');
const fScale = Dimensions.get('window').fontScale;

export default function ProfileScreen({ navigation }) {

    // const [userdata, setUserData] = useState()
    const dispatch = useDispatch()
    const { UserData, getProfileByDoc } = useSelector(state => state.ProfileReducer)
    const { color } = useSelector(state => state.ColorThemeReducer)
    var [username, setUserName] = useState("");
    var [modal, setModal] = useState(false)
    var [fileUri, setFileUri] = useState('')

    // //profile picture
    var [file, setFile] = useState('');
    var [profileDoc, setProfileDoc] = useState();
    var [profileImgUrl, setProfileImgUrl] = useState("");
    var [showAccountDelete, setShowAccDelete] = useState(false);

    //login skip : 
    var [loginSkip, setLoginSkip] = useState('');

    useEffect(() => {
        getProfileImageDocEntry()
        if (Platform.OS !== 'ios') {
            requestPermission()
        }

        AsyncStorage.getItem('is_login_skipped').then(res => {

            if (res !== null) {
                setLoginSkip(res);
            }

            console.log('Log ', loginSkip)

        })

    }, [])

    //console.log('user ',UserData)

    const requestPermission = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Please Grant File Access",
                    message: "Please grant the file access permission to update profile image.",
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

    const getProfileImageDocEntry = async () => {

        try {
            TestPing("www.google.com")
            axios.get(`${API_URL}PJjewels/Api/Admin/FileAttach/Profile/AbsEntry/${UserData?.docEntry}/ObjType/${UserData?.objType}`).then(
                (res) => {
                    if (res.status == 200) {
                        if (res?.data?.docEntry !== undefined) {
                            setProfileDoc(profileDoc = res?.data?.docEntry)
                            getFinalImageUrl(profileDoc)
                        }
                    }
                }
            ).catch((e) => {

            })

        } catch (e) {

        }

    }

    const getFinalImageUrl = async (doc) => {

        try {
            TestPing("www.google.com")
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

    const RemoveProfile = () => {
        setModal(!modal)

        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })

        const payloadData = [
            {
                "DocEntry": profileDoc
            }
        ]

        try {
            TestPing("www.google.com")
            axios.put(`${API_URL}PJjewels/Api/Admin/FileAttach/Remove`, payloadData)
                .then((res) => {
                    if (res?.data?.statusCode === 200) {
                        setFileUri(fileUri = "")
                        setProfileImgUrl(profileImgUrl = "")
                        getProfileImageDocEntry()
                        dispatch({
                            type: actions.SET_DOCENTRY_PICTURE,
                            payload: {
                                docEntry: res?.data?.docEntry,
                                objType: UserData?.objType
                            }
                        })
                        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                        setTimeout(() => {
                            Snackbar.show({
                                text: res.data.message,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: 'green'
                            })
                        }, 300)
                    } else if (res?.data?.statusCode === 400) {
                        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                        dispatch({
                            type: actions.SET_DOCENTRY_PICTURE,
                            payload: {
                                docEntry: res?.data?.docEntry,
                                objType: UserData?.objType
                            }
                        })

                        setTimeout(() => {
                            Snackbar.show({
                                text: res.data.message,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: 'brown'
                            })
                        }, 300)

                    }
                })

        } catch (e) {
            dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })

            setTimeout(() => {
                Snackbar.show({
                    text: 'Failed to Remove Profile',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'brown'
                })
            }, 300)
        }

    }

    const handleUserAccountDelete = () => {
        dispatch({
            type: 'DELETE_USER_ACCOUNT',
            payload: {
                docEntry: UserData?.docEntry,
                navigation: navigation
            }
        })
    }

    const updateProfile = async (url, type, name) => {
        setModal(!modal)
        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
        try {
            let datalist = new FormData()
            datalist.append('Picture', {
                uri: url,
                type: type,
                name: name,
            })

            datalist.append('CreatedBy', UserData?.userCode)

            datalist.append('ObjType', UserData?.objType)

            datalist.append('AbsEntry', UserData?.docEntry)

            TestPing("www.google.com")

            await axios.post(`${API_URL}PJjewels/Api/Admin/FileAttach/Save`, datalist, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            ).then((res) => {
                if (res?.data?.statusCode === 200) {
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                    dispatch({
                        type: "DIALOG_VISIBLE",
                        payload: { visible: true, msg: "Profile picture updated.", title: 'Success' }
                    })
                    getProfileImageDocEntry()
                } else {
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                    dispatch({
                        type: "DIALOG_VISIBLE",
                        payload: { visible: true, msg: "Profile picture update failed.", title: 'Success' }
                    })
                }
            }).catch((e) => {
                dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                dispatch({
                    type: "DIALOG_VISIBLE",
                    payload: { visible: true, msg: "Profile picture update failed.", title: 'Success' }
                })
            })

        } catch (e) {
            dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
            SnackBarUtil({ message: 'Failed to Upload Profile', isError: true })
        }
    }

    const IOSPicker = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose file from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, res => {
            if (res.didCancel) {
                dispatch({
                    type: "DIALOG_VISIBLE",
                    payload: { visible: true, msg: "User cancelled image picker", title: 'Success' }
                })
            } else if (res.error) {
                dispatch({
                    type: "DIALOG_VISIBLE",
                    payload: { visible: true, msg: res.error, title: 'Success' }
                })
            } else if (res.customButton) {
                alert(res.customButton);
            } else {
                let source = res;
                updateProfile(res.assets[0].uri, res.assets[0].type, res.assets[0].fileName)
            }
        });
    }

    const AndroidPicker = async () => {

        var options = {
            title: 'Select Image',
        };

        try {


            launchImageLibrary(options, res => {
                if (res.didCancel) {
                    dispatch({
                        type: "DIALOG_VISIBLE",
                        payload: { visible: true, msg: "User cancelled image picker", title: 'Alert' }
                    })
                } else if (res.error) {
                    dispatch({
                        type: "DIALOG_VISIBLE",
                        payload: { visible: true, msg: res.error, title: 'Error' }
                    })
                } else if (res.customButton) {
                    alert(res.customButton);
                } else {
                    let source = res;
                    updateProfile(res.assets[0].uri, res.assets[0].type, res.assets[0].fileName)
                }
            });

            // const res = await DocumentPicker.pick({
            //     type: [DocumentPicker.types.images],
            //     // presentationStyle: 'fullScreen',
            //     allowMultiSelection: false,
            //     mode: 'open'
            // });

            // if (res.length > 0) {
            //     setFileUri(fileUri = res[0].uri)
            //     const destPath = `${RNFS.DocumentDirectoryPath}/${res[0].name}`
            //     await RNFS.copyFile(res[0].uri, destPath)
            //     let url = 'file://' + destPath

            //     updateProfile(url, res[0].type, res[0].name)

            // } else {

            // }
        } catch (e) {
            console.log('err ', e)
        }
    }

    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title='MY ACCOUNT' />

            <View style={{ ...profileStyle.mainContainer, backgroundColor: color.mainColor }}>

                {/* updte modal */}
                <Modal
                    visible={modal}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => setModal(false)}
                >
                    <Pressable
                        onPress={() => setModal(false)}
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center'
                        }}>

                        <View style={{
                            width: '90%',
                            backgroundColor: '#fff',
                            alignSelf: 'center',
                            borderRadius: 5
                        }}>

                            <Text style={{
                                fontFamily: FONTS.FONT_SEMIMODAL,
                                color: '#000',
                                fontSize: height * 0.024 / fScale,
                                padding: 12
                            }}>Profile Picture</Text>

                            <TouchableOpacity onPress={async () => {

                                if (Platform.OS === 'ios') {
                                    IOSPicker()
                                } else {
                                    AndroidPicker()
                                }

                            }}>
                                <Text style={{
                                    fontFamily: FONTS.FONT_REGULAR,
                                    color: '#000',
                                    fontSize: height * 0.022 / fScale,
                                    padding: 12
                                }}>Change profile</Text>
                            </TouchableOpacity>

                            {(profileImgUrl !== "") ? <TouchableOpacity onPress={aysnc = () => {
                                setModal(false)
                                if (profileImgUrl !== "") {
                                    Alert.alert("Delete profile", "Do you want to remove profile?", [
                                        {
                                            text: "NO",
                                            onPress: null
                                        },
                                        {
                                            text: "YES",
                                            onPress: () => RemoveProfile()
                                        },
                                    ])
                                }
                            }}>
                                <Text style={{
                                    fontFamily: FONTS.FONT_REGULAR,
                                    color: '#000',
                                    fontSize: height * 0.022 / fScale,
                                    padding: 12
                                }}>Delete profile</Text>
                            </TouchableOpacity> : <View />}

                            <TouchableOpacity onPress={() => setModal(false)}>
                                <Text style={{
                                    fontFamily: FONTS.FONT_REGULAR,
                                    color: '#000',
                                    fontSize: height * 0.022 / fScale,
                                    padding: 12
                                }}>Close</Text>
                            </TouchableOpacity>

                        </View>

                    </Pressable>
                </Modal>

                {/* delete account modal */}
                <Modal
                    visible={showAccountDelete}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowAccDelete(false)}
                >

                    <Pressable onPress={() => null} style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: 'absolute',
                        justifyContent: 'center'
                    }}>

                        <View style={{
                            width: width - 80,
                            backgroundColor: '#fff',
                            borderRadius: 15,
                            alignSelf: 'center',
                            padding: 15
                        }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CancelIcon name="delete" size={22} color={'red'} />
                                <Text style={{
                                    color: '#000',
                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                    fontSize: height * 0.02,
                                    textAlign: 'center',
                                    marginLeft: 10,
                                }}>Delete Account!</Text>
                            </View>

                            <Text style={{
                                color: '#000',
                                fontFamily: FONTS.FONT_REGULAR,
                                fontSize: height * 0.017,
                                marginTop: 10,
                                textAlign: 'center'
                            }}>Your account will be deleted permanently! Do you want to delete?</Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                                justifyContent: 'flex-end'
                            }}>

                                <TouchableOpacity onPress={() => setShowAccDelete(false)}>
                                    <Text style={{
                                        color: 'grey',
                                        fontFamily: FONTS.FONT_MEDIUM
                                    }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    marginLeft: 20,
                                    backgroundColor: 'red',
                                    paddingHorizontal: 8,
                                    paddingVertical: 6,
                                    borderRadius: 5
                                }} onPress={() => {
                                    //console.log('Usr ',UserData)
                                    setShowAccDelete(false)
                                    handleUserAccountDelete();
                                }}>
                                    <Text style={{
                                        color: '#fff',
                                        fontFamily: FONTS.FONT_MEDIUM
                                    }}>Delete</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </Pressable>

                </Modal>

                <View style={profileStyle.subContainer}>
                    {loginSkip === 'yes' ?
                        <></> :
                        <View style={profileStyle.viewContainer}>
                            <View>
                                <View style={profileStyle.ProfileImage}>

                                    {/* 
                                <View style={{ ...profileStyle.ProfileImage, top: 0, left: 0, backgroundColor: 'red', borderWidth: 1 }}>
                                        <Text style={{
                                            alignSelf: 'center', fontFamily: FONTS.FONT_BOLD, color: color.mainColor, fontSize: 40,
                                            position: 'absolute', top: height * 0.020
                                        }}>
                                            {UserData?.cardName === undefined || UserData?.cardName === null ?
                                                "NO" : UserData?.cardName[0].toString().toUpperCase()}
                                        </Text>
                                    </View> */}

                                    {/* {
                                        getProfileByDoc?.docEntry === undefined ?
                                        <View style={{backgroundColor:'red'}}/>
                                        : */}

                                    {profileImgUrl !== "" ?
                                        <Image
                                            style={{ height: 90, width: 90, borderRadius: 100 }}
                                            source={{ uri: profileImgUrl }} //3029
                                        /> : <View style={{ height: 90, width: 90, borderRadius: 180, justifyContent: 'center' }}>
                                            {UserData?.cardName !== undefined?
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontSize: (height * 0.12 / 2) / fScale,
                                                        alignSelf: 'center',
                                                        fontFamily: FONTS.FONT_BOLD
                                                    }}
                                                >{UserData?.cardName[0].toString().toUpperCase()}</Text> : <></>
                                            }
                                        </View>}

                                    {/* } */}

                                    <View style={{
                                        height: 26, width: 26, backgroundColor: '#efd6bb',
                                        borderRadius: 100, borderWidth: 1, borderColor: 'white', right: 0, position: 'absolute'
                                    }}>

                                        <TouchableHighlight onPress={() => setModal(true)} underlayColor='transparent'>
                                            <Lock name='pencil' size={25} color={'#5e4407'} />
                                        </TouchableHighlight>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'column', left: width * 0.28, marginTop: 20 }}>
                                    <Text style={profileStyle.nameText}>{UserData?.cardName}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={profileStyle.schemeText}> Active Scheme </Text>
                                        <Text style={{ ...profileStyle.schemenumber, marginTop: -1 }}> :  {UserData?.activeSchemeCount}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ ...profileStyle.schemeText, marginTop: -1 }}> Pending Amount</Text>
                                        <Text style={{ ...profileStyle.schemenumber, marginTop: -2 }}>  :  {UserData?.pendingAmount}</Text>
                                    </View>

                                </View>


                            </View>

                        </View>}

                    {loginSkip === 'yes' ?
                        <></> :
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={profileStyle.emailStyle}>{UserData?.cellular}</Text>
                            <Text style={profileStyle.emailStyle}>{UserData?.email}</Text>
                        </View>}


                    <View style={{ justifyContent: 'space-between', top: height * 0.06, height: height * 0.6 }}>
                        <View style={profileStyle.contentstyle}>
                            <Pressable style={profileStyle.buttonstyle} onPress={() => navigation.navigate('AboutUs')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <AboutUs />
                                    <Text style={profileStyle.textstyle}>About us</Text>
                                </View>
                            </Pressable>
                            <View style={profileStyle.divider} />

                            <Pressable
                                onPress={async () => {
                                    if (Platform.OS === 'android') {
                                        await Share.share({
                                            title: 'Refer your friend',
                                            message: "Install the app from Play Store https://play.google.com/store/apps/details?id=com.pjchit",
                                            url: "https://play.google.com/store/apps/details?id=com.pjchit"
                                        })
                                    } else {
                                        await Share.share({
                                            title: 'Refer your friend',
                                            message: "Install the app from App Store 'https://apps.apple.com/app/id/6449457430'",
                                            url: 'https://apps.apple.com/app/id/6449457430'
                                        })
                                    }
                                }}
                                style={profileStyle.buttonstyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <ReferFriend height={24} width={24} />
                                    <Text style={{ ...profileStyle.textstyle, paddingLeft: 10 }}>Refer your Friend</Text>
                                </View>
                            </Pressable>

                            <View style={profileStyle.divider} />

                            <Pressable style={profileStyle.buttonstyle} onPress={() => navigation.navigate('FAQScreen')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FAQ height={22} width={22} />
                                    <Text style={profileStyle.textstyle}>FAQ's</Text>
                                </View>
                            </Pressable>

                            <View style={profileStyle.divider} />

                            {loginSkip === 'yes' ?
                                <></> :
                                <Pressable
                                    onPress={() => navigation.navigate('UpdateAddress')}
                                    style={profileStyle.buttonstyle} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <UpdateAddress height={22} width={22} />
                                        <Text style={profileStyle.textstyle}>Update Address</Text>
                                    </View>
                                </Pressable>}

                            {loginSkip === 'yes' ?
                                <></> :
                                <View style={profileStyle.divider} />}

                            {loginSkip === 'yes' ?
                                <></> :
                                <Pressable
                                    onPress={() => navigation.navigate('ChangePassword')}
                                    style={profileStyle.buttonstyle} >
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <UpdateAddress height={22} width={22} /> */}
                                        <DeleteIcon name="key-outline" size={22} color={'#e69944'} />
                                        <Text style={profileStyle.textstyle}>Change Password</Text>
                                    </View>
                                </Pressable>}

                            {/* Delete user */}
                            {
                                Platform.OS === 'ios' && loginSkip === 'no' ?
                                    <Pressable
                                        onPress={() => {
                                            setShowAccDelete(!showAccountDelete)
                                        }}
                                        style={profileStyle.buttonstyle} >
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <UpdateAddress height={22} width={22} /> */}
                                            <CancelIcon name="delete" size={22} color={'red'} />
                                            <Text style={profileStyle.textstyle}>Delete Account</Text>
                                        </View>
                                    </Pressable> :
                                    <></>
                            }

                        </View>
                        {loginSkip === 'yes' ?
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={async () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Splash' }]
                                    })
                                }}
                            >
                                <Text style={profileStyle.logout}>LOGIN</Text>
                            </TouchableHighlight> :
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={async () => {
                                    Alert.alert('Logout', 'Are you sure you want to logout?', [
                                        { text: 'cancel', onPress: () => null },
                                        {
                                            text: 'logout', onPress: async () => {
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
                                                await AsyncStorage.setItem("log_state", "logout")
                                                await AsyncStorage.setItem("is_login_skipped", "yes")
                                            }
                                        },
                                    ])
                                }
                                }>
                                <Text style={profileStyle.logout}>LOGOUT</Text>
                            </TouchableHighlight>}
                            <View style={{height:0}} />
                    </View>
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const profileStyle = StyleSheet.create({
    mainContainer: {
        height: height,
        width: width,
        //backgroundColor: COLORS.BACKGROUND_O
    },
    subContainer: {
        marginTop: 12,
        height: height * 0.95,
        width: width,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    viewContainer: {
        backgroundColor: '#f5dcb2',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: height * 0.15
    },
    ProfileImage: {
        backgroundColor: 'white',
        borderRadius: 100,
        position: 'absolute',
        top: height * 0.08,
        left: width * 0.011,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 10
    },

    nameText: {
        color: COLORS.DARK_BLUE,
        fontFamily: FONTS.FONT_BOLD,
        fontSize: height * 0.025 / fScale
    },
    schemeText: {
        fontFamily: FONTS.FONT_SEMIMODAL,
        color: 'grey',
        fontSize: height * 0.02 / fScale
    },
    schemenumber: {
        fontFamily: FONTS.FONT_BOLD,
        color: COLORS.DARK_BLUE,
        fontSize: height * 0.02 / fScale
    },
    emailStyle: {
        color: 'grey',
        left: width * 0.28,
        top: height * 0.02,
        fontFamily: FONTS.FONT_REGULAR,
        width: width * 0.65,
        fontSize: height * 0.02 / fScale
    },
    contentstyle: {
        marginHorizontal: 20,
        borderColor: '#f5e8dd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fdfcfb'

    },
    divider: {
        height: 1,
        backgroundColor: '#f5e8dd',
        marginHorizontal: 15
    },
    textstyle: {
        color: 'black',
        paddingLeft: 15,
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: height * 0.02 / fScale
    },
    buttonstyle: {
        marginHorizontal: 15,
        marginTop: 12,
        marginBottom: 13
    },
    logout: {
        color: 'red',
        textDecorationColor: 'red',
        textDecorationLine: 'underline',
        fontFamily: FONTS.FONT_BOLD,
        alignSelf: 'center',
        marginBottom: Platform.OS === 'ios' ? 50 : 20,
        fontSize: height * 0.02 / fScale
    },

    uploadbackground: {
        borderRadius: 100,
        height: 50,
        width: 50,
        alignItems: 'center',
        alignContent: 'center',
        padding: 12,
        marginHorizontal: 30
    }


})