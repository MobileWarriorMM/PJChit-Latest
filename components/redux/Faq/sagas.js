import { takeEvery, call, put, all } from 'redux-saga/effects';
import actions from './action';
import { API_URL } from '../../common_utils/constants';
import axois from "react-native-axios"
import TestPing from "../../common_utils/pingTest"

    
const FAQSaga = function* () {
    yield all([
        yield takeEvery(actions.GET_FAQ, getFAQList),
    ]);
};


const getFAQList = function* (data) {
    const { payload } = data;
    TestPing("www.google.com")
    const res = yield call(() =>
    axois.get(`${API_URL}PJjewels/Api/Chit/ChitMaster/FAQs/List`))

if (res.status == 200) {
    yield put({
        type: actions.SET_FAQ,
         payload:res?.data
    });
}
}

export default FAQSaga
