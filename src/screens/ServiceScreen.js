import React from 'react';
import axios from 'axios';

import {
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Text,
  ImageBackground,
  SectionList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Heading } from '../components/Heading';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { UserContext } from '../contexts/UserContext';
import SecureStorage from 'react-native-secure-storage';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { AuthContainer } from '../components/AuthContainer';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
import Moment from 'moment';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import { Formik } from 'formik';
import * as yup from 'yup';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import { spacing } from '../constants/appStyles';
import PropertyFilters from '../components/PropertyFilters';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function ServiceScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState({});
  const [appUser, setAppUser] = React.useState();
  const [loadMore, setLoadMore] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({});

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getServices(filters);
  }, []);
  React.useEffect(function () {
    getServices(filters);
  }, []);

  function getServices(filter) {
    setRefreshing(false);
    setLoading(true);
    console.log('getServices filters', filter);
    const isFilter = filter && Object.keys(filter).length;

    const filterData = new FormData();
    if (isFilter) {
      Object.keys(filter).map((f) => {
        filterData.append(f, filter[f]);
      });
    }

    let url = isFilter ? 'services' : 'services';
    setData({});
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        const data = isFilter ? filterData : {};
        axios
          .post(
            `${BASE_URL}/services`,
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
            let data = response.data;
            if (isFilter) {
              data = response.data ? response.data.property : {};
            }
            console.log(data.data);
            setData(data.data || {});
            if (data.last_page > data.current_page) {
              setPageNumber(parseInt(data.current_page) + parseInt(1));
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
            `${BASE_URL}/services`,
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
  function dialCall(number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
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

  const Service = ({ item, onPress, style, navigation }) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Text style={styles.name}>{item.service_name}</Text>
        <Text style={styles.provider}>{item.service_provider_name}</Text>
        <Text style={styles.email}><Icon name="mail" style={styles.eIcon} /> {item.email}</Text>
        <Text style={styles.address}><Icon name="location" style={styles.eIcon} /> {item.address}</Text>
        <View style={styles.contactWrap}>
          <TouchableOpacity
            onPress={() => {
              dialCall(item.contact_number);
            }}>
            <View style={styles.contact}>
              <Image source={require('../../Image/phone.png')} style={styles.Phoneicon} />
              <Text style={styles.contactNumber}>{item.contact_number}</Text>
            </View>
          </TouchableOpacity>
          {/* {item.mobile_number !== '' && (
            <TouchableOpacity
              onPress={() => {
                dialCall(item.contact_number);
              }}>
              <View style={styles.contact}>
                <Image source={require('../../Image/phone.png')} style={styles.Phoneicon}/>
                <Text style={styles.contactNumber}>{item.mobile_number}</Text>
              </View>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
      {/* <View style={styles.rightView}>
        {item.status === 1 && <Text style={styles.statusOpen}>Open</Text>}
        {item.status === 0 && <Text style={styles.statusClose}>Close</Text>}
      </View> */}
    </View>
  );

  // const getMoreData = () => { };

  const services = ({ item }) => {
    return (
      <Service navigation={navigation} item={item} style={styles.flatListBox} />
    );
  };

  const dataKeys = Object.keys(data);
  return (
   
      <AuthContainer>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.mainView}>
          <View style={styles.headerBG} >
            <Heading style={styles.titleText}>Services</Heading>
            <Image source={require('../../Image/add.png')} style={styles.headerImage} />
          </View>
          <View style={styles.roudedLayout}>
            <View style={styles.container}>
              {dataKeys.length
                ? dataKeys.map((key) => (
                  <>
                    <Text style={styles.servicesHeading}>
                      {data[key].categoryname}
                    </Text>

                    <View style={styles.listWrap}>
                      <FlatList
                        data={data[key].items || []}
                        renderItem={services}
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
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                          />
                        }
                      />
                    </View>
                  </>
                ))
                : null}
            </View>
          </View>
          <EmergencyAlarmModal setLoading={setLoading} />
          <Loading loading={loading} />
        </ScrollView>
      </AuthContainer>

  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: 15,
  },
  headerImage: {
    position: 'absolute',
    right: 20,
    top: 15,
    width: 150,
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
    top: 50,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  flatListBox: {
    backgroundColor: '#FEFEFE',
    borderRadius: 10,
  },
  servicesHeading: {
    fontSize: 30,
    color: '#555',
    paddingVertical: 10,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 5,
  },
  contactWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    fontSize: 18,
    color: '#555',
  },
  Phoneicon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  email: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  address: {
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  eIcon: {
    fontSize: 18,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
