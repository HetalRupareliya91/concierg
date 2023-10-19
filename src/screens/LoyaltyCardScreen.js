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

export function LoyaltyCardScreen({ navigation }) {
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

    let url = isFilter ? 'loyalty-card-stores' : 'loyalty-card-stores';
    setData({});
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        const data = isFilter ? filterData : {};
        axios
          .post(
            `${BASE_URL}/loyalty-card-stores`,
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
            `${BASE_URL}/loyalty-card-stores`,
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
          <ActivityIndicator color="#FFF" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const Service = ({ item, onPress, style, navigation }) => (
    window.myVar = item.store_offers,

    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Text style={styles.name}>{item.store_name}</Text>
        <Text style={styles.storeAddres}>{item.store_address}</Text>
        <View style={styles.storeOfferWrap}>
          <Text style={styles.storeOfferlbl}>Store Offers:</Text>
          <Text style={styles.storeOffer}>{window.myVar}</Text>
        </View>
      </View>
    </View>
  );

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={styles.mainView}>
        <View style={styles.headerBG} >
          <Heading style={styles.titleText}>Loyalty Store</Heading>
          <Image source={require('../../Image/loyaltistore.png')} style={styles.headerImage} />
        </View>
        <View style={styles.roudedLayout}>
          <SafeAreaView
            style={styles.container}
            keyboardShouldPersistTaps="handled">
            {dataKeys.length
              ? dataKeys.map((key) => (
                <>
                  <Text style={styles.catTitle}>
                    {data[key].categoryname}
                  </Text>

                  <View style={styles.listingWrap}>
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
            <EmergencyAlarmModal setLoading={setLoading} />
          </SafeAreaView>
          <Loading loading={loading} />
        </View>
      </ScrollView>
    </AuthContainer>
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
    width: 146,
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
  catTitle: {
    fontSize: 28,
    marginHorizontal: 16,
    marginBottom: 20,
    color: '#555',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  listWrap: {
    marginBottom: 20,
  },
  flatListBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#EDB43C',
    borderWidth: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  leftView: {
    width: '100%',
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
  storeAddres: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
  },
  storeOfferWrap: {
    flexDirection: 'row',
  },
  storeOfferlbl: {
    fontSize: 16,
  },
  storeOffer: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: '#EDB43C',
    color: '#FFF',
    marginLeft: 5,
  },
  contact: {
    marginTop: 5,
  },
  iconSize: {
    fontSize: 35,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});