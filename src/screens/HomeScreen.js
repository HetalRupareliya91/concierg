import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Button,
  Image,
  StatusBar,
  SectionList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {HeaderIconButton} from '../components/HeaderIconButton';
import {AuthContext} from '../contexts/AuthContext';
import {HeaderIconsContainer} from '../components/HeaderIconsContainer';
import {ThemeContext} from '../contexts/ThemeContext';
import {AuthContainer} from '../components/AuthContainer';
import SecureStorage from 'react-native-secure-storage';
import {UserContext} from '../contexts/UserContext';
import {BASE_URL} from '../config';
import {Loading} from '../components/Loading';
import Moment from 'moment';
import SvgUri from 'react-native-svg-uri';
import messaging from '@react-native-firebase/messaging';
import {EmergencyAlarmModal} from '../components/EmergencyAlarmModal';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { useIsFocused } from '@react-navigation/native'
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';

export function HomeScreen({navigation}) {
  const {logout} = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getHomeDetails();
  }, []);
  function getHomeDetails() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/home`,
            {
              company_id: userDetails.details.company_id,
              unit_id: userDetails.details.unit_id,
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
            setData(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
          });
      }
    });
  }

  React.useEffect(function () {
    getHomeDetails();


  }, [isFocused]);

  React.useEffect(function () {
    getHomeDetails();
    requestUserPermission();

    messaging().onTokenRefresh((fcmToken) => {
      // Process your token as required
      console.log('fcmToken onTokenRefresh', fcmToken);
      saveUserDeviceToken(fcmToken);
      console.log('fcmToken onTokenRefresh after', fcmToken);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data.type === 'parcel') {
        navigation.navigate('Parcels');
      }
      if (remoteMessage.data.type === 'issue') {
        navigation.navigate('Issue');
      }
      if (remoteMessage.data.type === 'poll') {
        navigation.navigate('Polls');
      }
      if (remoteMessage.data.type === 'service') {
        navigation.navigate('Service');
      }
      if (remoteMessage.data.type === 'facility') {
        navigation.navigate('Facility');
      }
      if (remoteMessage.data.type === 'Notice') {
        navigation.navigate('Message Board');
      }
      if (remoteMessage.data.type === 'Store') {
        navigation.navigate('Loyalty Card Stores');
      }
      if (remoteMessage.data.type === 'visitor') {
        navigation.navigate('Visitors');
      }
    });
    // let echo = new Echo({
    //   broadcaster: 'socket.io',
    //   host: 'http://concierge:6007',
    //   client: Socketio,
    //   // authEndpoint: 'http://127.0.0.2/broadcasting/auth',
    //   // auth: {
    //   //   headers: {
    //   //     Authorization: 'Bearer ' + token,
    //   //   },
    //   // },
    // });
    // console.log(echo);
    // echo.channel('user-channel').listen('UserEvent', (event) => {
    //   console.log(event);
    // });
  }, []);

  function saveUserDeviceToken(deviceToken) {
    console.log("deviceToken", deviceToken)
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        axios
          .post(
            `${BASE_URL}/saveDeviceToken`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              deviceToken: deviceToken,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            // setData(response.data.data);
            // console.log(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            // console.log(error.response.data);
          });
      }
    });
  }

  async function requestUserPermission() {
    const deviceToken = await messaging().getToken();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      saveUserDeviceToken(deviceToken);
    }
  }

  const Visitor = ({item, onPress, style}) => (
    <View style={styles.visitorsList}>
      <View style={{flex:1}}>
        <Text style={styles.visitorName}>{item.visitor_name}</Text>
        <Text style={styles.visitorOcc}>{item.reason}</Text>
       
      </View>
      <View style={styles.timeText}>
      <Text style={styles.flatNumbr}>{item.unit}</Text>
        <Text style={styles.dateTime}>
          <Icon name="time-outline" style={styles.iconSize} />{' '}
          {Moment(item.check_in_date).format('Do MMM, yyyy')} |{' '}
          {Moment(item.check_in_time, ['HH.mm']).format('hh:mm')}
        </Text>
      </View>
    </View>
  );
  const Board = ({item, onPress, style}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('Feeds')
      }}>
      <View style={styles.msgBoardWrap}>
        <Text style={styles.msgTitle}>{item.description}</Text>
        <Text style={styles.infoText}>{Moment(item.created_at).format('Do MMM, yyyy')}</Text>
        {/* <Text style={styles.detailText}>Details</Text> */}
      </View>
    </TouchableOpacity>
  );

  const renderVisitors = ({item}) => {
    const backgroundColor = '#04141A';
    return <Visitor item={item} style={{backgroundColor}} />;
  };
  const messageBoard = ({item}) => {
    console.log("message baord", item)
    const backgroundColor = '#04141A';
    return <Board item={item} style={{backgroundColor}} />;
  };

  function getGreetingTime(m) {
    var g = null; //return g

    if (!m || !m.isValid()) {
      return;
    } //if we can't find a valid or filled moment, we return.

    var split_afternoon = 12; //24hr time to split the afternoon
    var split_evening = 17; //24hr time to split the evening
    var currentHour = parseFloat(m.format('HH'));

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
      g = 'Afternoon';
    } else if (currentHour >= split_evening) {
      g = 'Evening';
    } else {
      g = 'Morning';
    }

    return g;
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  // function onSwipeLeft(direction) {
  //   navigation.navigate('Advertise');
  // }
  return (


    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.mainView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <SafeAreaView style={styles.container}>

        <View style={styles.headerWrap}>
          <Text style={styles.greetText}>
            Good {getGreetingTime(Moment())},
              </Text>
          {appUser && (
            <Text style={styles.nameText}>
              {appUser.first_name} {appUser.last_name}
            </Text>
          )}
        </View>
        <View style={styles.roudedLayout}>
          <View style={styles.infoIcons}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Parcels')}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>Parcels</Text>
                <Image
                  style={{marginTop: 10, width: 57, height: 40}}
                  source={require('../../Image/awesome-box-open.png')}
                />
              </View>
            </TouchableOpacity>

            {data && data.concierge !== '' && data.concierge !== null && data.concierge.length == 1 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('Chat', {selectedFeed: data.concierge[0]})
                }}
              // onPress={() =>
              //   navigation.navigate('ConciergeDetails', {
              //     concierge_id: data.concierge.id,
              //   })}
              >
                <View style={styles.icon}>
                  <Text style={styles.iconText}>Concierge</Text>
                  <Image
                    style={{marginTop: 5, width: 34, height: 40}}
                    source={require('../../Image/guard.png')}
                  />
                  <Text style={styles.conciergeText}>
                    {data.concierge[0].first_name} {data.concierge[0].last_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {data && data.concierge !== '' && data.concierge !== null && data.concierge.length >= 2 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ChatListing')
                }>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>Concierge</Text>
                  <Image
                    style={{marginTop: 5, width: 34, height: 40}}
                    source={require('../../Image/guard.png')}
                  />
                  <Text style={styles.conciergeText}>

                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {data && data.concierge == null && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ChatListing')
                }>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>Concierge</Text>
                  <Image
                    style={{marginTop: 5, width: 34, height: 40}}
                    source={require('../../Image/guard.png')}
                  />
                  <Text style={styles.conciergeText}>

                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {data && data.concierge.length == 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ChatListing')
                }>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>Concierge</Text>
                  <Image
                    style={{marginTop: 5, width: 34, height: 40}}
                    source={require('../../Image/guard.png')}
                  />
                  <Text style={styles.conciergeText}>

                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ChatListing')}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>Chat</Text>
                {data && data.messageBoard !== '' && data.messageBoard !== null && (
                  <Text style={styles.countMessage}>{data.messageCount}</Text>
                )}
                <Image
                  style={{marginTop: 10, width: 40, height: 40}}
                  source={require('../../Image/message-square.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          {data && data.issue !== '' && data.issue !== null && (
            <View>
              <View style={styles.alertInfo}>
                <View style={styles.leftView}>
                  <Image
                    source={require('../../Image/metro-warning.png')}
                    style={{width: 51, height: 45}}
                  />
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.paymentText}>{data.issue.issue}</Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Issue')}>
                <View style={styles.seeDetail}>
                  <View style={{width: '85%'}}>
                    <Text style={styles.seeDetailText}>See More Details</Text>
                  </View>
                  <View style={{width: 26, justifyContent: 'flex-end'}}>
                    <Image source={require('../../Image/arrow-rightnavigate.png')} style={{width: 26, height: 26, }} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Visitors')}>
            <View style={styles.titleTextWrap}>
              <Text style={styles.titleText}>Latest Visitors</Text>
              <View
                activeOpacity={0.8}
                style={styles.viewallText}
                onPress={() => navigation.navigate('Visitors')}>
                <Image source={require('../../Image/arrow-rightnavigate.png')} style={{width: 26, height: 26, }} />
              </View>
            </View>
            {data && (
              <FlatList
                data={data.visitors}
                renderItem={renderVisitors}
                keyExtractor={(item) => 'VI' + item.id}
              />
            )}
          </TouchableOpacity>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Feeds')}>
              <View style={styles.titleTextWrap}>
                <Text style={styles.titleText}>Message Board</Text>
                <View
                  style={styles.viewallText}
                  onPress={() => navigation.navigate('Feeds')}>
                  <Image source={require('../../Image/arrow-rightnavigate.png')} style={{width: 26, height: 26, }} />
                </View>
              </View>
            </TouchableOpacity>
            {data && (
              <FlatList
                horizontal={true}
                // numColumns='2'
                data={data.messageBoard}
                renderItem={messageBoard}
                keyExtractor={(item) => 'msg' + item.id}
              />
            )}
          </View>
          <View style={styles.discoverWrap}>
            <View style={styles.discoverImgWrap}>
              <Image source={require('../../Image/discover-img.jpg')} style={{width: '100%', height: 250, borderTopLeftRadius: 10, borderTopRightRadius: 10, }} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Advertise')}>
              <View style={styles.discoverTitleWrap}>
                <Text style={styles.titleText}>Discover</Text>
                <View
                  style={styles.viewallText}
                  onPress={() => navigation.navigate('Visitors')}>
                  <Image source={require('../../Image/arrow-rightnavigate.png')} style={{width: 26, height: 26, }} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.liveChat}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Advertise')}>
            <Image
              source={require('../../Image/social-media.png')}
              style={styles.liveChatImage}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <EmergencyAlarmModal setLoading={setLoading} />
      <Loading loading={loading} />
    </ScrollView>

  );
}
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
    color: '#333',
  },
  headerWrap: {
    paddingVertical: 50,
    backgroundColor: '#EDB43C',
  },
  greetText: {
    color: '#333',
    paddingHorizontal: 15,
    fontSize: 18,
  },
  nameText: {
    marginVertical: 0,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  roudedLayout: {
    height: '100%',
    marginTop: -36,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
  },
  iconTime: {
    fontSize: 16,
  },
  iconText: {
    fontWeight: 'bold',
    color: '#333',
  },
  conciergeText: {
    color: '#333',
    marginTop: 5,
  },
  infoIcons: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 30,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#D8D8D8',
    padding: 20,
    paddingBottom: 30,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  leftView: {
    width: '25%',
  },
  rightView: {
    width: '75%',
  },
  paymentText: {
    marginBottom: 10,
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
  payAmountText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  seeDetail: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#EDB43C',
    paddingHorizontal: 15,
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  seeDetailText: {
    color: '#FFF',
    fontSize: 14,
    paddingVertical: 15,
    textTransform: 'uppercase',
  },
  seeDetailIconText: {
    height: 50,
    textAlign: 'right',
  },
  titleTextWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#EDB43C',
    paddingHorizontal: 15,
  },
  titleText: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF',
  },
  viewallText: {
    width: 26,
  },

  visitorsList: {
    // position: 'relative',
    marginBottom: 20,
    // backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent:'space-between',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    color: '#000',
    fontSize: 18,
    flex:1,
    padding: 15,
    borderRadius: 10,
  },
  flatNumbr: {
  
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
    backgroundColor: '#333',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  timeText: {
    // position: 'absolute',
    flex:1,
    fontSize: 12,
    // fontWeight: '100',
    color: '#888',
    alignItems:'flex-end'
  },
  visitorName: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  visitInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitorOcc: {
    marginBottom: 10,
    // marginTop: 5,
    fontSize: 14,
    fontWeight: '300',
    color: '#333',
  },
  dateTime: {
    marginTop: 12,
    // width: '75%',
    fontSize: 14,
    fontWeight: '300',
    color: '#888',
  },
  msgBoardWrap: {
    // backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    marginRight: 15,
    width: 250,
    borderRadius: 10,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  msgTitle: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
    // textTransform: 'capitalize',
  },
  infoText: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '400',
  },
  detailText: {
    marginBottom: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'right',
    color: '#D1AE6C',
  },
  item: {
    backgroundColor: '#04141A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  discoverWrap: {
    marginBottom: 10,
  },
  discoverTitleWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#EDB43C',
    paddingHorizontal: 15,
  },
  liveChat: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  liveChatImage: {
    width: 100,
    height: 100,
  },
  iconSee: {
    fontSize: 26,
    color: '#000',
  },
  iconSize: {
    fontSize: 16,
  },
  SectionStyle: {
    // flexDirection: 'row',
    height: 200,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  yesButtonStyle: {
    backgroundColor: 'green',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#BA9551',
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  noButtonStyle: {
    backgroundColor: 'red',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#BA9551',
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFF',
    paddingVertical: 14,
    fontSize: 16,
  },
  titleTextStyle: {
    color: '#000',
    fontSize: 25,
    textAlign: 'left',
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '700',
  },
  helpImage: {
    position: 'absolute',
    bottom: 90,
    height: 60,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countMessage: {
    position: 'absolute',
    top: 35,
    left: 35,
  },
});
