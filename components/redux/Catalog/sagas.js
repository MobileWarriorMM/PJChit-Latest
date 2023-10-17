import { takeEvery, call, put, all } from 'redux-saga/effects';
import { API_URL } from '../../common_utils/constants';
import axois from "react-native-axios";
import actions from './actions';
import TestPing from '../../common_utils/pingTest';


const CatalogSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_CATALOG, getCatalogList),
        yield takeEvery(actions.GET_CATALOG_TYPE, getCatalogDetaialsByType)

    ]);
};


const getCatalogList = function* (data) {
    yield put({ type: "LOADER_VISIBLE", payload: { visible: true } })
    const { payload } = data;
    TestPing("www.google.com")
    const res = yield call(() =>
        axois.get(`${API_URL}PJjewels/Api/Masters/ItemName/Catalog/List`))

    if (res.status == 200) {
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
        yield put({
            type: actions.SET_CATALOG,
            payload: res?.data
        });
    } else {
        yield put({ type: "LOADER_VISIBLE", payload: { visible: false } })
    }

}

const getCatalogDetaialsByType = function* (data) {
    const { payload } = data;
    TestPing("www.google.com")
    const res = yield call(() =>
        axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/Offers/ActiveList/Type/${payload?.docEntry}`))

    if (res.status == 200) {
        yield put({
            type: actions.SET_CATALOG_TYPE,
            payload: res?.data
        });
    } else {
    }
}

export default CatalogSaga
