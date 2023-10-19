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
  TouchableOpacity,
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

export function AboutApartmentScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [aboutInfo, setInfo] = React.useState();
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
        console.log(userDetails.details);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/about-apartments`,
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
            console.log(response.data.data);
            setData(response.data.data);
            setInfo(response.data.data);
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

  return (
    <AuthContainer>
      <ScrollView>
        <SafeAreaView style={styles.mainView}>
          
            <View style={styles.headerBG} >
              <Heading style={styles.titleText}>About {"\n"} Apartment</Heading>
              <Image source={require('../../Image/apartment.png')} style={styles.headerImage} />
            </View>
            <View style={styles.roudedLayout}>
              <View style={styles.container}>
                <View>
                  {/* {data && data.floor_plan !== '' && data.floor_plan !== null && ( */}
                  <TouchableOpacity style={styles.buttonStyle}
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate('UpdateInfo', { data });
                    }}>
                    <Text style={styles.buttonTextStyle}><Icon name="pencil" style={{ fontSize: 30, }} /></Text>
                  </TouchableOpacity>
                  {/* )} */}
                </View>
                <View style={styles.listWrap}>
                  {console.log('app', data)}
                  <View style={[styles.item]}>
                    <View style={styles.topSection}>
                      <View style={[styles.topInfoWrap, styles.borderRight]}>
                        <Text style={styles.infoLbl}>Building Name</Text>
                        {data && data.image !== '' && data.image !== null && (
                          <Text style={styles.infoAns}>{data.image}</Text>
                        )}
                      </View>
                      <View style={[styles.topInfoWrap, styles.borderRight]}>
                        <Text style={styles.infoLbl}>Flat Number</Text>
                        {data && data.owner !== '' && data.owner !== null && (
                          <Text style={styles.infoAns}>{data.owner}</Text>
                        )}
                      </View>
                      {/* <View style={styles.topInfoWrap}>
                        <Text style={styles.infoLbl}>Flat No</Text>
                        <Text style={styles.infoAns}>201</Text>
                      </View> */}
                    </View>
                    <View style={styles.middleSection}>
                      <View style={[styles.parkingInfo, styles.aminityInfo]}>
                        <View style={styles.aminityLeft}>
                          <View style={styles.aminityIcon}>
                            <Image source={require('../../Image/parking.png')} style={styles.parkingImg} />
                          </View>
                        </View>
                        <View style={styles.aminityRight}>
                          <Text style={[styles.aminityTitle, styles.parkingTitle]}>Parking Information</Text>
                          {data && data.parking !== '' && data.parking !== null && (
                            <Text style={styles.aminityArea}>{data.parking}</Text>
                          )}

                          {/* <Text style={styles.aminityDetail}>TD58 HEE, Mercedes Benz</Text> */}
                        </View>
                      </View>
                      <View style={[styles.securityInfo, styles.aminityInfo]}>
                        <View style={styles.aminityLeft}>
                          <View style={styles.aminityIcon}>
                            <Image source={require('../../Image/security.png')} style={styles.SecurityImg} />
                          </View>
                        </View>
                        <View style={styles.aminityRight}>
                          <Text style={[styles.aminityTitle, styles.securityTitle]}>24*7 Concierge</Text>
                          {data && data.concierge !== '' && data.concierge !== null && (
                            <Text style={styles.aminityArea}>{data.concierge}</Text>
                          )}
                        </View>
                      </View>
                      <View style={[styles.fitnessInfo, styles.aminityInfo]}>
                        <View style={styles.aminityLeft}>
                          <View style={styles.aminityIcon}>
                            <Image source={require('../../Image/fitness.png')} style={styles.parkingImg} />
                          </View>
                        </View>
                        <View style={styles.aminityRight}>
                          <Text style={[styles.aminityTitle, styles.fitnessTitle]}>Fitness Centre</Text>
                          {data && data.fitness !== '' && data.fitness !== null && (
                            <Text style={styles.aminityArea}>{data.fitness}</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* {data && ( */}
                  <View style={[styles.item]}>
                    <View style={styles.buildingInfoWrap}>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Type of Paint</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.type_of_paint !== '' && data.type_of_paint !== null && (
                          <Text style={styles.appInfoDesc}>{data.type_of_paint}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Lightbulbs</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.lightbulbs !== '' && data.lightbulbs !== null && (
                          <Text style={styles.appInfoDesc}>{data.lightbulbs}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Window sizes</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.window_sizes !== '' && data.window_sizes !== null && (
                          <Text style={styles.appInfoDesc}>{data.window_sizes}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Oven</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.oven !== '' && data.oven !== null && (
                          <Text style={styles.appInfoDesc}>{data.oven}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Fridge</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.fridge !== '' && data.fridge !== null && (
                          <Text style={styles.appInfoDesc}>{data.fridge}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Dishwasher</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.dishwasher !== '' && data.dishwasher !== null && (
                          <Text style={styles.appInfoDesc}>{data.dishwasher}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Washing Machine / Dryer</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.washing_machine !== '' && data.washing_machine !== null && (
                          <Text style={styles.appInfoDesc}>{data.washing_machine}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Boiler Information</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.boiler_information !== '' && data.boiler_information !== null && (
                          <Text style={styles.appInfoDesc}>{data.boiler_information}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Air Conditioning</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.air_conditioning !== '' && data.air_conditioning !== null && (
                          <Text style={styles.appInfoDesc}>{data.air_conditioning}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Heating</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.heating !== '' && data.heating !== null && (
                          <Text style={styles.appInfoDesc}>{data.heating}</Text>
                        )}
                      </View>
                      <View style={styles.aprtmentInfoWrap}>
                        <Text style={styles.appInfoTitle}>Hob</Text>
                        {data == null && (
                          <Text style={styles.appInfoDesc}> N/A </Text>
                        )}
                        {data && data.hob !== '' && data.hob !== null && (
                          <Text style={styles.appInfoDesc}>{data.hob}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {/* )} */}
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
    width: 111,
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
    top: 30,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  roudedLayout: {
    position: 'relative',
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
  topSection: {
    borderWidth: 1,
    borderColor: '#888',
    paddingVertical: 10,
    marginBottom: 30,
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
  },
  topInfoWrap: {
    paddingHorizontal: 10,
    width: '50.33%',
  },
  aminityInfo: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  parkingImg: {
    width: 30,
    height: 30,
  },
  SecurityImg: {
    width: 24,
    height: 30,
  },
  parkingInfo: {
    backgroundColor: '#F3F1EE',
  },
  securityInfo: {
    backgroundColor: '#FFEFE7',
  },
  fitnessInfo: {
    backgroundColor: '#EFF9F8',
  },
  parkingTitle: {
    color: '#333689',
  },
  securityTitle: {
    color: '#93502F',
  },
  fitnessTitle: {
    color: '#358B82',
  },
  aminityLeft: {
    width: '20%',
  },
  aprtmentInfoWrap: {
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: '#888',
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  appInfoDesc: {
    fontSize: 16,
    color: '#555',
  },
  aminityIcon: {
    display: 'flex',
    alignItems: 'center',
    width: 56,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  aminityRight: {
    width: '80%',
  },
  aminityTitle: {
    width: '100%',
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  aminityArea: {
    width: '100%',
    fontSize: 16,
    color: '#888',
    textAlign: 'right',
  },
  aminityDetail: {
    width: '100%',
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: '#999',
  },
  infoLbl: {
    width: '100%',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  infoAns: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
  buttonStyle: {
    position: 'absolute',
    top: 0,
    left: '50%',
    zIndex: 99,
    marginTop: -70,
    marginLeft: -35,
    width: 70,
    height: 70,
    backgroundColor: '#EDB43C',
    borderRadius: 60,
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: '#FFF',
    width: 70,
    height: 70,
    paddingVertical: 20,
    fontWeight: 'bold',
  },
});
