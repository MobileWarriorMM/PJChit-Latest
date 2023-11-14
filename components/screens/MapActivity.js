import React from "react";
import { Dimensions, ImageBackground, Linking, Platform, Text, TouchableHighlight, View, StyleSheet } from "react-native";
import FONTS from "../common_utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';

const height = Dimensions.get('window').height

export default function MapActivity({ navigation }) {

  const { color } = useSelector((state) => state.ColorThemeReducer);
  const { locationData } = useSelector((state) => state.HomeScreenReducer);

  var lat = locationData.zoomLatitude
  var long = locationData.zoomLongitude

  var mainLat = locationData.branchList[0].latitude
  var mainLong = locationData.branchList[0].longitude

  var title = locationData.branchList[0].title
  var lable = locationData.branchList[0].label


  return (

    <View>
      <View style={{
        height: height,
        flexDirection: 'column'
      }}>

        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: parseFloat(mainLat),
            longitude: parseFloat(mainLong),
            latitudeDelta: parseFloat(lat),
            longitudeDelta: parseFloat(long),
          }}
        >
          {
            locationData.branchList.map((e, i) => {
              return (
                e.latitude!==""?
                <Marker
                  key={i} 
                  coordinate={{
                    latitude: parseFloat(e.latitude),
                    longitude: parseFloat(e.longitude),
                  }}
                  onDragEnd={
                    (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
                  }
                  title={e.label}
                  description={e.title}
                />:<></>
              )
            })
          }

        </MapView>

        <TouchableHighlight
          onPress={() => {
            navigation.goBack()
          }}
          underlayColor={'#ddd'}
          style={{
            height: height * 0.07,
            // width:'80%',
            paddingHorizontal: 10,
            backgroundColor: color.mainColor,
            marginVertical: 35,
            marginHorizontal: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 10,
            position: 'absolute',
            alignSelf: 'center',
            top: 25,
            right: -25
          }}
        >
          <IonIcon name="close-circle-sharp" size={30} color={color.secondaryColor} />
          {/* close-circle-sharp */}
        </TouchableHighlight>

      </View>
    </View>

  )

}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

