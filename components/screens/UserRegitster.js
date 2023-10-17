import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, Dimensions, Image, TextInput,
    TouchableHighlight, Keyboard, PermissionsAndroid, Modal, Pressable, ScrollView, ActivityIndicator
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import KeyboardWraper from "../common_utils/KeyboardWraper";
import COLORS from "../common_utils/colors"
import FONTS from '../common_utils/fonts'
import DatePicker from "react-native-date-picker"
import Moment from 'moment'
import SnackBarUtil from "../common_utils/SnackBarUtil";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/auth/actions";
import FAIcon from 'react-native-vector-icons/FontAwesome'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import moment from "moment";
import axois from "react-native-axios";
import TestPing from "../common_utils/pingTest";
import { API_URL, fontScaleOfDevice } from "../common_utils/constants";
import FooterText from "../common_utils/FooterText";
import AntIcon from 'react-native-vector-icons/AntDesign'
import AutoCompleteTextField from "../common_utils/AutoCompleteTextField";
import { checkValidMail } from '../common_utils/ValidMailChecker'
import AutoCompleteDropDown from "../common_utils/AutoCompleteDropDown";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const fScale = Dimensions.get("window").fontScale;

export default function RegisterScreen({ navigation }) {


    const { color } = useSelector((state) => state.ColorThemeReducer);

    const dispatch = useDispatch()

    var [addressName, setAddressName] = useState("")
    var [blockNo, setBlockNum] = useState("")
    var [street, setStreet] = useState("")
    var [district, setDistrict] = useState("")
    var [zipCode, setZipCode] = useState("")
    var [state, setState] = useState("")
    var [country, setCountry] = useState("")
    var [stateId, setStateId] = useState()
    var [countryId, setCountryId] = useState()
    var [disId, setDisId] = useState()
    var [area, setArea] = useState('')

    var [districtsList, setDistrictList] = useState([])
    var [stateList, setStateList] = useState([])
    var [countryList, setCountryList] = useState([])
    var [areaSuggList, setAreaSuggList] = useState([])

    var [showState, setShowState] = useState(false)
    var [showCountry, setShowCountry] = useState(false)

    // GLOBAL....
    //boolean
    var [loader, setLoader] = useState(false)
    var [showDatePick, setShowDatePick] = useState(false)

    //strings
    var [userName, setUserName] = useState("")
    var [userMobile, setUserMobile] = useState("")
    var [userMailId, setUserMailId] = useState("")
    var [userDob, setUserDob] = useState("")

    const [date, setDate] = useState(new Date())
    var [showLoader, setShowLoader] = useState(false)

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

    const getCountryByUserCode = async () => {
        setShowLoader(showLoader = true)
        // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })

        try {
            //https://pjapilive.avaniko.com/PJjewels/Api/Masters/ArCountry/List/UserCode/${UserData.userCode}
            axois.get(`${API_URL}PJjewels/Api/Masters/ArCountry/List/UserCode/MobileAppIntegration`).
                then((res) => {
                    // console.log('CountryByUser',res?.data)
                    setCountryList(countryList = res?.data)
                    var tempCountry = countryList.filter((e) => e.default.toString().toLowerCase() === "y")
                    setCountry(country = tempCountry[0].name.toString())
                    setCountryId(countryId = tempCountry[0].id.toString())
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)
                }).catch((e) => {
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)
                })
            getStatesByUserCode(country)
        } catch (e) {
            // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
            setShowLoader(showLoader = false)
        }

    }

    const getStatesByUserCode = (e) => {

        // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })
        setShowLoader(showLoader = true)

        try {

            axois.get(`${API_URL}PJjewels/Api/Masters/ArState/List/UserCode/MobileAppIntegration`).
                then((res) => {
                    // console.log('stateByUser',res?.data)

                    setStateList(stateList = res?.data)
                    const tempStates = stateList.filter((e) => e.default.toString().toLowerCase() === "y")
                    setState(state = tempStates[0].name.toString())
                    setStateId(stateId = tempStates[0].id.toString())
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)

                    getDistrictsBaseStateID(stateId, e, state)
                }).catch((e) => {
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)

                })

        } catch (e) {
            setShowLoader(showLoader = false)

            // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
        }

    }

    const getDistrictsBaseStateID = (e, coun, stat) => {

        var stateID = e;

        // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })
        setShowLoader(showLoader = true)


        try {
            axois.get(`${API_URL}PJjewels/Api/Masters/ArDistrict/StateId/${stateID}/UserCode/MobileAppIntegration`).
                then((res) => {
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)

                    setDistrictList(districtsList = res?.data)
                    var filList = districtsList.filter((res => res.default.toLowerCase() === "y"))
                    setDistrict(district = filList[0]['name'].toString())
                    setDisId(disId = filList[0]['id'].toString())
                }).catch((e) => {
                    // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setShowLoader(showLoader = false)

                })
        } catch (e) {
            // dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
            setShowLoader(showLoader = false)

        }

    }

    const getAreaSuggions = (val) => {

        setAreaSuggList([])

        axois.post(`${API_URL}PJjewels/Api/Masters/ArDistrict/AreaZipCodeList`,
            {
                "StateId": stateId, //Must
                "District": district, //"ALL"(for null) / Selected-DisctrictName
                "InputData": val //Area > 2 || ZipCode > 4
            }, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            setAreaSuggList(res?.data ?? [])
        }).catch(err => {
            console.log(err)
        })

    }

    useEffect(() => {
        getCountryByUserCode()
    }, [])


    console.log('showLoader',showLoader);
    return (
        <KeyboardWraper>

            {/* state list modal */}
            <Modal
                visible={showState}
                transparent={true}
                animationType={"slide"}
                onRequestClose={() => setShowState(false)}
            >

                <Pressable
                    //onPress={() => setShowState(!showState)}
                    style={{
                        // flex: 1,
                        // width: width,
                        position: 'absolute',
                        top: 0, right: 0, left: 0, bottom: 0,
                        backgroundColor: 'rgba(11, 11, 11, 0.2)',
                        justifyContent: 'flex-end'
                    }}
                >

                    <View
                        style={{
                            height: '40%',
                            width: width,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            flexDirection: 'column'
                        }}
                    >

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15,
                        }}>

                            <Text style={{
                                color: 'black',
                                fontFamily: FONTS.FONT_SEMIMODAL,
                                fontSize: 18
                            }}>Select State</Text>

                            <TouchableHighlight
                                onPress={() => setShowState(false)}
                                underlayColor="transparent"
                            >
                                <FAIcon name="close" size={30} color="red" />
                            </TouchableHighlight>
                        </View>

                        <ScrollView>
                            {
                                stateList.map((e, i) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => {
                                                setShowState(false)
                                                setState(state = e.name)
                                                setStateId(stateId = e.id)
                                                getDistrictsBaseStateID(e.id)
                                            }}
                                            underlayColor="#ddd"
                                            key={i}
                                            style={{
                                                padding: 15
                                            }}
                                        >
                                            <Text style={{
                                                color: 'black',
                                                fontFamily: e.name.toString().toLowerCase() === state.toLowerCase() ? FONTS.FONT_BOLD : FONTS.FONT_REGULAR,
                                            }}>{e.name}</Text>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </ScrollView>

                    </View>

                </Pressable>

            </Modal>

            {/* loader */}
            {/* <Modal 
                    visible={showLoader}
                    transparent={true}
                    animationType={"slide"}
                    onRequestClose={() => setShowLoader(false)}
            >
            <Pressable
                        //onPress={()=>setLoader(false)}
                        style={{
                            // flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(9,9,9,0.5)',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }}>

                        <View style={{
                            height: height * 0.1,
                            backgroundColor: 'white',
                            width: width * 0.7,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>

                            <ActivityIndicator
                                size={45}
                                color="rgba(167, 43, 99, 1)"
                            />

                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: height * 0.022 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                    marginLeft: 10
                                }}>Please Wait...</Text>

                        </View>

                    </Pressable> 
            </Modal> */}

            {/* country list modal */}
            <Modal
                visible={showCountry}
                transparent={true}
                animationType={"slide"}
                onRequestClose={() => setShowCountry(false)}
            >

                <Pressable
                    style={{
                        position: 'absolute',
                        top: 0, right: 0, left: 0, bottom: 0,
                        backgroundColor: 'rgba(11, 11, 11, 0.2)',
                        justifyContent: 'flex-end'
                    }}
                >

                    <View
                        style={{
                            height: '40%',
                            width: width,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            flexDirection: 'column'
                        }}
                    >

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15
                        }}>

                            <Text style={{
                                color: 'black',
                                fontFamily: FONTS.FONT_SEMIMODAL,
                                fontSize: 18
                            }}>Select Country</Text>

                            <TouchableHighlight
                                onPress={() => setShowCountry(false)}
                                underlayColor="transparent"
                            >
                                <FAIcon name="close" size={30} color="red" />
                            </TouchableHighlight>
                        </View>



                        <ScrollView>
                            {
                                countryList.map((e, i) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => {
                                                setShowCountry(false)
                                                setCountry(country = e.name)
                                                setCountryId(countryId = e.id)
                                            }}
                                            underlayColor="#ddd"
                                            key={i}
                                            style={{
                                                padding: 15
                                            }}
                                        >
                                            <Text style={{
                                                color: 'black',
                                                fontFamily: e.name.toString().toLowerCase() === country.toLowerCase() ? FONTS.FONT_BOLD : FONTS.FONT_REGULAR,
                                            }}>{e.name}</Text>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </ScrollView>

                    </View>

                </Pressable>

            </Modal>



           
                <View style={{ ...styles.mainContainer, backgroundColor: color.mainColor }}>

                    {/* Main view */}
                    <View style={styles.column}>

                        <View>
                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.03 / fontScaleOfDevice,
                                marginTop: 60,
                                alignSelf: 'center',
                                fontFamily: FONTS.FONT_BOLD
                            }}>User Registration</Text>

                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.02 / fontScaleOfDevice,
                                marginTop: 10,
                                alignSelf: 'center',
                                fontFamily: FONTS.FONT_REGULAR
                            }}>Your Basic Information</Text>

                            {/* name */}
                            <View style={{ ...styles.editTextBorder, marginTop: 40 }}>
                                <Text style={styles.placeHolderText}> Name <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fontScaleOfDevice, }}> * </Text></Text>
                                <View style={styles.textRow}>
                                    <FAIcon name="user-circle-o" size={27} color="#bf7a08" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                    <TextInput
                                        numberOfLines={1}
                                        autoCapitalize="words"
                                        value={userName}
                                        keyboardType='default'
                                        onChangeText={(e) => {
                                            setUserName(userName = e.replace(/[^a-z0-9 ]/gi, ''))
                                        }}
                                        placeholder="Enter name"
                                        placeholderTextColor={"gray"}
                                        style={styles.editTextTextStyle}
                                    />
                                </View>
                            </View>

                            {/* mobile number */}
                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Mobile No <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fontScaleOfDevice, }}> * </Text></Text>
                                <View style={styles.textRow}>
                                    <FAIcon name="phone" size={27} color="#bf7a08" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                    <TextInput
                                        keyboardType="phone-pad"
                                        numberOfLines={1}
                                        value={userMobile}
                                        maxLength={10}
                                        onChangeText={(e) => {
                                            setUserMobile(e)
                                        }}
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter mobile number"
                                        style={styles.editTextTextStyle}
                                    />
                                </View>
                            </View>

                            {/* email */}
                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Email ID <Text
                                    style={{ color: 'red', fontSize: 12 }}></Text></Text>
                                <View style={styles.textRow}>
                                    <EntypoIcon name="email" size={27} color="#bf7a08" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                    <TextInput
                                        keyboardType="email-address"
                                        numberOfLines={1}
                                        value={userMailId}
                                        onChangeText={(e) => {
                                            setUserMailId(e)
                                        }}
                                        autoCapitalize="none"
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter email id"
                                        style={styles.editTextTextStyle}
                                    />
                                </View>
                            </View>
                            {userMailId !== '' && !checkValidMail(userMailId) ?
                                <Text style={{
                                    color: 'red',
                                    fontSize: height * 0.018,
                                    fontFamily: FONTS.FONT_REGULAR,
                                    marginLeft: 25,
                                    marginTop: 5
                                }}>Enter valid email id!</Text> :
                                <></>
                            }

                            {/* dob */}
                            <View style={{ ...styles.editTextBorder, marginTop: 20, justifyContent: 'center' }}>
                                <Text style={styles.placeHolderText}> DOB <Text
                                    style={{ color: 'red', fontSize: 12 }}></Text></Text>
                                <View
                                    onStartShouldSetResponder={() => setShowDatePick(!showDatePick)}
                                    style={styles.textRow}>
                                    <MaterialIcon name="calendar-month" size={27} color="#bf7a08" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                    <Text style={{
                                        color: userDob === "" ? "gray" : 'black',
                                        flex: 1,
                                        fontFamily: FONTS.FONT_REGULAR,
                                        fontSize: height * 0.02 / fontScaleOfDevice,
                                    }}>
                                        {userDob === "" ? "Select Date Of Birth" : moment(userDob).format('DD-MM-YYYY')}
                                    </Text>
                                    <MaterialIcon name="calendar-month" size={27} color="#ddd" style={{
                                        marginLeft: 10, marginRight: 10
                                    }} />
                                </View>
                            </View>

                        </View>

                        <View>
                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Address Name <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                <View style={styles.textRow}>

                                    <TextInput
                                        keyboardType="default"
                                        numberOfLines={1}
                                        value={addressName == "null" ? "" : addressName}
                                        onChangeText={(e) => {
                                            setAddressName(addressName = e.replace(/[^a-z0-9 ]/gi, ''))

                                        }}
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter Address Name"
                                        style={styles.inputText}
                                    />
                                    {
                                        addressName !== "" ?
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                onPress={() => {
                                                    //Keyboard.dismiss()
                                                    setAddressName(addressName = "")
                                                }}
                                            >
                                                <AntIcon name="closecircle" size={15} color="gray" style={{
                                                    marginLeft: 10, marginRight: 10,
                                                }} />
                                            </TouchableHighlight> : <></>
                                    }
                                </View>
                            </View>

                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Block No. <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                <View style={styles.textRow}>
                                    <TextInput
                                        keyboardType='default'
                                        numberOfLines={1}
                                        value={blockNo == "null" ? "" : blockNo}
                                        onChangeText={(e) => {
                                            setBlockNum(blockNo = e)
                                        }}
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter block no"
                                        style={styles.inputText} />
                                    {
                                        blockNo !== "" ?
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                onPress={() => {
                                                    setBlockNum(blockNo = "")
                                                }}
                                            >
                                                <AntIcon name="closecircle" size={15} color="gray" style={{
                                                    marginLeft: 10, marginRight: 10,
                                                }} />
                                            </TouchableHighlight> : <></>
                                    }
                                </View>
                            </View>

                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Street <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                <View style={styles.textRow}>

                                    <TextInput
                                        keyboardType="default"
                                        numberOfLines={1}
                                        value={street === "null" ? "" : street}
                                        onChangeText={(e) => {
                                            setStreet(street = e)
                                        }}
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter street"
                                        style={styles.inputText}
                                    />
                                    {
                                        street !== "" ?
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                onPress={() => {
                                                    setStreet(street = "")
                                                }}
                                            >
                                                <AntIcon name="closecircle" size={15} color="gray" style={{
                                                    marginLeft: 10, marginRight: 10,
                                                }} />
                                            </TouchableHighlight> : <></>
                                    }
                                </View>
                            </View>

                            <View style={{ height: 10 }} />
                            <AutoCompleteDropDown
                                value={area}
                                placeHolderText={'Enter area name'}
                                onChange={(val) => {
                                    if (val.length > 2) {
                                        if (district === undefined || district === "") {
                                            SnackBarUtil({ message: 'Select district to get more area.', isError: true })
                                        } else {
                                            getAreaSuggions(val)
                                        }
                                    }
                                    setArea(area = val)
                                }}
                                lable={'Area'}
                                displayField={'area'}
                                onValueSelected={(val) => {
                                    setAreaSuggList([])
                                    setArea(val?.area)
                                    setZipCode(val?.zipcode + '')
                                    setDistrict(val?.district)
                                    //console.log(val)
                                }}
                                clearBtnPressed={() => {
                                    setArea(area = "");
                                    setAreaSuggList([]);
                                }}
                                data={areaSuggList}
                            />
                            <View style={{ height: 20 }} />
                            <AutoCompleteDropDown
                                value={district}
                                placeHolderText={'Enter district'}
                                onChange={(val) => {
                                    setDistrict(val)
                                    setDisId(disId = val.id + '')
                                }}
                                lable={'District'}
                                displayField={'display'}
                                onValueSelected={(val) => {
                                    setDistrict(val?.display)
                                    setDisId(val?.value?.id + '')
                                }}
                                clearBtnPressed={() => {
                                    setDistrict('')
                                }}
                                data={
                                    districtsList.map((e, i) => {
                                        return (
                                            { display: e.name, value: e }
                                        )
                                    })
                                }
                            />
                            <View style={{ height: 10 }} />

                            <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                <Text style={styles.placeHolderText}> Zip Code <Text
                                    style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                <View style={styles.textRow}>
                                    <TextInput
                                        keyboardType='numeric'
                                        numberOfLines={1}
                                        maxLength={6}
                                        value={zipCode}
                                        onChangeText={(e) => {
                                            const re = /^[0-9\b]+$/;
                                            if (e === '' || re.test(e)) {
                                                setZipCode(zipCode = e)
                                            }
                                        }}
                                        placeholderTextColor={"gray"}
                                        placeholder="Enter zip code"
                                        style={styles.inputText}
                                    />
                                    {
                                        zipCode !== "" ?
                                            <TouchableHighlight
                                                underlayColor={'#ddd'}
                                                onPress={() => {
                                                    setZipCode(zipCode = "")
                                                }}
                                            >
                                                <AntIcon name="closecircle" size={15} color="gray" style={{
                                                    marginLeft: 10, marginRight: 10,
                                                }} />
                                            </TouchableHighlight> : <></>
                                    }
                                </View>
                            </View>

                            <View style={{ height: 10 }} />

                            <TouchableHighlight
                                onPress={() => setShowState(!showState)}
                                underlayColor="transparent"
                            >
                                <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                    <Text style={styles.placeHolderText}> State <Text
                                        style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                    <View style={styles.textRow}>

                                        <TextInput
                                            keyboardType="default"
                                            editable={false}
                                            numberOfLines={1}
                                            value={state}
                                            onChangeText={(e) => {
                                                setState(state = e)
                                            }}
                                            placeholderTextColor={"gray"}
                                            placeholder="Select state"
                                            style={styles.inputText}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>


                            <View style={{ height: 10 }} />

                            <TouchableHighlight
                                onPress={() => setShowCountry(!showCountry)}
                                underlayColor="transparent"
                            >
                                <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                                    <Text style={styles.placeHolderText}> Country <Text
                                        style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                                    <View style={styles.textRow}>
                                        <TextInput
                                            keyboardType="default"
                                            numberOfLines={1}
                                            editable={false}
                                            value={country}
                                            onChangeText={(e) => {
                                                setCountry(country = e)
                                            }}
                                            placeholderTextColor={"gray"}
                                            placeholder="Enter country"
                                            style={styles.inputText}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>

                        </View>





                        {/* next btn */}
                        <TouchableHighlight
                            underlayColor={"#ddd"}
                            onPress={() => {
                                //requestPermission();
                                // Validate the inputs
                                Keyboard.dismiss()
                                if (userName === "") {
                                    SnackBarUtil({ message: "Please Enter User Name!", isError: true })
                                } else if (userMobile === "" || userMobile.length < 10) {
                                    SnackBarUtil({ message: "Please Enter Correct Mobile Number!", isError: true })
                                } else if (addressName === null && blockNo === null && street === null
                                    && district === null && zipCode === null && state === null && country === null
                                ) {
                                    dispatch({
                                        type: 'DIALOG_VISIBLE',
                                        payload: {
                                            visible: true,
                                            msg: "All Fields Are Empty! Please Fill The Form Then Proceed.",
                                            title: "Alert"
                                        }
                                    })
                                } else if (userMailId !== '' && !checkValidMail(userMailId)) {
                                    SnackBarUtil({ message: "Please Enter a valid email id!", isError: true })
                                }
                                else if (addressName === "") {
                                    SnackBarUtil({ message: "Please Enter Address Name!", isError: true })
                                } else if (blockNo === "") {
                                    SnackBarUtil({ message: "Please Enter Block Number!", isError: true })
                                } else if (street === "") {
                                    SnackBarUtil({ message: "Please Enter Street Name!", isError: true })
                                } else if (area === "" || area === undefined) {
                                    SnackBarUtil({ message: "Please Enter The Area Name!", isError: true })
                                } else if (district === "" || district === undefined) {
                                    SnackBarUtil({ message: "Please Enter The District!", isError: true })
                                }
                                else if (zipCode === "" || zipCode.length < 6) {
                                    SnackBarUtil({ message: "Please Enter Correct ZipCode!", isError: true })
                                } else if (state === "") {
                                    SnackBarUtil({ message: "Please Enter The State Name!", isError: true })
                                } else if (country === "") {
                                    SnackBarUtil({ message: "Please Enter The Country Name!", isError: true })
                                } else {
                                    var addressList = [
                                        {
                                            "AddressType": "B",
                                            "AddressName": addressName,
                                            "BlockNo": blockNo,
                                            "Street": street,
                                            "Building": area,
                                            "Zipcode": parseInt(zipCode),
                                            "DistrictId": disId,
                                            "StateId": stateId,
                                            "CountryId": countryId,
                                            "SetAsDefault": "Y"
                                        },
                                        {
                                            "AddressType": "S",
                                            "AddressName": addressName,
                                            "BlockNo": blockNo,
                                            "Street": street,
                                            "Building": area,
                                            "Zipcode": parseInt(zipCode),
                                            "DistrictId": disId,
                                            "StateId": stateId,
                                            "CountryId": countryId,
                                            "SetAsDefault": "Y"
                                        }
                                    ]
                                    dispatch({
                                        type: 'SET_USER_REGISTER',
                                        payload: {
                                            Number: userMobile,
                                            UserName: userName.trim(),
                                            Cellular: userMobile.trim(),
                                            EmailID: userMailId.trim(),
                                            UserDOB: userDob.trim(),
                                            AddressList: addressList
                                        },
                                        navigation: navigation
                                    })

                                }
                            }}
                            style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                            <Text style={{ ...styles.loginBtnText, color: color.secondaryColor }}>NEXT</Text>
                        </TouchableHighlight>

                        <View style={{ height: height * 0.1 / 2 }} />


                    </View>
                    {/* circular */}
                    <View style={{ ...styles.circleAvatar, backgroundColor: color.mainColor }}>
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

                    {/* footer */}
                    {/* <FooterText /> */}

                    <Image source={require('../../assets/images/Layer.png')}
                        style={{ height: height * 0.17, width: width * 0.45 }} />
                    {/* date picker */}
                    {
                        showDatePick ?
                            <DatePicker
                                open={showDatePick}
                                confirmText="SELECT"
                                title="Select DOB"
                                modal
                                date={date}
                                mode="date"
                                onConfirm={(date) => {
                                    const curr = new Date();
                                    if (date.getFullYear() > curr.getFullYear()) {
                                        SnackBarUtil({
                                            message: "Invalid Date Of Birth!",
                                            isError: true
                                        })
                                    } else {
                                        // var formated = Moment(date).format("YYYY-MM-DD").toString()
                                        var formated = Moment(date).format("YYYY-MM-DD")
                                        setUserDob(formated)
                                        setShowDatePick(false)
                                    }
                                }}
                                onCancel={() => {
                                    setShowDatePick(false)
                                }}
                            /> : null
                    }

                </View>

                {/* loader */}
                {showLoader ?
                    <Pressable
                        //onPress={()=>setLoader(false)}
                        style={{
                            // flex: 1,
                            // justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(9,9,9,0.5)',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }}>

                        <View style={{
                            height: height * 0.1,
                            backgroundColor: 'white',
                            width: width * 0.7,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginTop:height*0.5
                        }}>

                            <ActivityIndicator
                                size={45}
                                color="rgba(167, 43, 99, 1)"
                            />

                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: height * 0.022 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                    marginLeft: 10
                                }}>Please Wait...</Text>

                        </View>

                    </Pressable> :
                    <></>}
       


        </KeyboardWraper>
    );

}

