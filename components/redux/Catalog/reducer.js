import actions from './actions';
const initialState = {
    Catalog: [],
    Catalog_type:[],
}

const CatalogReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_CATALOG:
            return {
                ...state,
                Catalog:action.payload
            };
            case actions.GET_CATALOG_TYPE:
                return {
                    ...state,
                    Catalog_type:action.payload
                };
        default:
            return state;
    }
}

export default CatalogReducer;