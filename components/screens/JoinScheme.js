import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView,
    TouchableHighlight,
    Alert,
    ToastAndroid,
    RefreshControl,
    Platform, TextInput
} from "react-native";
import AppBar from "./Appbar";
import COLORS from "../common_utils/colors";
import BGsvg from "../../assets/images/graphic.svg"
import FONTS from "../common_utils/fonts";
import Select from "../common_utils/customSelect";
import CheckBox from "../common_utils/CustomCheckBox";
import JoinSchemeFormSVg from "../../assets/icons/join-scheme-form.svg"
import { useSelector, useDispatch } from "react-redux";
import actions from "../redux/join_scheme_redux/actions";
import axois from 'react-native-axios';
import Loaderactions from '../redux/loader_redux/actions'
import FabButton from '../common_utils/FabButton'
import DurSvg from '../../assets/joinscheme/duration.svg'
import ToGrSvg from '../../assets/joinscheme/total grams.svg'
import EnddateSvg from '../../assets/joinscheme/maturity.svg'
import SnackBarUtil from "../common_utils/SnackBarUtil";
import { generateUUID } from "../common_utils/RandomIDGen";
import Picker from "../common_utils/Picker";
import CustomAlert from "../common_utils/CustomAlertDialogModal";
import ArrowIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import TestPing from '../common_utils/pingTest'
import { API_URL } from "../common_utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get("window").fontScale;

