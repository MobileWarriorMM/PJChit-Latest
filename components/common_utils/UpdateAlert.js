import { View, Modal, Dimensions, Text, StyleSheet } from 'react-native';
import FONTS from './fonts';
import { TouchableHighlight } from 'react-native';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { useState } from 'react';

let media = Dimensions.get('window')

const AppUpdateAlert = ({ visible }) => {

    //var [view , setView] = useState(visible);
    
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
        >

            <View style={styles.mainView}>

                <View style={styles.subView}>

                    <Text style={styles.title}>Update Available!</Text>
                    <Text style={styles.msg}>There is a new version of the app</Text>
                    <TouchableHighlight
                        onPress={() => {
                            //setView(!view);
                            if (Platform.OS === 'android') {
                                Linking.openURL("market://details?id=com.pjchit");
                                //Linking.openURL("itms-apps://apps.apple.com/id/app/halojasa/id1492671277?l=id");
                            } else {
                                Linking.openURL("itms-apps://apps.apple.com/id/app/halojasa/id1492671277?l=id");
                            }
                        }}
                        style={styles.updateBtn}>
                        <Text style={styles.updateTxt}>Update Now</Text>
                    </TouchableHighlight>

                </View>

            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    subView: {
        width: "80%",
        backgroundColor: '#fff',
        borderRadius: 20,
        flexDirection: 'column',
        padding: 17
    },
    title: {
        color: "#000",
        fontSize: media.height * 0.025,
        fontFamily: FONTS.FONT_SEMIMODAL,
    },
    msg: {
        color: "#000",
        fontSize: media.height * 0.02,
        fontFamily: FONTS.FONT_REGULAR,
        marginTop: "2%",
    },
    updateBtn: {
        height: 45,
        width: "80%",
        marginHorizontal: 20,
        backgroundColor: 'green',
        marginTop: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    updateTxt: {
        color: '#fff',
        fontFamily: FONTS.FONT_MEDIUM,
        fontSize: media.height * 0.017
    }
})

export default AppUpdateAlert;