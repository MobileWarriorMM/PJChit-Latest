import React from "react";
import { useState } from "react";
import { Dimensions, TouchableHighlight, View, Text, ScrollView, Modal, Pressable, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "./Appbar";
import Icon from 'react-native-vector-icons/FontAwesome5'
import FONTS from "../common_utils/fonts";
import { useEffect } from "react";
import moment from "moment";
import axois from 'react-native-axios'
import CalendarPicker from "react-native-calendar-picker";
import MatiIcon from 'react-native-vector-icons/MaterialIcons'
import COLORS from "../common_utils/colors";
import BGsvg from '../../assets/images/bottom-img.svg'
import { API_URL } from "../common_utils/constants";
import { fontScaleOfDevice } from "../common_utils/constants";
import LoaderAction from '../redux/loader_redux/actions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function OrderDetails({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { UserData } = useSelector(state => state.ProfileReducer)

    const dispatch = useDispatch()

    var [widthArr, setWidthArr] = useState([])
    var [mainTableData, setMainTableData] = useState({})

    var [showFromDate, setShowFromDate] = useState(false)
    var [showToDate, setShowToDate] = useState(false)
    var [fromDate, setFromDate] = useState(new Date())
    var [toDate, setToDate] = useState(new Date())

    var [showModal, setShowModal] = useState(false)
    var [listData, setListData] = useState([])
    var [showLoader, setShowLoader] = useState(false)

    function getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }

    // my scheme full details tile
    const MySchemeDetailsText = (title, value) => {
        return (
            <View style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: "space-between",
                alignItems: 'center',
            }}>

                <Text style={{ fontSize: height * 0.014 / fontScaleOfDevice, color: 'gray', fontFamily: FONTS.FONT_REGULAR }}>
                    {title}
                </Text>

                <Text style={{
                    color: COLORS.DARK_BLUE,
                    fontSize: height * 0.017 / fontScaleOfDevice,
                    fontFamily: FONTS.FONT_SEMIMODAL,
                    textAlign: 'right',
                    paddingRight: 5
                }}>
                    {value}
                </Text>
            </View>
        )
    }

    useEffect(() => {
        AsyncStorage.getItem('is_login_skipped').then(res => {
            console.log(res)

            if(res === null || res === 'no') {
               handleTheFilter(); 
            }

        })
        
    }, [])

    const handleTheFilter = async () => {
        // dispatch({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })
        setShowLoader(showLoader = true)

        try {

            var res = await axois.post(`${API_URL}PJjewels/Api/Reports/Registers`,
                {
                    Screen: "ORD",
                    FromDate: moment(fromDate).format("YYYY-MM-DD"),
                    ToDate: moment(toDate).format("YYYY-MM-DD"),
                    CardCode: UserData?.cardCode,
                    // CardCode: "C108763",
                    // "FromDate": "2022-10-01",
                    // "ToDate": "2022-11-08",
                }, { headers: { "Content-Type": "application/json" } });

            setShowLoader(showLoader = false)

            if (res?.status === 200) {
                if (res?.data.length !== 0) {

                    var temp = res?.data

                    setListData(listData = temp)

                    // var data = []
                    // data = res?.data
                    // var tempHeader = []
                    // Object.keys(data[0]).forEach(e => {
                    //     tempHeader.push(e.toUpperCase())
                    // })
                    // var tempContents = []
                    // for (let i = 0; i < data.length; i++) {
                    //     tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    //     // tempContents.push(Object.values(data[i]))
                    // }
                    // var width = []
                    // for (let i = 0; i < tempHeader.length; i++) {
                    //     width.push(Dimensions.get('window').width * 0.26)
                    // }
                    // var tit = []
                    // for (let i = 0; i < tempHeader.length; i++) {
                    //     tit.push("l")
                    // }

                    // setMainTableData(mainTableData = {
                    //     header: tempHeader,
                    //     tableTitle: tit,
                    //     data: tempContents
                    // })
                    // setWidthArr(widthArr = width)

                } else{
                    setListData(listData = [])

                }

            }


        } catch (e) {
            setShowLoader(showLoader = false)
        }

        setShowLoader(showLoader = false)
    }

    return (

        <View>
            <View style={{
                backgroundColor: 'white',
                height: height,
                width: width,
                backgroundColor: color.mainColor,
                flexDirection: 'column',
            }}>
                <Modal
                    visible={showModal}
                    transparent={true}
                    onRequestClose={() => {
                        setShowModal(!showModal)
                    }}
                    animationType='slide'
                >

                    <Pressable
                        onPress={() => setShowModal(false)}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(9,9,9,0.5)',
                        }}
                    >

                        <View style={{
                            //height: height * 0.1,
                            // height: "auto",
                            // width: 'auto',
                            backgroundColor: 'white',
                            //width: width * 0.7,
                            borderRadius: 10,
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                        }}>

                            <CalendarPicker
                                onDateChange={(date, e) => {
                                    if (e === "END_DATE") {
                                        setToDate(toDate = date)
                                        handleTheFilter()
                                        setShowModal(!showModal)
                                    } else {
                                        setFromDate(fromDate = date)
                                    }
                                }}
                                allowBackwardRangeSelect={false}
                                monthTitleStyle={{
                                    fontFamily: FONTS.FONT_BOLD, fontSize: 15
                                }}
                                // height={height*0.8}
                                width={width * 0.85}
                                selectedRangeStyle={{
                                    backgroundColor: '#702AFC',
                                }}
                                selectedRangeStartTextStyle={{
                                    color: '#fff',
                                    fontSize: height * 0.02 / fontScaleOfDevice,
                                }}
                                selectedRangeEndTextStyle={{
                                    color: '#fff',
                                    fontSize: height * 0.02 / fontScaleOfDevice,
                                }}
                                showDayStragglers
                                textStyle={{ fontFamily: FONTS.FONT_BOLD, fontSize: height * 0.02 / fontScaleOfDevice, }}
                                allowRangeSelection
                                nextTitleStyle={{ color: '#702AFC', fontFamily: FONTS.FONT_BOLD }}
                                previousTitleStyle={{ color: '#702AFC', fontFamily: FONTS.FONT_BOLD }}
                            />

                            {/* <TouchableHighlight 
                        onPress={()=>{
                          setShowModal(false)
                          handleTheFilter()
                        }}
                        style={{
                          backgroundColor:'green',
                          height:height*0.05,
                          width:width*0.3,
                          borderRadius:20,
                          justifyContent:'center'
                        }}
                        >
                            <Text style={{
                               color:'white',
                               fontFamily:FONTS.FONT_BOLD,
                               fontSize:height*0.015,
                               alignSelf:'center' 
                            }}>SEARCH</Text>
                        </TouchableHighlight> */}

                        </View>

                    </Pressable>

                </Modal>

                {/* <Modal
                visible={showLoader}
                onRequestClose={() => {
                    setShowLoader(showLoader=false)
                    // dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                }}
                transparent={true}
                animationType="fade"
            >

                <Pressable
                    //onPress={()=>setLoader(false)}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(9,9,9,0.5)',
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
                            }}>Please Wait</Text>

                    </View>

                </Pressable>

            </Modal> */}

                <AppBar navigation={navigation} title="ORDER DETAILS" />
                <View style={{
                    flexDirection: "column",
                    backgroundColor: 'white',
                    flex: 1,
                    marginTop: height * 0.035,
                    borderTopLeftRadius: 30,
                    borderTopEndRadius: 30,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: -2
                    },
                    shadowRadius: 1,
                    shadowOpacity: 1,
                    elevation: 5
                }}>

                    <View style={{
                        flexDirection: 'column',
                        padding: 10
                    }}>

                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={() => {
                                setShowFromDate(true)
                                setShowModal(true)
                                // } else {
                                //     setShowToDate(true)
                                // }
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                borderWidth: 1.5,
                                borderColor: color.mainColor,
                                height: "auto",
                                borderRadius: 10,
                                backgroundColor: 'white',
                                elevation: 3,
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                marginVertical: 10
                            }}>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>

                                    <View style={{
                                        flexDirection: 'column',
                                        padding: 6
                                    }}>

                                        <Text style={{
                                            color: 'gray',
                                            fontSize: height * 0.02 / fontScaleOfDevice,
                                            fontFamily: FONTS.FONT_SEMIMODAL
                                        }}>FROM DATE</Text>

                                        <Text style={{
                                            color: 'black',
                                            fontFamily: FONTS.FONT_SEMIMODAL,
                                            fontSize: height * 0.02 / fontScaleOfDevice,
                                        }}>{moment(fromDate).format("DD MMM YYYY")}</Text>

                                    </View>

                                    <Text style={{
                                        fontSize: height * 0.02 / fontScaleOfDevice,
                                        color: 'black',
                                        fontFamily: FONTS.FONT_MEDIUM,
                                    }}>{getDifferenceInDays(fromDate, toDate) % 1 !== 0 ? "" : getDifferenceInDays(fromDate, toDate) + " days"}</Text>

                                    <View style={{
                                        flexDirection: 'column',
                                        padding: 6
                                    }}>

                                        <Text style={{
                                            color: 'gray',
                                            fontSize: height * 0.02 / fontScaleOfDevice,
                                            fontFamily: FONTS.FONT_SEMIMODAL
                                        }}>TO DATE</Text>

                                        <Text style={{
                                            color: 'black',
                                            fontFamily: FONTS.FONT_SEMIMODAL,
                                            fontSize: height * 0.02 / fontScaleOfDevice,
                                        }}>{moment(toDate).format("DD MMM YYYY")}</Text>

                                    </View>

                                </View>

                                <TouchableHighlight
                                    onPress={() => {
                                        setFromDate(fromDate = new Date())
                                        setToDate(toDate = new Date())
                                    }}
                                    underlayColor="#ddd"
                                >
                                    <MatiIcon name="cancel" size={height * 0.03} color='black' />
                                </TouchableHighlight>

                                <View style={{ width: 5 }} />

                                <TouchableHighlight
                                    onPress={() => handleTheFilter()}
                                    underlayColor="#ddd"
                                >
                                    <Icon name="search" size={height * 0.03} color='black' />
                                </TouchableHighlight>


                            </View>
                        </TouchableHighlight>

                    </View>

                    <View style={{
                        flex: 1,
                        padding: 8
                    }}>


                        <ScrollView showsVerticalScrollIndicator={false}>
                            {listData.length !== 0 ?
                                <View>
                                    {
                                        listData.map((e, i) => {
                                            return (
                                                <TouchableHighlight
                                                    underlayColor={"transparent"}
                                                    //onPress={() => {}}
                                                    key={i}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'column',
                                                            borderWidth: 0.5,
                                                            borderColor: COLORS.BACKGROUND_O,
                                                            margin: 10,
                                                            borderRadius: 20,
                                                            backgroundColor: '#fcfaf8'
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <View>
                                                                <Text style={{
                                                                    color: COLORS.BACKGROUND_O,
                                                                    paddingTop: 10,
                                                                    paddingBottom: 10,
                                                                    fontSize: 10,
                                                                    paddingLeft: 20,
                                                                    fontFamily: FONTS.FONT_REGULAR
                                                                }}>Doc Number
                                                                    <Text style={{
                                                                        color: COLORS.BACKGROUND_O,
                                                                        padding: 10,
                                                                        fontSize: 13,
                                                                        fontFamily: FONTS.FONT_BOLD
                                                                    }}> {e.docNum}</Text>
                                                                </Text>
                                                            </View>


                                                            {/* <TouchableHighlight
                                                            onPress={() => { }}
                                                            style={{
                                                                height: 35,
                                                                width: 35,
                                                                backgroundColor: '#f5e8dc',
                                                                borderRadius: 70 / 2,
                                                                alignItems: 'center',
                                                                alignContent: 'center',
                                                                justifyContent: 'center',
                                                                alignSelf: 'flex-end',
                                                                margin: 8
                                                            }}>
                                                            <FaIcon name="file-pdf-o" size={20}
                                                                color='red' />
                                                        </TouchableHighlight> */}
                                                        </View>
                                                        <View style={{
                                                            height: 0.5,
                                                            backgroundColor: COLORS.BACKGROUND_O
                                                        }} />

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            paddingTop: 7,
                                                            paddingBottom: 7,
                                                            paddingLeft: 10,
                                                            paddingRight: 10
                                                        }}>
                                                            {MySchemeDetailsText("Doc Date", e.docDate.toString().split("T")[0])}
                                                            {MySchemeDetailsText("Status", e.docStatus)}
                                                        </View>

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            paddingTop: 7,
                                                            paddingBottom: 7,
                                                            paddingLeft: 10,
                                                            paddingRight: 10
                                                        }}>
                                                            {MySchemeDetailsText("Doc Total", "₹ " + e.docTotal)}
                                                            {MySchemeDetailsText("Type", e.type)}
                                                        </View>

                                                        {/* <View style={{
                                                        flexDirection: 'row',
                                                        paddingTop: 7,
                                                        paddingBottom: 15,
                                                        paddingLeft: 10,
                                                        paddingRight: 10
                                                    }}>
                                                        {MySchemeDetailsText("Due Date", "nextDueDate")}
                                                        {MySchemeDetailsText("Due Amount", "₹ " + "nextDueAmount")}
                                                    </View> */}

                                                    </View>
                                                </TouchableHighlight>
                                            )

                                        })
                                    }

                                    {/* <Table borderStyle={{ borderBottomWidth: 2, borderColor: 'black' }}>
                                    <Row data={mainTableData.header} style={{ height: height * 0.06, backgroundColor: 'white' }}
                                        textStyle={{
                                            color: 'gray', marginHorizontal: 5, fontFamily: FONTS.FONT_BOLD,
                                            fontSize: height * 0.014, alignSelf: 'center'
                                        }}
                                        widthArr={widthArr}
                                    />
                                </Table>
                                <ScrollView sty={{ marginTop: -2 }}>
                                    <Table borderStyle={{ borderBottomWidth: 1.5, borderColor: 'pink' }}>
                                        {
                                            mainTableData.data.map((e, i) => {
                                                return (
                                                    <Row
                                                        key={i}
                                                        widthArr={widthArr}
                                                        data={e}
                                                        style={{ height: "auto", backgroundColor: '#F9FAFA', marginTop: 2 }}
                                                        textStyle={{
                                                            color: 'black', marginHorizontal: 5, marginVertical: 10
                                                            , fontFamily: FONTS.FONT_BOLD, fontSize: height * 0.015,
                                                            alignSelf: 'center'
                                                        }}
                                                    />
                                                )
                                            })
                                        }
                                    </Table>
                                </ScrollView> */}
                                </View> :
                                <Text style={{
                                    color: 'black',
                                    fontFamily: FONTS.FONT_BOLD,
                                    fontSize: height * 0.022,
                                    marginTop: 20,
                                    alignSelf: 'center'
                                }}>No Data Found!</Text>

                            }
                        </ScrollView>

                    </View>
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                </View>

            </View>

            {/* loader */}
            {showLoader ?
                <Pressable
                    //onPress={()=>setLoader(false)}
                    style={{
                        flex: 1,
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

                </Pressable> :
                <></>}

        </View>

    )
}