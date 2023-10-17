import React from "react";
import { useState } from "react";
import {
    View, Text, StyleSheet, TextInput, ScrollView,
    TouchableHighlight, Dimensions, Keyboard, ActivityIndicator, Platform
} from "react-native";
import FONTS from "./fonts";
import COLORS from "./colors";
import AntIcon from 'react-native-vector-icons/AntDesign'
import axois from "react-native-axios"
import { useDispatch } from "react-redux";
import { API_URL } from "./constants";
import { fontScaleOfDevice } from "./constants";

const height = Dimensions.get('window').height
const fScale = Dimensions.get("window").fontScale;

export default function AutoCompleteTextField(props) {

    const { 
        data, 
        hintText, 
        placeHolderText, 
        value, 
        inputType, 
        onSelected, 
        dis , 
        stateId , 
        defaultValue,
        onChanged
     } = props

    var [filteredList, setFilteredList] = useState([])
    var [selectedVal, setSelectedVal] = useState( selectedVal = value+"")
    const dispatch = useDispatch()
    var [showIndi, setShowIndi] = useState(false)


    handleSelection = (e) => {
        Keyboard.dismiss()
        setSelectedVal(e.display);
        setFilteredList(filteredList = [])
        onSelected(e.value);
    }

    valueChange = (e) => {
        //onChanged(e);
    }

    const getAreaSuggions = (e) => {
        //dispatch({ type: 'LOADER_VISIBLE', payload: { visible: true } })
        //https://pjapilive.avaniko.com/PJjewels/Api/Masters/ArDistrict/ZipCode/District/ALL/InputData/${e}

        if (e.length > 2) {
            setShowIndi(true)
            try {
                axois.post(`${API_URL}PJjewels/Api/Masters/ArDistrict/AreaZipCodeList`,
                    {
                        "StateId": stateId, //Must
                        "District": dis, //"ALL"(for null) / Selected-DisctrictName
                        "InputData": e //Area > 2 || ZipCode > 4
                    },{
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).
                    then((res) => {
                        //dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                        var dummyData = res?.data.map((e, i) => {
                            return (
                                { display: e.area, value: e }
                            )
                        })
                        setFilteredList(filteredList = dummyData)
                        setShowIndi(false)
                    }).catch((e) => {
                        setShowIndi(false)
                        //dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
                    })
            } catch (e) {
                setShowIndi(false)
                //dispatch({ type: 'LOADER_VISIBLE', payload: { visible: false } })
            }
        }

    }

    return (
        <View style={{ flexDirection: 'column' }}>
            <View
                style={{
                    height: 52,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 10,
                    marginVertical: 10,
                    marginHorizontal: 20,
                    paddingLeft: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text style={{
                    color: '#C2C2C2',
                    position: 'absolute',
                    fontSize: height * 0.02 / fontScaleOfDevice,
                    paddingLeft: 5,
                    paddingRight: 5,
                    top: -11,
                    left: 10,
                    backgroundColor: '#ffffff',
                    fontFamily: FONTS.FONT_REGULAR
                }}> {placeHolderText}<Text
                    style={{ color: 'red',fontSize:height*0.02/fScale   }}> * </Text></Text>
                <TextInput
                    keyboardType={inputType}
                    placeholder={hintText}
                    placeholderTextColor="gray"
                    numberOfLines={1}
                    defaultValue={value}
                    value={selectedVal}
                    //value={selectedVal==="null"?defaultValue:selectedVal}
                    onChangeText={(e) => {
                        //valueChange(e)
                        if (placeHolderText === "Area") {
                            if (e !== "") {
                                setSelectedVal(selectedVal = e)
                                getAreaSuggions(e)
                            }else{
                                setSelectedVal(selectedVal = e)
                            }
                        } else {
                            if (e !== "") {
                                setSelectedVal(selectedVal = e)
                                setFilteredList(filteredList = data.filter((e) => e.display.toString()
                                    .toLowerCase().includes(selectedVal.toLowerCase())))
                            } else {
                                setSelectedVal(selectedVal = e)
                                setFilteredList(filteredList = [])
                            }
                        }
                    }}
                    style={{
                        color: 'black',
                        fontFamily: FONTS.FONT_REGULAR,
                        flex: 1,
                        fontSize:height * 0.02 / fontScaleOfDevice
                    }}
                />
                {placeHolderText === "Area" &&
                    showIndi ? <ActivityIndicator size={20} color={'red'} /> : <></>}
                {
                    selectedVal !== "" ?
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={() => {
                                setSelectedVal(selectedVal = "")
                                setFilteredList(filteredList = [])
                                onSelected('')
                            }}
                        >
                            <AntIcon name="closecircle" size={15} color="gray" style={{
                                marginLeft: 10, marginRight: 10,
                            }} />
                        </TouchableHighlight> : <></>
                }
            </View>
            {
                filteredList.length !== 0 ?
                    <View style={{
                        maxHeight: 145,
                        backgroundColor: 'white',
                        width: "90%",
                        alignSelf: 'center',
                        position: Platform.OS==='ios'?null:'absolute',
                        top: Platform.OS==='ios'?null:Dimensions.get('window').height * 0.09,
                        zIndex: Platform.OS==='ios'?0:2,
                        borderRadius: 5,
                        elevation: 10,
                        borderWidth:Platform.OS==='ios'?1:0,
                        borderColor:Platform.OS==='ios'?'grey':null

                    }}>

                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            {
                                filteredList.map((e, i) => {
                                    return (
                                        <TouchableHighlight
                                            underlayColor={"transparent"}
                                            onPress={() => handleSelection(e)}
                                            key={i} >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    padding: 9,
                                                    fontSize: 16,
                                                    fontFamily: FONTS.FONT_REGULAR
                                                }}>{e.display}</Text>
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

})