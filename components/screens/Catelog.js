import React, { useCallback, useEffect, useState } from "react";
import {
    View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, TouchableHighlight,
    RefreshControl
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "./Appbar";
import actions from '../redux/Catalog/actions';
import COLORS from "../common_utils/colors";
import Arrow from 'react-native-vector-icons/Entypo';
import FONTS from "../common_utils/fonts";
import BGsvg from '../../assets/images/bottom-img.svg'
import { fontScaleOfDevice } from '../common_utils/constants'

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export default function CatelogScreen({ navigation }) {
    const dispatch = useDispatch();
    const { Catalog } = useSelector((state) => state.CatalogReducer);
    var [currentIndex, setCurrentIndex] = useState(null)

    useEffect(() => {
        dispatch({
            type: actions.GET_CATALOG,
        })
    }, [])

    const { color } = useSelector((state) => state.ColorThemeReducer);


    var [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch({
            type: actions.GET_CATALOG,
        })
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    return (
        <SafeAreaView>

            <AppBar navigation={navigation} title={'CATELOGS'} />

            <View style={{ backgroundColor: color.mainColor, height: height, }}>

                <View style={styles.subcontainer}>
                    {
                        Catalog?.length === 0 ?
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{
                                    color: 'black', fontFamily: FONTS.FONT_BOLD, alignSelf: 'center', fontSize: 20,
                                    marginBottom: 55
                                }}>No data found!</Text>
                            </View>
                            :
                            
                                <ScrollView
                                 refreshControl={
                                    <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    />
                                 }
                                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

                                    <View style={{ paddingHorizontal: 20, paddingVertical: 20, marginBottom: 20 }}>
                                        {
                                            Catalog?.map((item, index) => (
                                                <View key={index}>
                                                    <TouchableHighlight underlayColor={'transparent'} style={{ marginVertical: 5, padding: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}
                                                        onPress={() =>
                                                            setCurrentIndex(index === currentIndex ? null : index)
                                                        }>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontFamily: FONTS.FONT_SEMIMODAL,
                                                                fontSize:height*0.02/fontScaleOfDevice
                                                            }}>{item?.name}</Text>
                                                            {
                                                                (index === currentIndex) ?
                                                                    <Arrow name='chevron-up' size={20} color={'black'} /> : <Arrow name='chevron-down' size={20} color={'black'} />
                                                            }

                                                        </View>
                                                    </TouchableHighlight>

                                                    {
                                                        index === currentIndex ?

                                                            item?.category?.map((e, index) => (
                                                                <View key={index}>
                                                                    <TouchableHighlight underlayColor={'transparent'}
                                                                        onPress={() => {
                                                                            navigation.navigate('CatelogDetailsScreen', { docEntry: e?.type, name: e?.name })
                                                                        }}
                                                                    >
                                                                        <View style={{ marginVertical: 5 }}>
                                                                            <Text style={{ fontFamily: FONTS.FONT_REGULAR, color: 'grey', paddingHorizontal: 10,fontSize:height*0.02/fontScaleOfDevice }}>{e?.name}</Text>
                                                                            <View style={{ height: 1, color: '#ddd', backgroundColor: '#ddd', marginVertical: 5 }} />
                                                                        </View>
                                                                    </TouchableHighlight>
                                                                </View>

                                                            ))

                                                            : <View />
                                                    }
                                                </View>
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                    }
                    <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
                        <View >
                            <BGsvg />
                            {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
                        </View>
                    </View>
                </View>
            </View>

            <View style={{height:height*0.05}}/>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        height: height,
        // paddingBottom:Platform.OS==='ios'?80:0
    },
    subcontainer: {
        width: width,
        height: height * 0.9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 35,
    },
})  