
// import 'react-native-gesture-handler';
import { BaseNavigationContainer, NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import LoginScreen from './components/screens/LoginScreen';
import PasswordRegister from './components/screens/PasswordRegister';
import RegisterScreen from './components/screens/UserRegitster';
import { Provider, useSelector } from 'react-redux';
import { store } from './components/redux/store';
import SplashScreen from './components/screens/SplashScreen';
import HomeScreen from './components/screens/HomeScreen';
import ProfileScreen from './components/screens/Profile/ProfileScreen';
import AboutusScreen from './components/screens/Profile/AboutusScreen';
import FAQScreen from './components/screens/Profile/FAQScreen';
import MySchemes from './components/screens/MyScheme';
import SchemeDetails from './components/screens/SchemeDetails';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './components/screens/CustomDrawer';
import COLORS from './components/common_utils/colors';
import VerifyPasswordOTP from './components/screens/VerifyPasswordOTP';
import Forgotpass from './components/screens/Forgotpass';
import ForgotVerify from './components/screens/ForgotVerify';
import ForgotNewPass from './components/screens/ForgotNewPass';
import JoinScheme from './components/screens/JoinScheme';
import Offers from './components/screens/Offers';
import NewArrivals from './components/screens/NewArrivals';
import ColorsScreen from './components/screens/ColorScreen';
import { View, Text, StatusBar, Modal, Image, Dimensions, Alert, ToastAndroid } from 'react-native';
import { useDispatch } from "react-redux";
import ThemedStatusBar from './components/common_utils/ThemedStatusBar';
import Loader from './components/common_utils/loader';
import ProfileAction from './components/redux/profile_screen_redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateAddress from './components/screens/Profile/UpdateAddress';
import ChangePassword from './components/screens/Profile/ChangePassword';
import HandlePayment from './components/payment_gateway/HandlePayment';
import { useNetInfo, NetInfo } from '@react-native-community/netinfo';
import FONTS from './components/common_utils/fonts';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import NoInternet from './components/common_utils/NoInternet';
import CatelogScreen from './components/screens/Catelog';
import NotificationScreen from './components/screens/Notifications';
import CustomAlert from './components/common_utils/CustomAlertDialogModal';
import MenuIcon from './assets/icons/menu.svg'
import FireMessage from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification';
import MapActivity from './components/screens/MapActivity';
import CatalogDetails from './components/screens/CatalogDetails';
import axios from 'react-native-axios'
import OrderDetails from './components/screens/OrderDetails';
import TermsAndCondtion from './components/screens/TermsAndConditions'
import PaymentWebView from './components/payment_gateway/PaymentWebView';
import Ping from 'react-native-ping'
import TestPing from './components/common_utils/pingTest';
import PoorInternetAlert from './components/common_utils/PoorIntrnetAlert';
import ImageView from './components/screens/ImageViewer';
import TransactionsList from './components/screens/TransactionList';
import DeviceInfo from 'react-native-device-info';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind, StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { Platform, Linking, AppState } from 'react-native';
import AppUpdateAlert from './components/common_utils/UpdateAlert';
import GraphModal from './components/common_utils/GraphModal';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// import connectionBandWidth from 'react-native-network-bandwith-speed'
//for ios
PushNotification.configure({
  onRegister: function (token) {

  },
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  channelId: '1',
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,

})

//android
PushNotification.createChannel({
  channelId: 'pj-chan-id-10',
  channelName: 'pj-chit',
  channelDescription: 'none',
  playSound: true,
  importance: 4,
  vibrate: true,
  soundName: 'default'
})


const inAppUpdates = new SpInAppUpdates(
  true // isDebug
);

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

//android:networkSecurityConfig="@xml/network_security_config"

const Mydrawertab = () => {

  const { color } = useSelector((state) => state.ColorThemeReducer);
  const { UserData } = useSelector(state => state.ProfileReducer)
  var [profileDoc, setProfileDoc] = useState()
  var [profileImgUrl, setProfileImgUrl] = useState("")
  var dispatch = useDispatch()

  useEffect(() => {
    AsyncStorage.getItem('current_phone').then((e) => {
      if (e != null) {
        dispatch({
          type: "SET_PROFILE",
          payload: { cellular: e }
        })
      }
    })
  }, [])



  // ios ....

  // const LocalNotification=()=>{
  //   PushNotificationIOS.presentLocalNotification({
  //     alertTitle:'Test Notification',
  //     alertBody:'Test...'

  //   })
  // }
  // useEffect(()=>{
  //   LocalNotification()
  // },[])

  // useEffect(() => {
  //     // if (Platform.OS !== 'ios' && !__DEV__) {
  //     //   return;
  //     // }
  //     PushNotificationIOS.addEventListener(
  //       'localNotification',
  //       onRemoteNotification,
  //     );
  //     return () => {
  //       PushNotificationIOS.removeEventListener('localNotification');
  //     };
  //   }, []);

  //    const onRemoteNotification = (notification) => {
  //     const isClicked = notification.getData().userInteraction === 1;

  //     if (isClicked) {
  //         console.log('ise clicked....',isClicked)
  //       // Navigate user to another screen
  //     } else {
  //       // Do something else with push notification
  //     }
  //     // Use the appropriate result based on what you needed to do for this notification
  //     const result = PushNotificationIOS.FetchResult.NoData;
  //     notification.finish(result);
  //   };





  return (
    <Drawer.Navigator initialRouteName="homeScreen"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          borderTopRightRadius: Platform.OS === 'ios' ? 0 : 20,
          borderBottomRightRadius: Platform.OS === 'ios' ? 0 : 20,
          backgroundColor: color.mainColor
        },
        // drawerStyle: { width: '70%', borderTopRightRadius: 20, borderBottomRightRadius: 20, backgroundColor: color.mainColor },
      }}
      backBehavior="history"
      drawerContent={
        (props) => {
          return (
            <CustomDrawer {...props} />
          )
        }
      }
    >
      {/* <Drawer.Screen name="home">
          {props => <MyTabs {...props} />}
        </Drawer.Screen> */}
      <Drawer.Screen
        name="homeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }} />

    </Drawer.Navigator>
  )
}


