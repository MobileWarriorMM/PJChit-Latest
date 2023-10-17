import React, { useState, useEffect } from "react";
import {
    SafeAreaView, View, StyleSheet, ScrollView, Text, TextInput,
    Dimensions, TouchableHighlight, Keyboard, Pressable, Modal
} from "react-native";
import AppBar from "../Appbar";
import { useSelector, useDispatch } from "react-redux";
import FONTS from "../../common_utils/fonts";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import KeyboardWraper from "../../common_utils/KeyboardWraper";
import FAIcon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SnackBarUtil from '../../common_utils/SnackBarUtil'
import AutoCompleteTextField from "../../common_utils/AutoCompleteTextField";
import actions from "../../redux/profile_screen_redux/actions";
import axois from "react-native-axios"
import NotCheck from 'react-native-vector-icons/MaterialCommunityIcons' //checkbox-blank-outline
import CheckedIcon from 'react-native-vector-icons/FontAwesome' //check-square-o
import { API_URL } from "../../common_utils/constants";
import { fontScaleOfDevice } from "../../common_utils/constants";
import AutoCompleteDropDown from "../../common_utils/AutoCompleteDropDown";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get("window").fontScale;

export default function UpdateAddress({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { UserData } = useSelector((state) => state.ProfileReducer);
    const dispatch = useDispatch()

    var [addressName, setAddressName] = useState(addressName = UserData.addressName == null ? "" : UserData.addressName)
    var [blockNo, setBlockNum] = useState(blockNo = UserData.blockNo == null ? "" : UserData.blockNo)
    var [street, setStreet] = useState(street = UserData.street == null ? "" : UserData.street + "")
    var [area, setArea] = useState(area = UserData?.area == null ? "" : UserData?.area + "")
    var [district, setDistrict] = useState(district = UserData?.district == null ? "" : UserData?.district)
    var [zipCode, setZipCode] = useState(zipCode = UserData?.zipcode == null ? "" : UserData?.zipcode + "")
    var [state, setState] = useState("")
    var [country, setCountry] = useState("")
    var [stateId, setStateId] = useState()
    var [countryId, setCountryId] = useState()
    var [addressDocEntry, setAddressDocEntry] = useState(addressDocEntry = UserData.addressDocEntry)
    var [disId, setDisId] = useState()
    var [shipping, setShipping] = useState(true)

    var [districtsList, setDistrictList] = useState([])
    var [stateList, setStateList] = useState([])
    var [countryList, setCountryList] = useState([])
    var [areaSuggList, setAreaSuggList] = useState([])

    var [showState, setShowState] = useState(false)
    var [showCountry, setShowCountry] = useState(false)

    const getCountryByUserCode = async () => {

        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })

        try {
            ///PJjewels/Api/Masters/ArDistrict/ZipCode/District/{district}/InputData/{inputData}'
            //https://pjapilive.avaniko.com/PJjewels/Api/Masters/ArCountry/List/UserCode/${UserData.userCode}
            axois.get(`${API_URL}PJjewels/Api/Masters/ArCountry/List/UserCode/${UserData.userCode}`).
                then((res) => {
                    setCountryList(countryList = res?.data)
                    var tempCountry = countryList.filter((e) => e.default.toString().toLowerCase() === "y")
                    setCountry(country = tempCountry[0].name.toString())
                    setCountryId(countryId = tempCountry[0].id.toString())
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                }).catch((e) => {
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                })

            getStatesByUserCode(country)

        } catch (e) {
            dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
        }

    }

    const getStatesByUserCode = (e) => {

        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })

        try {

            axois.get(`${API_URL}PJjewels/Api/Masters/ArState/List/UserCode/${UserData.userCode}`).
                then((res) => {
                    setStateList(stateList = res?.data)
                    const tempStates = stateList.filter((e) => e.default.toString().toLowerCase() === "y")
                    setState(state = tempStates[0].name.toString())
                    setStateId(stateId = tempStates[0].id.toString())
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    getDistrictsBaseStateID(stateId, e, state)
                }).catch((e) => {
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                })

        } catch (e) {
            dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
        }

    }

    const getDistrictsBaseStateID = (e, coun, stat) => {

        var stateID = e;

        dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })

        try {
            axois.get(`${API_URL}PJjewels/Api/Masters/ArDistrict/StateId/${stateID}/UserCode/${UserData.userCode}`).
                then((res) => {
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    setDistrictList(districtsList = res?.data)
                    var filList = districtsList.filter((res => res.default.toLowerCase() === "y"))
                    setDistrict(district = filList[0]['name'].toString())
                    setDisId(disId = filList[0]['id'].toString())
                    //setDistrict(district = filList[0].name.toString())
                }).catch((e) => {
                    dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                })
        } catch (e) {
            dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
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

    const handleAddressUpdate = () => {
        var data = {
            //Common
            "AddressName": addressName,
            "BlockNo": blockNo,
            "Street": street,
            //From Area API
            "Area": area,
            "Zipcode": parseInt(zipCode),
            "DistrictId": disId,
            "StateId": stateId,
            "CountryId": countryId,
            "Shipping": shipping,
            //For Save
            "BPDocEntry": UserData.docEntry, //From CustomerData API
            "AddressDocEntry": addressDocEntry !== 0 ? UserData.addressDocEntry : 0 //Default 0 must*
            //For Update
            //"AddressDocEntry":1 //From CustomerData API
        }

        dispatch({
            type: 'UPDATE_ADDRESS',
            payload: { data: data, navigation: navigation, cellular: UserData?.cellular }
        })

    }

    useEffect(() => {
        getCountryByUserCode()
    }, [])

    return (
      <KeyboardWraper>
          <View>
            <View style={{
                //height: height,
                backgroundColor: color.mainColor,
                flexDirection: 'column',
            }}>
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

                            {/* <TextInput
                                style={{
                                  marginHorizontal:15,
                                  fontFamily:FONTS.FONT_REGULAR,
                                  color:'black'
                                }}
                                placeholder="Search..."
                                placeholderTextColor={"gray"}
                                /> */}

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

                {/* country list modal */}
                <Modal
                    visible={showCountry}
                    transparent={true}
                    animationType={"slide"}
                    onRequestClose={() => setShowCountry(false)}
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

                            {/* <TextInput
                                style={{
                                  marginHorizontal:15,
                                  fontFamily:FONTS.FONT_REGULAR,
                                  color:'black'
                                }}
                                placeholder="Search..."
                                placeholderTextColor={"gray"}
                                /> */}

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

                <AppBar navigation={navigation} title='UPDATE ADDRESS' />
                <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 1 }}>
                    <View style={styles.column}>
                        {/* <ScrollView> */}
                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Address Name <Text
                                style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <FAIcon name="user-circle-o" size={27} color="#bf7a08" style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
                                <TextInput
                                    keyboardType="default"
                                    numberOfLines={1}
                                    value={addressName == "null" ? "" : addressName}
                                    onChangeText={(e) => {
                                        // setAddressName(addressName = e)
                                        setAddressName(addressName = e.replace(/[^a-z0-9 ]/gi, ''))

                                    }}
                                    placeholderTextColor={"gray"}
                                    placeholder="Enter Address Name"
                                    style={styles.inputText}
                                />
                                {
                                    addressName !== "" ?
                                        <TouchableHighlight
                                            underlayColor={'#ddd'}
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

                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Block No. <Text
                                style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <MaterialIcon name="alpha-b-circle-outline" size={27} color="#bf7a08" style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
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
                                            underlayColor={'#ddd'}
                                            onPress={() => {
                                                //Keyboard.dismiss()
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

                        {/* block no */}
                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Street <Text
                                style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <FAIcon name="street-view" size={27} color="#bf7a08" style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
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
                                            underlayColor={'#ddd'}
                                            onPress={() => {
                                                //Keyboard.dismiss()
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

                        {/* block no */}

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
                            placeHolderText={'Enter district name'}
                            onChange={(val) => {
                                setDistrict(val)
                            }}
                            lable={'District'}
                            displayField={'display'}
                            onValueSelected={(val) => {
                                console.log(val)
                                setDistrict(val?.display)
                                setDisId(val?.value?.id+'')
                            }}
                            clearBtnPressed={() => {
                                setDistrict('')
                                setDisId('')
                            }}
                            data={
                                districtsList.map((e, i) => {
                                    return (
                                        { display: e.name, value: e }
                                    )
                                })
                            }
                        />

                        {/* <AutoCompleteTextField
                            hintText="Enter District Name"
                            defaultValue={district}
                            placeHolderText="District"
                            value={district}
                            data={
                                districtsList.map((e, i) => {
                                    return (
                                        { display: e.name, value: e }
                                    )
                                })
                            }
                            onSelected={(e) => {
                                setDistrict(district = e.name)
                                setDisId(disId = e.id)
                            }}
                        /> */}

                        <View style={{ ...styles.editTextBorder, marginTop: 20 }}>
                            <Text style={styles.placeHolderText}> Zip Code <Text
                                style={{ color: 'red', fontSize: height * 0.02 / fScale }}> * </Text></Text>
                            <View style={styles.textRow}>
                                {/* <MaterialIcon name="alpha-z-circle-outline" size={27} color="#bf7a08" style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
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
                                                //Keyboard.dismiss()
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
                                    {/* <MaterialIcon name="map-marker-radius" size={27} color="#bf7a08" style={{
                                    marginLeft: 10, marginRight: 10,
                                }} /> */}
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

                        {/* <AutoCompleteTextField
                            hintText="Enter State Name"
                            placeHolderText="State"
                            value={state}
                            data={
                                stateList.map((e, i) => {
                                    return (
                                        { display: e.name, value: e }
                                    )
                                })
                            }
                            onSelected={(e) => {
                                setStateId(stateId = e.id)
                                setState(state = e.name)
                                getDistrictsBaseStateID(e,country,state)
                            }}
                        /> */}

                        {/* <AutoCompleteTextField
                            hintText="Enter Country Name"
                            placeHolderText="Country"
                            value={"" + country}
                            data={
                                countryList.map((e, i) => {
                                    return (
                                        { display: e.name, value: e }
                                    )
                                })
                            }
                            onSelected={(e) => console.log(e)}
                        /> */}

                        {/* <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 15
                        }}>
                            <TouchableHighlight
                                underlayColor={'#ddd'}
                                onPress={() => {
                                    setShipping(!shipping)
                                }}
                            >
                                {shipping ?
                                    <CheckedIcon name="check-square-o" size={24} color="black" /> :
                                    <NotCheck name="checkbox-blank-outline" size={24} color="black" />
                                }
                            </TouchableHighlight>
                            <Text style={{
                                color: 'black', fontFamily: FONTS.FONT_SEMIMODAL,
                                fontSize: 15,
                                marginLeft: 8
                            }}>Shipping Address</Text>

                        </View> */}

                        <TouchableHighlight
                            underlayColor={"#ddd"}
                            onPress={() => {
                                //Validate the inputs
                                if (addressName === null && blockNo === null && street === null && area === null
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
                                }
                                else if (addressName === "") {
                                    SnackBarUtil({ message: "Please Enter Address Name!", isError: true })
                                } else if (blockNo === "") {
                                    SnackBarUtil({ message: "Please Enter Block Number!", isError: true })
                                } else if (street === "") {
                                    SnackBarUtil({ message: "Please Enter Street Name!", isError: true })
                                } else if (area === "") {
                                    SnackBarUtil({ message: "Please Enter The Area!", isError: true })
                                } else if (district === "") {
                                    SnackBarUtil({ message: "Please Enter The District!", isError: true })
                                } else if (zipCode === "" || zipCode.length < 6) {
                                    SnackBarUtil({ message: "Please Enter Correct ZipCode!", isError: true })
                                } else if (state === "") {
                                    SnackBarUtil({ message: "Please Enter The State Name!", isError: true })
                                } else if (country === "") {
                                    SnackBarUtil({ message: "Please Enter The Country Name!", isError: true })
                                } else {
                                    handleAddressUpdate()
                                }

                            }}
                            style={{ ...styles.loginBtn, backgroundColor: color.mainColor }}>
                            <Text style={{ ...styles.loginBtnText, color: color.secondaryColor }}>UPDATE</Text>
                        </TouchableHighlight>

                        <View style={{ height: 120 }} />

                    </View>
                </ScrollView>
            </View>
        </View>
      </KeyboardWraper>
    )
}

const styles = StyleSheet.create({
    column: {
        //flex: 1,
        //height: height*0.89,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // padding: height*0.019,
        // paddingVertical: height * 0.021,
        paddingHorizontal: 10,
        zIndex: 9,
        position: "relative",
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 3,
        // marginBottom: 100
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
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 13 : 0
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
    loginBtn: {
        height: 50,
        //backgroundColor: '#bf7a08',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 30,
        marginBottom: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6
    },
    loginBtnText: {
        //color: 'white',
        fontFamily: FONTS.FONT_MEDIUM,
        fontSize: 15
    },
    inputText: {
        flex: 1,
        fontFamily: FONTS.FONT_REGULAR,
        color: 'black',
        marginLeft: 10,
        fontSize: height * 0.02 / fontScaleOfDevice
    }
})