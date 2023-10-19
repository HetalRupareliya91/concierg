import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { AuthContext } from '../contexts/AuthContext';
import { HeaderIconsContainer } from '../components/HeaderIconsContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { BASE_URL } from '../config';
import { Loading } from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function PollsScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPolls();
  }, []);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <HeaderIconsContainer>
      //     <HeaderIconButton
      //       name={'color-palette'}
      //       onPress={() => {
      //         switchTheme();
      //       }}
      //     />
      //     <HeaderIconButton
      //       name={'log-out'}
      //       onPress={() => {
      //         logout();
      //       }}
      //     />
      //   </HeaderIconsContainer>
      // ),
    });
  }, [navigation, logout, switchTheme]);
  React.useEffect(function () {
    getPolls();
  }, []);

  function getPolls() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log(userDetails);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/polls`,
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
            setData(response.data.data.data);
            console.log(response.data.data.data);
            if (
              response.data.data.last_page > response.data.data.current_page
            ) {
              setPageNumber(
                parseInt(response.data.data.current_page) + parseInt(1),
              );
              setIsLoadMore(true);
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
  function getMoreData() {
    setLoadMore(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/polls`,
            {
              company_id: userDetails.details.company_id,
              page: pageNumber,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(async function (response) {
            setLoading(false);
            setLoadMore(false);
            setData([...data, ...response.data.data.data]);
            if (
              response.data.data.last_page > response.data.data.current_page
            ) {
              setPageNumber(
                parseInt(response.data.data.current_page) + parseInt(1),
              );
              setIsLoadMore(true);
            } else {
              setIsLoadMore(false);
            }
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error.response.data);
          });
      }
    });
  }
  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loadMore ? (
          <ActivityIndicator color="#FFF" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const Polls = ({ item, onPress, style }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('PollsResult', {
          poll: item,
        })
      }>
      <View style={[styles.item, style]}>
        <View style={styles.leftView}>
          <Text style={styles.name}>{item.title}</Text>
          <View style={styles.dateWrap}>
            <Icon name="time-outline" size={14} style={styles.timeIcon} />
            <Text style={styles.lblText}>Start:</Text>
            <Text style={styles.date}>{Moment(item.created_at).format('Do MMM, YYYY')}</Text>
          </View>
          <View style={styles.dateWrap}>
            <Icon name="time-outline" size={14} style={styles.timeIcon} />
            <Text style={styles.lblText}>End:</Text>
            <Text style={styles.date}>{Moment(item.poll_valid_until).format('Do MMM, YYYY')}</Text>
          </View>
          <View style={styles.btnWrap}>
            <Text style={styles.pollButton}>Poll</Text>
          </View>
        </View>
        <View style={styles.rightView}>
          {item.status === 1 && <Text style={styles.statusOpen}>Open</Text>}
          {item.status === 0 && <Text style={styles.statusClose}>Close</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const polls = ({ item }) => {
    return <Polls item={item} style={styles.flatListBox} />;
  };
  return (
    <AuthContainer>
      <ScrollView>
       
          <SafeAreaView style={styles.mainView}>
            <View>
              <ImageBackground
                source={require('../../Image/poll.png')}
                style={styles.headerBG} >
                <Heading style={styles.titleText}>Polls</Heading>
              </ImageBackground>
            </View>
            <View style={styles.container}>
              <Heading>Polls</Heading>
              <View style={styles.listWrap}>
                {data && (
                  <FlatList
                    data={data}
                    renderItem={polls}
                    keyExtractor={(item) => 'ses' + item.id}
                    initialNumToRender={10}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                      if (isLoadMore) {
                        getMoreData();
                      }
                    }}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                  />
                )}
              </View>
              <EmergencyAlarmModal setLoading={setLoading} />
              <Loading loading={loading} />
            </View>
          </SafeAreaView>
      
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
  },
  headerBG: {
    position: 'relative',
    height: 160,
    width: '100%',
  },
  titleText: {
    position: 'absolute',
    top: 40,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  flatListBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EDB43C',
    borderRadius: 5,
    marginBottom: 20,
  },
  leftView: {
    width: '100%',
  },
  name: {
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lblText: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pollButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#000',
    color: '#FFF',
    borderRadius: 20,
    width: 80,
    textAlign: 'center',
  },
  statusOpen: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'green',
    borderRadius: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  statusClose: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'red',
    borderRadius: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  provider: {
    marginTop: 10,
    marginBottom: 15,
  },
  contact: {
    marginTop: 5,
  },
  iconSize: {
    fontSize: 16,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
