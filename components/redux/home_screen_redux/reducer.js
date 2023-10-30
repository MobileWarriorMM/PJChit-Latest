import actions from "../home_screen_redux/actions";

const initialState = {
    todayGoldSilverRate: {
        silverPrice: '',
        goldPrice: '',
        updated: ''
    },
    getMobileNumberForScheme: {
        CardCode: ''
    },
    schemeListData: [],
    sliderListData: [],
    offersListData: [],
    newArraivalsListData: [],
    locationData: {},
    sliderListLoading: true,
    mySchemeIsLoading: false,
}

const HomeScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_GOLD_SILVER_RATE:
            return {
                ...state,
                todayGoldSilverRate: {
                    silverPrice: action.payload.silverPrice,
                    goldPrice: action.payload.goldPrice,
                    updated: action.payload.updated,
                },
            };
        case actions.GET_SCHEMES_DATA:
            return {
                ...state,
                getMobileNumberForScheme: {
                    CardCode: action.payload.CardCode
                }
            };
        case actions.SET_SCHEMES_DATA_LIST:
            return {
                ...state,
                schemeListData: action.payload.schemeListData
            };
        case actions.SET_SLIDER_LIST:
            return {
                ...state,
                sliderListData: action.payload.sliderListData
            };
        case actions.SET_OFFERS_LIST:
            return {
                ...state,
                offersListData: action.payload.data
            };
        case actions.SET_NEW_ARRIVALS_LIST:
            return {
                ...state,
                newArraivalsListData: action.payload.data
            };
        case actions.SET_LOCATION:
            return {
                ...state,
                locationData: action.payload.data
            };
        case actions.SET_SLIDER_LIST_LOADING:
            return {
                ...state,
                sliderListLoading: action.payload.sliderListLoading
            }
        case actions.SET_MYSCHEME_LOAD:
            return {
                ...state,
                mySchemeIsLoading: action.payload.load
            }
        default:
            return state;
    }
};
export default HomeScreenReducer;