import { View, Dimensions, StyleSheet, Image } from "react-native";
// import ImageViewer from "react-native-image-zoom-viewer"
import ImageZoom from "react-native-image-pan-zoom";
import AppBar from "./Appbar";

var media = Dimensions.get('window');

const ImageView = ({ navigation, route }) => {

    return (
        <View style={styles.mainView}>
            <AppBar title={"IMAGE"}/>
            <ImageZoom cropWidth={media.width}
                cropHeight={media.height*0.9}
                imageWidth={media.width}
                imageHeight={media.height*0.9}>
                <Image style={{ width: media.width, height: media.height*0.88,resizeMode:'contain'}}
                    source={{ uri: route?.params?.uri }} />
            </ImageZoom>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        // height: media.height*0.9,
        width: media.width,
        backgroundColor:'#fff',
        flex:1
        
    }
});

export default ImageView;