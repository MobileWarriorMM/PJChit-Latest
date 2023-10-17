import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { View, TextInput, StyleSheet, Keyboard , Dimensions} from "react-native";
import FONTS from "./fonts";
import {fontScaleOfDevice} from '../common_utils/constants'

const height = Dimensions.get('window').height

export default function OTPTextField(props) {

    const {onChange , value} = props

    var mainValue = value;

    var [valOne , setValOne] = useState("")
    var [valTwo , setValTwo] = useState("")
    var [valThree , setValThree] = useState("")
    var [valFour , setValFour] = useState("")

    const onChangedText = () =>{
      var lastValue = valOne+valTwo+valThree+valFour;  
      onChange(lastValue.toString())
    }

    var keyOne = useRef().current
    var keyTwo = useRef().current
    var keyThree = useRef().current
    var keyFour = useRef().current

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            <View style={styles.borderVieStyle}>
                <TextInput
                    maxLength={1}
                    caretHidden={false}
                    value={mainValue[0]}
                    keyboardType="phone-pad"
                    ref={(input) => { keyOne = input; }}
                    style={styles.TextFieldStyle}
                    onChangeText={(e) => {
                        if (e.length === 1) {
                            setValOne(valOne = e)
                            onChangedText()
                            keyTwo.focus()
                        }else if(e.length==0){
                            setValOne(valOne = e)
                            mainValue[0] = "";
                            onChangedText()
                            //Keyboard.dismiss()
                        }
                    }}
                />
            </View>
            <View style={styles.borderVieStyle}>
                <TextInput
                    maxLength={1}
                    caretHidden={false}
                    value={mainValue[1]}
                    keyboardType="phone-pad"
                    ref={(input) => { keyTwo = input; }}
                    onChangeText={(e) => {
                        if (e.length === 1) {
                            setValTwo(valTwo = e)
                            onChangedText()
                            keyThree.focus()
                        }else if(e.length==0){
                            setValTwo(valTwo = e)
                            mainValue[1] = "";
                            onChangedText()
                            keyOne.focus()
                        }
                    }}
                    style={styles.TextFieldStyle}
                />
            </View>
            <View style={styles.borderVieStyle}>
                <TextInput
                    maxLength={1}
                    caretHidden={false}
                    value={mainValue[2]}
                    keyboardType="phone-pad"
                    ref={(input) => { keyThree = input; }}
                    onChangeText={(e) => {
                        if (e.length === 1) {
                            setValThree(valThree = e)
                            onChangedText()
                            keyFour.focus()
                        }else if(e.length==0){
                            mainValue[2] = "";
                            setValThree(valThree = e)
                            onChangedText()
                            keyTwo.focus()
                        }
                    }}
                    style={styles.TextFieldStyle}
                />
            </View>
            <View style={styles.borderVieStyle}>
                <TextInput
                    maxLength={1}
                    caretHidden={false}
                    keyboardType="phone-pad"
                    value={mainValue[3]}
                    ref={(input) => { keyFour = input; }}
                    style={styles.TextFieldStyle}
                    onChangeText={(e) => {
                        if (e.length === 1) {
                            setValFour(valFour = e)
                            onChangedText()
                            Keyboard.dismiss()
                        }else if(e.length==0){
                            setValFour(valFour = e)
                            mainValue[3] = "";
                            onChangedText()
                            keyThree.focus()
                        }
                    }}
                />
            </View>

        </View>
    )

}

const styles = StyleSheet.create({

    borderVieStyle: {
        width: 55,
        height: 55,
        borderWidth: 2,
        borderColor: '#b5b5b5',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        margin: 8,
        paddingLeft:5
    },
    TextFieldStyle: {
        color: 'black',
        fontFamily: FONTS.FONT_SEMIMODAL,
        fontSize:height * 0.025 / fontScaleOfDevice,
    }

})