export default function JoinScheme({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { setActiveSchemeList } = useSelector((state) => state.JoinSchemeReducer);
    const { schemesType } = useSelector((state) => state.JoinSchemeReducer);
    const { schemesCatog } = useSelector((state) => state.JoinSchemeReducer);
    const { chitItemGroup } = useSelector((state) => state.JoinSchemeReducer);
    const { UserData } = useSelector((state) => state.ProfileReducer);

    const dispatch = useDispatch()
    var [i, setI] = useState(0)

    var [refreshing, setRefreshing] = useState(false);

    var activeSchemeList = setActiveSchemeList;
    var [selectedSchemeData, setSelectedSchemeData] = useState([])
    var [duration, setDuration] = useState("")
    var [totalAmount, setTotalAmount] = useState(0)
    var [schemeDate, setSchemeDate] = useState("")
    var [schemeCategory, setSchemeCategory] = useState("Monthly")
    var [schemeType, setSchemeType] = useState("Weight")
    var [schemTypeLable, setSchemeTypeLable] = useState("Flexi Gold Weight Scheme")
    var [weight, setWeight] = useState(0)
    var [schemeId, setSchemeId] = useState("")
    var [termsCheck, setTermsCheck] = useState(true)
    var [schemeName, setSchemeName] = useState("")
    var [chitGroup, setChitGroup] = useState("GOLD")
    var [schemeValue, setSchemeValue] = useState("MW")

    var [schemeAmountList, setSchemeAmountList] = useState([])
    var [schemeAmt, setSchemeAmt] = useState("")
    var [enteredAmt, setEnteredAmt] = useState("")
    var [multiplesAmt, setMultiplesAmt] = useState(0)
    var [notMultipleAmt, setNotMultiAmt] = useState(false)

    var [orderId, setOrderId] = useState("")
    var [orderToken, setOrderToken] = useState("")
    var [customID, setCustomID] = useState(0)

    //login skip : 
    var [loginSkip, setLoginSkip] = useState('');

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setI(i = i + 1)
        var mobileNum = UserData.cellular
        dispatch({
            type: "SET_PROFILE",
            payload: { cellular: mobileNum }
        })
        dispatch({
            type: actions.GET_ACTIVE_SCHEMES_LIST,
        })

        dispatch({
            type: actions.GET_SCHEME_TYPE,
        })

        dispatch({
            type: actions.GET_MM_YY,
        })


        dispatch({
            type: actions.GET_CHIT_ITEM_GROUP,
        })


        wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    ///get schemes details
    const getSchemesDetailsByDocId = async (id) => {
        setSchemeId(schemeId = id)
        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: true } })
        try {
            TestPing("www.google.com")
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/MobileJoinData/DocEntry/${id}`)
                .then(
                    (res) => {
                        setSelectedSchemeData(selectedSchemeData = res?.data)
                        setDuration(duration = selectedSchemeData?.duration)
                        setTotalAmount(totalAmount = selectedSchemeData?.chitAmount)
                        setEnteredAmt(enteredAmt = selectedSchemeData?.chitAmount)
                        setMultiplesAmt(multiplesAmt = selectedSchemeData?.multiplesOF)
                        setSchemeDate(schemeDate = selectedSchemeData?.dueDate)
                        setWeight(weight = selectedSchemeData?.weight)
                        //setSchemeCategory(schemeCategory = selectedSchemeData?.chitCategory)
                        //setSchemeType(schemeType = selectedSchemeData?.chitType)
                        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
                    }
                );
        } catch (e) {
            dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
        }
        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
    }

    const getSchemesDetailsByWeightAndAmount = async () => {
        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: true } })
        try {
            TestPing("www.google.com")
            axois.post(`${API_URL}PJjewels/Api/Chit/ChitMaster/MobileActiveList`, {
                "ChitType": schemeType,
                "ChitCategory": schemeCategory,
                "ItemGroup": chitGroup, //Scheme group
                "New":"Y"
            })
                .then(
                    (res) => {
                        if (res?.data?.length !== 0) {
                            setSchemeAmountList(schemeAmountList = res?.data)
                            getSchemesDetailsByDocId(res?.data[0].id)
                            setDuration(duration = "")
                            setTotalAmount(totalAmount = 0)
                            setSchemeDate(schemeDate = "")
                            setWeight(weight = 0)
                        } else {
                            setSchemeAmountList(schemeAmountList = [])
                            getSchemesDetailsByDocId("")
                            setDuration(duration = "")
                            setTotalAmount(totalAmount = 0)
                            setSchemeDate(schemeDate = "")
                            setWeight(weight = 0)
                        }


                        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
                    }
                );
        } catch (e) {
            dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
        }
    }

    // useFocusEffect(
    //     useCallback(()=>{
    //         alert('alert')
    //     },[])
    // );

    useEffect(() => {
        //get active schemes
        dispatch({
            type: actions.GET_ACTIVE_SCHEMES_LIST,
        })

        dispatch({
            type: actions.GET_SCHEME_TYPE,
        })

        dispatch({
            type: actions.GET_MM_YY,
        })

        dispatch({
            type: actions.GET_CHIT_ITEM_GROUP,
        })

        getSchemesDetailsByWeightAndAmount()

        AsyncStorage.getItem('is_login_skipped').then(res => {

            if (res !== null) {
                setLoginSkip(res);
            }

            //console.log('Log ', loginSkip)

        })


    }, [])

    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title={"JOIN SCHEMES"} />
            <View style={{
                flexDirection: 'column',
                backgroundColor: color.mainColor,
                height: height * 0.945,
            }}>
                <View style={styles.column}>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        overScrollMode='always'
                        nestedScrollEnabled
                    >
                        <View style={{ marginHorizontal: height * 0.017 / fScale, zIndex: 4, marginTop: height * 0.009, flexDirection: "row" }}>
                            <Text style={{ paddingHorizontal: width * 0.028 }}><JoinSchemeFormSVg /></Text>
                            <Text style={{
                                color: "#67a224", fontSize: height * 0.027 / fScale, fontWeight: "600", marginTop: -1
                                , fontFamily: FONTS.FONT_REGULAR
                            }}>Fill This To Join Scheme</Text>
                        </View>
                        <View style={{ marginTop: height * 0.018 }}>

                            <View style={{
                                margin: 10
                            }}>

                                <Picker
                                    placeHolderText="Select Scheme Category"
                                    onSelect={(e) => {
                                        setSchemeCategory(schemeCategory = e.name)
                                        if (schemeCategory == "Monthly") {
                                            setSchemeType(
                                                schemeType = schemesType.data.filter((e) =>
                                                    e.code.toLowerCase() === "monthly"
                                                )[1].name
                                            )
                                            setSchemeTypeLable(
                                                schemTypeLable = schemesType.data.filter((e) =>
                                                    e.code.toLowerCase() === "monthly"
                                                )[1].code_Name
                                            )
                                            setSchemeValue(schemeValue = schemesType.data.filter((e) =>
                                                e.code.toLowerCase() === "monthly"
                                            )[1].value)
                                        } else {
                                            setSchemeType(
                                                schemeType = schemesType.data.filter((e) =>
                                                    e.code.toLowerCase() === "yearly"
                                                )[0].name
                                            )
                                            setSchemeTypeLable(
                                                schemTypeLable = schemesType.data.filter((e) =>
                                                    e.code.toLowerCase() === "yearly"
                                                )[0].code_Name
                                            )
                                            setSchemeValue(schemeValue = schemesType.data.filter((e) =>
                                                e.code.toLowerCase() === "yearly"
                                            )[0].value)
                                        }
                                        getSchemesDetailsByWeightAndAmount()
                                    }}
                                    data={schemesCatog.data.map((e, i) => {
                                        return (
                                            { value: e, label: e.name }
                                        )
                                    })}
                                    value={schemeCategory}
                                />

                            </View>

                            {
                                schemeCategory !== "" ?
                                    <View style={{
                                        margin: 10
                                    }}>

                                        <Picker
                                            placeHolderText="Select Scheme Type"
                                            onSelect={(e) => {
                                                if (schemeCategory === "") {
                                                    dispatch({
                                                        type: 'DIALOG_VISIBLE',
                                                        payload: {
                                                            visible: true,
                                                            msg: "Please Select Scheme Category",
                                                            title: "Alert"
                                                        }
                                                    })
                                                } else {
                                                    setSchemeType(schemeType = e.name)
                                                    setSchemeTypeLable(schemTypeLable = e.code_Name)
                                                    setSchemeValue(schemeValue = e.value)
                                                    getSchemesDetailsByWeightAndAmount()
                                                }
                                            }}
                                            data={schemesType.data.filter((e) => e.code.toLowerCase() === schemeCategory.toLowerCase()).map((e, i) => {
                                                return (
                                                    { value: e, label: e.code_Name }
                                                )
                                            })}
                                            value={schemTypeLable}
                                        />

                                    </View> :
                                    <View style={{
                                        margin: 10
                                    }}>

                                        <View style={{
                                            backgroundColor: 'white',
                                            height: 50,
                                            borderRadius: 13,
                                            borderColor: '#C2C2C2',
                                            borderWidth: 1,
                                            justifyContent: 'center'
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                padding: 10,
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{
                                                    color: COLORS.DARK_BLUE,
                                                    fontFamily: FONTS.FONT_REGULAR
                                                }}>{"Select"}</Text>
                                                <ArrowIcon name="arrow-down" size={18} color={"black"} />
                                            </View>

                                        </View>
                                        <Text style={{
                                            color: '#a8a3a3',
                                            position: 'absolute',
                                            fontSize: 13,
                                            paddingLeft: 5,
                                            paddingRight: 5,
                                            fontWeight: 'bold',
                                            top: -11,
                                            left: 10,
                                            backgroundColor: '#ffffff',
                                            fontFamily: FONTS.FONT_REGULAR
                                        }}>{"Select Scheme Type"}</Text>

                                    </View>
                            }

                            {/* {
                                    schemeType !== "" ?
                                        <View style={{
                                            margin: 10
                                        }}>

                                            <Picker
                                                placeHolderText="Select Chit Group"
                                                onSelect={(e) => {
                                                    setChitGroup(chitGroup = e)
                                                    getSchemesDetailsByWeightAndAmount()
                                                }}
                                                data={chitItemGroup.data.map((e, i) => {
                                                    return (
                                                        { value: e.name, label: e.name }
                                                    )
                                                })}
                                                value={chitGroup}
                                            />

                                        </View>
                                        : <View style={{
                                            margin: 10
                                        }}>

                                            <View style={{
                                                backgroundColor: 'white',
                                                height: 50,
                                                borderRadius: 13,
                                                borderColor: '#C2C2C2',
                                                borderWidth: 1,
                                                justifyContent: 'center'
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    padding: 10,
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text style={{
                                                        color: COLORS.DARK_BLUE,
                                                        fontFamily: FONTS.FONT_REGULAR
                                                    }}>{"Select"}</Text>
                                                    <ArrowIcon name="arrow-down" size={18} color={"black"} />
                                                </View>

                                            </View>
                                            <Text style={{
                                                color: '#a8a3a3',
                                                position: 'absolute',
                                                fontSize: 13,
                                                paddingLeft: 5,
                                                paddingRight: 5,
                                                fontWeight: 'bold',
                                                top: -11,
                                                left: 10,
                                                backgroundColor: '#ffffff',
                                                fontFamily: FONTS.FONT_REGULAR
                                            }}>{"Select Chit Group"}</Text>

                                        </View>
                                } */}

                            {
                                ((schemeCategory.toLowerCase() === "yearly" & schemTypeLable.toLowerCase() === "smart gold") ||
                                    (schemeCategory.toLowerCase() === "yearly" & schemTypeLable.toLowerCase() === "advance gold")) ?
                                    <></> :
                                    <View style={{
                                        margin: 10
                                    }}>

                                        {
                                            schemeAmountList.length !== 0 ?
                                                <Picker
                                                    placeHolderText="Select Scheme Amount"
                                                    onSelect={(e) => {
                                                        setTotalAmount(totalAmount = e.code_Name)
                                                        getSchemesDetailsByDocId(e.id)
                                                    }}
                                                    data={
                                                        schemeAmountList.sort((a, b) => parseInt(a.code_Name) - parseInt(b.code_Name)).map((e, i) => {
                                                            return (
                                                                { value: e, label: e.code_Name }
                                                            )
                                                        })
                                                    }
                                                    value={totalAmount}
                                                /> :
                                                <Text style={{
                                                    color: 'red',
                                                    fontFamily: FONTS.FONT_REGULAR,
                                                    fontSize: 13,
                                                    marginHorizontal: 10
                                                }}>Scheme Not Available.!</Text>
                                        }

                                    </View>

                            }

                            {
                                schemeCategory.toLowerCase() === "yearly" & schemTypeLable.toLowerCase() === "advance gold" ?
                                    <View style={{ marginVertical: height * 0.012, zIndex: 94, flexDirection: 'column' }}>
                                        <View style={styles.editTextBorder}>
                                            <Text style={styles.placeHolderText}>
                                                Enter Amount
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingHorizontal: 10
                                            }}>
                                                <MatIcon name="mode-edit" size={25} color={COLORS.BACKGROUND_O} style={{ marginTop: Platform.OS === 'ios' ? 15 : 0 }} />
                                                <TextInput
                                                    placeholder="Enter Amount Above 10,000"
                                                    //value={totalAmount.toString()}
                                                    defaultValue={enteredAmt.toString()}
                                                    placeholderTextColor={'gray'}
                                                    keyboardType="number-pad"
                                                    onChangeText={(e) => {

                                                        setEnteredAmt(enteredAmt = (parseInt(e) || ""))

                                                        //setTotalAmount(totalAmount = (parseInt(e)||""))
                                                        // if (parseInt(e) >= 10000) {
                                                        //     let callculation = ((parseInt(e)) - totalAmount) / multiplesAmt;


                                                        //     if (Number.isInteger(callculation)) {
                                                        //         setNotMultiAmt(notMultipleAmt = false)
                                                        //         setTotalAmount(totalAmount = (parseInt(e) || ""))
                                                        //     } else {
                                                        //         setNotMultiAmt(notMultipleAmt = true)
                                                        //         SnackBarUtil({ message: `Please enter amount multiple of ${multiplesAmt}`, isError: true })
                                                        //     }
                                                        // }
                                                        // else{
                                                        //     //setTotalAmount(totalAmount = (parseInt(e)||""))
                                                        //     //SnackBarUtil({message:"Please enter amount above 10,000",isError:true})
                                                        // }
                                                        //setTotalAmount(totalAmount = (parseInt(e)||""))
                                                    }}
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: FONTS.FONT_REGULAR,
                                                        flex: 1,
                                                        marginTop: Platform.OS === 'ios' ? 15 : 2,
                                                        marginLeft: 5,
                                                        fontSize: height * 0.018 / fScale
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        {notMultipleAmt ?
                                            <Text style={{
                                                color: 'red',
                                                fontSize: 13,
                                                fontFamily: FONTS.FONT_REGULAR,
                                                padding: 5,
                                                marginLeft: 10
                                            }}>{`Please enter amount multiple of ${multiplesAmt}`}</Text> : <></>}
                                    </View> :
                                    <></>
                            }

                            {/* <View style={{
                                margin: 10
                            }}>

                                <Picker
                                    placeHolderText="Select Scheme"
                                    onSelect={(e) => {
                                        setSchemeName(schemeName = e.name)
                                        getSchemesDetailsByDocId(e.id)
                                    }}
                                    data={activeSchemeList.map((e, i) => {
                                        return (
                                            { label: e.name, value: e }
                                        )
                                    })}
                                    value={schemeName}
                                />

                            </View> */}

                            {/* <View style={{ marginVertical: height * 0.012, zIndex: 96 }}>
                                <View style={styles.editTextBorder}>
                                    <Text style={styles.placeHolderText}>
                                        Scheme Amount
                                    </Text>
                                    <Text style={{
                                        color: COLORS.DARK_BLUE,
                                        fontFamily: FONTS.FONT_REGULAR,
                                        paddingVertical: 13,
                                        paddingLeft: 14
                                    }}>{totalAmount}</Text>
                                    <Select
                                    title="Monthly"
                                    onTextChange={(e) => console.log(e)}
                                    options={[
                                        { label: "GE 5000 [Rs.5000]", value: "5000" },
                                        { label: "GE 4000 [Rs.4000]", value: "4000" },
                                        { label: "GE 3000 [Rs.3000]", value: "3000" },
                                    ]}
                                />
                                </View>
                            </View> */}

                            {
                                schemeCategory.toLowerCase() === "yearly" &
                                    schemTypeLable.toLowerCase() === "smart gold"
                                    ?
                                    <></> :
                                    <View style={{ marginVertical: height * 0.012, zIndex: 96 }}>
                                        <View style={styles.editTextBorder}>
                                            <Text style={styles.placeHolderText}>
                                                Duration
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                                <DurSvg height={25} width={25} style={{
                                                    marginTop: Platform.OS === 'ios' ? 15 : 12,
                                                    marginLeft: 10
                                                }} />
                                                <Text style={{
                                                    color: COLORS.DARK_BLUE,
                                                    fontFamily: FONTS.FONT_REGULAR,
                                                    paddingVertical: 13,
                                                    paddingLeft: 14,
                                                    flex: 1,
                                                    marginTop: Platform.OS === 'ios' ? 5 : 0,
                                                    fontSize: height * 0.018 / fScale
                                                }}>{duration}</Text>
                                            </View>
                                            {/* <Select
                                    title="Monthly"
                                    onTextChange={(e) => console.log(e)}
                                    options={[
                                        { label: "GE 5000 [Rs.5000]", value: "5000" },
                                        { label: "GE 4000 [Rs.4000]", value: "4000" },
                                        { label: "GE 3000 [Rs.3000]", value: "3000" },
                                    ]}
                                /> */}
                                        </View>
                                    </View>
                            }


                            {
                                schemeCategory.toLowerCase() === "yearly" &
                                    schemTypeLable.toLowerCase() === "smart gold"
                                    ?
                                    <></> :
                                    <View style={{ marginVertical: height * 0.012, zIndex: 95 }}>
                                        <View style={styles.editTextBorder}>
                                            <Text style={styles.placeHolderText}>
                                                Tatal Gram/Total Amount
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                            }}>
                                                <ToGrSvg height={25} width={25} style={{
                                                    marginTop: Platform.OS === 'ios' ? 15 : 12,
                                                    marginLeft: 10
                                                }} />
                                                <Text style={{
                                                    color: COLORS.DARK_BLUE,
                                                    fontFamily: FONTS.FONT_REGULAR,
                                                    paddingVertical: 13,
                                                    paddingLeft: 14,
                                                    flex: 1,
                                                    marginTop: Platform.OS === 'ios' ? 5 : 0,
                                                    fontSize: height * 0.018 / fScale
                                                }}>{weight + " Gms / "}{"₹ " + totalAmount}</Text>
                                            </View>

                                            {/* <Select
                                    title="Monthly"
                                    onTextChange={(e) => console.log(e)}
                                    options={[
                                        { label: "GE 5000 [Rs.5000]", value: "5000" },
                                        { label: "GE 4000 [Rs.4000]", value: "4000" },
                                        { label: "GE 3000 [Rs.3000]", value: "3000" },
                                    ]}
                                /> */}
                                        </View>
                                    </View>
                            }

                            {
                                schemeCategory.toLowerCase() === "yearly" &
                                    schemTypeLable.toLowerCase() === "smart gold"
                                    ?
                                    <></> :
                                    <View style={{ marginVertical: height * 0.012, zIndex: 94 }}>
                                        <View style={styles.editTextBorder}>
                                            <Text style={styles.placeHolderText}>
                                                Scheme Maturity Date
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                            }}>
                                                <EnddateSvg height={25} width={25} style={{
                                                    marginTop: Platform.OS === 'ios' ? 15 : 12,
                                                    marginLeft: 10,

                                                }} />
                                                {
                                                    schemeDate !== "" ?
                                                        <Text style={{
                                                            color: COLORS.DARK_BLUE,
                                                            fontFamily: FONTS.FONT_REGULAR,
                                                            paddingVertical: 13,
                                                            paddingLeft: 14,
                                                            marginTop: Platform.OS === 'ios' ? 5 : 0,
                                                            fontSize: height * 0.018 / fScale
                                                        }}>{schemeDate.split("/")[1]}/{schemeDate.split("/")[0]}/{schemeDate.split("/")[2]}</Text> : <></>}
                                            </View>
                                            {/* <Select
                                    title="Monthly"
                                    onTextChange={(e) => console.log(e)}
                                    options={[
                                        { label: "GE 5000 [Rs.5000]", value: "5000" },
                                        { label: "GE 4000 [Rs.4000]", value: "4000" },
                                        { label: "GE 3000 [Rs.3000]", value: "3000" },
                                    ]}
                                /> */}
                                        </View>
                                    </View>
                            }

                        </View>
                        <View style={{ paddingVertical: height * 0.006, paddingHorizontal: width * 0.078, zIndex: 93, flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                            <View>
                                <CheckBox onChecked={(e) => {
                                    setTermsCheck(termsCheck = e)
                                }} />
                            </View>

                            <Text style={{
                                color: "#182b4d", fontFamily: FONTS.FONT_REGULAR,
                                paddingLeft: 5, fontSize: height * 0.02 / fScale, fontWeight: 'bold'
                            }}>Terms and Conditions*</Text>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                style={{ paddingLeft: 4 }}
                                onPress={() => {
                                    navigation.navigate('Terms', { schemeVal: schemeValue })
                                }}
                            >
                                <Text style={{
                                    color: "#4680e6", fontSize: height * 0.02 / fScale, textDecorationLine: 'underline'
                                    , fontFamily: FONTS.FONT_REGULAR
                                }}>view</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{ zIndex: 9, alignItems: "center", paddingTop: height * 0.016 }}>
                            <Text style={{ color: "#ff8b3f", fontFamily: FONTS.FONT_REGULAR, fontSize: height * 0.022 / fScale }}>Current Month Due - Rs.{totalAmount}/-</Text>
                        </View>
                        <TouchableHighlight
                            style={{
                                alignSelf: 'stretch',
                                backgroundColor: !termsCheck ? "#ddd" : "#67a224",
                                alignItems: "center",
                                marginHorizontal: width * 0.028,
                                paddingVertical: height * 0.016,
                                marginTop: height * 0.012,
                                borderRadius: 28,
                            }}
                            disabled={!termsCheck}
                            underlayColor={"#ddd"}
                            onPress={() => {
                                if (loginSkip === 'yes') {
                                    Alert.alert('Login required', 'To join scheme you need to login!', [
                                        {
                                            text: 'CANCEL',
                                            onPress: () => null
                                        },
                                        {
                                            text: 'LOGIN',
                                            onPress: () => {
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'Splash' }]
                                                })
                                            }
                                        }
                                    ])
                                } else if (schemTypeLable.toLocaleLowerCase() === "smart gold" && schemeCategory.toLocaleLowerCase() === "yearly") {
                                    //visit poongulazhi jewellers pvt ltd to join Smart gold yearly scheme
                                    dispatch({
                                        type: 'DIALOG_VISIBLE',
                                        payload: {
                                            visible: true,
                                            msg: "'Visit Poongulazhi Jewellers Pvt Ltd' To Join Smart Gold Yearly Scheme",
                                            title: "Alert"

                                        }
                                    })
                                } else {
                                    if (duration === "" || enteredAmt === 0) {
                                        dispatch({
                                            type: 'DIALOG_VISIBLE',
                                            payload: {
                                                visible: true,
                                                msg: "Please select scheme amount.",
                                                title: "Alert"
                                            }
                                        })
                                    } else {
                                        if (schemeCategory.toLowerCase() === "yearly" & schemTypeLable.toLowerCase() === "advance gold") {
                                            var e = enteredAmt;
                                            if (parseInt(e.toString()) >= 10000) {
                                                var callculation = (e - totalAmount) / multiplesAmt;

                                                if (Number.isInteger(callculation)) {
                                                    setNotMultiAmt(notMultipleAmt = false)
                                                    setTotalAmount(totalAmount = (parseInt(e) || ""))
                                                    navigation.navigate('HandlePayment', {
                                                        data: {
                                                            amount: totalAmount,
                                                            docEntry: "",
                                                            payTotal: "",
                                                            type: "new",
                                                            data: {
                                                                TransType: "M", //* - Default send "M" 
                                                                CardCode: UserData?.cardCode, //* 
                                                                CardName: UserData?.cardName, //* 
                                                                Cellular: UserData?.cellular, //* 
                                                                DueDate: schemeDate, //*	CF
                                                                GoldRate: selectedSchemeData?.goldRate, //* CF
                                                                SilverRate: selectedSchemeData?.silverRate, //* CF
                                                                ChitCode: selectedSchemeData?.chitCode, //* CF
                                                                ChitName: selectedSchemeData?.chitName, //* CF
                                                                ChitCategory: schemeCategory, //* CF
                                                                ChitType: schemeType, //* CF
                                                                ChitAmount: totalAmount, //* CF
                                                                NoOfInst: selectedSchemeData?.noOfInst, //* CF
                                                                Weight: weight, //* CF
                                                                PayTotal: selectedSchemeData?.payTotal,  // CF //Check ->Collected Amount == CF
                                                                CounterRef: "", //TransRefNo
                                                                IssuerBank: "null",
                                                                RefNo: 'null',
                                                                Remarks: "null",
                                                                ItemGroup: chitGroup
                                                            }
                                                        }
                                                    })

                                                } else {
                                                    setNotMultiAmt(notMultipleAmt = true)
                                                    SnackBarUtil({ message: `Please enter amount multiple of ${multiplesAmt}`, isError: true })
                                                }

                                            } else {
                                                SnackBarUtil({ message: `Please enter amount above 10,000`, isError: true })
                                            }
                                        } else {
                                            navigation.navigate('HandlePayment', {
                                                data: {
                                                    amount: totalAmount,
                                                    docEntry: "",
                                                    payTotal: "",
                                                    type: "new",
                                                    data: {
                                                        TransType: "M", //* - Default send "M" 
                                                        CardCode: UserData?.cardCode, //* 
                                                        CardName: UserData?.cardName, //* 
                                                        Cellular: UserData?.cellular, //* 
                                                        DueDate: schemeDate, //*	CF
                                                        GoldRate: selectedSchemeData?.goldRate, //* CF
                                                        SilverRate: selectedSchemeData?.silverRate, //* CF
                                                        ChitCode: selectedSchemeData?.chitCode, //* CF
                                                        ChitName: selectedSchemeData?.chitName, //* CF
                                                        ChitCategory: schemeCategory, //* CF
                                                        ChitType: schemeType, //* CF
                                                        ChitAmount: totalAmount, //* CF
                                                        NoOfInst: selectedSchemeData?.noOfInst, //* CF
                                                        Weight: weight, //* CF
                                                        PayTotal: selectedSchemeData?.payTotal,  // CF //Check ->Collected Amount == CF
                                                        CounterRef: "", //TransRefNo
                                                        IssuerBank: "null",
                                                        RefNo: 'null',
                                                        Remarks: "null",
                                                        ItemGroup: chitGroup
                                                    }
                                                }
                                            })
                                        }
                                        // AsyncStorage.removeItem('the_last_ord_id')
                                    }
                                }
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: height * 0.025 / fScale,
                                    color: "white",
                                    fontWeight: 'bold',
                                    fontFamily: FONTS.FONT_SEMIMODAL
                                }}
                            >
                                JOIN SCHEME
                            </Text>
                        </TouchableHighlight>
                        <View style={{ alignItems: "center", padding: height * 0.023 }}>
                            <TouchableHighlight
                                underlayColor={"#ddd"}
                                onPress={() => {
                                    setDuration(duration = "")
                                    setTotalAmount(totalAmount = "")
                                    setSchemeDate(schemeDate = "")
                                    setWeight(weight = "")
                                    // setSchemeCategory(schemeCategory = "")
                                    // setSchemeType(schemeType = "")
                                }}
                            >
                                <Text style={{ color: "red", fontSize: height * 0.025 / fScale, textDecorationLine: 'underline', fontFamily: FONTS.FONT_REGULAR }}>CLEAR</Text>
                            </TouchableHighlight>

                            <View style={{ height: 25 }} />

                        </View>
                    </ScrollView>
                    <View style={{ zIndex: -1, position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '180deg' }], alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                    <FabButton marginBottom={Platform.OS === 'ios' ? height * 0.09 : 30} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        backgroundColor: COLORS.BACKGROUND_O,
        height: height,
    },
    column: {
        //flex: 1,
        height: height * 0.9,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // padding: height*0.019,
        paddingVertical: height * 0.021,
        paddingHorizontal: 10,
        marginTop: height * 0.04,
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
        paddingBottom: 15
    },
    schemesTile: {
        flexDirection: 'column',
        borderWidth: 0.5,
        borderColor: COLORS.BACKGROUND_O,
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#fcfaf8'
    },
    editTextBorder: {
        borderWidth: 1,
        height: height * 0.072,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginHorizontal: height * 0.013,
    },
    placeHolderText: {
        color: '#a8a3a3',
        position: 'absolute',
        fontSize: height * 0.018 / fScale,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: FONTS.FONT_REGULAR
    },
})