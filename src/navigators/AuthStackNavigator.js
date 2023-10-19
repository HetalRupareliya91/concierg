import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {LoginScreen} from '../screens/LoginScreen';
import {RegistrationScreen} from '../screens/RegistrationScreen';
import {ForgotPasswordScreen} from '../screens/ForgotPasswordScreen';
import {ChangePasswordScreen} from '../screens/ChangePasswordScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { TermsConditionsScreen } from '../screens/TermsConditionsScreen';

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      mode={'modal'}
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name={'LoginStack'}>
        {() => (
          <LoginStack.Navigator
            mode={'card'}
            screenOptions={{
              headerShown: false,
            }}>
            <LoginStack.Screen name={'Login'} component={LoginScreen} />
          </LoginStack.Navigator>
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name={'Registration'} component={RegistrationScreen} />
      <AuthStack.Screen
        name={'ForgotPassword'}
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        name={'ChangePassword'}
        component={ChangePasswordScreen}
      />
      <AuthStack.Screen
        name={'PrivacyPolicyScreen'}
        component={PrivacyPolicyScreen}
      />
      <AuthStack.Screen
        name={'TermsConditionsScreen'}
        component={TermsConditionsScreen}
      />
    </AuthStack.Navigator>
  );
}
