import React from "react";
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions, Platform } from "react-native";


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default function KeyboardWraper({ children }) {
    return (
        <KeyboardAvoidingView enabled style={{ flex: 1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
            <ScrollView showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}