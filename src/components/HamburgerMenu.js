import React, {useContext} from 'react';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Context} from '../hooks/Store';

export function HamburgerMenu() {
  const [state, dispatch] = useContext(Context);
  const navigation = useNavigation();
  const {drawerOpen, submenuOpen} = state;
  console.log('HamburgerMenu state', state);

  const toggleDrawer = () => {
    if(submenuOpen){
      dispatch({type: 'CLOSE_SUB_MENU', close: Math.random()})
    } else {
      navigation.dispatch(DrawerActions.toggleDrawer())
    }
  }

  return (
    <Icon
      style={{marginLeft: 15}}
      name={drawerOpen ? 'arrow-back' : 'menu-sharp'}
      size={30}
      color="#000"
      onPress={toggleDrawer}
    />
  );
}
