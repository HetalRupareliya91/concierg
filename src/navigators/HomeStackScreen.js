import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../screens/HomeScreen';
import {AdvertiseScreen} from '../screens/AdvertiseScreen';
import {MessagesScreen} from '../screens/MessagesScreen';

const HomeStack = createStackNavigator();

export function HomeStackScreen({navigation}) {
  return (
    <HomeStack.Navigator
      screenOptions={{
          // headerStyle: {
          //   backgroundColor: '#009387',
          // },
          // headerTintColor: '#fff',
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
        }
      }>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerLeft: () => (
            <Icon
              style={{marginLeft: 15}}
              name="ios-menu"
              size={35}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="Advertise"
        component={AdvertiseScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Message Board"
        component={MessagesScreen}
        options={{
          headerShown: true,
          title: 'Message Board',
          headerLeft: () => (
            <Icon
              style={{marginLeft: 15}}
              name="ios-menu"
              size={35}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}
