import AuthReducer from "./auth/reducers";
import CommonReducer from "./Common/reducers";
import ColorThemeReducer from "./color_theme_redux/reducers";
import HomeScreenReducer from "./home_screen_redux/reducer";
import ProfileReducer from "./profile_screen_redux/reducer";
import LoaderReducer from "./loader_redux/reducer";
import FAQReducer from './Faq/reducer';
import SchemeDetailsReducer from "./scheme_details_redux/reducer";
import JoinSchemeReducer from "./join_scheme_redux/reducer";
import CatalogReducer from './Catalog/reducer';

const reducers = { 
    AuthReducer,
    CommonReducer,
    ColorThemeReducer,
    HomeScreenReducer,
    ProfileReducer,
    LoaderReducer,
    FAQReducer,
    SchemeDetailsReducer,
    JoinSchemeReducer,
    CatalogReducer,
};

export default reducers;