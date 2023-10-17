import actions from "./actions";

const initialState = {
    color: { mainColor: '#5c0232', secondaryColor: '#ffffff', selectedIndex: 3 },
};

const ColorThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_COLOR:
            return {
                ...state,
                color: action.payload
            };

        default:
            return state;
    }
};

export default ColorThemeReducer;