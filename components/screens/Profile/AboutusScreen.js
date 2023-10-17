import React from "react";
import { View, SafeAreaView, Text, StyleSheet, Dimensions, ScrollView, TouchableHighlight } from 'react-native';
import AppBar from "../Appbar";
import Person from 'react-native-vector-icons/Feather';
import COLORS from '../../common_utils/colors';
import FONTS from "../../common_utils/fonts";
import Bottomimg from '../../../assets/images/bottom-img.svg';
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from 'react-native-vector-icons/Ionicons';
import { useEffect } from "react";
import { fontScaleOfDevice } from "../../common_utils/constants";


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function AboutusScreen({ navigation }) {

  const { color } = useSelector((state) => state.ColorThemeReducer);
  const { aboutUsListData } = useSelector((state) => state.ProfileReducer);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: "GET_ABOUT_US" })
  }, [])

  return (
    <SafeAreaView>
      <AppBar navigation={navigation} title='ABOUT US' />
      <View style={{
        flexDirection: 'column',
        backgroundColor: color.mainColor,
        height: height,
        paddingBottom:Platform.OS==='ios'?height*0.1:0

      }}>
        <View>
          <View style={about.subcontainer}>
            {aboutUsListData.length===0?
            <Text style={{
              fontFamily:FONTS.FONT_BOLD,
              fontSize:Dimensions.get('window').width*0.045,
              color:'black',
              alignSelf:'center',
              marginTop:30
            }}>Poongulazhi Jewellers</Text>:
            <ScrollView showsVerticalScrollIndicator={false}>
              {
                aboutUsListData.map((e, i) => {
                  return (
                    <View key={i}
                      style={{
                        flexDirection: 'column'
                      }}
                    >
                      <Text style={about.heading}>{e.title}</Text>
                      {
                        e.paragraphs.map((f,j)=>{
                          return (
                            <Text key={j} style={about.content}>{f}</Text>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
            <View style={{height:height*0.05}}/>

            </ScrollView>}
            <Bottomimg style={{ alignSelf: 'center', top: 0, zIndex: -100, position: 'absolute', transform: [{ rotate: '180deg' }],}} />
            <Bottomimg style={{ alignSelf: 'center', bottom: -10, zIndex: -100, position: 'absolute' }} />
          </View>
        </View>
      </View>


    </SafeAreaView>
  )
}


const about = StyleSheet.create({
  subcontainer: {
    //flex: 1,
    height: height * 0.89,
    backgroundColor: 'white',
    flexDirection: 'column',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // padding: height*0.019,
    paddingVertical: height * 0.021,
    paddingHorizontal: 10,
    marginTop: height * 0.04,
    zIndex: 9,
    position: "relative",
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowRadius: 1,
    shadowOpacity: 1,
    elevation: 3,
    // paddingBottom:Platform.OS==='ios'?height*0.1:0
  },
  content: {
    color: 'black',
    fontSize: height*0.024/fontScaleOfDevice,
    marginTop: 16,
    fontFamily: FONTS.FONT_REGULAR
  },
  dot: {
    width: 11,
    height: 11,
    backgroundColor: '#faa702',
    borderRadius: 100,
    marginTop: 5,
    marginRight: 6
  },
  heading: {
    color: '#111563',
    fontSize:height*0.03/fontScaleOfDevice,
    marginTop: 10,
    fontFamily: FONTS.FONT_SEMIMODAL
  },
  textStyle: {
    color: 'black',
    fontSize:height*0.02/fontScaleOfDevice,
    fontFamily: FONTS.FONT_REGULAR,
    marginRight: 10
  }

})