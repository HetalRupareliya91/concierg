/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true;
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // this is NEVER CALLED on iOS
  console.log('Message handled in the background!', remoteMessage);
  // await displayNotification(remoteMessage.data);
});
AppRegistry.registerComponent(appName, () => App);
