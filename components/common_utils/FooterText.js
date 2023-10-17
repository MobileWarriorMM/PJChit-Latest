import { Text , StyleSheet , View , Dimensions} from "react-native";
import FONTS from "./fonts";
import { fontScaleOfDevice } from "./constants";

const {height , width} = Dimensions.get('window')

export default FooterText = ({isPositioned=true}) => {

    return (
        <View style={isPositioned?styles.mainView:styles.normalView} >
           <Text style={styles.preText}>Powered by <Text style={styles.backText}>AvaniKo</Text></Text>
        </View>
    )

}

const styles = StyleSheet.create({
    mainView:{
        position:'absolute',
        bottom:height*0.033,
        alignSelf:'center'
    },
    normalView:{
       alignSelf:'center',
       marginBottom:height*0.01
    },
    preText:{
        color:'#7b7b7c',
        fontFamily:FONTS.FONT_REGULAR,
        fontSize:height*0.016/fontScaleOfDevice
    },
    backText:{
        color:'#7b7b7b',
        fontFamily:FONTS.FONT_BOLD,
        fontSize:height*0.016/fontScaleOfDevice
    }
})