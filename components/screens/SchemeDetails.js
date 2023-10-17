import React, { useEffect } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView, ActivityIndicator
} from "react-native";
import COLORS from "../common_utils/colors";
import AppBar from "./Appbar";
import { useSelector, useDispatch } from "react-redux";
import FONTS from "../common_utils/fonts";
import CalIcon from '../../assets/payment history/total amount.svg'
import CalenderIcon from '../../assets/payment history/moths.svg'
import WeiIcon from '../../assets/payment history/totalweight-gram.svg'
import actions from "../redux/scheme_details_redux/actions";
import { fontScaleOfDevice } from '../common_utils/constants'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width


export default function SchemeDetails({ navigation, route }) {


    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { schemeDetailsData } = useSelector((state) => state.SchemeDetailsReducer);
    const { Data } = route.params
    const { mySchemeIsLoading } = useSelector((state) => state.HomeScreenReducer);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: actions.GET_SCHEME_DETAILS_BY_DOC_ENTRY,
            payload: { DocEntry: Data.docEntry }
        })
    }, [])


    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title={"PAYMENT HISTORY"} />
            <View style={{ ...styles.mainContainer, backgroundColor: color.mainColor }}>
                <View style={styles.column}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* scheme header */}
                        <View style={{
                            flexDirection: 'column',
                            backgroundColor: '#f5ddb5',
                            borderRadius: 20,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}>

                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.023 / fontScaleOfDevice,
                                fontFamily: FONTS.FONT_REGULAR
                            }}>Scheme Amount :
                                <Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontSize: height * 0.023 / fontScaleOfDevice,
                                    textAlignVertical: 'center'
                                }}> Rs.
                                    <Text style={{
                                        color: COLORS.DARK_BLUE,
                                        fontSize: height * 0.023 / fontScaleOfDevice,
                                        fontFamily: FONTS.FONT_BOLD,
                                        textAlignVertical: 'center'
                                    }}>{Data.schemeAmount}/
                                        <Text style={{
                                            color: COLORS.DARK_BLUE,
                                            fontSize: 10,
                                            textAlignVertical: 'center',
                                            textAlign: 'center',
                                            fontFamily: FONTS.FONT_REGULAR
                                        }}> Month</Text>
                                    </Text>
                                </Text>
                            </Text>

                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontSize: height * 0.023 / fontScaleOfDevice,
                                fontFamily: FONTS.FONT_REGULAR
                            }}>Doc Number :
                                <Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontSize: height * 0.023 / fontScaleOfDevice,
                                    textAlignVertical: 'center'
                                }}><Text style={{
                                    color: COLORS.DARK_BLUE,
                                    fontSize: height * 0.023 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_BOLD,
                                    textAlignVertical: 'center'
                                }}> {Data.docNum}</Text>
                                </Text>
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'center',
                                alignItems: 'center'
                            }}>

                                <View style={{
                                    marginTop: 15,
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    padding: 10,
                                    borderRadius: 15,
                                    flex: 1,
                                    marginRight: 15
                                }}>

                                    <Text style={{
                                        color: COLORS.DARK_BLUE,
                                        fontSize: height * 0.02 / fontScaleOfDevice,
                                        alignSelf: 'center',
                                        fontFamily: FONTS.FONT_BOLD,
                                    }}>Total Amount</Text>
                                    <View style={{
                                        height: 0.5,
                                        backgroundColor: COLORS.BACKGROUND_O,
                                        marginTop: 8,
                                        marginBottom: 8
                                    }} />

                                    <View style={{
                                        flexDirection: 'row',
                                        alignSelf: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <CalIcon />
                                        {/* <MaterialIcons name="calculator" size={25} color={COLORS.BACKGROUND_O} /> */}
                                        <Text style={{
                                            color: COLORS.DARK_BLUE,
                                            fontFamily: FONTS.FONT_BOLD,
                                            fontSize: 14
                                        }}> {Data.totalAmtPaid}/-</Text>
                                    </View>

                                </View>

                                <View style={{
                                    marginTop: 15,
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    padding: 10,
                                    borderRadius: 15,
                                    flex: 1,
                                    marginLeft: 15
                                }}>

                                    <Text style={{
                                        color: COLORS.DARK_BLUE,
                                        fontFamily: FONTS.FONT_BOLD,
                                        fontSize: height * 0.02 / fontScaleOfDevice,
                                        alignSelf: 'center'
                                    }}>Total Grams</Text>
                                    <View style={{
                                        height: 0.5,
                                        backgroundColor: COLORS.BACKGROUND_O,
                                        marginTop: 8,
                                        marginBottom: 8
                                    }} />

                                    <View style={{
                                        flexDirection: 'row',
                                        alignSelf: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <WeiIcon />
                                        {/* <MaterialIcons name="weight-gram" size={25} color={COLORS.BACKGROUND_O} /> */}
                                        <Text style={{
                                            color: COLORS.DARK_BLUE,
                                            fontFamily: FONTS.FONT_BOLD,
                                            fontSize: 14
                                        }}> {Data.totalGmsPaid} <Text style={{
                                            color: COLORS.DARK_BLUE,
                                            fontFamily: FONTS.FONT_BOLD,
                                            fontSize: 11,
                                            textAlignVertical: 'top'
                                        }}>gms</Text></Text>
                                    </View>

                                </View>


                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginTop: 15,
                                marginBottom: 10
                            }}>

                                <Text style={{
                                    color: 'black',
                                    fontSize: height * 0.023 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_REGULAR
                                }}>Due Paid :
                                    <Text style={{
                                        color: 'green',
                                        fontWeight: 'bold'
                                    }}>{Data.paidInst.split("/")[0]}</Text>
                                </Text>

                                <Text style={{
                                    color: 'black',
                                    fontSize: height * 0.023 / fontScaleOfDevice,
                                    fontFamily: FONTS.FONT_REGULAR
                                }}>Pending Due :
                                    <Text style={{
                                        color: 'red',
                                        fontWeight: 'bold'
                                    }}>{Data.paidInst.split("/")[1] - Data.paidInst.split("/")[0]}</Text>
                                </Text>

                            </View>

                        </View>

                        {/* list */}
                        {/* list header */}
                        {mySchemeIsLoading ?
                            <ActivityIndicator
                                size={45}
                                color={COLORS.BACKGROUND_V}
                                style={{ marginTop: 15 }} /> :
                            schemeDetailsData.length === 0 ?
                                <Text style={{
                                    color: 'black',
                                    fontSize: 16,
                                    fontFamily: FONTS.FONT_BOLD,
                                    alignSelf: 'center',
                                    marginTop: 120
                                }}>No Data Found!</Text> :
                                schemeDetailsData.map((item, i) => {
                                    return (
                                        <View
                                            key={i}
                                            style={{
                                                flexDirection: 'column',
                                                borderWidth: 0.5,
                                                borderColor: COLORS.BACKGROUND_O,
                                                padding: 15,
                                                borderRadius: 12,
                                                margin: 10,
                                                backgroundColor: '#fcfaf8'
                                            }}>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}
                                            >

                                                <View style={{
                                                    flexDirection: 'row',
                                                }}>

                                                    <CalenderIcon />
                                                    {/* <MaterialIcons name="calendar-month" size={20} color={COLORS.BACKGROUND_O} /> */}
                                                    <Text style={{
                                                        color: 'gray',
                                                        fontSize: height * 0.018 / fontScaleOfDevice,
                                                        fontFamily: FONTS.FONT_MEDIUM
                                                    }}> {item.date}</Text>

                                                </View>

                                                <Text style={{
                                                    color: COLORS.DARK_BLUE,
                                                    fontSize: height * 0.022 / fontScaleOfDevice,
                                                    fontFamily: FONTS.FONT_SEMIMODAL
                                                }}> {item.month}</Text>

                                            </View>

                                            <View style={{
                                                backgroundColor: COLORS.BACKGROUND_O,
                                                height: 0.4,
                                                margin: 8
                                            }} />

                                            {/* Sub contents.. */}
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-around'
                                            }}>

                                                {/* sub 1 */}
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{
                                                        color: 'gray',
                                                        fontSize: height * 0.022 / fontScaleOfDevice,
                                                        fontFamily: FONTS.FONT_REGULAR
                                                    }}>
                                                        Gold Rate
                                                    </Text>
                                                    <Text style={{ color: COLORS.DARK_BLUE, fontSize: height * 0.019 / fontScaleOfDevice, fontFamily: FONTS.FONT_BOLD }}>
                                                        {item.goldRate}
                                                    </Text>
                                                </View>

                                                <View style={{ width: 0.5, backgroundColor: COLORS.BACKGROUND_O }} />

                                                {/* sub 2 */}
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{
                                                        color: 'gray',
                                                        fontSize: height * 0.022 / fontScaleOfDevice,
                                                        fontFamily: FONTS.FONT_REGULAR
                                                    }}>
                                                        Weight
                                                    </Text>
                                                    <Text style={{ color: COLORS.DARK_BLUE, fontSize: height * 0.019 / fontScaleOfDevice, fontFamily: FONTS.FONT_BOLD }}>
                                                        {item.weight} <Text style={{
                                                            color: COLORS.DARK_BLUE,
                                                            fontFamily: FONTS.FONT_BOLD,
                                                            fontSize: 11,
                                                            textAlignVertical: 'top'
                                                        }}>gms</Text>
                                                    </Text>
                                                </View>

                                                <View style={{ width: 0.5, backgroundColor: COLORS.BACKGROUND_O }} />

                                                {/* sub 3 */}
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{
                                                        color: 'gray',
                                                        fontSize: height * 0.022 / fontScaleOfDevice,
                                                        fontFamily: FONTS.FONT_REGULAR
                                                    }}>
                                                        Amount
                                                    </Text>
                                                    <Text style={{ color: COLORS.DARK_BLUE, fontSize: height * 0.019 / fontScaleOfDevice, fontFamily: FONTS.FONT_BOLD }}>
                                                        {item.amount}
                                                    </Text>
                                                </View>

                                            </View>

                                        </View>
                                    )
                                })
                        }

                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        // backgroundColor: COLORS.BACKGROUND_O,
        height: height * 0.9
    },
    column: {
        //flex: 1,
        height: height * 0.9,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 10,
        marginTop: 15
    },
})