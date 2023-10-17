import React from "react";
import { View, Text, Image, Dimensions, ImageBackground } from 'react-native';

let { width, heigth } = Dimensions.get('window')

export default function SplashScreen({ navigation }) {

    setTimeout(() => {
        navigation.replace('Login')
    }, 3000);

    return (
        // <SafeAreaView>
        //    <View style={{width:width,height:'100%',alignSelf:'center',
        //    justifyContent:'center',alignContent:'center',alignItems:'center'}}>
        //   {/* <Text style={{color:'white',fontFamily:'Poppins-Regular',fontSize:28}}>
        //   Poongulazhi Jewellers
        //     </Text> */}
        //     <Image source={require('../../assets/images/splash-light.png')} style={{height:heigth,width:width}}/>

        //     </View>
        // </SafeAreaView>

        <View>
            <ImageBackground source={require('../../assets/images/splash-light.png')}
                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                <Image
                    source={require('../../assets/images/logopjcropped.jpg')}
                    resizeMode='contain'
                    //resizeMethod='resize'
                    style={{
                        height: 100, width: 100,
                        borderRadius: 200,
                        borderWidth: 2,
                        backgroundColor: '#5c0232',
                        borderColor: '#c4903b'
                    }}
                />

            </ImageBackground>
        </View>
    )
}
