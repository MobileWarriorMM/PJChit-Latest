import actions from "./actions";
import { takeEvery, call, put, all } from 'redux-saga/effects';
import axois from 'react-native-axios'
import { useDispatch } from "react-redux";
import { API_URL } from '../../common_utils/constants'
import TestPing from '../../common_utils/pingTest'

const SchemeDetailsSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_SCHEME_DETAILS_BY_DOC_ENTRY, getShemeDetailsData),
        yield takeEvery(actions.GET_SCHEME_GRAPH, getGraphData),
    ])
}

const getShemeDetailsData = function* (data) {

    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: true } });
    const { payload } = data;
    var code = payload.DocEntry

    try {
        TestPing("www.google.com")

        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitCreation/MobileMyScheme/PayHistory/DocEntry/${code}`))
            
        if(res?.status === 200) {
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
            yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: false } });
            
            yield put({
                type: actions.SET_SCHEME_DETAILS_LIST_DATA,
                payload: { data: res?.data ?? [] }
            })
        } else{
            yield put({
                type: actions.SET_SCHEME_DETAILS_LIST_DATA,
                payload: { data: [] }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        }

    } catch (e) {
        yield put({
            type: actions.SET_SCHEME_DETAILS_LIST_DATA,
            payload: { data: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }
    
}

const getGraphData = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } });
    const { payload } = data;
    var code = payload.DocEntry

    try {
        
        const res = yield call(() =>
            axois.get(`${API_URL}PJjewels/Api/Chit/ChitCreation/MobileMyScheme/PayHistory/DocEntry/${code}`))
            
        if(res?.status === 200) {
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
            
            yield put({
                type: actions.SET_SCHEME_GRAPH,
                payload: { visible:true , data: res?.data ?? [] }
            })
        } else{
            yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: false } });
            yield put({
                type: actions.SET_SCHEME_GRAPH,
                payload:{ visible:false , data: [] }
            })
            yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
        }

    } catch (e) {
        yield put({ type: "SET_MYSCHEME_LOAD", payload: { load: false } });
        yield put({
            type: actions.SET_SCHEME_GRAPH,
            payload: { visible:false , data: [] }
        })
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } });
    }
}

export default SchemeDetailsSaga