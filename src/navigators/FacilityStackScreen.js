import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {FacilityScreen} from '../screens/FacilityScreen';

const FacilityStack = createStackNavigator();

export function FacilityStackScreen({navigation}) {
  return (
    <FacilityStack.Navigator>
      <FacilityStack.Screen
        name="Facility"
        component={FacilityScreen}
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
    </FacilityStack.Navigator>
  );
}
