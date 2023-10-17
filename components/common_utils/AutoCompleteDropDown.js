import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import MatiIcon from 'react-native-vector-icons/MaterialIcons';
import { fontScaleOfDevice } from './constants';
import FONTS from './fonts';
import { useState } from 'react';

const size = Dimensions.get('window');

export default AutoCompleteDropdown = ({
    value,
    onChange,
    placeHolderText,
    data,
    onValueSelected,
    clearBtnPressed,
    lable,
    displayField
}) => {
    var [showList , setShowList] = useState(false);
    return (
        <View>
            <View style={styles.textEditRow}>
                <Text style={styles.topPlaceHolderText}> {lable}<Text
                    style={{ color: 'red', fontSize: size.height * 0.02 / fontScaleOfDevice }}> * </Text></Text>
                <TextInput
                    placeholder={placeHolderText}
                    placeholderTextColor="gray"
                    value={value}
                    onChangeText={(val) => {
                        onChange(val);
                        if(val==="") {
                            setShowList(false)
                        }else {
                            setShowList(true)
                        }
                    }}
                    style={{
                        color: 'black',
                        fontFamily: FONTS.FONT_REGULAR,
                        flex: 1,
                        fontSize: size.height * 0.02 / fontScaleOfDevice
                    }}
                />
                {value !== "" ?
                    <TouchableOpacity onPress={() => {
                        Keyboard.dismiss()
                        setShowList(false)
                        clearBtnPressed()
                    }}>
                        <MatiIcon name='cancel' size={size.height * 0.028} style={{ marginLeft: 3 }} />
                    </TouchableOpacity> : <></>
                }
            </View>
            {showList && value.length > 2 ?
                <View style={styles.listView}>
                    <ScrollView keyboardShouldPersistTaps='handled' nestedScrollEnabled >
                        {
                            data.filter((e) => e[`${displayField}`]?.toLowerCase().includes(value.toLowerCase())).map((item, i) => {
                                return (
                                    <TouchableOpacity key={i} onPress={() => {
                                        Keyboard.dismiss()
                                        setShowList(false);
                                        onValueSelected(item)
                                    }}>
                                        <Text style={styles.listText}>{item[`${displayField}`]}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View> : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    textEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 5,
        height:52
    },
    listView: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        maxHeight: 160,
        elevation: 5,
        borderRadius: 10,
        marginTop: 5,
        borderWidth:Platform.OS==='ios'?1:0,
        borderColor:Platform.OS==='ios'?'grey':null
    },
    listText: {
        margin: 8,
        color: '#000',
        fontSize: size.height * 0.02 / fontScaleOfDevice,
        fontFamily: FONTS.FONT_REGULAR
    },
    topPlaceHolderText: {
        color: '#C2C2C2',
        position: 'absolute',
        fontSize: size.height * 0.02 / fontScaleOfDevice,
        paddingLeft: 5,
        paddingRight: 5,
        top: -11,
        left: 10,
        backgroundColor: '#ffffff',
        fontFamily: FONTS.FONT_REGULAR
    }
})