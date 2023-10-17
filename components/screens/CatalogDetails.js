import React, { useEffect, useState, useCallback, memo } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView,
    TouchableHighlight,
    Image,
    RefreshControl,
    ActivityIndicator
} from "react-native";
import AppBar from "./Appbar";
import COLORS from "../common_utils/colors";
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import MenuIcon from 'react-native-vector-icons/Ionicons';
import BGsvg from "../../assets/images/graphic.svg"
import images from "../common_utils/images";
import { LinearGradient } from "react-native-svg";
import FONTS from "../common_utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import actions from "../redux/Catalog/actions";
import axois from 'react-native-axios'
import TestPing from '../common_utils/pingTest'
import { API_URL, IMG_URL } from "../common_utils/constants";
// import ImagePlaceHolder from 'react-native-image-placeholder';
import ImageWithLoader from '../common_utils/ImageWithLoader'


var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get('window').fontScale;

function CatalogDetails({ navigation, route }) {

    const win = Dimensions.get('window');
    //const { Catalog_type } = useSelector((state) => state.CatalogReducer);
    var [listData, setListData] = useState([])
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(false);
    var queryIndex = 0;
    var [endReached, setEndReached] = useState(false);

    const onRefresh = useCallback(() => {

        setRefreshing(true);

        getTypeImages(route.params.docEntry)

        wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    useEffect(() => {

        // dispatch({
        //     type: actions.GET_CATALOG_TYPE,
        //     payload:{docEntry:'IG1-C10001'}
        // })

        getTypeImages(route.params.docEntry)

    }, [])

    const getTheImagesFromIndex = (lastIndex) => {

        var type = route.params.docEntry;

        try {
            TestPing("www.google.com")
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/Offers/ActiveList/Type/${type}/LastNum/${lastIndex}`,
                { headers: { 'Content-type': 'application/json' } }).then(res => {
                    if (res?.status === 200) {
                        var templist = [];
                        templist = res?.data;
                        templist.forEach(element => {
                            listData.push(element)
                        });
                        setListData(listData = listData)
                        setEndReached(endReached = false)
                    } else {
                        setEndReached(endReached = false)
                    }
                }).catch(e => {
                    setEndReached(endReached = false)
                })

        } catch (e) {
            setEndReached(endReached = false)
        }
    }

    const getTypeImages = (type) => {
        dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
        try {
            TestPing("www.google.com")
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/${type}`,
                { headers: { 'Content-type': 'application/json' } }).then(res => {
                    if (res?.status === 200) {
                        setListData(listData = res?.data)
                        dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                    } else {
                        dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                    }
                }).catch(e => {
                    dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                })

        } catch (e) {
            dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
        }

    }


    // my scheme full details tile
    const MySchemeDetailsText = (title, value) => {
        return (
            <Text style={{
                fontSize: 12,
                color: 'gray',
                flex: 1
            }}>
                {title}
                <Text style={{
                    color: COLORS.DARK_BLUE,
                    fontSize: 14,
                    fontWeight: 'bold',
                }}>  {value}
                </Text>
            </Text>
        )
    }

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                {/* top */}
                <View style={{ position: "absolute", zIndex: -1, alignSelf: "center", alignItems: "center" }}>
                    <View >
                        <BGsvg />
                    </View>
                </View>
                {/* end */}
                <View style={{ position: "absolute", bottom: 0, transform: [{ rotate: '180deg' }], zIndex: -1, alignSelf: "center", alignItems: "center" }}>
                    <View >
                        <BGsvg />
                    </View>
                </View>

                {/* sub view 1 */}
                <View style={styles.appBarUIStyle}>
                    <TouchableHighlight onPress={() => navigation.goBack()} underlayColor='transparant'>
                        <MenuIcon name="arrow-back-outline" color={COLORS.DARK_BLUE} size={30} />
                    </TouchableHighlight>
                    <Text style={{ fontSize: height * 0.03 / fScale, fontFamily: FONTS.FONT_SEMIMODAL, color: COLORS.DARK_BLUE, paddingLeft: 10 }}>{route?.params?.name}</Text>
                </View>

                {/* sub view 2 */}
                <View style={styles.subViewTwoStyle}>
                        <ScrollView showsVerticalScrollIndicator={false}
                         refreshControl={
                            <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                         }
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    if (listData[listData.length - 1].lineNum != queryIndex) {
                                        //setEndReached(endReached = true)
                                        //getTheImagesFromIndex(listData[listData.length - 1].lineNum.toString())
                                    }
                                    queryIndex = parseInt(listData[listData.length - 1].lineNum.toString());
                                    // setTimeout(()=>{
                                    //     setEndReached(endReached = false)
                                    // },3000);
                                }
                            }}>
                            {
                                listData.length > 0 ?
                                    <View
                                        style={{ marginTop: 5, marginBottom: 5 }}
                                    >
                                        {listData.map((val, index) =>
                                            <View key={index} style={{ position: "relative", zIndex: -index }}>
                                                <TouchableHighlight
                                                    onPress={() => navigation.navigate("ImageView", { uri: `${IMG_URL}${val?.imageId}` })}
                                                    underlayColor={"transparent"}
                                                >
                                                    <View style={{
                                                        borderRadius: 30,
                                                        marginVertical: 10,
                                                        padding: 15,
                                                        backgroundColor: "white",
                                                        marginHorizontal: 30,
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 8,
                                                        },
                                                        shadowOpacity: 0.46,
                                                        shadowRadius: 11.14,
                                                        elevation: 17,
                                                    }} >

                                                        <View style={{ position: "relative" }}>
                                                            <View style={{ position: 'absolute', flexDirection: "row", zIndex: 999 }}>
                                                                <View style={{ flex: 3 }} ></View>
                                                                <View style={{
                                                                    height: win.height * 0.22, flex: 2, justifyContent: "center",
                                                                    marginTop: 0, backgroundColor: 'rgba(0, 0, 0, 0.40)',
                                                                    borderRadius: 15, alignItems: 'center'
                                                                }} >
                                                                    <Text style={{ color: 'white', fontFamily: FONTS.FONT_SEMIMODAL, fontSize: height * 0.02 / fScale }} >{val?.tContent}</Text>
                                                                    <Text style={{ color: '#f1a40c', fontSize: height * 0.018 / fScale, fontFamily: FONTS.FONT_SEMIMODAL, alignSelf: "center", paddingHorizontal: 3 }} >{val?.content}</Text>
                                                                    {/* <Text style={{ color: 'white', marginLeft: 20, fontSize: 11, fontFamily: FONTS.FONT_REGULAR }} >{val.imageName}</Text>
                                                                        <Text style={{ color: '#f1a40c', marginLeft: 20, fontSize: 9, fontFamily: FONTS.FONT_SEMIMODAL }} >{"From \n" + val.fromDate.split("T")[0] + " To \n" +
                                                                            val.toDate.split("T")[0]}</Text> */}
                                                                </View>
                                                            </View>
                                                            <View style={{
                                                                position: 'absolute',
                                                                width: win.width * 0.785,
                                                                height: win.height * 0.22,
                                                                zIndex: 9999,
                                                                borderRadius: 15,
                                                            }}>
                                                            </View>
                                                            <ImageWithLoader
                                                                uri={`${IMG_URL}${val?.imageId}`}
                                                                style={{
                                                                    backgroundColor: '#ddd',
                                                                    width: win.width * 0.785,
                                                                    height: win.height * 0.22,
                                                                    alignSelf: "center",
                                                                    //zIndex: 99,
                                                                    borderRadius: 15
                                                                }}
                                                            />
                                                            {/* <ImagePlaceHolder
                                                                source={{ uri: `${IMG_URL}${val?.imageId}`}}
                                                                loadingStyle={{ size: 'large', color:COLORS.BACKGROUND_V }}
                                                                style={{
                                                                    backgroundColor: 'pink',
                                                                    width: win.width * 0.785,
                                                                    height: win.height * 0.22,
                                                                    alignSelf: "center",
                                                                    zIndex: 99,
                                                                    borderRadius: 15
                                                                }} /> */}
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        )}
                                    </View> :
                                    <View style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        width: "100%",
                                        height: height * 0.9,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 16,
                                            fontFamily: FONTS.FONT_BOLD,
                                            alignSelf: 'center',
                                        }}>No Data Found.!</Text>
                                    </View>
                            }

                            <View style={{height:height*0.05}}/>
                        </ScrollView>

                    {
                        endReached == true ? <ActivityIndicator
                            style={styles.progressCircleStyle}
                            color={'purple'}
                            size={50}
                        /> : <></>
                    }
                </View>

            </View>
        </SafeAreaView >
    )
}

export default memo(CatalogDetails);

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.BACKGROUND_W,
        height: height,
        width: width,
        position: "relative",
    },
    appBarUIStyle: {
        flexDirection: "row",
        width: "100%",
        height: 70,
        alignItems: 'center',
        paddingLeft: 10
    },
    subViewTwoStyle: {
        flexDirection: "column",
        flex: 1,
        width: "100%"
    },
    progressCircleStyle: {
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        width: "100%",
        backgroundColor: 'white',
        paddingVertical: 5
    }
})