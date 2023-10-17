import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Linking,
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    Pressable,
    Modal
} from 'react-native'
import { Dimensions } from "react-native";
import DownArrow from "../../assets/icons/down-arrow.svg"
import COLORS from "../common_utils/colors";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FONTS from "./fonts";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default function Select(props) {

    const { options, onTextChange, defaultValue } = props
    const [open, setOpen] = useState(false)
    const [SelectedVal, setSelectedVal] = useState({ label: defaultValue?.label, value: defaultValue?.value })
    const HandleSelect = (val, open) => {
        onTextChange(val.value)
        setSelectedVal(val)
        if (open) {
          setOpen(!open)
        }
    }

    // useEffect(() => {
    //     if (options.length !== 0) {
    //         HandleSelect(options[0], false)
    //     }
    // }, [options])
    return (
        <View style={{
            position: "relative",
            flexDirection: "column",
        }}>
            <TouchableHighlight
                underlayColor={"transparent"}
                onPress={() => setOpen(!open)}
            >
                <View
                    style={{
                        paddingHorizontal: width * 0.038,
                        paddingVertical: height * 0.016,
                        flexDirection: 'row',
                        justifyContent: "space-between"
                    }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: "#182b4d",
                            fontWeight:'bold',
                            fontFamily: FONTS.FONT_SEMIMODAL
                        }}
                    >
                        {SelectedVal.label ? SelectedVal.label : ''}
                    </Text>
                    <View style={{ padding: 2.5 }}>
                        <DownArrow />
                    </View>
                </View>
            </TouchableHighlight>

            <Modal
                visible={open}
                transparent={true}
                animationType="fade"
            >
                <Pressable style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#8080801f',
                }}
                    onPress={() => setOpen(!open)}
                >
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                        marginRight: 10,
                        padding: 10
                    }}
                    >
                        <ScrollView
                            style={{
                                overflow: 'scroll',
                                backgroundColor: "white",
                                marginTop: 5,
                                flexDirection: "column",
                                maxHeight: height * 0.3
                            }}
                        >
                            {options.length !== 0 ?
                                options.map((val, index) => {
                                    return (
                                        <View
                                            key={index}
                                        >
                                            <TouchableHighlight
                                                underlayColor={"#f2f2f2"}
                                                style={{
                                                    overflow: 'scroll',
                                                    borderBottomColor: "#8080801f",
                                                    borderBottomWidth: 1
                                                }}
                                                onPress={() => HandleSelect(val, true)}
                                            >
                                                <View style={{ paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: "space-between" }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            color: "black",
                                                            fontWeight:'bold',
                                                            fontFamily: FONTS.FONT_REGULAR
                                                        }}
                                                    >
                                                        {val.label}
                                                    </Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })
                                :
                                <View style={{
                                    alignSelf:"center"
                                }}>
                                    <Text style={{
                                        fontSize:17,
                                        fontWeight:'bold'
                                    }}>No Options</Text>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

        </View>
    )
}


