import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Button,
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
import { spacing } from '../constants/appStyles';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function ParcelsScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pending, setPending] = React.useState(styles.pendingColor);
  const [received, setReceived] = React.useState(styles.receivedColor);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getServices(0);
  }, []);
  React.useEffect(function () {
    getServices(0);
  }, []);

  function getServices(status) {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        if (status === 1) {
          setReceived(styles.pendingColor);
          setPending(styles.receivedColor);
        } else {
          setReceived(styles.receivedColor);
          setPending(styles.pendingColor);
        }
        axios
          .post(
            `${BASE_URL}/parcels`,
            {
              company_id: userDetails.details.company_id,
              unit_id: userDetails.details.unit_id,
              user_id: userDetails.details.id,
              status: status,
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
            console.log(response);
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

  const Parcels = ({ item, onPress, style }) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Image source={require('../../Image/Parcel.png')} style={styles.ParcelImage} />
      </View>
      <View style={styles.rightView}>
        <Text style={styles.name}>{item.unit}</Text>
        <Text style={styles.totalParcel}>Total Parcel : {item.total_parcel}</Text>
        <Text style={styles.parcelDate}>{Moment(item.created_at).format('Do MMM, yyyy HH:mm')}</Text>
        {item.name !== '' && item.name !== null && (
          <Text style={styles.colletby}>Collected By : {item.name}</Text>
        )}
      </View>
    </View>
  );

  const parcels = ({ item }) => {
    return <Parcels item={item} style={styles.flatListBox} />;
  };
  return (
    <AuthContainer>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={styles.mainView}>
        
          <View style={styles.headerBG} >
            <Heading style={styles.titleText}>Parcels</Heading>
            <Image source={require('../../Image/car.png')} style={styles.headerImage} />
          </View>
          <View style={styles.roudedLayout}>
            <SafeAreaView style={styles.container}>
              <View style={styles.fixToText}>
                <TouchableOpacity
                  onPress={() => {
                    getServices(0);
                  }}>
                  <Text style={[styles.buttonPending, pending]}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    getServices(1);
                  }}>
                  <Text style={[styles.buttonReceived, received]}>Received</Text>
                </TouchableOpacity>
              </View>
              {data == '' ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: spacing(50),
                    paddingHorizontal: spacing(15),
                  }}>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>
                    No parcel records found
              </Text>
                </View>
              ) : null}
              <View style={styles.listWrap}>
                {data && (
                  <FlatList
                    data={data}
                    renderItem={parcels}
                    keyExtractor={(item) => 'par' + item.id}
                  />
                )}
              </View>
            </SafeAreaView>
          </View>
     
      </ScrollView>
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
  headerImage: {
    position: 'absolute',
    right: 40,
    top: 5,
    width: 116,
    height: 115,
  },
  roudedLayout: {
    flex: 1,
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
  listWrap: {
    marginTop: 20,
  },
  flatListBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 5,
  },
  leftView: {
    width: '27%',
    padding: 10,
    backgroundColor: '#EDB43C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ParcelImage: {
    width: 47,
    height: 40,
  },
  rightView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '73%',
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalParcel: {
    textAlign: 'right',
    color: '#777',
  },
  parcelDate: {
    textAlign: 'right',
    color: '#777',
  },
  colletby: {
    textAlign: 'right',
    color: '#777',
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
  iconSize: {
    fontSize: 16,
  },
  fixToText: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 15,
  },
  buttonPending: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  buttonReceived: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 20,
  },
  pendingColor: {
    color: '#FFF',
    backgroundColor: '#000',
  },
  receivedColor: {
    color: '#000',
    backgroundColor: '#FFF',
  },
});
