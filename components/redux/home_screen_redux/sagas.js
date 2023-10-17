import actions from "./actions";
import { takeEvery, call, put, all } from 'redux-saga/effects';
import axois from 'react-native-axios'
import { useDispatch } from "react-redux";
import { API_URL } from '../../common_utils/constants'
import AsyncStorage from "@react-native-async-storage/async-storage";
import TestPing from '../../common_utils/pingTest'

const HomeScreenSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_GOLD_SILVER_RATES, getGoldSilverTodayRate),
        yield takeEvery(actions.GET_SCHEMES_DATA, getShemeData),
        yield takeEvery(actions.GET_SLIDER_LIST, getSliderList),
        yield takeEvery(actions.GET_NEW_ARRIVALS_LIST, getNewArrivalList),
        yield takeEvery(actions.GET_OFFERS_LIST, getOffersList),
        yield takeEvery(actions.GET_LOCATION, getLocationData),
        //added
        yield takeEvery(actions.GET_INITIAL_HP_IMAGES, getInitialHPImages),
        yield takeEvery(actions.GET_INITIAL_NA_IMAGES, getInitialNAImages),
        yield takeEvery(actions.GET_INITIAL_OF_IMAGES, getInitialOFImages),
    ])
}

const getInitialHPImages = function* (data) {
    yield put({
        type: actions.SET_SLIDER_LIST_LOADING,
        payload: { sliderListLoading: true }
    })
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}/PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/HP`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_SLIDER_LIST,
                payload: { sliderListData: res?.data }
            })
            yield put({
                type: actions.SET_SLIDER_LIST_LOADING,
                payload: { sliderListLoading: false }
            })
        } else {
            yield put({
                type: actions.SET_SLIDER_LIST,
                payload: { sliderListData: [] }
            })
            yield put({
                type: actions.SET_SLIDER_LIST_LOADING,
                payload: { sliderListLoading: false }
            })
        }

    } catch (e) {
        yield put({
            type: actions.SET_SLIDER_LIST,
            payload: { sliderListData: [] }
        })
        yield put({
            type: actions.SET_SLIDER_LIST_LOADING,
            payload: { sliderListLoading: false }
        })
    }
}

const getInitialOFImages = function* (data) {
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/OF`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_OFFERS_LIST,
                payload: { data: res?.data }
            })
        } else {
            yield put({
                type: actions.SET_OFFERS_LIST,
                payload: { data: [] }
            })
        }
    } catch (e) {
        yield put({
            type: actions.SET_OFFERS_LIST,
            payload: { data: [] }
        })
    }
}

const getInitialNAImages = function* (data) {
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}/PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/NA`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_NEW_ARRIVALS_LIST,
                payload: { data: res?.data }
            })
        } else {
            yield put({
                type: actions.SET_NEW_ARRIVALS_LIST,
                payload: { data: [] }
            })
        }

    } catch (e) {
        yield put({
            type: actions.SET_NEW_ARRIVALS_LIST,
            payload: { data: [] }
        })
    }
}

const getLocationData = function* (data) {
    //yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    try {
        // TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Masters/Branch/MapLocations`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_LOCATION,
                payload: { data: res?.data }
            })

            // yield put({
            //     type:'HOME_REFRESH',
            //     payload:false
            // })
            //yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        } else {
            yield put({
                type: actions.SET_LOCATION,
                payload: { data: {} }
            })
            //yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        }

    } catch (e) {
        yield put({
            type: actions.SET_LOCATION,
            payload: { data: {} }
        })
        //yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }

}

const getOffersList = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/OF`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_OFFERS_LIST,
                payload: { data: res?.data }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        } else {
            yield put({
                type: actions.SET_OFFERS_LIST,
                payload: { data: [] }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        }

    } catch (e) {
        yield put({
            type: actions.SET_OFFERS_LIST,
            payload: { data: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }
}

const getNewArrivalList = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}/PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/NA`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_NEW_ARRIVALS_LIST,
                payload: { data: res?.data }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        } else {
            yield put({
                type: actions.SET_NEW_ARRIVALS_LIST,
                payload: { data: [] }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        }

    } catch (e) {
        yield put({
            type: actions.SET_NEW_ARRIVALS_LIST,
            payload: { data: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }

}

const getSliderList = function* (data) {

    yield put({
        type: actions.SET_SLIDER_LIST_LOADING,
        payload: { sliderListLoading: true }
    })
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}/PJjewels/Api/Chit/ChitMaster/AppImage/ActiveList/Type/HP`))

        if (res.status === 200) {
            yield put({
                type: actions.SET_SLIDER_LIST,
                payload: { sliderListData: res?.data }
            })
            yield put({
                type: actions.SET_SLIDER_LIST_LOADING,
                payload: { sliderListLoading: false }
            })
        } else {
            yield put({
                type: actions.SET_SLIDER_LIST,
                payload: { sliderListData: [] }
            })
            yield put({
                type: actions.SET_SLIDER_LIST_LOADING,
                payload: { sliderListLoading: false }
            })
        }

    } catch (e) {
        yield put({
            type: actions.SET_SLIDER_LIST,
            payload: { sliderListData: [] }
        })
        yield put({
            type: actions.SET_SLIDER_LIST_LOADING,
            payload: { sliderListLoading: false }
        })
    }

}

const getShemeData = function* (data) {
    const { payload } = data;
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: true } });
    //https://pjapilive.avaniko.com/PJjewels/Api/Admin/RateSetups/TodayList
    var code = payload.CardCode

    try {
        TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitCreation/MobileMyScheme/CardCode/NEW-${code}`))

        yield put({
            type: actions.SET_SCHEMES_DATA_LIST,
            payload: { schemeListData: res?.data }
        })

        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: false } });
        yield put({ type: "HOME_REFRESH", payload:  false });

    } catch (e) {
        yield put({
            type: actions.SET_SCHEMES_DATA_LIST,
            payload: { schemeListData: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: false } });
        yield put({ type: "HOME_REFRESH", payload:false });

    }
}


const getGoldSilverTodayRate = function* (data) {
    const { payload } = data;
    //https://pjapilive.avaniko.com/PJjewels/Api/Admin/RateSetups/TodayList
    // yield put({
    //     type:'HOME_REFRESH',
    //     payload:true
    // })
    try {
        //TestPing("www.google.com")
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Admin/RateSetups/TodayList`))

        if (res.status == 200) {
            // yield put({
            //     type:'HOME_REFRESH',
            //     payload:false
            // })
            let tempGoldPrice = ""
            let tempSilverPrice = ""
            res?.data.forEach(val => {
                if (val.displayRate === "GOLD") {
                    tempGoldPrice = val.price
                } else if (val.displayRate === "SILVER") {
                    tempSilverPrice = val.price
                }

            })
            yield put({
                type: actions.SET_GOLD_SILVER_RATE, payload: {
                    silverPrice: tempSilverPrice,
                    goldPrice: tempGoldPrice,
                    updated: "",
                }
            });
        }

    } catch (e) {

    }
}


export default HomeScreenSaga;