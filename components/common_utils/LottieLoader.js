import React from "react";
import { View , ActivityIndicator,Text} from "react-native";
import COLORS from "../common_utils/colors";

export default function LottieLoader() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <View style={{
                width: 'auto', height: 'auto',
                borderRadius: 10, backgroundColor: 'white', padding: 15,
                flexDirection: 'column'
            }}>
                <ActivityIndicator
                    size={50}
                    color={COLORS.DARK_BLUE}
                />
                <Text style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: 'bold',
                    marginTop: 6
                }}>Please Wait...</Text>
            </View>
        </View>
    )
}