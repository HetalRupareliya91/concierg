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
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  TouchableHighlight,
} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { BASE_URL } from '../config';
import { CONFIG_URL } from '../config';
import { Loading } from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import { FilledButton } from '../components/FilledButton';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export const defaultMaleImage = 'public/front/images/nomale.png';
export const defaultFeMaleImage = 'public/front/images/nofemale.jpg';

export function ProfileScreen(props) {
  const { navigation, route = {} } = props;
  const { params = {} } = route;
  const { refetch } = params;
  const { token } = React.useContext(UserContext);
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getConciergeDetails();
  }, []);

  function getConciergeDetails(fetchApi) {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        console.log(userDetails);
        if (fetchApi) {
          setLoading(true);
          getUserProfile(userDetails.details);
        }
      }
      setLoading(false);
    });
  }

  React.useEffect(function () {
    getConciergeDetails();
  }, []);

  React.useEffect(() => {
    if (refetch) {
      getConciergeDetails(true);
    }
  }, [refetch]);

  const getUserProfile = (data = {}) => {
    axios
      .post(
        `${BASE_URL}/${`get-user-details`}`,
        { email: data.email, company_id: data.company_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(onGetProfile)
      .catch(onGetProfileFail);
  };

  const onGetProfile = (d = {}) => {
    const { data = {} } = d;
    const { success = {} } = data;
    const { user = {} } = success;
    const userData = {
      details: user,
      token,
    };
    setUserData(user, userData);
    setLoading(false);
  };

  const setUserData = async (user, userData) => {
    setAppUser(user);
    await SecureStorage.setItem('user', JSON.stringify(userData));
  };

  const onGetProfileFail = (error) => {
    setLoading(false);
  };

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

  return (
  <AuthContainer>
    <View style={styles.mainBody}>
      <SafeAreaView>
        {appUser && (
         
            <View style={styles.container}>
              <Heading style={styles.pageTitle}>My Profile</Heading>
              <View style={styles.conciergeImageWrap}>
                {appUser &&
                  appUser.member_image !== '' &&
                  appUser.member_image !== null && (
                    <Image
                      style={styles.conciergeImage}
                      source={{ uri: appUser.image }}
                    />
                  )}
                {appUser && appUser.member_image == null && appUser.gender == 'male' && (
                  <Image
                    style={styles.conciergeImage}
                    source={{ uri: CONFIG_URL + defaultMaleImage }}
                  />
                )}
                {appUser && appUser.member_image == null && appUser.gender == 'female' && (
                  <Image
                    style={styles.conciergeImage}
                    source={{ uri: CONFIG_URL + defaultFeMaleImage }}
                  />
                )}

                <View style={styles.profileBackPattern}></View>
              </View>
              <View style={styles.heading}>
                <Heading style={styles.headingStyle}>
                  {appUser.first_name} {appUser.last_name}
                </Heading>
              </View>
              <View style={styles.flatWrap}>
                <Heading style={styles.flatNumber}>
                  {appUser.unit[0].block_number}
                  {'-'}
                  {appUser.unit[0].flat_number}
                </Heading>
              </View>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.8}
                // onPress={() => navigation.navigate('Editprofile')}>
                onPress={() => {
                  navigation.navigate('UpdateProfiles', {
                    appUser,
                    backScreen: 'ProfileScreen',
                  });
                }}>
                <Text style={styles.buttonTextStyle}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
       
        )}
        <EmergencyAlarmModal setLoading={setLoading} />
      </SafeAreaView>
      <Loading loading={loading} />
    </View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#FFF',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    color: '#000',
  },
  conciergeImageWrap: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  conciergeImage: {
    position: 'relative',
    zIndex: 2,
    width: 160,
    height: 160,
    marginHorizontal: 'auto',
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#B2B2B2',
  },
  profileBackPattern: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: '#EDB43C',
    width: 100,
    height: 100,
    borderRadius: 50,
    transform: [{ scaleX: 2 }],
    marginTop: -50,
    marginLeft: -50,
  },
  heading: {
    width: '100%',
  },
  headingStyle: {
    marginBottom: 5,
    color: '#000',
    fontSize: 26,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  flatNumber: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: 20,
  },
  infoWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  contact: {
    width: 155,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    color: '#000',
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  iconSize: {
    marginRight: 5,
    fontSize: 18,
  },
  buttonStyle: {
    backgroundColor: '#cf8704',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#cf8704',
    // height: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 100,
    marginRight: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFF',
    paddingVertical: 14,
    fontSize: 19,
    fontWeight: 'bold',
  },
});
