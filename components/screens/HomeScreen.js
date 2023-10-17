import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableHighlight,
    ImageBackground,
    RefreshControl,
    ActivityIndicator,
    BackHandler,
    Alert,
    Modal,
    Pressable,
    Platform
} from 'react-native'
import AppBar from "./Appbar";
import COLORS from "../common_utils/colors";
import FabButton from "../common_utils/FabButton";
import FONTS from "../common_utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import actions from "../redux/home_screen_redux/actions";
import JoinScheme from '../../assets/icons/join scheame.svg';
import MyScheme from '../../assets/icons/myscheme.svg';
import Offers from '../../assets/offers.svg';
import NewArrivals from '../../assets/new arrival.svg';
import GoldSvg from '../../assets/icons/gold-icon.svg'
import SilverSvg from '../../assets/icons/silver-icon.svg'
import BGsvg from '../../assets/images/bottom-img.svg'
import AsyncStorage from "@react-native-async-storage/async-storage";
import FaIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import axois from 'react-native-axios'
import { useFocusEffect } from "@react-navigation/native";
import { API_URL, IMG_URL } from "../common_utils/constants";
import PaginationDots from 'react-native-animated-pagination-dot';
// import ImagePlaceHolder from 'react-native-image-placeholder';
import ImageWithLoader from "../common_utils/ImageWithLoader";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get("window").fontScale;

//you need to preview n items.
const previewCount = 1;
const itemWidth = width / (previewCount + .5)
const startScroll = (itemWidth * 3 / 4);


