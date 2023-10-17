import actions from "./actions";

const initialState = {
   loader_visible: { visible: false },
   dialog_visible: {
      visible: false,
      msg: '',
      title: ''
   },
   poor_net_visible: { visible: false }
}

const LoaderReducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.LOADER_VISIBLE:
         return {
            ...state,
            loader_visible: {
               visible: action.payload.visible
            }
         }
      case actions.DIALOG_VISIBLE:
         return {
            ...state,
            dialog_visible: {
               visible: action.payload.visible,
               msg: action.payload.msg,
               title: action.payload.title
            }
         }
      case actions.SHOW_POOR_NET:
         return {
            ...state,
            poor_net_visible:{visible:action.payload.visible}
         }
      default:
         return state;
   }
}

export default LoaderReducer;