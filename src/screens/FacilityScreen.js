import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  StatusBar,
  ScrollView,
  RefreshControl,
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
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function FacilityScreen({ navigation }) {
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
    getFacilities();
  }, []);
  React.useEffect(function () {
    getFacilities();
  }, []);

  function getFacilities() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log(userDetails);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/facilities`,
            {
              company_id: userDetails.details.company_id,
              unit_id: userDetails.details.unit_id,
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
            `${BASE_URL}/facilities`,
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

  const Facilities = ({ item, onPress, style }) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Text style={styles.name}>{item.facility_name}</Text>
        <Text style={styles.provider}>{item.contact}</Text>
        <Text style={styles.contact}>
          <Icon name="time-outline" style={styles.iconSize} /> {item.availability}
        </Text>
        <Text>{item.description}</Text>
      </View>
      <View style={styles.rightView}>
        {item.status === 1 && <Text style={styles.statusOpen}>Open</Text>}
        {item.status === 0 && <Text style={styles.statusClose}>Close</Text>}
      </View>
    </View>
  );

  const facility = ({ item }) => {
    return <Facilities item={item} style={styles.flatListBox} />;
  };
  return (
    <AuthContainer>
      <ScrollView>
      
          <SafeAreaView style={styles.mainView}>
            <View style={styles.headerBG} >
              <Heading style={styles.titleText}>Facilities</Heading>
              <Image source={require('../../Image/add.png')} style={styles.headerImage} />
            </View>
            <View style={styles.roudedLayout}>
              <View style={styles.container}>
                <View style={styles.listWrap}>
                  {data && (
                    <FlatList
                      data={data}
                      renderItem={facility}
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
            <EmergencyAlarmModal setLoading={setLoading} />
            <Loading loading={loading} />
          </SafeAreaView>
   
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
    top: 10,
    width: 150,
    height: 115,
  },
  headerBG: {
    position: 'relative',
    height: 180,
    width: '100%',
    backgroundColor: '#EDB43C',
    // backgroundColor: '#FFF',
  },
  titleText: {
    position: 'absolute',
    top: 50,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  roudedLayout: {
    marginTop: -36,
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
  },
  listWrap: {
    marginTop: 20,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 10,
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
    fontSize: 18,
    marginVertical: 0,
    fontWeight: 'bold',
  },
  provider: {
    marginTop: 5,
    marginBottom: 5,
    color: '#888',
  },
  contact: {
    marginBottom: 5,
    color: '#888',
  },
  iconSize: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
