import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableHighlight } from "react-native"
import COLORS from "../common_utils/colors";
import AppBar from "./Appbar";
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FONTS from "../common_utils/fonts";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/color_theme_redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BGsvg from '../../assets/images/bottom-img.svg'

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;


const ColorsScreen = ({ navigation }) => {

   //GLOBAL
   const { color } = useSelector((state) => state.ColorThemeReducer);
   const dispatch = useDispatch()
   const [data, setData] = useState([
      { color: "#ffffff", secColor: "#11144b", name: 'White Theme' },
      { color: "#c57e07", secColor: "white", name: "Gold Theme" },
      { color: "#11144b", secColor: "white", name: "Navy Blue Theme" },
      { color: "#5c0232", secColor: "white", name: "Lavandar Theme" },
      { color: "#1b2b51", secColor: "white", name: "Blue Theme" }
   ])
   const storeData = async (value) => {
      try {
         const jsonValue = JSON.stringify(value)
         await AsyncStorage.setItem('@saved_color', jsonValue)
      } catch (e) {
         // saving error
      }
   }


   return (
      <View style={styles.mainView}>
         <AppBar navigation={navigation} title={"THEMES"} />
         <View style={styles.column}>
            {data.map((val, ind) =>
               <View key={ind}>
                  <TouchableHighlight

                     onPress={() => {
                        dispatch({
                           type: actions.SET_COLOR,
                           payload: { mainColor: val.color, secondaryColor: val.secColor, selectedIndex: ind }
                        })
                        storeData({ mainColor: val.color, secondaryColor: val.secColor, selectedIndex: ind })
                     }}
                     underlayColor="#ddd"
                  >
                     <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10
                     }}>

                        <View style={{
                           flexDirection: 'row',
                           alignItems: 'center'
                        }}>
                           <View style={{
                              height: 40,
                              width: 40,
                              backgroundColor: val.color,
                              borderRadius: 80,
                              borderColor: 'gray',
                              borderWidth: 1
                           }} />
                           <Text style={
                              {
                                 color: 'black',
                                 fontFamily: FONTS.FONT_REGULAR,
                                 marginLeft: 5
                              }}>{val.name}</Text>
                        </View>
                        {
                           ind === color.selectedIndex ?
                              <MaterialComIcon name="check-circle-outline" size={25} color={"green"} /> :
                              null

                        }
                     </View>
                  </TouchableHighlight>
               </View>
            )}
            {/* {renderListItem("#ffffff", "White Theme", 0)}
            {renderListItem("#c57e07", "Gold Theme", 1)}
            {renderListItem("#11144b", "Navy Blue Theme", 2)}
            {renderListItem("#5c0232", "Lavandar Theme", 3)}
            {renderListItem("#1b2b51", "Blue Theme", 4)} */}
            <View style={{ position: "absolute", flex: 1, bottom: 0, transform: [{ rotate: '360deg' }], zIndex: -5, alignSelf: "center", alignItems: "center" }}>
               <View >
                  <BGsvg />
                  {/* <Ima source={require('../../assets/images/graphic.svg')} style={{}} /> */}
               </View>
            </View>
         </View>
      </View>
   )
}

export default ColorsScreen;

const styles = StyleSheet.create({
   mainView: {
      backgroundColor: COLORS.BACKGROUND_V,
      height: height,
      width: width,
      flexDirection: 'column'
   },
   column: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
   }
})