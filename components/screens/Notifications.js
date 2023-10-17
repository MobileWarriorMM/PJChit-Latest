import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView, Touchable, TouchableHighlight, RefreshControl } from "react-native";
import AppBar from "./Appbar";
import IonIcon from 'react-native-vector-icons/Ionicons'
import COLORS from "../common_utils/colors";
import FONTS from "../common_utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import BGsvg from '../../assets/images/bottom-img.svg'
import axois from 'react-native-axios'
import TestPing from "../common_utils/pingTest";
import { useCallback } from "react";
import { API_URL, fontScaleOfDevice } from "../common_utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function NotificationScreen({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    var [notificationList, setList] = useState([])
    const dispatch = useDispatch()

    var [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getNotifications()
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const getNotifications = () => {

        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })

        try {
            TestPing("www.google.com")
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/NotificationList`).then(res => {
                if (res.status === 200) {
                    setList(notificationList = res?.data)
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                }
            }).catch(e => {
                dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
            })

        } catch (e) {
            dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        }

    }

    useEffect(() => {

        AsyncStorage.getItem('is_login_skipped').then(res => {

            if (res === null || res === 'no') {
                getNotifications()
            }

        })


    }, [])

    return (
        <SafeAreaView
            style={{ backgroundColor: color.mainColor }}
        >
            <AppBar navigation={navigation} title={'NOTIFICATIONS'} />
            {
                notificationList.length == 0 ?
                    <View style={{
                        height: height * 0.95,
                        width: width,
                        backgroundColor: 'white',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <IonIcon name="ios-notifications-off-outline" color={'#000'} size={35} />
                            <Text style={{
                                fontFamily: FONTS.FONT_MEDIUM,
                                color: '#000',
                                fontSize: 18,
                                marginLeft: 5,
                            }}>No Notifications</Text>
                        </View>
                    </View> :
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
                        elevation: 3
                    }}>


                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            showsVerticalScrollIndicator={false}>
                            {
                                notificationList.map((e, i) => {
                                    return (
                                        <View key={i}>
                                            <TouchableHighlight>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: 7,
                                                    alignItems: 'flex-start'
                                                }}>

                                                    <View style={{
                                                        height: 50,
                                                        width: 50,
                                                        borderRadius: 100,
                                                        backgroundColor: '#ddd',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>

                                                        <IonIcon name='notifications-outline' size={25} color='black' />

                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'column',
                                                        marginLeft: 8,
                                                        flex: 1
                                                    }}>

                                                        <Text style={{
                                                            color: COLORS.DARK_BLUE,
                                                            fontFamily: FONTS.FONT_SEMIMODAL,
                                                            fontSize: height * 0.023 / fontScaleOfDevice
                                                        }}>{e.title}</Text>

                                                        <Text style={{
                                                            color: 'gray',
                                                            fontFamily: FONTS.FONT_REGULAR,
                                                            fontSize: height * 0.02 / fontScaleOfDevice,
                                                            marginTop: 4
                                                        }}>{e.message}</Text>
                                                    </View>

                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })
                            }

                        </ScrollView>

                        <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                            <View >
                                <BGsvg />
                                {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                            </View>
                        </View>
                    </View>
            }

        </SafeAreaView>
    )

}