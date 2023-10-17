import { all } from "redux-saga/effects";
import AuthSaga from "./auth/sagas";
import CommonSaga from "./Common/sagas";
import HomeScreenSaga from "./home_screen_redux/sagas";
import ProfileSaga from "./profile_screen_redux/sagas";
import FAQSaga from './Faq/sagas';
import SchemeDetailsSaga from "./scheme_details_redux/saga";
import JoinSchemeSaga from "./join_scheme_redux/sagas";
import CatalogSaga from './Catalog/sagas';

export default function* rootSaga() {
    yield all([
        AuthSaga(),
        CommonSaga(),
        HomeScreenSaga(),
        ProfileSaga(),
        FAQSaga(),
        SchemeDetailsSaga(),
        JoinSchemeSaga(),
        CatalogSaga(),
    ]);
};