import actions from "./actions";
import { takeEvery, call, put, all } from 'redux-saga/effects';
import axois from 'react-native-axios'
import LoaderActions from '../loader_redux/actions'
import SnackBarUtil from "../../common_utils/SnackBarUtil";
import { Alert } from "react-native";
import HomeActions from "../home_screen_redux/actions";
import TestPing from "../../common_utils/pingTest";
import { API_URL } from "../../common_utils/constants";

const JoinSchemeSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_ACTIVE_SCHEMES_LIST, getActiveSchemesList),
        yield takeEvery(actions.GET_SCHEME_DETAOLS_BY_DOC_ENTRY, getSchemeDetails),
        yield takeEvery(actions.SAVE_THE_SCHEME, saveTheScheme),
        yield takeEvery(actions.UPDATE_THE_SCHEME, updateTheScheme),
        yield takeEvery(actions.GET_SCHEME_TYPE, getSchemeType),
        yield takeEvery(actions.GET_MM_YY, getSchemeCategory),
        yield takeEvery(actions.GET_CHIT_ITEM_GROUP, getChitItemGroup),
        // yield takeEvery(actions.HANDLE_ORDER, handleOrder),
    ])
}

const getChitItemGroup = function* (data) {

    //https://pjapilive.avaniko.com/PJjewels/Api/Masters/SubMasters/List/Type/ChitType

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/SubMasters/List/Type/ChitItemGroup`))

        if (res?.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: actions.SET_CHIT_ITEM_GROUP, payload: { data: res?.data } })
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        SnackBarUtil({ message: 'Error', isError: true })
    }

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });

}

const getSchemeCategory = function* (data) {

    //https://pjapilive.avaniko.com/PJjewels/Api/Masters/SubMasters/List/Type/ChitType

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/SubMasters/List/Type/ChitCategory`))

        if (res?.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: actions.SET_MM_YY, payload: { data: res?.data } })
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        SnackBarUtil({ message: 'Error', isError: true })
    }

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });

}

const getSchemeType = function* (data) {

    //https://pjapilive.avaniko.com/PJjewels/Api/Masters/SubMasters/List/Type/ChitType

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/SubMasters/List/Type/ChitType`))

        if (res?.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: actions.SET_SCHEME_TYPE, payload: { data: res?.data } })
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        SnackBarUtil({ message: 'Error', isError: true })
    }

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });

}

const updateTheScheme = function* (data) {
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.put(`${API_URL}PJjewels/Api/Chit/ChitCreation/Update`,
                JSON.stringify(payload.data), { headers: { "Content-Type": "application/json" } }))

        if (res?.status === 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: HomeActions.GET_SCHEMES_DATA, payload: { CardCode: payload.CardCode } })
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: res.data.message,
                    title: "Alert"
                }
            })
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: "Failed To Update The Scheme",
                    title: "Alert"
                }
            })
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
        SnackBarUtil({ message: 'Error', isError: true })
    }

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
}

const saveTheScheme = function* (data) {

    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: true } });
    const { payload } = data
    
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.post(`${API_URL}PJjewels/Api/Chit/ChitCreation/Save`,
                JSON.stringify(payload.data), { headers: { "Content-Type": "application/json" } }))

        if (res?.data?.statusCode == 200) {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({ type: HomeActions.GET_SCHEMES_DATA, payload: { CardCode: payload.CardCode } })
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: res.data.message,
                    title: "Alert"
                }
            })
        } else {
            yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
            yield put({
                type: 'DIALOG_VISIBLE',
                payload: {
                    visible: true,
                    msg: "Failed To Join Scheme!",
                    title: "Alert"
                }
            })
        }

    } catch (e) {
        yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
    }
    yield put({ type: LoaderActions.LOADER_VISIBLE, payload: { visible: false } });
}

const getSchemeDetails = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    const { payload } = data

    var docEntry = payload.docEntry

    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/MobileJoinData/DocEntry/${docEntry}`))

        if (res?.status == 200) {
            yield put({
                type: actions.SET_SCEHEME_DETAILS_DATA,
                payload: { data: res?.data }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        } else {

            yield put({
                type: actions.SET_SCEHEME_DETAILS_DATA,
                payload: { data: [] }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });

        }



    } catch (e) {
        yield put({
            type: actions.SET_SCEHEME_DETAILS_DATA,
            payload: { data: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }
}

const getActiveSchemesList = function* () {
    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/ActiveList`))

        yield put({
            type: actions.SET_ACTIVE_SCHEMES_DATA,
            payload: { data: res?.data }
        })

    } catch (e) {
        yield put({
            type: actions.SET_ACTIVE_SCHEMES_DATA,
            payload: { data: [] }
        })
    }
}

export default JoinSchemeSaga;