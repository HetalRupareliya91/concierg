import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {ParcelsScreen} from '../screens/ParcelsScreen';

const ParcelsStack = createStackNavigator();

export function ParcelsStackScreen({navigation}) {
  return (
    <ParcelsStack.Navigator>
      <ParcelsStack.Screen
        name="Parcels"
        component={ParcelsScreen}
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
    </ParcelsStack.Navigator>
  );
}
