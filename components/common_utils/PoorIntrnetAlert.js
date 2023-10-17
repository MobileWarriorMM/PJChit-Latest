import { Modal, Pressable, View, Text } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useDispatch, useSelector } from "react-redux";
import FONTS from "./fonts";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState } from "react";

export default function PoorInternetAlert() {

  const { poor_net_visible } = useSelector((state) => state.LoaderReducer);

  var [visible, setVisible] = useState(poor_net_visible.visible)
  const dispatch = useDispatch()

  return (
    <Modal
      transparent={true}
      visible={poor_net_visible.visible}
      animationType="fade"
      onRequestClose={()=>{
        dispatch({
          type:"SHOW_POOR_NET",
          payload:{visible:false}
        })
      }}
      onStartShouldSetResponderCapture={() => {
        dispatch({
          type:"SHOW_POOR_NET",
          payload:{visible:false}
        })
      }}
    >

      <View
        style={{
          height: "8%",
          width: "80%",
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 20,
          borderRadius: 10,
          elevation: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon name="wifi-remove" color={'red'} size={30} />
        <Text style={{
          color: "black",
          fontFamily: FONTS.FONT_SEMIMODAL,
          alignSelf: 'center',
          fontSize: 16,
          marginLeft: 10
        }}>Poor internet connection...</Text>

      </View>

    </Modal>
  )

}