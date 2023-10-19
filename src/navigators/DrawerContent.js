import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { fontSize, spacing } from '../constants/appStyles';
import MainMenu from '../components/DrawerContent/MainMenu';
import SubMenu from '../components/DrawerContent/SubMenu';
import { DrawerActions } from '@react-navigation/native';
import { Context } from '../hooks/Store';
import { useEffect } from 'react';
import SecureStorage from 'react-native-secure-storage';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import messaging from '@react-native-firebase/messaging';
import { BASE_URL } from '../config';
export function DrawerContent(props) {
  const [subMenu, setSubmenu] = useState(null);
  const { token } = React.useContext(UserContext);
  const [state, dispatch] = useContext(Context);
  const drawerOpen = useIsDrawerOpen();
  const closeSubmenu = state.closeSubmenu;
  const { logout } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    dispatch({ type: 'DRAWER_STATE', open: drawerOpen });
  }, [drawerOpen]);

  useEffect(() => {
    dispatch({ type: 'DRAWER_SUB_MENU', open: subMenu });
  }, [subMenu]);

  useEffect(() => {
    if (closeSubmenu) {
      setSubmenu(null);
    }
  }, [closeSubmenu]);

  const redirect = (to, params = {}) => {
    dispatch({ type: 'DRAWER_STATE', payload: Math.random() });
    props.navigation.navigate(to, params);
    setSubmenu(null);
    props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  const userLogout = () => {
    
    setLoading(true)
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        axios
          .post(
            `${BASE_URL}/logout`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            // await messaging().deleteToken();
            logout()
          })
          .catch(function (error) {
            setLoading(false);
          });
      }
    });
  }


  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: fontSize(24),
            // fontFamily: 'Lobster-Regular',
          }}>
          {subMenu ? subMenu.menu : 'Explore Aptly'}
        </Text>
        <View style={styles.drawerContent}>
          <View style={styles.drawerSection}>
            {subMenu ? (
              <SubMenu
                redirect={redirect}
                data={subMenu}
                resetSubmenu={() => setSubmenu(null)}
                navigation={props.navigation}
              />
            ) : (
              <MainMenu
                redirect={redirect}
                showSubMenu={setSubmenu}
                navigation={props.navigation}
              />
            )}
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => redirect('Home')} style={styles.menuView}>
          <Icon name="business-outline" size={22} color="white" />
          <Text style={styles.menuText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => redirect('Profile')} style={styles.menuView}>
          <Icon name="person-outline" size={22} color="white" />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          userLogout()
        }} style={styles.menuView}>
          <Icon name="log-out-outline" size={22} color="white" />
          {
            loading ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.menuText}>Logout</Text>
          }

        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDB43C',
    width: '100%',
  },
  drawerContent: {
    width: '100%',
    flex: 1,
    height: 500,
  },
  drawerSection: {
    width: '100%',
    flex: 1,
    height: 500,
    marginTop: 150,
    position: 'absolute',
    top: 0,
    marginLeft: spacing(4),
  },
  menuText: {
    color: 'white',
    marginLeft: spacing(10),
    fontSize: fontSize(13),
  },
  menuView: {
    paddingVertical: spacing(10),
    paddingLeft: spacing(25),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    borderRadius: 20,
  },
  menuIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: spacing(20),
    width: '100%',
  },
});
