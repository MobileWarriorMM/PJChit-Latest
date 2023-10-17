import { takeEvery, call, put, all } from 'redux-saga/effects';
import { API_URL } from '../../common_utils/constants';
import axois from "react-native-axios"
import SnackBarUtil from '../../common_utils/SnackBarUtil';
import { Alert } from 'react-native';
import commonActions from './actions';

const CommonSaga = function* () {
    yield all([
        // yield takeEvery(actions.GET_USER_DETAILS, getUsersDetails),
       
    ]);
};


// const getUsersDetails = function* (data) {
//     const { payload } = data;
// };

// const registerTheUser = function* (data) {
//     const { payload } = data
//     const password = payload.password
//     try {
//         const result = yield call(() => axois.post(`${API_URL}PJjewels/Api/Masters/BP/MobileSave`, {
//             "TransType": "M", //* - Default send "M"
//             "CardName": payload.UserData.UserName, //*Customer Name
//             "Cellular": payload.UserData.Cellular, //* //MobileNo
//             "Email": payload.UserData.EmailID, //* 
//             "DOB": payload.UserData.UserDOB,
//             "Password": password //* 
//         }));

//         console.log(result)

//         if (result.data.statusCode === 200) {
//             console.log(result)
//         }

//     } catch (e) {
//         console.log(e)
//     }

// }

// const getForgetPassword = function* (data) {
//     const { payload } = data;
//     try {

//         const result = yield call(() => axois.post(`${API_URL}PJjewels/Api/Masters/BP/UpdatePassword`, payload.Submitdata));

//         if (result.data.statusCode === 200) {
//             payload.navigation.navigate('Login')

//         } else {
//             SnackBarUtil({ message: result.data.message, isError: true })
//         }

//     } catch (err) {
//         SnackBarUtil({ message: "Some Error Accured", isError: true })
//     }

// };

// const getLogin = function* (data) {
//     const { payload } = data;
//     console.log(payload.Submitdata)
//     try {
//         const result = yield call(() => axois.post(`${API_URL}PJjewels/Api/Masters/BP/Validation`, payload.Submitdata));
//         console.log(result.data)
//         if (result.data.statusCode === 200) {
//             payload.navigation.navigate('Drawer')
//             yield put({ type: actions.SET_LOGIN, payload: true });
//             SnackBarUtil({ message: result.data.message, isError: false })
//         } else {
//             SnackBarUtil({ message: result.data.message, isError: true })
//             yield put({ type: actions.SET_LOGIN, payload: false });
//         }

//     } catch (err) {
//         SnackBarUtil({ message: "Some Error Accured", isError: true })
//     }

// };


export default CommonSaga;