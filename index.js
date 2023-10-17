/**
 * @format
 */

import {AppRegistry , LogBox} from 'react-native';
import App from './App';
import React,{useEffect} from 'react';
import {name as appName} from './app.json';
import FireMessage from '@react-native-firebase/messaging'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreLogs(['Require cycle']); // Ignore log notification by message
LogBox.ignoreAllLogs();

FireMessage().setBackgroundMessageHandler(async resMsg=>{
    
})

AppRegistry.registerComponent(appName, () => App);


// useEffect(() => {
//     if (Platform.OS !== 'ios' && !__DEV__) {
//       return;
//     }
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
