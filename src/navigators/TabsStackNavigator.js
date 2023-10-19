import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {ParcelsScreen} from '../screens/ParcelsScreen';
import {ServiceScreen} from '../screens/ServiceScreen';
import {FacilityScreen} from '../screens/FacilityScreen';
import {PollsScreen} from '../screens/PollsScreen';
import {IssueScreen} from '../screens/IssueScreen';
import { FeedsScreen } from '../screens/FeedsScreen';
import {NotificationScreen} from '../screens/NotificationScreen';
import {AdvertiseScreen} from '../screens/AdvertiseScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {isIos, isIphoneX, spacing} from '../constants/appStyles';

const Tab = createBottomTabNavigator();

export function TabsStackNavigator({navigation}) {
  console.log('isIphoneX()', isIphoneX());
  return (
    <Tab.Navigator
      style={styles.tabsWrap}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          size = 50;
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'layers' : 'layers-outline';
          }
          // else if (route.name === 'Issue') {
          //   size = 48;
          //   iconName = focused ? 'help-circle' : 'help-circle-outline';
          // }

          // You can return any component that you like here!
          if (route.name === 'Issue') {
            return (
              <Icon
                style={styles.middleTab}
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
          // else {
          //   return <Icon name={iconName} size={size} color={color} />;
          // }
        },
      })}
      tabBarOptions={{
        tabBarVisible: true,
        activeTintColor: '#000',
        inactiveTintColor: '#fff',
        showIcon: true,
        style: {
          // height: isIphoneX() ? 85 : 70,
          backgroundColor: '#EDB43C',
        },
        iconStyle:{
          height:70,
          width:70,
        },
        labelStyle: {
          fontSize: 12,
          // paddingTop: 50,
          // paddingBottom: isIos ? (isIphoneX() ? 15 : spacing(35)) : 10,
          // paddingBottom: 15,
          textTransform: 'uppercase',
        },

      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        onPress={() => navigation.navigate('Home')}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Icon name="home-outline" color={color} style={{fontSize: 30}}/>
          ),
        }}
      />

      <Tab.Screen
        name="Notification"
        style={styles.helpTab}
        options={{
          tabBarVisible: true,
          tabBarLabel: 'Notifications',
          tabBarIcon: ({tintColor}) => (
            <Image
              source={require('../../Image/icon.png')}
              style={styles.helpImage}
            />
          ),
        }}
        component={NotificationScreen}
        onPress={() => navigation.navigate('Notification')}
      />
      <Tab.Screen
        name="Feeds"
        onPress={() => navigation.navigate('Feeds')}
        component={FeedsScreen}
        options={{
          tabBarVisible: true,
          tabBarLabel: 'Message Board',
          tabBarIcon: ({color}) => (
            <Icon name="chatbox-ellipses-outline" color={color} style={{fontSize: 30}}/>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabsWrap: {
    position: 'relative',
  },
  helpImage: {
    position: 'absolute',
    bottom: 0,
    height: 55,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});
