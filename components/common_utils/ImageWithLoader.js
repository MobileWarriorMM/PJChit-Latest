import { ActivityIndicator, Image, Dimensions, View } from "react-native";
import { useState } from "react";
import COLORS from "./colors";
import axois from "react-native-axios";

const size = Dimensions.get('window')

export default ImageWithLoader = ({ uri, style }) => {

    var [load, setLoad] = useState(true);

    // axois.get(uri).then((e) => {
    //     if (e.status == 200) {
    //         setLoad(false)
    //     } else {
    //         setLoad(false)
    //     }
    // }).catch(e => setLoad(false))

    return (
        <View style={{justifyContent:'center'}}>
            <Image
                onLoadEnd={() => setLoad(false)}
                source={{ uri: uri }}
                style={style}
            />
            {load?
            <ActivityIndicator
                size={size.height * 0.06}
                style={{
                    position: 'absolute',
                    alignSelf:'center'
                }}
                color={COLORS.BACKGROUND_V}
            />:<></>}
        </View>
    )

}