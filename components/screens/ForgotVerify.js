import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, TouchableHighlight, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../common_utils/colors";
import FONTS from "../common_utils/fonts";
import UserIcon from '../../assets/icons/user.svg';
import ImageIcon from 'react-native-vector-icons/Ionicons';
import KeyboardWraper from "../common_utils/KeyboardWraper";
import EditIcon from 'react-native-vector-icons/EvilIcons';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default function ForgotVerify({ navigation }) {


    return (
      <KeyboardWraper>
          <SafeAreaView>
            <View style={{ backgroundColor: COLORS.BACKGROUND_O, height: height }}>
                <Image source={require('../../assets/images/Layer.png')} style={{ height: height * 0.17, width: width * 0.45 }} />


                {/* Main view */}
                <View style={styles.column}>
                    {/* circular */}
                    <View style={styles.circleAvatar}>
                        {/* <Icon name="user" size={45} color="white" style={styles.iconStyle} /> */}
                        <UserIcon />
                    </View>



                 <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} horizontal={false} >
                 <View style={{ justifyContent: 'space-between', height: height * 0.8 }}>
                        <View>
                            <Text style={{
                                color: 'black',
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 60,
                                alignSelf: 'center'
                            }}>Verify your mobile</Text>


                            <Text style={{ fontFamily: FONTS.FONT_REGULAR, color: 'grey', textAlign: 'center',paddingTop:10,fontSize:13,width:width*0.7,alignSelf:'center' }}>
                            We have sent the code verification
                            to your Mobile Number
                            </Text>

                        </View>
                           <View>
                           <View style={{backgroundColor:'#f2f2f2',height:130,width:130,borderRadius:100,alignSelf:'center',justifyContent:'center',marginBottom:20}}>
                                    <ImageIcon name="ios-images-outline" color={'black'} size={60} style={{alignSelf:'center'}}/>
                            </View>

                            <View style={{alignSelf:'center',flexDirection:'row'}}>
                                <Text style={{color:'black',fontFamily:FONTS.FONT_SEMIMODAL}}>0000007843</Text>
                                <TouchableHighlight style={{backgroundColor:'#cfcfd0',borderRadius:100,height:20,width:20,marginLeft:5,justifyContent:'center'}}>
                                    <EditIcon name="pencil" color={'black'} size={20}/>
                                </TouchableHighlight>
                            </View>
                           </View>

                            <View>
                                     {/* mobile number */}
                    <View style={{ ...styles.editTextBorder,}}>
                        <Text style={styles.placeHolderText}>Verification code <Text
                        style={{color:'red',fontSize:12}}> * </Text></Text>
                        <View style={styles.textRow}>
                            <MaterialIcon name="account-circle-outline" size={22} color="#c4903b" style={{
                                marginLeft: 10, marginRight: 10
                            }}/>
                          <TextInput
                          style={{color:'black',fontFamily:FONTS.FONT_REGULAR,width:width*0.6}}
                          keyboardType='number-pad'
                          numberOfLines={1}
                          placeholder="Enter verification code"
                          placeholderTextColor={"gray"} 
                          />
                        </View>
                    </View>
                            </View>

                        <View>
                         
                            {/* login btn */}
                            <TouchableHighlight
                                underlayColor={"#ddd"}
                                onPress={() => navigation.navigate('forgotnewpass')}
                                style={styles.loginBtn}>
                                <Text style={styles.loginBtnText}>VERIFY</Text>
                            </TouchableHighlight>

                            <View style={{ alignSelf: 'center' }}>

                                <Text style={{
                                    color: 'gray', fontSize: 11, fontFamily: FONTS.FONT_REGULAR
                                }}>Powered by <Text style={{
                                    color: 'gray', fontSize: 11.5, fontFamily: FONTS.FONT_BOLD
                                }}>Avaniko</Text></Text>
                            </View>
                        </View>
                    </View>

                 </ScrollView>
                </View>

            </View>


        </SafeAreaView>
      </KeyboardWraper>
    );

}

const styles = StyleSheet.create({
    circleAvatar: {
        height: 85,
        width: 85,
        backgroundColor: '#0e4dfb',
        borderRadius: 170 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: -40,
        borderColor: 'white',
        borderWidth: 5,
        justifyContent: 'center'
    },
    column: {
        height: height * 0.88,
        top: -height * 0.012,
        backgroundColor: 'white',
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        marginTop: 20
    },
    iconStyle: {
        alignSelf: "center",
    },
    editTextBorder: {
        borderWidth: 1,
        height: 50,
        borderRadius: 10,
        borderColor: '#C2C2C2',
        marginLeft: 20,
        marginRight: 20,
    },
    placeHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: 13,
        paddingLeft: 5,
        paddingRight: 5,
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: "Poppins-Regular"
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loginBtn: {
        height: 50,
        backgroundColor: COLORS.BACKGROUND_O,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 25,
        marginTop: 15,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        marginBottom: 20
    },
    loginBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
  
})