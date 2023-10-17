import React, { useState } from "react";
import { useEffect , useRef } from "react";
import { Alert, Dimensions, TouchableHighlight, View ,Text, StatusBar} from "react-native";
import WebView from "react-native-webview";
import AppBar from "../screens/Appbar";
import COLORS from "../common_utils/colors";
import FONTS from "../common_utils/fonts";
import SnackBarUtil from "../common_utils/SnackBarUtil";

export default function PaymentWebView({ navigation, route }) {

    var url = route.params.paymentLink
    const webViewRef = useRef(null)
    var [canGoBack , setCanGoBack] = useState(false)

    
    const handleRes = (title) => {
        if(title === "CashFree - Thank you"){
            Alert.alert("Success","Payment done...!")
        }else if(title === "CashFree - Payment Failed"){
            navigation.goBack();
            SnackBarUtil({message:"Payment failed!",isError:true})
        }
        //CashFree - Payment Failed  CashFree - Thank you
    }

    return (
        <View style={{
            height: Dimensions.get('window').height,
            width:Dimensions.get('window').width,
        }}>
            <StatusBar backgroundColor={COLORS.BACKGROUND_V} />
            <View 
            style={{
                height:55,
                width:Dimensions.get('window').width,
                backgroundColor:COLORS.BACKGROUND_V,
                justifyContent:'center',
                paddingLeft:10,
            }}
            >
                <TouchableHighlight 
                onPress={()=>{
                    if(canGoBack){
                        webViewRef.current.goBack()
                    }else{
                        navigation.goBack()
                    }
                }}
                style={{
                    backgroundColor:'white',
                    width:100,
                    height:35,
                    justifyContent:'center',
                    borderRadius:10
                }}>
                    <Text style={{
                        color:COLORS.BACKGROUND_V,
                        fontFamily:FONTS.FONT_SEMIMODAL,
                        fontSize:18,
                        alignSelf:'center'
                    }}>Back</Text>
                </TouchableHighlight>
            </View>
            <WebView
                source={{ uri: url }}
                javaScriptEnabled
                ref={webViewRef}
                domStorageEnabled
                onNavigationStateChange={(state) => {
                    setCanGoBack(state.canGoBack)
                    handleRes(state.title)
                }}
            />
        </View>
    )

}