export default function HomeScreen({ navigation }) {

    const { color } = useSelector((state) => state.ColorThemeReducer);
    const { UserData } = useSelector((state) => state.ProfileReducer);
    const { sliderListLoading, mySchemeIsLoading, sliderListData, schemeListData, todayGoldSilverRate } = useSelector((state) => state.HomeScreenReducer);
    const { HomeRefresh } = useSelector((state) => state.CommonReducer);

    var [docEntry, setDocEntry] = useState(0)
    var [payTotal, setPayTotal] = useState(0)
    var [currentPhn, setCurrentPhn] = useState(UserData?.cellular)

    const [refreshing, setRefreshing] = useState(false);
    var [showExitModal, setShowExitModal] = useState(false)
    var progressInterval = setInterval(() => { }, 0)

    var myColor = color.mainColor;
    const dispatch = useDispatch()

    var [ChitName, setChitName] = useState("")
    var [dateOfChit, setDateOfChit] = useState("")

    var [currentDotIndex, setCurrentDotIndex] = useState(0)
    const flatlistRef = React.useRef();

    var [sliderImageList, setSliderImageList] = useState([])
    var [hpSliderLoad, setHpSliderLoad] = useState(true)

    //login skip
    var [loginSkip, setLoginSkip] = useState('')

    const updateDate = (total, doc, amount) => {
        navigation.navigate('HandlePayment', {
            data: {
                amount: amount,
                docEntry: doc,
                payTotal: total,
                type: "update"
            }
        })
    }

    const gettingPhn = () => {
        AsyncStorage.getItem("current_phone").then((res) => {
            setCurrentPhn(currentPhn = res)
            dispatch({
                type: "SET_PROFILE",
                payload: { cellular: currentPhn }
            })
        }).catch(e => {

        })

    }

    const getSchemeDetailsGraph = (doc) => {
        dispatch({
            type: "GET_SCHEME_GRAPH",
            payload: { DocEntry: doc }
        })
    }

    //get HP Slider images
    const getHPSliderImages = () => {

        try {
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/HP`).then((res) => {

                if (res?.status === 200) {
                    // dispatch({
                    //     type:'HOME_REFRESH',
                    //     payload:false
                    // })
                    const data = res?.data;
                    var tempArray = [];
                    //setSliderImageList(data)
                    data.forEach(element => {
                        const d = { ...element, loader: true };
                        tempArray.push(d)
                    });
                    setSliderImageList(tempArray)
                    setHpSliderLoad(false)

                }

            }).catch((e) => {
                setHpSliderLoad(false)
            })
        } catch (e) {
            setHpSliderLoad(false)
        }

    }

    useFocusEffect(
        useCallback(() => {
            const infiniteScroll = (imgList) => {
                const numberOfdata = imgList.length
                var scrollValue = 0
                var scrolled = 0
                progressInterval = setInterval(function () {

                    scrolled++
                    //setCurrentDotIndex(currentDotIndex = scrolled)
                    if (scrolled < numberOfdata) {
                        scrollValue = scrollValue + width
                    }
                    else {
                        scrollValue = 0
                        scrolled = 0
                    }

                    setCurrentDotIndex(scrolled)

                    flatlistRef.current.scrollToOffset({ animated: true, offset: scrollValue })

                }, 3500)
            }
            //infiniteScroll(sliderListData)

            const handleBackAction = () => {
                setShowExitModal(showExitModal = true);
                // Alert.alert("Hold on!", "Are you sure you want to go back?", [
                //     {
                //         text: "Cancel",
                //         onPress: () => null,
                //         style: "cancel"
                //     },
                //     { text: "YES", onPress: () => BackHandler.exitApp() }
                // ]);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', handleBackAction);

            return () => {
                //clearInterval(progressInterval)
                BackHandler.removeEventListener("hardwareBackPress", handleBackAction);
            };
        }, [])
    );

    // refresh listener...
    const onRefresh = useCallback(() => {

        // setRefreshing(true);

        if (Platform.OS === 'ios') {
            AsyncStorage.getItem('is_login_skipped').then(res => {
                setLoginSkip(res);

                if(res === null || res === 'no' ) {
                    dispatch({
                        type: 'HOME_REFRESH',
                        payload: true
                    })

                    getHPSliderImages()

                    dispatch({
                        type: "SET_PROFILE",
                        payload: { cellular: currentPhn }
                    })

                    dispatch({
                        type: actions.GET_GOLD_SILVER_RATES,
                    },)

                    dispatch({
                        type: actions.GET_LOCATION,
                    },)
                } 

            }).catch(err => {

            })
        } else {

            dispatch({
                type: 'HOME_REFRESH',
                payload: true
            })

            getHPSliderImages()

            dispatch({
                type: "SET_PROFILE",
                payload: { cellular: currentPhn }
            })

            dispatch({
                type: actions.GET_GOLD_SILVER_RATES,
            },)

            dispatch({
                type: actions.GET_LOCATION,
            },)

        }

    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    // initstate
    useEffect(() => {

        // BackHandler.removeEventListener("hardwareBackPress", handleBackAction);

        if (Platform.OS === 'ios') {
            getHPSliderImages();
            AsyncStorage.getItem('is_login_skipped').then(res => {

                setLoginSkip(res);

                //if login is skipped
                if (res !== null && res === 'no') {
                    gettingPhn()
                }

            }).catch(err => {

            })
        } else {
            getHPSliderImages();
            gettingPhn();
        }




        // dispatch({
        //     type: actions.GET_SLIDER_LIST,
        // },)

        // dispatch({
        //     type: actions.GET_LOCATION,
        // },)

        // dispatch({
        //     type: actions.GET_SCHEMES_DATA,
        //     payload: { CardCode: UserData.cardCode }
        // })

        //getFirebaseToken()

    }, [])

    // render images item
    const OfferImageListTiles = ({ item, index }) => {

        // axois.get(`${IMG_URL}${item?.imageId}`).then(res => {
        //     if (res.status === 200) {
        //         setImgLoader(false)
        //     } else {
        //         setImgLoader(false)
        //     }
        // })

        //var base64Image = 'data:' + item?.image?.contentType + ";base64," + item?.image?.fileContents
        return (
            <View>
                <ImageWithLoader
                    uri={`${IMG_URL}${item?.imageId}`}
                    style={{
                        height: height * 0.25,
                        width: width - 20,
                        backgroundColor: '#ddd',
                        borderRadius: 15,
                        marginHorizontal: 10,
                        borderWidth: 1,
                        borderColor: color.secondaryColor
                    }}
                />
                {/* <Image
                    source={{ uri: `${IMG_URL}${item?.imageId}` }}
                    //key={index}
                    resizeMode="cover"
                    resizeMethod="scale"
                    onLoadEnd={() => {
                        const temp = [...sliderImageList];
                        temp.find(el => el.id === item.id).loader = false;
                        setSliderImageList(temp)
                    }}
                    style={{
                        height: height * 0.25,
                        width: width - 20,
                        backgroundColor: 'pink',
                        borderRadius: 15,
                        marginHorizontal: 10,
                        borderWidth: 1,
                        borderColor: color.secondaryColor
                    }} />
                {
                    item.loader ?
                        <View style={{
                            height: height * 0.25,
                            width: width - 20,
                            backgroundColor: '#ddd',
                            borderRadius: 15,
                            marginHorizontal: 10,
                            borderWidth: 1,
                            borderColor: color.secondaryColor,
                            position:'absolute',
                            justifyContent:'center'
                        }}>
                            <FaIcon name="image" color='blue' style={{
                                alignSelf:'center'
                            }} size={35} />
                            <ActivityIndicator
                                size={45}
                                style={{
                                    alignSelf: 'center',
                                    marginTop:10
                                }}
                                color={COLORS.BACKGROUND_V}
                            />
                        </View> : <></>
                } */}
            </View>
        )
    }


    // render header tiles
    const HeaderTile = (path, title, SVG) => {
        return (
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate(path)
                }}
                underlayColor={"transparent"}
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        height: 'auto',
                        width: 'auto',
                        borderWidth: 0.5,
                        borderColor: '#c57e07',
                        margin: 5,
                        borderRadius: 10,
                        padding: 10,
                        justifyContent: 'space-between',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 6,
                    }}>
                    <SVG height={35} width={35} />
                    {/* <MaterialIcon name={icon} size={30} color={COLORS.BACKGROUND_O} /> */}
                    <Text style={{
                        fontSize: height * 0.011 / fScale, color: COLORS.DARK_BLUE, fontFamily: FONTS.FONT_BOLD
                        , marginTop: 5, textAlign: "center"
                    }}>{title}</Text>
                </View>
            </TouchableHighlight>

        )
    }

    //  gold and silver title
    const GoldSilverView = (title, SVG) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                }}>
                {/* <MaterialIcon name={icon} size={25} color={COLORS.BACKGROUND_O} /> */}
                <SVG height={30} width={30} />
                <Text style={{
                    fontSize: height * 0.02 / fScale, color: COLORS.DARK_BLUE,
                    marginLeft: 8, fontFamily: FONTS.FONT_SEMIMODAL, marginTop: 3
                }}>{title}</Text>
            </View>
        )

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

    return (
        <SafeAreaView>
            <AppBar navigation={navigation} title={'WELCOME'} />
            <View style={{ ...styles.mainContainer, backgroundColor: myColor }}>

                {/* <RenderGraph data={graphData?.data} visible={graphData?.vivible}/> */}

                <Modal
                    visible={showExitModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowExitModal(showExitModal = false)}
                >

                    <Pressable
                        onPress={() => setShowExitModal(showExitModal = false)}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: 'rgba(9,9,9,0.5)',
                        }}>
                        <View style={{
                            width: "80%",
                            backgroundColor: 'white',
                            elevation: 10,
                            borderRadius: 10,
                            alignSelf: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 15
                        }}>

                            <Image
                                source={require("../../assets/images/pjlogocrop.png")}
                                style={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: 160,
                                    marginBottom: 10
                                }}
                            />

                            <Text style={{
                                color: 'black',
                                fontFamily: FONTS.FONT_SEMIMODAL,
                            }}>Do you want to quit the app?</Text>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20
                            }}>

                                <TouchableHighlight
                                    onPress={() => setShowExitModal(showExitModal = false)}
                                    underlayColor="transparent"
                                    style={{
                                        height: 40,
                                        flex: 1,
                                        backgroundColor: color.mainColor,
                                        borderRadius: 20,
                                        marginHorizontal: 15,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        elevation: 10
                                    }}>
                                    <Text style={{
                                        color: color.secondaryColor,
                                        fontFamily: FONTS.FONT_BOLD,
                                    }}>CANCEL</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    onPress={() => {
                                        setShowExitModal(showExitModal = false)
                                        BackHandler.exitApp()
                                    }}
                                    underlayColor="transparent"
                                    style={{
                                        height: 40,
                                        flex: 1,
                                        backgroundColor: color.mainColor,
                                        borderRadius: 20,
                                        marginHorizontal: 15,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        elevation: 10,
                                    }}>
                                    <Text style={{
                                        color: color.secondaryColor,
                                        fontFamily: FONTS.FONT_BOLD,
                                    }}>QUIT</Text>
                                </TouchableHighlight>

                            </View>

                        </View>
                    </Pressable>

                </Modal>

                {/* Image slider listview*/}
                <View style={{
                    height: height * 0.265,
                    width: width,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    {/* <Carousel
                        data={imgList}
                        renderItem={({ item }) => OfferImageListTiles({ item })}
                        sliderWidth={120}
                        itemWidth={100}
                    /> */}


                    {
                        hpSliderLoad ?
                            <ActivityIndicator size={45} color={color.secondaryColor} /> :
                            sliderImageList?.length > 0 ?
                                <FlatList
                                    data={sliderImageList}
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    keyExtractor={(i, index) => index}
                                    renderItem={(({ item }) => <OfferImageListTiles index={0} item={item} />)}
                                    onScroll={(event) => {
                                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                                        setCurrentDotIndex(currentDotIndex = index)
                                    }}
                                /> : <Text style={{
                                    color: 'purple',
                                    backgroundColor: 'white',
                                    padding: 7,
                                    borderRadius: 10,
                                    fontFamily: FONTS.FONT_REGULAR
                                }}>No Data Found!</Text>
                    }

                    <View style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        width: "auto",
                        bottom: 20,
                        alignSelf: 'center',
                    }}>

                        {/* {
                            sliderListData?.map((e, i) => {
                                return (
                                    <View
                                        key={i}
                                        style={{
                                            height: 8,
                                            width: i === currentDotIndex ? 20 : 8,
                                            borderRadius: 20 / 2,
                                            backgroundColor: i === currentDotIndex ? color.mainColor : 'white',
                                            margin: 2
                                        }}
                                    />
                                )
                            })
                        } */}

                        <PaginationDots
                            maxPage={sliderImageList.length}
                            curPage={currentDotIndex}
                            activeDotColor={myColor}
                            inactiveDotColor={"red"}
                            sizeRatio={1.2}
                        />

                    </View>


                </View>

                <View style={styles.column}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={HomeRefresh}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {/* header tiles */}
                        <View style={styles.headerTiles}>
                            {HeaderTile("joinScheme", "Join Scheme", JoinScheme)}
                            {HeaderTile("myscheme", "My Scheme", MyScheme)}
                            {HeaderTile("CatelogScreen", "All Catelogs", Offers)}
                            {HeaderTile("newArrivals", "New Arrivals", NewArrivals)}
                        </View>

                        {/* gold silver price */}
                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 8,
                            borderWidth: 0.5,
                            borderColor: COLORS.BACKGROUND_O,
                            borderRadius: 22
                        }}>

                            <View style={{ flexDirection: 'row' }}>
                                {GoldSilverView("GOLD PRICE", GoldSvg)}
                                <View style={{
                                    width: 1,
                                    backgroundColor: COLORS.BACKGROUND_O
                                }} />
                                {GoldSilverView("SILVER PRICE", SilverSvg)}
                            </View>

                            <View style={{
                                height: 0.5,
                                backgroundColor: COLORS.BACKGROUND_O
                            }} />


                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <View style={{
                                    flex: 1,
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 20,
                                    paddingBottom: 20,
                                    paddingRight: 15,
                                    paddingLeft: 15
                                }}>

                                    <Text style={{
                                        fontSize: 15,
                                        fontFamily: FONTS.FONT_SEMIMODAL,
                                        color: COLORS.DARK_BLUE
                                    }}>Rs<Text style={{
                                        fontSize: height * 0.028 / fScale,
                                        fontFamily: FONTS.FONT_SEMIMODAL,
                                        color: COLORS.DARK_BLUE
                                    }}> {todayGoldSilverRate?.goldPrice} <Text style={{
                                        fontSize: height * 0.014,
                                        textAlignVertical: "bottom",
                                        color: COLORS.DARK_BLUE,
                                        fontFamily: FONTS.FONT_REGULAR,
                                    }}>1gms</Text></Text>
                                    </Text>

                                </View>

                                <View
                                    style={{
                                        width: 1,
                                        backgroundColor: COLORS.BACKGROUND_O,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                />

                                <View style={{
                                    flex: 1,
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 20,
                                    paddingBottom: 20,
                                    paddingRight: 15,
                                    paddingLeft: 15
                                }}>

                                    <Text style={{
                                        fontSize: 15,
                                        fontFamily: FONTS.FONT_SEMIMODAL,
                                        color: COLORS.DARK_BLUE
                                    }}>Rs<Text style={{
                                        fontSize: height * 0.028 / fScale,
                                        fontFamily: FONTS.FONT_SEMIMODAL,
                                        color: COLORS.DARK_BLUE
                                    }}> {todayGoldSilverRate?.silverPrice} <Text style={{
                                        fontSize: height * 0.014,
                                        textAlignVertical: "bottom",
                                        color: COLORS.DARK_BLUE,
                                        fontFamily: FONTS.FONT_REGULAR,
                                    }}>1gms</Text></Text>
                                    </Text>

                                </View>

                            </View>

                            {/* <View style={{
                                height: 0.5,
                                backgroundColor: COLORS.BACKGROUND_O
                            }} /> */}

                            {/* <Text style={{
                                fontSize: 11,
                                alignSelf: 'center',
                                paddingTop: 8,
                                paddingBottom: 8,
                                color: COLORS.DARK_BLUE,
                                fontFamily: FONTS.FONT_REGULAR,
                            }}>Last Changed : 28 Aug 2022 , 12:00 AM</Text> */}

                        </View>

                        {/* my schems */}
                        <Text style={{
                            color: COLORS.DARK_BLUE,
                            fontFamily: FONTS.FONT_BOLD,
                            paddingTop: 15,
                            paddingLeft: 15,
                            fontSize: height * 0.023
                        }}>
                            MY SCHEMES
                        </Text>

                        {
                            mySchemeIsLoading ?
                                <ActivityIndicator
                                    size={45}
                                    color={COLORS.BACKGROUND_V}
                                    style={{ marginTop: 15 }} /> :
                                schemeListData.length === 0 || loginSkip === 'yes' ?
                                    <Text style={{
                                        fontSize: 15,
                                        color: COLORS.DARK_BLUE,
                                        fontFamily: FONTS.FONT_REGULAR,
                                        alignSelf: 'center',
                                        marginTop: 20
                                    }}>No Data Found! </Text> :
                                    schemeListData?.map((e) => {
                                        return (
                                            <TouchableHighlight
                                                underlayColor={"transparent"}
                                                // onPress={() => {
                                                //     navigation.navigate("schemedetails", { Data: e })
                                                // }}
                                                key={e?.docEntry}
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
                                                            fontFamily: FONTS.FONT_REGULAR,
                                                        }}>Scheme
                                                            <Text style={{
                                                                color: COLORS.BACKGROUND_O,
                                                                padding: 10,
                                                                fontSize: height * 0.018 / fScale,
                                                                fontFamily: FONTS.FONT_SEMIMODAL,
                                                            }}> {e?.chitName}</Text>
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
                                                            }}> {e?.docNum}</Text>
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
                                                        backgroundColor: 'white'
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
                                                            alignSelf: 'center'
                                                        }}>{e?.chitCategory} - </Text> {e?.chitType}</Text>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        paddingTop: 7,
                                                        paddingBottom: 7,
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        flex: 1,
                                                        backgroundColor: 'white'
                                                    }}>
                                                        {MySchemeDetailsText("Started On", e?.startDate)}
                                                        {MySchemeDetailsText("Duration", e?.duration)}
                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        paddingTop: 7,
                                                        paddingBottom: 7,
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        backgroundColor: 'white'
                                                    }}>
                                                        {MySchemeDetailsText("Total Paid", "₹ " + e?.totalAmtPaid)}
                                                        {MySchemeDetailsText("Total Gram", e?.totalGmsPaid)}
                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        paddingTop: 7,
                                                        paddingBottom: 15,
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        backgroundColor: 'white'
                                                    }}>
                                                        {MySchemeDetailsText("Due Date", e?.nextDueDate)}
                                                        {MySchemeDetailsText("Due Amount", "₹ " + e?.nextDueAmount)}
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
                                                            underlayColor={'transparent'}
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
                                                            underlayColor={'transparent'}
                                                            onPress={() => {
                                                                setDocEntry(docEntry = e?.docEntry)
                                                                setPayTotal(payTotal = e?.nextDueAmount)
                                                                updateDate(payTotal, docEntry, e?.nextDueAmount)
                                                            }}
                                                            disabled={e?.payBtn.toString().toLowerCase() === "enable" ? false : true}
                                                            style={{
                                                                backgroundColor: e?.payBtn.toString().toLowerCase() == "enable" ? '#fac900' : 'gray',
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
                                                            onPress={() => {
                                                                setChitName(ChitName = e?.chitName)
                                                                setDateOfChit(dateOfChit = e?.startDate)
                                                                getSchemeDetailsGraph(e?.docEntry)
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
                                    })
                        }

                        <View style={{ height: height * 0.05 }} />

                    </ScrollView>
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                </View>

            </View>
            <FabButton marginBottom={Platform.OS === 'ios' ? height * 0.22 : 120} />
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        //backgroundColor: COLORS.BACKGROUND_O,
        height: height,
        // paddingBottom:100
    },
    column: {
        //flex: 1,
        height: height * 0.67,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 10
    },
    headerTiles: {
        flexDirection: 'row',
        padding: 10,
    },
    schemesTile: {
        flexDirection: 'column',
        borderWidth: 0.5,
        borderColor: COLORS.BACKGROUND_O,
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#fff'
    }
})