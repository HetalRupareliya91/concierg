import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {ServiceScreen} from '../screens/ServiceScreen';

const ServicesStack = createStackNavigator();

export function ServiceStackScreen({navigation}) {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen
        name="Services"
        component={ServiceScreen}
        options={{
          title: '',
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
    </ServicesStack.Navigator>
  );
}
