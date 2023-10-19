import React, { useRef } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { BASE_URL } from '../config';
import { CONFIG_URL } from '../config';
import { Loading } from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import Moment from 'moment';
import {
  FAB,
  Modal,
  Portal,
  Text as PapaerText,
  TextInput,
  Button,
  Provider,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export const defaultMaleImage = 'public/front/images/nomale.png';
export const defaultFeMaleImage = 'public/front/images/nofemale.jpg';

export function ChatListingScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const scrollRef = useRef();
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const isFocused = useIsFocused();
  // alert(isFocused)
  const containerStyle = {
    backgroundColor: '#FFF',
    padding: 30,
    marginHorizontal: 15,
    borderRadius: 30,
    borderColor: '#FFF',
    borderWidth: 2.5,
  };
  const [error, setError] = React.useState('');
  const validationSchema = yup.object().shape({
    title: yup.string().required('Title is Required'),
    description: yup.string().required('Note is Required'),
  });




  const onRefresh = React.useCallback(() => {

    setRefreshing(true);
    getServices();
  }, []);


  React.useEffect(function () {
    getServices();


  }, [isFocused]);

  // useFocusEffect(() => {

  //  getServices();

  //     return () => getServices();

  // }, [data])

  function getServices() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        var data = {
          company_id: userDetails.details.company_id,
          user_id: userDetails.details.id,

        }
        console.log("comsdf", data)
        axios
          .post(
            `${BASE_URL}/listing-chat`,
            {
              company_id: userDetails.details.company_id,
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
            console.log('CheckData', response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log("chat", error.response.data);
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
            `${BASE_URL}/get-notes`,
            {
              user_id: userDetails.details.id,
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



  const Service = ({ item, onPress, style }) => {
    console.log("Service", item)
    return (
      <TouchableOpacity
        onPress={() => {
          // alert(1)
          navigation.navigate('Chat', { selectedFeed: item, onRefresh: onRefresh })
        }}>
        <View style={[styles.chatWrap, { backgroundColor: item.unReadCount > 0 ? '#fff5e1' : 'transaparent' }]}>

          <View>
            <Image source={{ uri: item.image }} style={styles.profileImg} />
            <Icon name="ellipse" style={item.livestatus == 'active' ? styles.online : styles.offline} />
          </View>

          <View style={styles.contactInfo}>
            <Text
              style={styles.contactName}
              onPress={() => {
                navigation.navigate('Chat', { selectedFeed: item })
              }}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.msgText}>{item.lastmessage}</Text>
          </View>

          <View style={styles.rightContent}>
            {
              item.unReadCount > 0 &&
              <View style={styles.unread}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.unReadCount}</Text>
              </View>
            }

            <Text style={styles.msgTime}>{item.lastMessageCreationTime && Moment.unix(parseInt(item.lastMessageCreationTime)).fromNow()}</Text>
          </View>
        </View>
      </TouchableOpacity>
      /* <View style={styles.chatWrapSelected}>*/
    )
  };

  const Indepths = ({ item, onPress, style }) => (

    <TouchableOpacity
      onPress={() => {

        navigation.navigate('Chat', { selectedFeed: item, })
      }}>
      <View style={[styles.chatWrap, { backgroundColor: item.unReadCount > 0 ? '#fff5e1' : 'transaparent' }]}>

        <View>
          <Image source={{ uri: item.gender == 'male' ? CONFIG_URL + defaultMaleImage : CONFIG_URL + defaultFeMaleImage }} style={styles.profileImg} />
          <Icon name="ellipse" style={item.livestatus == 'active' ? styles.online : styles.offline} />
        </View>
        <View style={styles.contactInfo}>
          <Text
            style={styles.contactName}
            onPress={() => {
              // alert(1)
              navigation.navigate('Chat', { selectedFeed: item, onRefresh: onRefresh() })
            }}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.msgText}>{item.lastmessage}</Text>
        </View>
        <View style={styles.rightContent}>
          {
            item.unReadCount > 0 &&
            <View style={styles.unread}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.unReadCount}</Text>
            </View>
          }
          <Text style={styles.msgTime}>{item.lastMessageCreationTime && Moment.unix(parseInt(item.lastMessageCreationTime)).fromNow()}</Text>
          {/* <View><Icon name="ellipse" style={item.livestatus == 'active' ? styles.online : styles.offline} /></View> */}
        </View>
      </View>
    </TouchableOpacity >
    /* <View style={styles.chatWrapSelected}>*/
  );

  const services = ({ item }) => {
    if (item.concierge_image != '') {
      return <Service item={item} style={styles.flatListBox} />;
    }
    else {
      return <Indepths item={item} style={styles.flatListBox} />;
    }
  };

  return (

    <AuthContainer style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.mainView}>
          <View>

            <ImageBackground
              source={require('../../Image/chat.png')}
              style={styles.headerBG} >
              <Heading style={styles.titleText}>Chat</Heading>
            </ImageBackground>

          </View>
          <View style={styles.container} >
            {/* <View style={styles.search}>
              <TextInput style={styles.input}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Search..."
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View> */}
            <ScrollView style={styles.chatContainer}>
  
              {data && (
                <FlatList
                  data={data}
                  horizontal={false}
                  renderItem={services}
                  keyExtractor={(item) => 'ses' + item.id}
                  initialNumToRender={10}
                  onEndReachedThreshold={0.1}
                  onEndReached={() => {
                    if (isLoadMore) {
                      getMoreData();
                    }
                  }}
                  // ListFooterComponent={renderFooter}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                />
              )}

            </ScrollView>
            <EmergencyAlarmModal setLoading={setLoading} />
            <Loading loading={loading} />
          </View>
        </View>
      </View>
    </AuthContainer>

  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  headerBG: {
    position: 'relative',
    height: 180,
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
  container: {
    flexDirection: 'column',
    position: 'relative',
    flex: 1,
  },
  input: {
    marginHorizontal: 20,
    height: 50,
    marginBottom: -2,
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'rgba(0,0,0,0)',
    color: '#999'
  },
  search: {
    overflow: 'hidden',
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    elevation: 0,
    borderColor: '#F7F7F8',
    borderWidth: 0,
    borderRadius: 25,
    backgroundColor: '#F7F7F8',
    opacity: 1,
    top: 0,
    zIndex: 1
  },
  chatWrap: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,

  },
  unread: {
    padding: 5,
    backgroundColor: '#000',
    fontWeight: 'bold',
    borderRadius: 360,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatWrapSelected: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    backgroundColor: '#E9E9E9',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  msgText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
  rightContent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  online: {
    // marginTop: 5,
    // textAlign: 'right',
    position: 'absolute',
    right: 5,
    bottom: 0,
    fontSize: 17,
    color: 'green',
  },
  offline: {
    // marginTop: 5,
    // textAlign: 'right',
    position: 'absolute',
    right: 5,
    bottom: 0,
    fontSize: 17,

    color: '#8A8A8A',
  },
  msgTime: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: 10,
  },

});
