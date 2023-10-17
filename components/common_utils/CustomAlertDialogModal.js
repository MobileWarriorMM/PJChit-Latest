import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, TouchableHighlight, Dimensions, Platform, Animated, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FONTS from "./fonts";
import MateriaIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fontScaleOfDevice } from "./constants";
// import { useRef } from "react";
// import FontFive from 'react-native-vector-icons/FontAwesome5';
// import SnackBarUtil from "./SnackBarUtil";
// import Snackbar from "react-native-snackbar";

const height = Dimensions.get('window').height
const size = Dimensions.get('window')

export default function CustomAlert() {

  const { dialog_visible } = useSelector((state) => state.LoaderReducer);
  const { color } = useSelector((state) => state.ColorThemeReducer);
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);

  // console.log('Value ', dialog_visible?.visible)

  useEffect(() => {
    //console.log('Use eff... loader')
    if (dialog_visible?.visible) {
      setShow(true);
      if (Platform.OS === 'ios') {
        Alert.alert('Alert', `${dialog_visible?.msg}`, [
          {
            text: 'OKAY',
            onPress: () => {
              dispatch({
                type: 'DIALOG_VISIBLE',
                payload: {
                  visible: false,
                  msg: "",
                  title: ""
                }
              })
            }
          }
        ])
      }
    } else {
      setShow(false);
    };
  }, [dialog_visible])


  return (
    <View>
      {
        Platform.OS === 'android' ?
          <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              dispatch({
                type: 'DIALOG_VISIBLE',
                payload: {
                  visible: false,
                  msg: "",
                  title: ""
                }
              })
            }}
          >

            <Pressable
              onPress={() => {
                dispatch({
                  type: 'DIALOG_VISIBLE',
                  payload: {
                    visible: false,
                    msg: "",
                    title: ""
                  }
                })
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>

              <View>
                <View style={{
                  backgroundColor: 'white',
                  flexDirection: 'column',
                  //height: Dimensions.get('window').height * 0.2,
                  width: Dimensions.get('window').width - 90,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 15
                }}>

                  <Text style={{
                    color: 'black',
                    fontFamily: FONTS.FONT_REGULAR,
                    fontSize: height * 0.022 / fontScaleOfDevice,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    paddingTop: 20
                  }}>{dialog_visible.msg}</Text>

                  <TouchableHighlight
                    underlayColor={'#ddd'}
                    onPress={() => {
                      dispatch({
                        type: 'DIALOG_VISIBLE',
                        payload: {
                          visible: false,
                          msg: "",
                          title: ""
                        }
                      })
                    }}
                    style={{
                      backgroundColor: color.mainColor,
                      width: '65%',
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 10,
                      marginTop: 20,
                      paddingVertical: 6
                    }}>
                    <Text style={{
                      color: color.secondaryColor,
                      fontFamily: FONTS.FONT_BOLD,
                      fontSize: height * 0.022 / fontScaleOfDevice,
                    }}>OK</Text>
                  </TouchableHighlight>

                </View>
                <View
                  style={{
                    height: 50, width: 50,
                    position: 'absolute',
                    top: -27,
                    borderRadius: 90,
                    alignSelf: 'center',
                    elevation: 10,
                    backgroundColor: color.mainColor,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <MateriaIcon
                    name="alert-circle"
                    color={color.secondaryColor}
                    size={45}
                  />
                </View>
              </View>

            </Pressable>

          </Modal> : <></>
      }
    </View>
  )


}