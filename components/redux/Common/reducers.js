import commonActions from "./actions";

const initialState = {
  alertBar: 'fasle',
  currentRouteName: "",
  HomeRefresh:false
};

const CommonReducer = (state = initialState, action) => {
  switch (action.type) {
    case commonActions.SET_COMMON_ALERTBAR:
      return {
        ...state,
        alertBar: action.payload
      };
    case commonActions.SET_CURRENT_ROUTE_NAME:
      return {
        ...state,
        currentRouteName: action.payload
      };
      case commonActions.HOME_REFRESH:
        return {
          ...state,
          HomeRefresh: action.payload
        };


    default:
      return state;
  }
};

export default CommonReducer;