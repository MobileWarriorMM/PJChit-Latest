import actions from "./actions";

const initstate = {
    theSchemeDataByDocEntry: {
        DocEntry: ""
    },
    schemeDetailsData: [],
    graphData: {
        visible: false,
        data: []
    },
}

const SchemeDetailsReducer = (state = initstate, action) => {
    switch (action.type) {
        case actions.GET_SCHEME_DETAILS_BY_DOC_ENTRY:
            return {
                ...state,
                theSchemeDataByDocEntry: {
                    DocEntry: action.payload.DocEntry
                }
            };
        case actions.SET_SCHEME_DETAILS_LIST_DATA:
            return {
                ...state,
                schemeDetailsData: action.payload.data
            };
        case actions.GET_SCHEME_GRAPH:
            return {
                ...state,
                theSchemeDataByDocEntry: {
                    DocEntry: action.payload.DocEntry
                }
            };
        case actions.SET_SCHEME_GRAPH:
            return {
                ...state,
                graphData: {
                    visible:action.payload.visible,
                    data:action.payload.data,
                }
            };
        default:
            return state;
    }
}

export default SchemeDetailsReducer;