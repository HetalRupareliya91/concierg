import React from 'react';
import {View, StyleSheet} from 'react-native';
import MenuItem, {hPadding} from './MenuItem';

const emergencySubmenus = {
  menu: 'Emergency',
  sub_menus: [
    {
      name: 'Emergency Contacts',
      icon: require('../../../Image/emergency-call.png'),
      redirectTo: 'EmergencyNumbers',
    },
    {
      name: 'Emergency Alerts',
      icon: require('../../../Image/emergency-message.png'),
      redirectTo: 'EmergencyMessages',
    },
  ],
};

const settingsSubmenus = {
  menu: 'Settings',
  sub_menus: [
    {
      name: 'Change Password',
      icon: require('../../../Image/passeod.png'),
      redirectTo: 'ChangePassword',
    },
    {
      name: 'My Profile',
      icon: require('../../../Image/progile.png'),
      redirectTo: 'Profile',
    },
    {
      name: 'Alerts',
      icon: require('../../../Image/notification-icon.png'),
      redirectTo: 'Notification',
    },
    {
      name: 'Privacy Policy',
      icon: require('../../../Image/security.png'),
      redirectTo: 'PrivacyPolicyScreen',
    },
    {
      name: 'User Policy',
      icon: require('../../../Image/note.png'),
      redirectTo: 'TermsConditionsScreen',
    },
    // {name: 'Note', icon: require('../../../Image/note.png'), redirectTo: 'Note'},
  ],
};

const realStateSubmenus = {
  menu: 'Real Estate',
  sub_menus: [
    {
      name: 'My Listing',
      icon: require('../../../Image/list.png'),
      redirectTo: 'MyPropertyListing',
    },
    {
      name: 'Buy',
      icon: require('../../../Image/buy.png'),
      redirectTo: 'RealEstate',
      params: {property_type: 'sale'},
    },
    {
      name: 'Rent',
      icon: require('../../../Image/sell.png'),
      redirectTo: 'RealEstate',
      params: {property_type: 'rent'},
    },
    {
      name: 'List',
      icon: require('../../../Image/list.png'),
      redirectTo: 'AddProperty',
    },
  ],
};

const apartmentSubmenus = {
  menu: 'Apartment',
  sub_menus: [
    {
      name: 'Manage visitors',
      icon: require('../../../Image/visitor-manager.png'),
      redirectTo: 'Visitors',
    },
    {
      name: 'Info',
      icon: require('../../../Image/Info.png'),
      redirectTo: 'AboutApartmentScreen',
    },
    {
      name: 'Bills',
      icon: require('../../../Image/invoice.png'),
      redirectTo: 'BillApartment',
    },
    {
      name: 'Parcels',
      icon: require('../../../Image/Parcels.png'),
      redirectTo: 'Parcels',
    },
    {
      name: 'Home notes',
      icon: require('../../../Image/note.png'),
      redirectTo: 'Note',
    },
    {
      name: 'Polls',
      icon: require('../../../Image/poll-icon.png'),
      redirectTo: 'Polls',
    },
    {
      name: 'Report Issues',
      icon: require('../../../Image/report-icon.png'),
      redirectTo: 'Issue',
    },
  ],
};

const MainMenu = (props) => (
  <View style={styles.menusView}>
    <MenuItem
      icon={require('../../../Image/material-message.png')}
      style={{marginLeft: -5}}
      label="Message Board"
      isCenter={true}
      onPress={() => {
        props.redirect('Feeds');
      }}
    />
    <MenuItem
      icon={require('../../../Image/pink-eype.png')}
      style={{position: 'absolute', left: '2%', top: '6%'}}
      label="Settings"
      onPress={() => {
        props.showSubMenu(settingsSubmenus);
      }}
    />
    <MenuItem
      icon={require('../../../Image/awesome-poll.png')}
      style={{position: 'absolute', left: '12%', top: '-77%'}}
      label="Emergency"
      onPress={() => {
        props.showSubMenu(emergencySubmenus);
      }}
    />
    <MenuItem
      icon={require('../../../Image/material-error.png')}
      style={{position: 'absolute', left: '13%', top: '88%'}}
      label="Partners"
      onPress={() => {
        props.redirect('Loyalty Card Stores');
      }}
    />
    <MenuItem
      icon={require('../../../Image/awesome-boxes.png')}
      style={{position: 'absolute', left: '42.5%', top: '-100%'}}
      label="Dashboard"
      onPress={() => {
        props.redirect('Home');
      }}
    />
    <MenuItem
      icon={require('../../../Image/add-circle.png')}
      style={{position: 'absolute', left: '80%', top: '6%'}}
      label="Apartment"
      onPress={() => {
        props.showSubMenu(apartmentSubmenus);
      }}
    />
    <MenuItem
      icon={require('../../../Image/material-message.png')}
      style={{position: 'absolute', left: '73%', top: '-79%'}}
      label="Chat"
      onPress={() => {
        props.redirect('ChatListing');
      }}
    />
    <MenuItem
      icon={require('../../../Image/awesome-servicestack.png')}
      style={{position: 'absolute', left: '72%', top: '91%'}}
      label="Real Estate"
      onPress={() => {
        props.showSubMenu(realStateSubmenus);
      }}
    />
    <MenuItem
      icon={require('../../../Image/awesome-power-off.png')}
      style={{position: 'absolute', left: '42.5%', top: '120%'}}
      label="Services"
      onPress={() => {
        props.redirect('Service');
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  menusView: {
    flexDirection: 'row',
    paddingHorizontal: hPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainMenu;
