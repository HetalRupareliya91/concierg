import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  Platform,
  ActivityIndicator,
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

export function EmergencyMessagesScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState([]);
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getEmergencyMessages();
  }, []);
  React.useEffect(function () {
    getEmergencyMessages();
  }, []);

  function getEmergencyMessages() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/emergencyMessages`,
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
            console.log(response.data.data.data);
            setData(response.data.data.data);
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
  function getMoreData() {
    setLoadMore(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/emergencyMessages`,
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
            console.log(response.data.data.data);
            console.log(data);
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

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }

  const EmergencyMessages = ({ item, onPress, style }) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Text style={styles.name}>{item.description}</Text>
        <Text style={styles.provider}>
          <Icon name="time-outline" style={styles.iconSize} />
          {' '}{Moment(item.created_at).format('Do MMM, yyyy H:mm A')}
        </Text>
      </View>
    </View>
  );

  const emergencyMessages = ({ item }) => {
    return <EmergencyMessages item={item} style={styles.flatListBox} />;
  };
  return (
    
      <AuthContainer>

          <SafeAreaView
            style={styles.mainView}
            keyboardShouldPersistTaps="handled">
            <View style={styles.headerBG} >
              <Heading style={styles.titleText}>Emergency Alerts {data.length}</Heading>
              <Image source={require('../../Image/metro-warning.png')} style={styles.headerImage} />
            </View>
            <View style={styles.roudedLayout}>
              <View style={styles.listWrap}>
                {data && (
                  <FlatList
                    data={data}
                    renderItem={emergencyMessages}
                  
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
            </View>
            <EmergencyAlarmModal setLoading={setLoading} />
            <Loading loading={loading} />
          </SafeAreaView>
       
      </AuthContainer>
   
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
    height:'100%'
  },
  headerImage: {
    marginRight:20,
    width: 89,
    height: 80,
  },
  roudedLayout: {
    marginTop: -36,
    minHeight: '100%',
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
  },
  headerBG: {
    flexDirection:'row',
    justifyContent:'space-between',
    height: 180,
    width: '100%',
    backgroundColor: '#EDB43C',
  },
  titleText: {
   
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  listWrap: {
    // marginTop: 20,
    paddingBottom:120
  },
  flatListBox: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#B2B2B2',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  leftView: {
    width: '75%',
  },
  rightView: {
    width: '25%',
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  provider: {
    marginTop: 10,
    color: '#888',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
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