const styles = StyleSheet.create({
    mainContainer: {
        // height: height,
        width: width,
        flexDirection: 'column-reverse'
    },
    circleAvatar: {
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: height * 0.11,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center',
        elevation: 6
    },
    column: {
        // height: height * 0.85,
        // flex:1,
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
        elevation: 3,
    },
    editTextBorder: {
        borderWidth: 1,
        height: 52,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center'
    },
    inputeEditor: {
        paddingLeft: 10,
        fontFamily: FONTS.FONT_REGULAR,
        color: "#000000",
    },
    inputText: {
        flex: 1,
        fontFamily: FONTS.FONT_REGULAR,
        color: 'black',
        marginLeft: 10,
        fontSize: height * 0.02 / fontScaleOfDevice
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
        fontFamily: FONTS.FONT_REGULAR,
        color: "#000000",
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
        fontFamily: FONTS.FONT_REGULAR
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 13 : 0
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
        //backgroundColor: '#bf7a08',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6
    },
    loginBtnText: {
        //color: 'white',
        fontFamily: FONTS.FONT_SEMIMODAL,
        fontSize: height * 0.022 / fontScaleOfDevice
    }, newRegRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    editTextTextStyle: {
        flex: 1,
        fontFamily: FONTS.FONT_REGULAR,
        color: 'black',
        fontSize: height * 0.02 / fontScaleOfDevice,
    }
})