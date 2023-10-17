import { useEffect, useState } from "react";
import { View, Text, Modal, Pressable, ActivityIndicator, Dimensions, Platform } from "react-native";
import FONTS from "./fonts";
import { useDispatch, useSelector } from "react-redux";
import { fontScaleOfDevice } from '../common_utils/constants'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function Loader() {

  const { loader_visible } = useSelector((state) => state.LoaderReducer);
  const dispatch = useDispatch()
  var [show, setShow] = useState(false)

  useEffect(() => {
    setShow(loader_visible?.visible);
  }, [loader_visible])

  //console.log('Loading...', show)

  if (Platform.OS === 'ios') {
    return (
      <>
        {loader_visible?.visible === true ?
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center'
          }}>

            <View style={{
              height: height * 0.1,
              backgroundColor: 'white',
              width: width * 0.7,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              alignSelf: 'center'
            }}>

              <ActivityIndicator
                size={45}
                color="rgba(167, 43, 99, 1)"
              />

              <Text
                style={{
                  color: 'black',
                  fontSize: height * 0.022 / fontScaleOfDevice,
                  fontFamily: FONTS.FONT_SEMIMODAL,
                  marginLeft: 10
                }}>Please Wait...</Text>

            </View>

          </View> : <></>
        }
      </>
    )
  }

  return (
    <Modal
      visible={show}
      onRequestClose={() => {
        dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
      }}
      transparent={true}
      animationType="fade"
    >

      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(9,9,9,0.5)',
        }}>

        <View style={{
          height: height * 0.1,
          backgroundColor: 'white',
          width: width * 0.7,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10
        }}>

          <ActivityIndicator
            size={45}
            color="rgba(167, 43, 99, 1)"
          />

          <Text
            style={{
              color: 'black',
              fontSize: height * 0.022 / fontScaleOfDevice,
              fontFamily: FONTS.FONT_SEMIMODAL,
              marginLeft: 10
            }}>Please Wait...</Text>

        </View>

      </Pressable>

    </Modal>
  )
}