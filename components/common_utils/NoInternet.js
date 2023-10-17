import { View, Text, StatusBar, Modal, Image, Dimensions } from 'react-native';
import FONTS from './fonts';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function NoInternet({ netInfo }) {
    return (
        <Modal
            visible={netInfo.isConnected ? false : true}
            animationType="fade"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >

                <View
                    style={{
                        height: 'auto',
                        width: width - 50,
                        backgroundColor: 'white',
                        borderRadius: 23,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 15
                    }}
                >

                    <Text style={{
                        color: 'black',
                        fontFamily: FONTS.FONT_SEMIMODAL,
                        fontSize: 20,
                        marginBottom: 10
                    }}>You're offline</Text>

                    <MaterialIcon name='wifi-off' color={'red'} size={60} />

                    <Text style={{
                        color: 'red',
                        fontFamily: FONTS.FONT_SEMIMODAL,
                        fontSize: 14.5,
                        marginTop: 10
                    }}>No Internet Connection</Text>

                </View>
            </View>
        </Modal>
    )
}