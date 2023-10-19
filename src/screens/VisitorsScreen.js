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
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {HeaderIconButton} from '../components/HeaderIconButton';
import {AuthContext} from '../contexts/AuthContext';
import {HeaderIconsContainer} from '../components/HeaderIconsContainer';
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

export function VisitorsScreen({navigation}) {
  const {logout} = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState([]);
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getVisitors();
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
    getVisitors();
  }, []);

  function getVisitors() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/visitors`,
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
            console.log("visitors", response)
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
  function getMoreData() {
    setLoadMore(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/visitors`,
            {
              company_id: userDetails.details.company_id,
              unit_id: userDetails.details.unit_id,
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
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }
  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loadMore ? (
          <ActivityIndicator color="#FFF" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  const Visitor = ({item, onPress, style}) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Text style={styles.name}>{item.visitor_name}</Text>
        {
          item.description &&

          <Text style={styles.provider}>{item.description}</Text>
        }
        {
          item.reason &&
          <Text style={styles.provider}>{item.reason}</Text>
        }
        {/* <Text style={styles.provider}>{item.id_number}</Text> */}
      </View>
      {/* <View style={styles.rightView}>
        <Text style={styles.flateNo}>{item.unit}</Text>
        <Text style={styles.gate_name}>Gate: {item.gate_name}</Text>
      </View> */}
      <View>
        <Text style={styles.check_in}>
          Checked In: {Moment(item.check_in_date).format('Do MMM, yyyy')}{' '}
          {Moment(item.check_in_time, ['HH.mm']).format('hh:mm A')}
        </Text>
        {item.check_out_date !== '' && item.check_out_date !== null && (
          <Text style={styles.check_out}>
            Checked Out: {Moment(item.check_out_date).format('Do MMM, yyyy')}{' '}
            {Moment(item.check_out_time, ['HH.mm']).format('hh:mm A')}
          </Text>
        )}
      </View>
    </View>
  );

  const Visitors = ({item}) => {
    return <Visitor item={item} style={styles.flatListBox} />;
  };
  return (
    <AuthContainer>
      <SafeAreaView
        style={styles.mainView}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerBG} >
          <Heading style={styles.titleText}>Visitors</Heading>
          <Image source={require('../../Image/report.png')} style={styles.headerImage} />
        </View>
        <View style={styles.roudedLayout}>
          <View style={styles.container}>
            <View style={styles.listWrap}>
              {data && (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  renderItem={Visitors}
                  style={{marginBottom: 100}}
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
        </View>

      </SafeAreaView>
      <EmergencyAlarmModal setLoading={setLoading} />
      <Loading loading={loading} />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
    height: '100%',
  },
  container: {
    paddingHorizontal: 15,
  },
  headerImage: {
    marginRight: 20,
    width: 95,
    height: 90,
  },
  roudedLayout: {
    marginTop: -36,
    paddingHorizontal: 15,
    paddingVertical: 30,
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
  },

  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 5,
  },
  leftView: {
    width: '75%',
  },
  rightView: {
    width: '25%',
  },
  flateNo: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#666',
    borderRadius: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  check_in: {
    width: '100%',
    color: 'green',
  },
  check_out: {
    width: '100%',
    color: '#b51004',
  },
  provider: {
    marginBottom: 10,
    color: '#999',
  },
  contact: {
    marginTop: 5,
  },
  gate_name: {
    color: '#888',
  },
  iconSize: {
    fontSize: 25,
    color: '#059EA4',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
