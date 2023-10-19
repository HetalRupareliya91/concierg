import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {AuthContainer} from '../components/AuthContainer';
import {Heading} from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import {UserContext} from '../contexts/UserContext';
import {BASE_URL} from '../config';
import {Loading} from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import {EmergencyAlarmModal} from '../components/EmergencyAlarmModal';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


export function EmergencyNumbersScreen({route, navigation}) {
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getEmergencyContact();
  }, []);
  function getEmergencyContact() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/emergencyContact`,
            {
              company_id: userDetails.details.company_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            setData(response.data.data);
            console.log(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
      }
    });
  }
  React.useEffect(function () {
    getEmergencyContact();
  }, []);

  function dialCall(number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }

  const Contacts = ({item, onPress, style}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        dialCall(item.number);
      }}>
      <View style={[styles.item, style]}>
        <View style={styles.leftView}>
          <Image source={require('../../Image/phonewithbg.png')} style={styles.ServiceIcon} />
        </View>
        <View style={styles.rightView}>
          <Text style={styles.PhoneNumber}>{item.number}</Text>
          <Text style={styles.ServiceName}>{item.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const contacts = ({item}) => {
    return <Contacts item={item} style={styles.flatListBox} />;
  };

  return (
    <AuthContainer>
      <View style={styles.mainView}>

        <View style={styles.headerBG} >
          <Heading style={styles.titleText}>Emergency Numbers</Heading>
          <Image source={require('../../Image/report.png')} style={styles.headerImage} />
        </View>
        <View style={styles.roudedLayout}>
          <View style={styles.container}>
            {data && (
              <View style={styles.conciergeDetailWrap}>
                <View style={styles.listWrap}>
                  {data && (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      style={{paddingBottom: 10}}
                      data={data}
                      renderItem={contacts}
                      keyExtractor={(item, index) => 'ses' + index}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
          <EmergencyAlarmModal setLoading={setLoading} />
          <Loading loading={loading} />
      </View>
      </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
    height:'100%'
  },
  container: {
        paddingHorizontal: 15,
        height:'100%'
  },
  headerImage: {
    // position: 'absolute',
    // right: 30,
    // top: 40,
    marginRight: 20,
    width: 95,
    height: 90,
  },
  roudedLayout: {
        marginTop: -36,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,

    height: '100%'
  },
  headerBG: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 180,
    width: '100%',
    backgroundColor: '#EDB43C',
  },
  titleText: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  listWrap: {
    // marginTop: 20,

  },
  flatListBox: {
        backgroundColor: '#FEFEFE',
    borderRadius: 10,
    overflow: 'hidden',
  },

  item: {
        flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    // padding: 15,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 5,
  },
  conciergeDetailWrap: {
    backgroundColor: '#FFF',
    // marginTop: 30,
    paddingBottom:120
  },
  leftView: {
        width: 80,
    backgroundColor: '#EDB43C',
    paddingVertical: 12,
  },
  rightView: {
        paddingVertical: 10,
    paddingHorizontal: 15,
  },
  ServiceIcon: {
        width: 40,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#D1AE6C',
  },
  PhoneNumber: {
        fontSize: 18,
    fontWeight: '700',
  },
  ServiceName: {
        fontSize: 16,
  },
});