const App = () => {

  var netInfo = useNetInfo()
  var [appUpdateVisible, setAppUpdateVisible] = useState(false);
  var appState = useRef(AppState.currentState);

  const checkAppVersion = () => {
    inAppUpdates.checkNeedsUpdate({ curVersion: DeviceInfo.getVersion() }).then((val) => {
      if (val.shouldUpdate) {
        setAppUpdateVisible(appUpdateVisible = true)
      } else {
        setAppUpdateVisible(appUpdateVisible = false)
      }
    })
  }

  useEffect(() => {

    getFirebaseToken()

    //android
    FireMessage().setBackgroundMessageHandler(async remoteMsg => {
      //ToastAndroid.show(remoteMsg.notification.body, ToastAndroid.LONG)
    })

    const subscribe = FireMessage().onMessage(async remoteMsg => {
      //Alert.alert(remoteMsg.notification.title,remoteMsg.notification.body)

      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: remoteMsg.notification.title,
          alertBody: remoteMsg.notification.body
        })
      } else {
        PushNotification.localNotification({
          message: remoteMsg.notification.body,
          title: remoteMsg.notification.title,
          smallIcon: remoteMsg.notification?.android?.smallIcon,
          channelId: 'pj-chan-id-10',
          vibrate: true
        })
      }
    })

    //console.log("Active --> ",appState.current);

    const myAppState = AppState.addEventListener('change', state => {
      if (state === 'active') {
        appState.current = state;
        setAppUpdateVisible(false)
        checkAppVersion()
      }
    });

    return (() => {
      subscribe,
        myAppState.remove()
      //clearInterval(timer)
    });

    //

  }, [])

  const getFirebaseToken = async () => {
    const tok = await FireMessage().getToken();
    if (tok) {
      AsyncStorage.setItem("fbTokId", tok);
    }
  }


  return (
    <Provider store={store}>
      <ThemedStatusBar />
      <PoorInternetAlert />
      <GraphModal />
      <AppUpdateAlert visible={appUpdateVisible} />
      <NoInternet netInfo={netInfo} />
      <CustomAlert />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          <Stack.Screen
            options={{ headerShown: false }}
            name='Splash' component={SplashScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='Login' component={LoginScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='Register' component={RegisterScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='VerifyScreen' component={VerifyPasswordOTP} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='PasswordRegister' component={PasswordRegister} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='forgotpass' component={Forgotpass} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='forgotverify' component={ForgotVerify} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='forgotnewpass' component={ForgotNewPass} />

          <Stack.Screen options={{ headerShown: false }}
            name='Drawer'
            component={Mydrawertab} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='ProfileScreen' component={ProfileScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='OrderDetails' component={OrderDetails} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='AboutUs' component={AboutusScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='Terms' component={TermsAndCondtion} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='FAQScreen' component={FAQScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='myscheme' component={MySchemes} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='joinScheme' component={JoinScheme} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='offers' component={Offers} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='newArrivals' component={NewArrivals} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='schemedetails' component={SchemeDetails} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='VerifyPasswordOTP' component={VerifyPasswordOTP} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='ColorsScreen' component={ColorsScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='UpdateAddress' component={UpdateAddress} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='ChangePassword' component={ChangePassword} />
          <Stack.Screen
            options={{ headerShown: false }}
            name='ProfileUpdate' component={ChangePassword} />
          <Stack.Screen
            options={{ headerShown: false }}
            name='HandlePayment' component={HandlePayment} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='CatelogScreen' component={CatelogScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='CatelogDetailsScreen' component={CatalogDetails} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='NotificationScreen' component={NotificationScreen} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='MapScreen' component={MapActivity} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='PaymnetWebView' component={PaymentWebView} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='ImageView' component={ImageView} />

          <Stack.Screen
            options={{ headerShown: false }}
            name='TransactionList' component={TransactionsList} />

        </Stack.Navigator>
      </NavigationContainer>
      <Loader />

      {/* <Text style={{color:'white',padding:10,backgroundColor:'grey'}}>Your internet connection is slow...</Text> */}
    </Provider>
  )
}


export default App