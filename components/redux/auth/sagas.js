import { takeEvery, call, put, all, delay } from 'redux-saga/effects';
import actions from './actions';
import { API_URL } from '../../common_utils/constants';
import axois from "react-native-axios"
import SnackBarUtil from '../../common_utils/SnackBarUtil';
import LoaderActions from "../loader_redux/actions"
import { Alert, Keyboard, Platform } from 'react-native';
import action from '../../redux/profile_screen_redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profileCtion from '../profile_screen_redux/actions'
import TestPing from '../../common_utils/pingTest';

const AuthSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_USER_DETAILS, getUsersDetails),
        yield takeEvery(actions.GET_FORGET_PASSWORD, getForgetPassword),
        yield takeEvery(actions.USER_REGISRTATION, registerTheUser),
        yield takeEvery(actions.GET_LOGIN, getLogin),
        yield takeEvery(actions.SET_NEW_PASSWORD, getNewPassword),
        yield takeEvery(actions.SET_USER_REGISTER, userRegistration),
        yield takeEvery(actions.HANDLE_VALID_PHONENUMBER, handlePhoneNumber),
        yield takeEvery(actions.HANDLE_EXIST_VALID_PHONENUMBER, handleCheckExistUserNumber),
        yield takeEvery(actions.SET_HANDLE_OTP, handleOTP),
        yield takeEvery(actions.DELETE_USER_ACCOUNT, handleDeleteUserAccount),
    ]);
};


const getUsersDetails = function* (data) {
    const { payload } = data;
};

const registerTheUser = function* (data) {
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    const password = payload.password
    try {
        TestPing("www.google.com")
        const result = yield call(() =>
            axois.post(`${API_URL}PJjewels/Api/Masters/BP/MobileSave`,
                JSON.stringify({
                    "TransType": "M", //* - Default send "M"
                    "CardName": payload?.UserData?.UserName, //*Customer Name
                    "Cellular": payload?.UserData?.Cellular, //* //MobileNo
                    "Email": payload?.UserData?.EmailID, //* 
                    "DOB": payload?.UserData?.UserDOB,
                    "Password": password,//* 
                    "AddressList": payload?.UserData?.AddressList
                }),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
        );

        if (result.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            if (result?.data?.statusCode == 200) {
                AsyncStorage.setItem('is_login_skipped','no');
                yield put({
                    type: "HANDLE_OTP",
                    payload: ''
                })
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: result.data.message,
                        title: "Alert"
                    }
                })
                payload.navigation.goBack()
                payload.navigation.goBack()
                payload.navigation.goBack()
                //payload.navigation.replace('Login')
            } else if (result?.data?.statusCode == 400) {
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: result.data.message,
                        title: "Alert"
                    }
                })
            } else {
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: result.data.message,
                        title: "Alert"
                    }
                })
            }
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: "Error Occurred",
                    title: "Alert"
                }
            })
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
    }
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
}

const getNewPassword = function* (data) {
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data;
    try {
        TestPing("www.google.com")
        const result = yield call(() => axois.put(`${API_URL}PJjewels/Api/Masters/BP/UpdatePassword`,
            JSON.stringify(payload.Submitdata),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ));

        if (result.data.statusCode === 200) {
            SnackBarUtil({ message: result.data.message, isError: false })
            payload.navigation.goBack()
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: "Password Changed.",
                    title: "Alert"
                }
            })
        } else {
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: result?.data?.message,
                    title: "Alert"
                }
            })
            SnackBarUtil({ message: result.data.message, isError: true })
        }

    } catch (err) {
        SnackBarUtil({ message: "Some Error Accured", isError: true })
    }
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });

};

const getForgetPassword = function* (data) {
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload, } = data;
    try {
        TestPing("www.google.com")
        const result = yield call(() => axois.put(`${API_URL}PJjewels/Api/Masters/BP/UpdatePassword`,
            JSON.stringify(payload.Submitdata),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ));
        if (result.data.statusCode === 200) {
            yield put({
                type: "HANDLE_OTP",
                payload: ''
            })
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            //SnackBarUtil({ message: result.data.message, isError: false })
            if (Platform.OS === 'ios') {
                Alert.alert("Message", "Password Updated Successfully.")
            } else {
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: "Password Updated Successfully.",
                        title: "Alert"
                    }
                })
            }
            if (payload?.type === 'existUser') {
                AsyncStorage.setItem('current_phone', payload.Submitdata?.Cellular)
                AsyncStorage.setItem('current_pass', payload.Submitdata?.Password)
                AsyncStorage.setItem("log_state", "login")
                // payload.navigation.replace('Drawer')
                payload.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Drawer' }]
                })
            } else {
                payload.navigation.goBack()
                payload.navigation.goBack()
                payload.navigation.goBack()
            }
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            if (Platform.OS === 'ios') {
                Alert.alert("Message", result?.data?.message)
            } else {
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: result?.data?.message,
                        title: "Alert"
                    }
                })
            }
        }

    } catch (err) {
        SnackBarUtil({ message: "Some Error Accured", isError: true })
    }
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
};

