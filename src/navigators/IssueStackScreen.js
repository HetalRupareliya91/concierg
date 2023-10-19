import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {IssueScreen} from '../screens/IssueScreen';

const IssueStack = createStackNavigator();

export function IssueStackScreen({navigation}) {
  return (
    <IssueStack.Navigator>
      <IssueStack.Screen
        name="Issue"
        component={IssueScreen}
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
    </IssueStack.Navigator>
  );
}
