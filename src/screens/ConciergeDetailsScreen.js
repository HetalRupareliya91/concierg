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
} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { BASE_URL } from '../config';
import { Loading } from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function ConciergeDetailsScreen({ route, navigation }) {
  const { concierge_id } = route.params;
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getConciergeDetails();
  }, []);
  function getConciergeDetails() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/concierge-details`,
            {
              company_id: userDetails.details.company_id,
              concierge_id: concierge_id,
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
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error.response.data);
          });
      }
    });
  }
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }
  React.useEffect(function () {
    getConciergeDetails();
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

  return (
    <View style={styles.mainView}>

      <SafeAreaView>
        
          <View style={styles.headerBG} >
            <Heading style={styles.titleText}>Concierge Detail</Heading>
            <Image source={require('../../Image/shield.png')} style={styles.headerImage} />
          </View>
          <View style={styles.roudedLayout}>
            <View style={styles.conciergeImageWrap}>
              {data && (
                <Image
                  style={styles.conciergeImage}
                  resizeMode={'stretch'}
                  source={{ uri: data.image }}
                />
              )}
            </View>
            {data && (
              <View style={styles.conciergeDetailWrap}>
                <Heading style={styles.name}>{data.name}
                  {"\n"}
                  <Text style={styles.time}>
                    {Moment(data.shift_start, ['HH.mm']).format('hh:mm A')} - {Moment(data.shift_end, ['HH.mm']).format('hh:mm A')}
                  </Text>
                </Heading>
                {/* <Text style={styles.age}>40 Years</Text> */}
                {/* <View style={styles.contactText}>
                  <Icon name="chatbox-ellipses" style={{ fontSize: 34, color: '#FCB623', marginLeft: 'auto', marginRight: 'auto', }} />
                  <Text
                    style={styles.time}
                    onPress={() => {
                      navigation.navigate('Chat', { selectedFeed: data })
                    }}>
                    Live Chat
              </Text>
                </View> */}

                <View style={styles.contactGrids}>
                  {/*<Col style={styles.TimeText}>
                    <View style={styles.contactText}>
                      <Image source={require('../../Image/clock.png')} style={styles.clockIcon} />
                      <Text style={styles.time}>
                        {Moment(data.shift_start, ['HH.mm']).format('hh:mm A')} -
                        {Moment(data.shift_end, ['HH.mm']).format('hh:mm A')}
                      </Text>
                    </View>
                  </Col>*/}
                  <View style={styles.TimeText}>
                    <Image source={require('../../Image/clock.png')} style={styles.clockIcon} />
                    <Text style={styles.time}>
                      {Moment(data.shift_start, ['HH.mm']).format('hh:mm')} -
                    {Moment(data.shift_end, ['HH.mm']).format('hh:mm')}
                    </Text>
                  </View>
                  <View style={styles.TimeText}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { selectedFeed: data }) }}>
                      <View style={styles.contactText}>
                        <Icon name="chatbox-ellipses" style={{ fontSize: 34, color: '#FCB623', marginLeft: 'auto', marginRight: 'auto', }} />
                        <Text style={styles.time}>Live Chat</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.TimeText}>
                    <TouchableOpacity
                      onPress={() => {
                        dialCall(data.phone_number);
                      }}>
                      <View style={styles.contactText}>
                        <Image source={require('../../Image/telephone.png')} style={styles.phoneIcon} />
                        <Text style={styles.time}>{data.phone_number}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/*<Col style={styles.TimeText}>
                    <View style={styles.contactText}>
                      <Image source={require('../../Image/open-door-entrance.png')} style={styles.gateIcon} />
                      <Text style={styles.time}>Gate No. 3</Text>
                    </View>
                  </Col>*/}
                </View>
                {/* <View style={styles.contactGrids}>
                  <View style={styles.TimeText}>
                    <Icon name="time" style={styles.ContacticonSize} />
                    <Text>
                      {Moment(data.shift_start, ['HH.mm']).format('hh:mm A')}
                    </Text>
                    <Text>
                      {Moment(data.shift_end, ['HH.mm']).format('hh:mm A')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.TimeText}
                    onPress={() => {
                      dialCall(data.phone_number);
                    }}>
                    <View style={styles.contactText}>
                      <Icon name="call" style={styles.ContacticonSize} />
                      <Text style={styles.time}>{data.phone_number}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.TimeText}>
                    <Icon name="time" style={styles.ContacticonSize} />
                    <Text style={styles.time}>Gate No. 3</Text>
                  </View>
                </View> */}
              </View>
            )}
          </View>
          <EmergencyAlarmModal setLoading={setLoading} />
  
      </SafeAreaView>
      <Loading loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
  },
  headerImage: {
    position: 'absolute',
    right: 30,
    top: 0,
    width: 90,
    height: 115,
  },
  roudedLayout: {
    marginTop: -36,
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
  },
  headerBG: {
    position: 'relative',
    height: 180,
    width: '100%',
    backgroundColor: '#EDB43C',
  },
  titleText: {
    position: 'absolute',
    top: 20,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  conciergeDetailWrap: {
    backgroundColor: '#FFF',
  },
  conciergeImageWrap: {
    display: 'flex',
    marginTop: -50,
    marginBottom: 20,
    width: 150,
    height: 150,
    position: 'relative',
    marginLeft: -70,
    left: '50%',
    borderWidth: 5,
    borderColor: '#B2B2B2',
    borderRadius: 100,
  },
  conciergeImage: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  name: {
    color: '#000',
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  age: {
    marginBottom: 40,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },

  contactGrids: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  TimeText: {
    width: '33%',
    fontWeight: '600',
    marginTop: 5,
  },
  contact: {
    width: '30%',
    fontWeight: '600',
    marginTop: 5,
    borderRightWidth: 1,
    borderColor: '#999',
  },
  ContacticonSize: {
    display: 'flex',
    width: '100%',
    fontSize: 42,
    marginBottom: 10,
    color: '#999',
  },
  gateItem: {
    width: '30%',
    fontWeight: '600',
    marginTop: 5,
  },
  ChatIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    width: 32,
    height: 30,
  },
  clockIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    width: 30,
    height: 30,
  },
  phoneIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    width: 32,
    height: 32,
  },
  gateIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    width: 24,
    height: 30,
  },
  time: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
  },
  heading: {
    height: 170,
    width: '100%',
    backgroundColor: '#000',
  },
  headingStyle: {
    marginTop: 20,
    textAlign: 'left',
    textTransform: 'capitalize',
  },
});

