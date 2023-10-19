import React from 'react';
import {ParcelsScreen} from '../screens/ParcelsScreen';
import {ServiceScreen} from '../screens/ServiceScreen';
import {FacilityScreen} from '../screens/FacilityScreen';
import {IssueScreen} from '../screens/IssueScreen';
import {PollsScreen} from '../screens/PollsScreen';
import {MessagesScreen} from '../screens/MessagesScreen';
import {VisitorsScreen} from '../screens/VisitorsScreen';
import {LoyaltyCardScreen} from '../screens/LoyaltyCardScreen';
import {EmergencyNumbersScreen} from '../screens/EmergencyNumbersScreen';
import {EmergencyMessagesScreen} from '../screens/EmergencyMessagesScreen';

import {TabsStackNavigator} from './TabsStackNavigator';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './DrawerContent';
import {ConciergeDetailsScreen} from '../screens/ConciergeDetailsScreen';
import { AboutApartmentScreen } from '../screens/AboutApartmentScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';

const Drawer = createDrawerNavigator();

console.log('Drawer', Drawer)

// const defaultGetStateForAction = Drawer.router.getStateForAction;

// Drawer.router.getStateForAction = (action, state) => {
//   console.log('createDrawerNavigator', action, state)
//     if(state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
//         StatusBar.setHidden(false);
//     }

//     if(state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerOpen') {
//         StatusBar.setHidden(true);
//     }


//     return defaultGetStateForAction(action, state);
// };

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
    	captureGestures={true}
      initialRouteName="Home"
      drawerStyle={{width: '100%', height: '100%'}}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={TabsStackNavigator} />
      
    </Drawer.Navigator>
  );
}
