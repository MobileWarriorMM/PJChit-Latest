import actions from '../profile_screen_redux/actions';

const initialState = {
    UserData: {},
    userMobileno: {
        cellular: ''
    },
    stateList: [],
    countryList: [],
    getProfileByDoc: {
        objType: '',
        docEntry: ''
    },
    aboutUsListData:[]
}

const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_PROFILE:
            return {
                ...state,
                UserData: action.payload
            };
        case actions.SET_PROFILE:
            return {
                ...state,
                userMobileno: {
                    cellular: action.payload
                }
            };
        case actions.SET_STATE_BY_COUNTRY:
            return {
                ...state,
                stateList: action.payload.data
            }
        case actions.SET_COUNTRY_LIST:
            return {
                ...state,
                countryList: action.payload.data
            }
        case actions.GET_DOCENTRY_PICTURE:
            return {
                ...state,
                getProfileByDoc: {
                    objType: action.payload.objType,
                    docEntry: action.payload.docEntry
                }
            }
            case actions.SET_ABOUT_US:
                return{
                    ...state,
                    aboutUsListData:action.payload.data
                }
        default:
            return state;
    }
}

export default ProfileReducer;