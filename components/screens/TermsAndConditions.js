import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView,
    TouchableHighlight,
    RefreshControl,
    Modal, Pressable, Platform
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import FONTS from "../common_utils/fonts";
import AppBar from "./Appbar";
import axois from 'react-native-axios'
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component';
import BGsvg from '../../assets/images/bottom-img.svg'
import TestPing from "../common_utils/pingTest";
import { API_URL } from "../common_utils/constants";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function TermsAndCondtion({ navigation, route }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const dispatch = useDispatch()

    var [dataTamil, setDataTamil] = useState([])
    var [dataEnglish, setDataEnglish] = useState([])
    var [bottomData , setBottomData] = useState([])
    var [tableData, setTableData] = useState([])

    var [head, setHead] = useState([])
    var [tamilTableData, setTamilTableData] = useState([])
    var [englishTableData, setEnglishTableData] = useState([])
    var [widthAtr, setWidthAtr] = useState([])


    const getTerms = () => {
        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
        try {
            TestPing("www.google.com")
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/TermsList/ChitType/${route.params.schemeVal}`).then(
                (res) => {
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                    // setData(data = res?.data?.commonContent)
                    var tamilData =res?.data?.commonContent?.filter((e) => e.language.toLowerCase() === "t");
                    var englishData =res?.data?.commonContent?.filter((e) => e.language.toLowerCase() === "e");

                   setDataTamil(dataTamil=tamilData)
                   setDataEnglish(dataEnglish=englishData)

                    if(res?.data?.chitTypeTblContent!==undefined){
                        setBottomData(bottomData = res?.data?.chitTypeTblContent)
                    }
                    if (res?.data?.tableContent2 !== null) {
                        setTableData(tableData = res?.data?.tableContent2)
                        handleTableData(tableData)
                    } else {
                        setTableData(tableData = res?.data?.tableContent3)
                        handleTableData(tableData)
                    }
                }).catch(e => {
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                })

        } catch (e) {
            dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        }

    }

    const handleTableData = (e) => {

        var tabData = e;
        var tamilTab = tabData.filter((e) => e.language.toLowerCase() === "t");
        var englishTab = tabData.filter((e) => e.language.toLowerCase() === "e");

        //4 columns
        if (tabData[0].column4 !== undefined) {

            var conData = [];
            var engData = [];

            tamilTab.forEach((e, i) => {
                conData.push([tamilTab[i].column1, tamilTab[i].column2, tamilTab[i].column3,tamilTab[i].column4])
            })

            // setWidthAtr(widthAtr = [width * 0.25, width * 0.3, width * 0.5,width * 0.5]);
             setWidthAtr(widthAtr = [width * 0.2, width * 0.2, width * 0.3,width * 0.22]);


            englishTab.forEach((e, i) => {
                engData.push([englishTab[i].column1, englishTab[i].column2, englishTab[i].column3,englishTab[i].column4])
            })

            setTamilTableData(tamilTableData = conData)
            setEnglishTableData(englishTableData = engData)


        } 
        else if(tabData[0].column3 !== undefined){
            var conData = [];
            var engData = [];

            tamilTab.forEach((e, i) => {
                conData.push([tamilTab[i].column1, tamilTab[i].column2, tamilTab[i].column3])
            })

            // setWidthAtr(widthAtr = [width * 0.25, width * 0.3, width * 0.5]);
            setWidthAtr(widthAtr = [width * 0.2, width * 0.2, width * 0.4]);


            englishTab.forEach((e, i) => {
                engData.push([englishTab[i].column1, englishTab[i].column2, englishTab[i].column3])
            })

            setTamilTableData(tamilTableData = conData)
            setEnglishTableData(englishTableData = engData)
        }
        else {

            // setWidthAtr(widthAtr = [width * 0.2, width * 0.2]);
            setWidthAtr(widthAtr = [width * 0.3, width * 0.5]);


            var conData = [];
            var engData = [];

            tamilTab.forEach((e, i) => {
                conData.push([tamilTab[i].column1, tamilTab[i].column2])
            })

            englishTab.forEach((e, i) => {
                engData.push([englishTab[i].column1, englishTab[i].column2])
            })

            setTamilTableData(tamilTableData = conData)
            setEnglishTableData(englishTableData = engData)

        }

    }

    useEffect(() => {
        getTerms()
    }, [])

    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title="Terms & Conditions" />
            <View style={{
                height: height,
                width: width,
                backgroundColor: color.mainColor
            }}>

                <View style={{
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
                }}>

                    <ScrollView style={{
                        flex: 1,
                    }}>

                        {/* <Text style={{color:'black',fontFamily:FONTS.FONT_REGULAR,fontSize:height*0.025,paddingHorizontal:10}}>தமிழ்</Text> */}
                        {/* <Text style={{color:'black',fontFamily:FONTS.FONT_REGULAR,fontSize:height*0.025,paddingHorizontal:10,alignSelf:'center'}}>'***'</Text> */}

                        {
                            dataTamil.map((e, i) => {
                                return (
                                    <Text
                                        key={i}
                                        style={{
                                            color: 'black',
                                            fontFamily: FONTS.FONT_REGULAR,
                                            margin: 10
                                        }}>{e?.content}</Text>
                                )
                            })
                        }

                        <ScrollView horizontal style={{ alignSelf: 'center' }}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                                {
                                    tamilTableData.map((item, index) => {
                                        return (
                                            <Row
                                                key={index}
                                                data={item}
                                                //flexArr={[1, 2]}
                                                widthArr={widthAtr}
                                                textStyle={{
                                                    color: "black",
                                                    alignSelf: 'center',
                                                    margin: 10,
                                                    fontFamily: index === 0 ? FONTS.FONT_BOLD : FONTS.FONT_REGULAR,
                                                    fontSize: index === 0 ? 12 : 13
                                                }}
                                            />
                                        )
                                    })
                                }
                            </Table>
                        </ScrollView>

                        {/* <Text style={{
                            color:'black',
                            fontFamily:FONTS.FONT_REGULAR,
                            fontSize:height*0.025,
                            paddingHorizontal:10,
                            marginTop:15
                          }}>English</Text> */}
                           <Text style={{
                            color:'black',
                            fontFamily:FONTS.FONT_REGULAR,
                            fontSize:height*0.025,
                            paddingHorizontal:10,
                            marginTop:15,alignSelf:'center'
                          }}>***</Text>
                        {
                            dataEnglish.map((e, i) => {
                                return (
                                    <Text
                                        key={i}
                                        style={{
                                            color: 'black',
                                            fontFamily: FONTS.FONT_REGULAR,
                                            margin: 10
                                        }}>{e?.content}</Text>
                                )
                            })
                        }

                        <View style={{ height: 10 }} />
                        <ScrollView horizontal style={{ alignSelf: 'center' }}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                                {
                                    englishTableData.map((item, index) => {
                                        return (
                                            <Row
                                                key={index}
                                                data={item}
                                                //flexArr={[1, 1]}
                                                widthArr={widthAtr}
                                                textStyle={{
                                                    color: "black",
                                                    alignSelf: 'center',
                                                    margin: 10,
                                                    fontFamily: index === 0 ? FONTS.FONT_BOLD : FONTS.FONT_REGULAR,
                                                    fontSize: index === 0 ? 12 : 13
                                                }}
                                            />
                                        )
                                    })
                                }
                            </Table>
                        </ScrollView>
                        <View style={{ height: 10 }} />
                        {
                            bottomData.map((e, i) => {
                                return (
                                    <Text
                                        key={i}
                                        style={{
                                            color: 'black',
                                            fontFamily: FONTS.FONT_REGULAR,
                                            margin: 10
                                        }}>{e?.content}</Text>
                                )
                            })
                        }
                        {/* <View style={{ height: 10 }} /> */}
                        <View style={{height:height*0.05}}/>

                    </ScrollView>

                    <View style={{ zIndex: -1, position: "absolute", flex: 1, top: 0, transform: [{ rotate: '180deg' }], alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>

                    <View style={{ zIndex: -1, position: "absolute", flex: 1, bottom: 80, transform: [{ rotate: '360deg' }], alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>

                    {Platform.OS === 'ios' ?
                    <></>:
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableHighlight
                            onPress={() => navigation.goBack()}
                            underlayColor={"#ddd"}
                            style={{
                                height: height * 0.06,
                                flex: 1,
                                backgroundColor: color.mainColor,
                                borderColor: 'black',
                                width: 1.5,
                                elevation: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                                marginHorizontal: 5,
                                marginBottom:10
                            }}>
                            <Text style={{
                                color: color.secondaryColor,
                                fontFamily: FONTS.FONT_BOLD,
                                fontSize: 15
                            }}>OK</Text>
                        </TouchableHighlight>

                    </View>
                    }

                    <View style={{ height: 25 }} />

                </View>

            </View>
        </SafeAreaView>
    );

}