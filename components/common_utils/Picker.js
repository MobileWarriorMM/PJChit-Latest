import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableHighlight, Dimensions, ScrollView, Modal, Pressable, FlatList } from "react-native";
import ArrowIcon from 'react-native-vector-icons/SimpleLineIcons'
import COLORS from "./colors";
import FONTS from "./fonts";
import { useSelector } from "react-redux";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width
const fScale = Dimensions.get("window").fontScale;

export default function Picker(props) {

    const { data = [], value, onSelect, placeHolderText } = props
    var [show, setShow] = useState(false)
    var [selectedValue, setSelectedValue] = useState(value)

    const handleSelected = (val) => {
        setShow(!show)
        onSelect(val.value)
    }

    const { color } = useSelector((state) => state.ColorThemeReducer);

    var myColor = color.mainColor;
    var secColor = color.secondaryColor;

    return (

        <View>

            {/* <Modal 
            visible={show}
            transparent={true}
            animationType="slide"
            >

                <Pressable 
                onPress={()=>setShow(!show)}
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'rgba(9,9,9,0.4)', 
                }}>

                    <View style={{
                      maxHeight:Dimensions.get('window').height*0.4,
                      backgroundColor:'white',
                      width:Dimensions.get('window').width,
                      borderTopLeftRadius:20,
                      borderTopRightRadius:20,
                      flexDirection:'column'
                    }}>

                        <Text style={{
                          color:secColor.toLowerCase()==="white"||secColor.toLowerCase()==="#ffffff"?
                          myColor:secColor,
                          fontFamily:FONTS.FONT_SEMIMODAL,
                          fontSize:15.5,
                          alignSelf:'center',
                          marginTop:10,
                          marginBottom:10,
                        }}>{placeHolderText}</Text>
                        <ScrollView>
                            {
                                data.map((e,i)=>{
                                    return (
                                      <View key={i} style={{
                                        flexDirection:'column',
                                        paddingBottom:5,
                                        paddingTop:5
                                      }}>
                                        <TouchableHighlight 
                                        underlayColor={'transparent'}
                                        onPress={()=>{
                                          handleSelected(e)
                                        }}
                                        style={{
                                            padding:10
                                        }}>
                                            <Text style={{
                                               color:'black',
                                               fontFamily:FONTS.FONT_SEMIMODAL 
                                            }}>{e.label}</Text>
                                        </TouchableHighlight>
                                        <View style={{
                                            height:0.5,
                                            backgroundColor:'#ddd'
                                        }}/>
                                      </View>  
                                    )
                                })
                            }
                        </ScrollView>

                        <TouchableHighlight 
                        underlayColor={"transparent"}
                        onPress={()=>setShow(!show)}
                        style={{
                          height:40,
                          width:Dimensions.get('window').width - 100,
                          backgroundColor:myColor,
                          elevation:10,
                          borderRadius:20,
                          marginTop:10,
                          marginBottom:10,
                          alignSelf:'center',
                          alignItems:'center',
                          justifyContent:'center'
                        }}
                        >
                            <Text style={{
                               color:secColor,
                               fontFamily:FONTS.FONT_SEMIMODAL,
                               fontSize:15
                            }}>Close</Text>
                        </TouchableHighlight>

                    </View>

                </Pressable>

            </Modal> */}

            <View style={{
                height:'auto'
            }}>
                <View style={{
                    backgroundColor: 'white',
                    height: 50,
                    borderRadius: 13,
                    borderColor: '#C2C2C2',
                    borderWidth: 1,
                    justifyContent: 'center'
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            data.length !== 0 ?
                                setShow(!show) :
                                null
                        }}
                        underlayColor="transparent"
                    >
                        <View style={{
                            flexDirection: 'row',
                            padding: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: COLORS.DARK_BLUE,
                                fontFamily: FONTS.FONT_REGULAR,
                                fontSize:height*0.018/fScale
                            }}>{value === "" ? "Select" : value}</Text>
                            <ArrowIcon name="arrow-down" size={18} color={"black"}
                                style={{
                                    transform: [
                                        { rotate: show ? "180deg" : '0deg' }
                                    ]
                                }}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
                <Text style={styles.placeHolderText}>{placeHolderText}</Text>
            </View>
            {
                show ?
                    <View style={{
                        maxHeight: 150,
                        padding: 8,
                        //position:'absolute',
                        //bottom:10,
                        backgroundColor: 'white',
                        //zIndex: 150,
                        width: Dimensions.get('window').width - 40,
                        borderRadius: 8,
                        marginTop: 6,
                        borderWidth:1,
                        borderColor:myColor,
                        elevation:8
                    }}>
                        <ScrollView 
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled
                        >
                            {
                                data.map((e, i) => {
                                    return (
                                        <TouchableHighlight
                                        key={i}
                                        underlayColor="#ddd"
                                        onPress={()=>handleSelected(e)}
                                        >
                                            <Text key={i}
                                                style={
                                                    {color: 'black',
                                                        fontFamily: FONTS.FONT_REGULAR,
                                                        margin: 5,
                                                        backgroundColor:e.label===value?'#FAF6F6':'white',
                                                        fontSize:height*0.02/fScale
                                                    }}>{e.label}</Text>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </ScrollView>
                    </View> : null
            }
        </View>
    )

}

const styles = StyleSheet.create({
    placeHolderText: {
        color: '#a8a3a3',
        position: 'absolute',
        fontSize:height*0.018/fScale,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight:'bold',
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: FONTS.FONT_REGULAR
    }
})