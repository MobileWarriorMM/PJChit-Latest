import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Linking,
    TouchableHighlight,
    SafeAreaView
} from 'react-native'
import Tick from "../../assets/icons/tick.svg"
export default function CheckBox(props) {
    const { options, onChecked } = props
    const [SelectedVal, setSelectedVal] = useState(true)
    const handleCheck = () => {
        let Checked = !SelectedVal
        setSelectedVal(Checked)
        onChecked(Checked)
    }
    return (

        <TouchableHighlight
            style={{
                borderWidth: 2,
                height: 20,
                width: 20,
                backgroundColor: SelectedVal ? "black" : "white",
                borderColor: 'black',
                borderRadius: 5,
                paddingTop: 2.5,
                paddingLeft: 2.5
            }}
            underlayColor={"transparent"}
            onPress={handleCheck}
        >
            {SelectedVal ?
                <View
                >
                    <Tick />
                </View>
                :
                <View></View>
            }
        </TouchableHighlight>

    )
}