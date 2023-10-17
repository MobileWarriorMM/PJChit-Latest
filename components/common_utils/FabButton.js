import React, { useEffect, useState } from "react";
import {
    View,
    Linking,
    TouchableHighlight
} from 'react-native'
import COLORS from "../common_utils/colors";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import SnackBarUtil from "./SnackBarUtil";

export default function FabButton (props) {

    const { UserData } = useSelector((state) => state.ProfileReducer);

    const {marginBottom}=props
    return (
        <View style={{
            position: 'absolute',
            height: 60,
            width: 60,
            borderRadius: 120 / 2,
            backgroundColor: '#25d366',
            bottom: 0,
            right: 0,
            marginRight: 15,
            marginBottom: marginBottom,
            elevation: 15,
            alignItems: "center",
            justifyContent: 'center'
        }}>
            <TouchableHighlight
                underlayColor={"transparent"}
                onPress={() => {
                    // try{
                    //     Linking.openURL(`whatsapp://send?text=hello&phone=+91${UserData?.companyCellular}`)
                    // }catch(e){
                    //     SnackBarUtil({message:"Whatsapp not found!",isError:true})
                    // }
                    let msg = "Hello Sir/Madam";
                    let phoneWithCountryCode = `91${UserData?.companyCellular}`;
                  
                    let mobile =
                      Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
                    if (mobile) {
                      if (msg) {
                        let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
                        Linking.openURL(url)
                          .then(data => {
                            
                          })
                          .catch(() => {
                            alert("Make sure WhatsApp installed on your device");
                          });
                      } else {
                        alert("Please insert message to send");
                      }
                    } else {
                      alert("Please insert mobile no");
                    }
                }}
            >
                <MaterialIcon name="whatsapp" color="#ffffff" size={35} />
            </TouchableHighlight>
        </View>
    )
}