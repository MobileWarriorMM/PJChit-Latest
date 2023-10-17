import { StatusBar, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React,{ useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemedStatusBar = () => {
    const dispatch = useDispatch()
    const { color } = useSelector((state) => state.ColorThemeReducer);

    var myColor = color.mainColor;
    var secColor = color.secondaryColor;
    useEffect(() => {
        AsyncStorage.getItem('@saved_color').then(res => {
            if (res !== null) {
                dispatch({
                    type: ColorAction.SET_COLOR,
                    payload: JSON.parse(res)
                })
            } else {
            }
        })
            .catch(err => {});
    }, [])

    return (
        <StatusBar
            backgroundColor={myColor}
            animated
            barStyle={color.selectedIndex === 0 ? "dark-content" : 'light-content'}
        />
    );

}

export default ThemedStatusBar;