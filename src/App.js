import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {AuthStackNavigator} from './navigators/AuthStackNavigator';
import {lightTheme} from './themes/light';
import {AuthContext} from './contexts/AuthContext';
import {StackNavigator} from './navigators/StackNavigator';
import {useAuth} from './hooks/useAuth';
import {UserContext} from './contexts/UserContext';
import {SplashScreen as JsSplashScreen} from './screens/SplashScreen';
import {darkTheme} from './themes/dark';
import {ThemeContext} from './contexts/ThemeContext';
import {StatusBar} from 'react-native';
import Store from './hooks/Store';
import SplashScreen from 'react-native-splash-screen';

const RootStack = createStackNavigator();

export default function App() {
  const {auth, state} = useAuth();
  // const isDarkMode = useDarkMode();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const switchTheme = React.useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  function renderScreens() {
    if (state.loading) {
      return (
        <RootStack.Screen
          options={{headerShown: false}}
          name={'Splash'}
          component={JsSplashScreen}
        />
      );
    }
    return state.user ? (
      <RootStack.Screen name={'MainStack'} options={{title: ''}}>
        {() => (
          <UserContext.Provider value={state.user}>
            <StackNavigator />
          </UserContext.Provider>
        )}
      </RootStack.Screen>
    ) : (
      <RootStack.Screen
        name={'AuthStack'}
        component={AuthStackNavigator}
        options={{headerShown: false}}
      />
    );
  }

  return (
    <Store>
      <ThemeContext.Provider value={switchTheme}>
        <StatusBar
          backgroundColor="#EDB43C"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <AuthContext.Provider value={auth}>
          <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
            <RootStack.Navigator
              screenOptions={{
                headerShown: false,
                animationEnabled: true,
              }}>
              {renderScreens()}
            </RootStack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </Store>
  );
}
