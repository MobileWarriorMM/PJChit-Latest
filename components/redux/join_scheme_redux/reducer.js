import actions from "./actions";

const initialState = {
    setActiveSchemeList: [],
    setSchemeDetailsList: [],
    getSchemeByDocEntry: {
        docEntry: ''
    },
    paymentData: {
        status: '',
        orderId: '',
        orderToken: ''
    },
    updateData: {
        payTotal: 0,
        docEntry: 0
    },
    schemesType: {
        data: []
    },
    schemesCatog: {
        data: []
    },
    chitItemGroup: {
        data: []
    }
}

const JoinSchemeReducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.SET_ACTIVE_SCHEMES_DATA:
            return {
                ...state,
                setActiveSchemeList: action.payload.data
            };
        case actions.SET_SCEHEME_DETAILS_DATA:
            return {
                ...state,
                setSchemeDetailsList: action.payload.data
            };
        case actions.HANDLE_THE_PAYMENT:
            return {
                ...state,
                paymentData: {
                    status: action.payload.status,
                    orderId: action.payload.orderId,
                    orderToken: action.payload.orderToken
                }
            };
        case actions.SET_DOC_AND_TOTAL:
            return {
                ...state,
                updateData: {
                    payTotal: action.payload.payTotal,
                    docEntry: action.payload.docEntry
                }
            };
        case actions.SET_SCHEME_TYPE:
            return {
                ...state,
                schemesType: {
                    data: action.payload.data
                }
            }
        case actions.SET_MM_YY:
            return {
                ...state,
                schemesCatog: {
                    data: action.payload.data
                }
            }
        case actions.SET_CHIT_ITEM_GROUP:
            return {
                ...state,
                chitItemGroup: {
                    data: action.payload.data
                }
            }
        default:
            return state;
    }

}

export default JoinSchemeReducer;