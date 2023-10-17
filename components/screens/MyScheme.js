import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView,
    TouchableHighlight,
    RefreshControl,
    Modal, Pressable, ActivityIndicator
} from "react-native";
import AppBar from "./Appbar";
import COLORS from "../common_utils/colors";
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { useDispatch, useSelector } from "react-redux";
import FONTS from "../common_utils/fonts";
import FabButton from "../common_utils/FabButton";
import FaIcon from 'react-native-vector-icons/FontAwesome'
import actions from "../redux/scheme_details_redux/actions";
import BGsvg from '../../assets/images/bottom-img.svg'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-async-storage/async-storage";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get("window").fontScale;

export default function MySchemes({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { schemeListData, mySchemeIsLoading } = useSelector((state) => state.HomeScreenReducer);
    const { UserData } = useSelector((state) => state.ProfileReducer);

    var [ChitName, setChitName] = useState("")
    var [dateOfChit, setDateOfChit] = useState("")

    const dispatch = useDispatch()
    var [i, setI] = useState(0)

    var [refreshing, setRefreshing] = useState(false);

    //login skip
    var [loginSkip, setLoginSkip] = useState('');


    const getSchemeDetailsGraph = (doc) => {
        dispatch({
            type: "GET_SCHEME_GRAPH",
            payload: { DocEntry: doc }
        })
    }

    useEffect(() => {

        AsyncStorage.getItem('is_login_skipped').then(res => {
            setLoginSkip(loginSkip = res);
            console.log(loginSkip)
        })

    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setI(i = i + 1)
        var mobileNum = UserData.cellular
        dispatch({
            type: "SET_PROFILE",
            payload: { cellular: mobileNum }
        })
        // dispatch({
        //     type: actions.GET_SCHEMES_DATA,
        //     payload: {CardCode: mobileNum}
        // })
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
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

                <Text style={{ fontSize: height * 0.014 / fScale, color: 'gray', fontFamily: FONTS.FONT_REGULAR }}>
                    {title}
                </Text>

                <Text style={{
                    color: COLORS.DARK_BLUE,
                    fontSize: height * 0.017 / fScale,
                    fontFamily: FONTS.FONT_SEMIMODAL,
                    textAlign: 'right',
                    paddingRight: 5
                }}>
                    {value}
                </Text>
            </View>
        )
    }

    const updateDate = (total, doc, amount) => {
        navigation.navigate('HandlePayment', {
            data: {
                amount: amount,
                docEntry: doc,
                payTotal: total,
                type: 'update'
            }
        })
    }

    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title={"MY SCHEMES"} />
            <View style={{
                flexDirection: 'column',
                backgroundColor: color.mainColor,
                height: height
            }}>


                <View style={styles.column}>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >

                        {/* <ProgressChart
                                data={progData}
                                width={width - 30}
                                style={{
                                    borderRadius: 20,
                                    alignSelf: 'center'
                                }}
                                height={220}
                                strokeWidth={16}
                                radius={32}
                                chartConfig={chartConfig}
                                hideLegend={false}
                            /> */}



                        {/* <BarChart
                                style={{
                                    borderRadius: 30,
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    borderColor: COLORS.BACKGROUND_O,
                                    borderWidth: 0.8
                                }}
                                data={barChartData}
                                width={width - 40}
                                height={height * 0.27}
                                yAxisLabel="$"
                                chartConfig={chartConfig}
                                verticalLabelRotation={0}
                            /> */}

                        {loginSkip === 'yes' ?
                            <Text style={{
                                color: 'black',
                                fontFamily: FONTS.FONT_BOLD,
                                marginTop: 10,
                                alignSelf: 'center',
                                fontSize: 20
                            }}>No Data Found!</Text> :
                            <ScrollView showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                            >
                                {
                                    mySchemeIsLoading ?
                                        <ActivityIndicator
                                            size={45}
                                            color={COLORS.BACKGROUND_V}
                                            style={{ marginTop: 15 }} /> :
                                        schemeListData.length !== 0 ?
                                            schemeListData.map((e) => {
                                                return (
                                                    <TouchableHighlight
                                                        underlayColor={"transparent"}
                                                        //onPress={() => navigation.navigate("schemedetails", { Data: e })}
                                                        key={e.docEntry}
                                                    >
                                                        <View
                                                            style={styles.schemesTile}
                                                        >

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingRight: 20
                                                            }}>
                                                                <Text style={{
                                                                    color: COLORS.BACKGROUND_O,
                                                                    paddingTop: 10,
                                                                    paddingBottom: 10,
                                                                    fontSize: height * 0.014 / fScale,
                                                                    paddingLeft: 20,
                                                                    fontFamily: FONTS.FONT_REGULAR
                                                                }}>Scheme
                                                                    <Text style={{
                                                                        color: COLORS.BACKGROUND_O,
                                                                        padding: 10,
                                                                        fontSize: height * 0.018 / fScale,
                                                                        fontFamily: FONTS.FONT_BOLD
                                                                    }}> {e.chitName}</Text>
                                                                </Text>
                                                                <Text style={{
                                                                    color: COLORS.BACKGROUND_O,
                                                                    paddingTop: 10,
                                                                    paddingBottom: 10,
                                                                    fontSize: height * 0.014 / fScale,
                                                                    paddingLeft: 20,
                                                                    fontFamily: FONTS.FONT_REGULAR
                                                                }}>Doc No.
                                                                    <Text style={{
                                                                        color: COLORS.BACKGROUND_O,
                                                                        padding: 10,
                                                                        fontSize: height * 0.018 / fScale,
                                                                        fontFamily: FONTS.FONT_BOLD
                                                                    }}> {e.docNum}</Text>
                                                                </Text>
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
                                                                paddingRight: 10,
                                                                flex: 1,
                                                                //backgroundColor: 'white'
                                                            }}>
                                                                <Text style={{
                                                                    color: COLORS.DARK_BLUE,
                                                                    fontSize: 13,
                                                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                                                    paddingRight: 5,
                                                                    alignSelf: 'center'
                                                                }}> <Text style={{
                                                                    color: COLORS.DARK_BLUE,
                                                                    fontSize: height * 0.017 / fScale,
                                                                    fontFamily: FONTS.FONT_SEMIMODAL,
                                                                    paddingRight: 5,
                                                                    alignSelf: 'center',
                                                                }}>{e.chitCategory} - </Text> {e.chitType}</Text>
                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingTop: 7,
                                                                paddingBottom: 7,
                                                                paddingLeft: 10,
                                                                paddingRight: 10
                                                            }}>
                                                                {MySchemeDetailsText("Started On", e.startDate)}
                                                                {MySchemeDetailsText("Duration", e.duration)}
                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingTop: 7,
                                                                paddingBottom: 7,
                                                                paddingLeft: 10,
                                                                paddingRight: 10
                                                            }}>
                                                                {MySchemeDetailsText("Total Paid", "₹ " + e.totalAmtPaid)}
                                                                {MySchemeDetailsText("Total Gram", e.totalGmsPaid)}
                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingTop: 7,
                                                                paddingBottom: 15,
                                                                paddingLeft: 10,
                                                                paddingRight: 10
                                                            }}>
                                                                {MySchemeDetailsText("Due Date", e.nextDueDate)}
                                                                {MySchemeDetailsText("Due Amount", "₹ " + e.nextDueAmount)}
                                                            </View>

                                                            <View
                                                                style={{
                                                                    height: 0.5,
                                                                    backgroundColor: COLORS.BACKGROUND_O,
                                                                    marginLeft: 15,
                                                                    marginRight: 15
                                                                }}
                                                            />

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                padding: 10,
                                                                alignContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                                <TouchableHighlight
                                                                    underlayColor={"transparent"}
                                                                    onPress={() => {
                                                                        navigation.navigate("schemedetails", { Data: e })
                                                                    }}>
                                                                    <Text style={{
                                                                        color: COLORS.DARK_BLUE,
                                                                        textDecorationLine: 'underline',
                                                                        fontFamily: FONTS.FONT_REGULAR,
                                                                        fontSize: height * 0.016 / fScale
                                                                    }}>Payment History</Text>
                                                                </TouchableHighlight>

                                                                <TouchableHighlight
                                                                    onPress={() => {
                                                                        updateDate(e?.nextDueAmount, e?.docEntry, e?.nextDueAmount)
                                                                    }}
                                                                    disabled={e.payBtn.toString().toLowerCase() === "enable" ? false : true}
                                                                    style={{
                                                                        backgroundColor: e.payBtn.toString().toLowerCase() == "enable" ? 'green' : 'gray',
                                                                        height: 30,
                                                                        width: 100,
                                                                        borderRadius: 15,
                                                                        alignContent: 'center',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        marginLeft: 10
                                                                    }}>
                                                                    <Text style={{
                                                                        color: 'white',
                                                                        fontFamily: FONTS.FONT_REGULAR,
                                                                        fontSize: height * 0.015 / fScale
                                                                    }}>Pay Now</Text>
                                                                </TouchableHighlight>

                                                                <View style={{ flex: 1 }} />
                                                                <TouchableHighlight
                                                                    underlayColor={'transparent'}
                                                                    onPress={() => {
                                                                        setChitName(ChitName = e.chitName)
                                                                        setDateOfChit(dateOfChit = e.startDate)
                                                                        getSchemeDetailsGraph(e.docEntry)
                                                                    }}
                                                                    style={{
                                                                        height: 35,
                                                                        width: 35,
                                                                        backgroundColor: '#f5e8dc',
                                                                        borderRadius: 70 / 2,
                                                                        alignItems: 'center',
                                                                        alignContent: 'center',
                                                                        justifyContent: 'center',
                                                                        alignSelf: 'flex-end'
                                                                    }}>
                                                                    <FaIcon name="line-chart" size={20}
                                                                        color={COLORS.BACKGROUND_G} />
                                                                </TouchableHighlight>

                                                                <View style={{
                                                                    width: 8
                                                                }} />

                                                                <TouchableHighlight
                                                                    underlayColor={'transparent'}
                                                                    onPress={() => navigation.navigate("schemedetails", { Data: e })}
                                                                    style={{
                                                                        height: 35,
                                                                        width: 35,
                                                                        backgroundColor: '#f5e8dc',
                                                                        borderRadius: 70 / 2,
                                                                        alignItems: 'center',
                                                                        alignContent: 'center',
                                                                        justifyContent: 'center',
                                                                        alignSelf: 'flex-end'
                                                                    }}>
                                                                    <MaterialIcon name="arrow-forward-ios" size={20}
                                                                        color={COLORS.BACKGROUND_O} />
                                                                </TouchableHighlight>

                                                            </View>

                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            }) : <Text style={{
                                                color: 'black',
                                                fontFamily: FONTS.FONT_BOLD,
                                                marginTop: 10,
                                                alignSelf: 'center',
                                                fontSize: 20
                                            }}>No Data Found!</Text>
                                }
                            </ScrollView>
                        }

                        <View style={{ height: height * 0.05 }} />
                    </ScrollView>
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                    <FabButton marginBottom={80} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    column: {
        height: height * 0.9,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 10,
        marginTop: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
    },
    schemesTile: {
        flexDirection: 'column',
        borderWidth: 0.5,
        borderColor: COLORS.BACKGROUND_O,
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#fcfaf8',
    }

})