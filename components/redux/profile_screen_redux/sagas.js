import { takeEvery, call, put, all } from 'redux-saga/effects';
import actions from '../profile_screen_redux/actions';
import { API_URL } from '../../common_utils/constants';
import axois from "react-native-axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderAction from '../../redux/loader_redux/actions'
import SnackBarUtil from '../../common_utils/SnackBarUtil';
import Snackbar from 'react-native-snackbar';
import TestPing from '../../common_utils/pingTest';
import DeviceInfo from 'react-native-device-info'
import FireMessage from '@react-native-firebase/messaging'

const ProfileSaga = function* () {
    yield all([
        yield takeEvery(actions.SET_PROFILE, getUsersDetails),
        yield takeEvery(actions.UPDATE_ADDRESS, updateTheAddress),
        yield takeEvery(actions.GET_STATE_BY_COUNTRY, getStateList),
        yield takeEvery(actions.GET_COUNTRY_LIST, getCountryList),
        yield takeEvery(actions.SET_PROFILE_PICTURE, getProfile),
        yield takeEvery(actions.SET_DOCENTRY_PICTURE, getProfileByDocEntry),
        yield takeEvery(actions.GET_ABOUT_US, getAboutUsData),
        yield takeEvery(actions.UPDATE_USER_DEVICE_DATA, updateFbTokenToApi),
    ]);
};

const getAboutUsData = function* (data) {
    yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/AboutUs/List`,
                { headers: { "Content-Type": "application/json" } }))

        if (res?.status == 200) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            yield put({
                type: actions.SET_ABOUT_US,
                payload: { data: res?.data }
            })
        } else {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
        }

    } catch (e) {
        yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
    }

}

const getCountryList = function* (data) {
    const { payload } = data
    yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/ArCountry/List/UserCode/${payload.userCode}`,
                { headers: { "Content-Type": "application/json" } }))

        if (res?.status === 200) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            yield put({ type: actions.SET_COUNTRY_LIST, payload: { data: res?.data } })
        } else {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
        }

    } catch (e) {
        yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
    }
}

const getStateList = function* (data) {

    const { payload } = data
    yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/ArState/List/UserCode/${payload.userCode}`,
                { headers: { "Content-Type": "application/json" } }))

        if (res?.status === 200) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            yield put({ type: actions.SET_STATE_BY_COUNTRY, payload: { data: res?.data } })
        } else {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
        }

    } catch (e) {
        yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
    }

}

const updateTheAddress = function* (data) {
    const { payload } = data;

    yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })

    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.put(`${API_URL}PJjewels/Api/Masters/BP/MobileAddressUpdate`,
                JSON.stringify(payload.data), { headers: { "Content-Type": "application/json" } }
            ))

        if (res?.status === 200) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            if (res?.data.statusCode === 200) {
                yield put({
                    type: 'SET_PROFILE',
                    payload: { cellular: payload.cellular }
                })
                payload.navigation.goBack()
            }
            yield put({
                type: LoaderAction.DIALOG_VISIBLE,
                payload: { visible: true, msg: res.data.message, title: 'Alert' }
            })
        } else {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            yield put({
                type: LoaderAction.DIALOG_VISIBLE,
                payload: { visible: true, msg: res.data.message, title: 'Alert' }
            })
        }

    } catch (e) {
        yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
    }

}


const updateFbTokenToApi = function* (data) {

    const { payload } = data;

    const res = yield call(() =>
        axois.put(`${API_URL}PJjewels/Api/Masters/BP/MobileDeviceDataUpdate`, payload))

    if (res.status == 200) {
    }

}


const getUsersDetails = function* (data) {
    const { payload } = data;
    const number = payload?.cellular.toString().trim();
    let token = ""
    let devId = ""

    AsyncStorage.getItem("fbTokId").then((tokId) => {
        token = tokId;
        devId = DeviceInfo.getDeviceId();
    }).catch(e => { 
        token = "null";
        devId = "device none";
    })

    const res = yield call(() =>
        axois.get(`${API_URL}PJjewels/Api/Masters/BP/CustomerData/Cellular/${number}`))

    if (res.status == 200) {
        // yield put({
        //     type:'HOME_REFRESH',
        //     payload:false
        // })
        yield put({
            type: "GET_SCHEMES_DATA",
            payload: { CardCode: res?.data.cardCode }
        })
        yield put({
            type: actions.GET_PROFILE, payload: res?.data
        });

        if (res?.data?.pnDeviceId !== token) {
            yield put({
                type: actions.UPDATE_USER_DEVICE_DATA, payload: {
                    "BPDocEntry": res?.data?.docEntry, //From CustomerData API
                    "DeviceId": devId,
                    "PNDeviceId": token
                }
            });
        }
    }
}


const getProfileByDocEntry = function* (data) {
    const { payload } = data;
    TestPing("www.google.com")
    const res = yield call(() =>
        axois.get(`${API_URL}PJjewels/Api/Admin/FileAttach/Profile/AbsEntry/${payload?.docEntry}/ObjType/${payload?.objType}`))
    yield put({
        type: actions.GET_DOCENTRY_PICTURE, payload: {
            objType: res?.data?.objType,
            docEntry: res?.data?.docEntry
        }
    });
}


const getProfile = function* (data) {
    const { payload } = data;
    yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: true } })
    try {

        let datalist = new FormData()
        datalist.append('Picture', {
            uri: payload?.picture?.uri,
            type: payload?.picture?.type,
            name: payload?.picture?.name,
        })
        datalist.append('CreatedBy', payload?.createdBy)

        datalist.append('ObjType', payload?.ObjType)

        datalist.append('AbsEntry', payload?.AbsEntry)
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.post(`${API_URL}PJjewels/Api/Admin/FileAttach/Save`, datalist,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            ))

        if (res?.data.statusCode === 200) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            // yield put({
            //     type: 'DIALOG_VISIBLE',
            //     payload: {
            //         visible: true,
            //         msg: "Profile Updated",
            //         title: "Alert"
            //     }
            // })
            // SnackBarUtil({ message: res?.data?.message, isError: false })
            setTimeout(() => {
                Snackbar.show({
                    text: res?.data?.message,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'green'
                })
            }, 300)

        } else if (res?.data.statusCode === 400) {
            yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
            // yield put({
            //     type: 'DIALOG_VISIBLE',
            //     payload: {
            //         visible: true,
            //         msg: res.data.message,
            //         title: "Alert"
            //     }
            // })
            // SnackBarUtil({ message: res?.data?.message, isError: false })

            setTimeout(() => {
                Snackbar.show({
                    text: res?.data?.messag,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'green'
                })
            }, 300)
        }

    } catch (e) {
        yield put({ type: LoaderAction.LOADER_VISIBLE, payload: { visible: false } })
        // yield put({
        //     type: 'DIALOG_VISIBLE',
        //     payload: {
        //         visible: true,
        //         msg: "Some Error Occurred",
        //         title: "Alert"
        //     }
        // })
        // SnackBarUtil({ message: res?.data?.message, isError: false })
        setTimeout(() => {
            Snackbar.show({
                text: res?.data?.messag,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'green'
            })
        }, 300)

    }

}

export default ProfileSaga