const getLogin = function* (data) {
    //TestPing("https://www.google.com")
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data;
    //TestPing("https://www.google.com")
    try {
        TestPing("www.google.com")
        const result = yield call(() =>
            axois.post(`${API_URL}PJjewels/Api/Masters/BP/Validation`,
                JSON.stringify(payload.Submitdata),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ))
        if (result.status === 200 && result.data.statusCode === 200) {
            yield put({
                type: profileCtion.SET_PROFILE, payload: {
                    cellular: payload.Submitdata?.Cellular
                }
            });
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: actions.SET_LOGIN, payload: true });
            AsyncStorage.setItem('current_phone', payload.Submitdata?.Cellular)
            AsyncStorage.setItem('current_pass', payload.Submitdata?.Password)
            AsyncStorage.setItem("log_state", "login")
            AsyncStorage.setItem('is_login_skipped','no');
            payload.navigation.replace('Drawer')
        } else {
            console.log('Err... saga')
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg:result?.data?.message,
                    title: "Alert"
                }
            })
            yield put({ type: actions.SET_LOGIN, payload: false });
        }
        // delay(2000)
        // yield put({type:"SHOW_POOR_NET",payload:{visible:false}})

    } catch (err) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        return SnackBarUtil({ message: "Some Error Accured", isError: true })
    }
    // yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
};


const userRegistration = function* (data) {
    const { payload, navigation } = data;
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });

    try {
        TestPing("www.google.com")

        const response = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/BP/CustomerVerification/Cellular/${payload?.Cellular}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ))

        if (response.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            
            if (response?.data === false) {
                yield put({
                    type: "SET_USER_REGISTER_DETAILS", payload: {
                        UserName: payload?.UserName,
                        Cellular: payload?.Cellular,
                        EmailID: payload?.EmailID,
                        UserDOB: payload?.UserDOB,
                        AddressList: payload?.AddressList
                    }
                })
                Keyboard.dismiss()
                navigation.navigate('VerifyScreen', { type: "register", num: payload?.Cellular })
            } else {

                if (Platform.OS === 'ios') {
                    Alert.alert("Message", `Mobile Number (${payload?.Cellular}) Already Exists Please Login.`)
                } else {
                    yield put({
                        type: 'DIALOG_VISIBLE',
                        payload: {
                            visible: true,
                            msg: `Mobile Number (${payload?.Cellular}) Already Exists Please Login.`,
                            title: "Alert"
                        }
                    })
                }

            }
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: response?.data,
                    title: "Alert"
                }
            })
        }
    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
    }
};

