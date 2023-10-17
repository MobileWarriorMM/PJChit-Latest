import actions from "./action";
const initialState = {
    FaqList: []
}

const FAQReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_FAQ:
            return {
                ...state,
                FaqList:action.payload
            };
        default:
            return state;
    }
}

export default FAQReducer;