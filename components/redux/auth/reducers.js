import actions from "./actions";

const initialState = {
  logged_in: 'false',
  forgetPasswordDetails: { Cellular: "", Password: "", Type: "" },
  loginInputDetails: { Cellular: "", Password: "" },
  userRegisterDetails: { UserName: "", Cellular: "", EmailID: "", UserDOB: "", AddressList: "" },
  Authentication: false,
  logDetails: {},
  userOTP: '',
  loginLoading: false
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGGED_IN:
      return {
        ...state,
        logged_in: action.payload
      };
    case actions.SET_FORGET_PASSWORD_DETAILS:
      return {
        ...state,
        forgetPasswordDetails: {
          Cellular: action.payload.Cellular,
          Password: action.payload.Password,
          Type: action.payload.Type
        }
      };
    case actions.SET_LOGIN_INPUT_DETAILS:
      return {
        ...state,
        loginInputDetails: {
          Cellular: action.payload.Cellular,
          Password: action.payload.Password,
        }
      };

    case actions.SET_USER_REGISTER_DETAILS:
      return {
        ...state,
        userRegisterDetails: {
          UserName: action.payload.UserName,
          Cellular: action.payload.Cellular,
          EmailID: action.payload.EmailID,
          UserDOB: action.payload.UserDOB,
          AddressList: action.payload.AddressList
        }
      }
    case actions.SET_LOGIN:
      return {
        ...state,
        Authentication: action.payload
      }
    case actions.SET_LOG_DETAILS:
      return {
        ...state,
        logDetails: action.payload
      }
    case actions.HANDLE_OTP:
      return {
        ...state,
        userOTP: action.payload
      }
    case actions.LOGIN_LOAD:
      return {
        ...state,
        loginLoading: action.payload
      }
    default:
      return state;
  }
};

export default AuthReducer;