const handlePhoneNumber = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } })

    const { payload } = data;
    try {

        const response = yield call(() => axois.get(`${API_URL}PJjewels/Api/Masters/BP/CustomerVerification/Cellular/${payload?.number}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ))

        if (response.status === 200) {
            yield put({ type: 'LOADER_VISIBLE', payload: { visible: false } })

            if (response?.data === false) {
                if (Platform.OS === 'ios') {
                    Alert.alert("Message", `No account was found with this number (${payload?.number})`)
                } else {
                    yield put({
                        type: "DIALOG_VISIBLE",
                        payload: {
                            visible: true,
                            msg: `No account was found with this number (${payload?.number})`,
                            title: "Alert"
                        }
                    })

                }

            } else {
                // handleDetails(num)
                var Number = payload?.number;
                var Type = payload?.type;
                yield put({
                    type: actions.SET_FORGET_PASSWORD_DETAILS, payload: {
                        Cellular: Number,
                        Password: "",
                        Type: (Type === 'existUser') ? "existUser" : "forget"
                    }
                });
                payload?.navigation.navigate('VerifyScreen', { type: (payload?.type === 'existUser') ? "existUser" : "forgot", num: payload?.number.trim() })
            }
        }
    } catch (e) {
        yield put({ type: 'LOADER_VISIBLE', payload: { visible: false } })
    }
}

const handleCheckExistUserNumber = function* (data) {

    const { payload } = data;
    yield put({ type: 'LOADER_VISIBLE', payload: { visible: true } })

    try {

        const response = yield call(() => axois.get(`${API_URL}PJjewels/Api/Masters/BP/CustomerVerification/ExistUser/Cellular/${payload.number}`));
        yield put({ type: 'LOADER_VISIBLE', payload: { visible: false } })
        if (response.status === 200) {

            if (response?.data?.statusCode === 200) {

                var Number = payload?.number;
                var Type = payload?.type;
                yield put({
                    type: actions.SET_FORGET_PASSWORD_DETAILS, payload: {
                        Cellular: Number,
                        Password: "",
                        Type: (Type === 'existUser') ? "existUser" : "forget"
                    }
                });
                payload?.navigation.navigate('VerifyScreen', { type: (payload?.type === 'existUser') ? "existUser" : "forgot", num: payload?.number.trim() })

            } else {

                if (Platform.OS === 'android') {

                    yield put({
                        type: "DIALOG_VISIBLE",
                        payload: {
                            visible: true,
                            msg: `${response?.data?.message}`,
                            title: "Alert"
                        }
                    })

                } else {
                    alert(`${response?.data?.message}`)
                }

            }

        }

    } catch (e) {
        yield put({ type: 'LOADER_VISIBLE', payload: { visible: false } })
    }

}

const handleOTP = function* (data) {

    const { payload } = data;
    try {
        TestPing("www.google.com")
        const res = yield call(() => axois.post(`${API_URL}PJjewels/Api/Admin/SMS/Send`,
            JSON.stringify({
                "MobileNo": payload?.phoneNum,
                "OTP": payload?.code,
                //added
                "ObjType": "C",
                "Type": payload?.apiType,
                "Code": payload?.apiCode,
            }),
            { headers: { 'Content-type': 'application/json' } }
        ))

        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })

        if (res.status === 200) {
            if (res?.data === true) {
                yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })


                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: "OTP Code Sent To " + payload?.phoneNum,
                        title: "Alert"
                    }
                })


                // setTimeout(() => {
                // dispatch({ type: "LOADER_VISIBLE", payload: { visible: true } })
                if (payload?.phoneNum === payload?.deviceNumber) {
                    // setEnterOtp(enteredOtp = code.toString())
                    yield put({
                        type: actions.HANDLE_OTP,
                        payload: payload?.code
                    })
                    if (payload?.type === "register") {

                        payload?.navigation.navigate("PasswordRegister")
                    } else {
                        // yield put({
                        //     type:"HANDLE_OTP",
                        //     payload:''
                        // })
                        payload?.navigation.navigate("forgotnewpass")
                    }
                    // dispatch({ type: "LOADER_VISIBLE", payload: { visible: false } })
                }
                // }, 3000)


            } else {
                yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: "Unable To Send OTP",
                        title: "Alert"
                    }
                })
            }
        } else {
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
            SnackBarUtil({ message: 'Something went wrong!', isError: true })
        }



    } catch (e) {
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
        SnackBarUtil({ message: 'Something went wrong!', isError: true })
    }
}

//handle user account delete
const handleDeleteUserAccount = function* (data) {

    const { payload } = data;

    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } })

    try {

        const resp = yield call(() => axois.delete(`${API_URL}PJjewels/Api/Masters/BP/Remove/${payload?.docEntry}`));

        if (resp?.status === 200) {
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })

            if (resp?.data?.statusCode === 200) {

                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: resp?.data?.message,
                        title: "Alert"
                    }
                })

                payload?.navigation?.reset({
                    index: 0,
                    routes: [{ name: 'Splash' }]
                })

                AsyncStorage.setItem("log_state", "logout");
                AsyncStorage.removeItem('current_phone');
                AsyncStorage.removeItem('current_pass');

            } else {

                yield put({
                    type: 'DIALOG_VISIBLE',
                    payload: {
                        visible: true,
                        msg: resp?.data?.message,
                        title: "Alert"
                    }
                })

            }

        } else {
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: 'Unable to delete account!',
                    title: "Alert"
                }
            })
        }

    } catch (e) {
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
        yield put({
            type: 'DIALOG_VISIBLE',
            payload: {
                visible: true,
                msg: 'Unable to delete account!',
                title: "Alert"
            }
        })
    }

}


export default AuthSaga;