import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { BASE_URL } from '../config';
import { Loading } from '../components/Loading';
import Moment from 'moment';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


export function PollsResultScreen({navigation, route }) {
  const { poll } = route.params;
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isVoted, setIsVoted] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPollsDetails();
  }, []);
  function getPollsDetails() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/isPollConduct`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              poll_id: poll.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            if (response.data.isVoted === 0) {
              let date1 = Moment().format('DD-MM-YYYY').valueOf();
              let date2 = Moment(poll.poll_valid_until, 'DD-MM-YYYY').valueOf();
              if (date1 > date2) {
                setIsVoted(true);
                setIsExpired(true);
                getPollsResult();
              } else {
                setLoading(false);
                setData(poll.options);
                setIsVoted(false);
              }
            } else {
              setIsVoted(true);
              getPollsResult();
            }
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error.response.data);
          });
      }
    });
  }
  React.useEffect(function () {
    getPollsDetails();
  }, []);

  function selectOption(option_id) {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/selectPollOption`,
            {
              user_id: userDetails.details.id,
              poll_id: poll.id,
              option_id: option_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            if (response.data.status === true) {
              getPollsResult();
              setData([]);
            }
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

  async function getPollsResult() {
    setLoading(true);
    setIsVoted(true);
    await axios
      .post(
        `${BASE_URL}/get-poll-result`,
        {
          poll_id: poll.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        setLoading(false);
        console.log(response.data.data);
        console.log('isVoted', isVoted);
        if (isVoted === true) {
          // console.log(response.data.data.poll.options);
          setData(response.data.data.poll.options);
        } else {
          setIsExpired(false);
          setData(response.data.data.result);
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error.response.data);
      });
  }

  const Poll = ({ item, style }) => (
    <TouchableOpacity onPress={() => selectOption(item.id)}>
      <View style={[styles.item, style]}>
        <Text style={styles.pollText}>{item.option}</Text>
      </View>
    </TouchableOpacity>
  );

  const polls = ({ item }) => {
    return <Poll item={item} style={styles.flatListBox} />;
  };


  const PollResult = ({ item, style }) => (
    // <TouchableOpacity onPress={() => selectOption(item.id)}>
    window.myVar = item.per + '%',

    <View style={[styles.item, style]}>
      <View style={styles.pollResult}>
        <View style={{ width: window.myVar == 'undefined%' ? 0 : item.per + '%', backgroundColor: 'rgba(237, 180, 60, .5)', borderRadius: 100, paddingVertical: 5, height: 50, }}></View>
        <Text style={styles.leftText}>{isExpired === false && item.name}</Text>
        <Text style={styles.rightText}>{isExpired === false && item.per + '%'}</Text>
      </View>
    </View>
    // </TouchableOpacity>
  );

  const pollResults = ({ item }) => {
    return <PollResult item={item} style={styles.flatListBox} />;
  };

  return (
    <AuthContainer>
   
        <SafeAreaView style={styles.container}>
          <View>
            <ImageBackground
              source={require('../../Image/poll.png')}
              style={styles.headerBG} >
              <Heading style={styles.titleText}>Poll</Heading>
            </ImageBackground>
          </View>
          <Heading style={styles.pollTitle}>{poll.title}</Heading>
          <View style={styles.listWrap}>
            {isVoted === true && (
              <FlatList
                data={data}
                renderItem={pollResults}
                keyExtractor={(item, index) => 'res' + index}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            )}
            {isVoted === false && data && (
              <FlatList
                data={data}
                renderItem={polls}
                keyExtractor={(item) => 'ses' + item.id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            )}
          </View>
          <EmergencyAlarmModal setLoading={setLoading} />
          <Loading loading={loading} />
        </SafeAreaView>
     
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 0,
  },
  headerBG: {
    position: 'relative',
    height: 160,
    width: '100%',
    marginBottom: 30,
  },
  titleText: {
    position: 'absolute',
    top: 40,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  pollTitle: {
    color: '#000',
  },
  listWrap: {
    marginTop: 10,
  },
  item: {
    flex: 1,
    flexWrap: 'wrap',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  flatListBox: {
    height: 52,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#868A8E',
    marginTop: 20,
  },
  pollText: {
    fontSize: 22,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#000',
  },
  pollResult: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  leftText: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 11,
    width: '50%',
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rightText: {
    position: 'absolute',
    top: 2,
    right: 0,
    width: '50%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
