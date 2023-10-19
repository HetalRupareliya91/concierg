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
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import Moment from 'moment';
import {
  FAB,
  Modal,
  Portal,
  TouchableOpacity,
  Text as PapaerText,
  TextInput,
  Button,
  Provider,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export const defaultMaleImage = 'public/front/images/nomale.png';
export const defaultFeMaleImage = 'public/front/images/nofemale.jpg';
export function ChatScreen({ navigation, route }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const scrollRef = useRef(null);
  const { selectedFeed, feedLiked, backScreen } = route.params;
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
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
    message: yup.string().required('Message is Required'),
  });
  const scrollViewRef = useRef();
  console.log("route.params;", route.params)
  const onRefresh = React.useCallback(() => {

    setRefreshing(true);
    getServices();
  }, []);
  React.useEffect(function () {

    getServices();
  }, []);

  function sendIssue(issue) {
    setLoading(true);
    var data = {
      company_id: appUser.company_id,
      sender_id: appUser.id,
      receiver_id: selectedFeed.id,
      message: issue.message,
      creationTime: new Date().getTime() / 1000

    }
    console.log("chat submit", data)
    axios
      .post(
        `${BASE_URL}/send-message`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        setLoading(false);
        console.log(response);
        getServices();
        setVisible(false);
      })
      .catch(function (e) {
        setLoading(false);
        setError(e.response.data.msg);
        setLoading(false);
        console.log(e.response.data);
      });
  }

  function getServices() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/get-chat`,
            {
              company_id: userDetails.details.company_id,
              sender_id: userDetails.details.id,
              receiver_id: selectedFeed.id,
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
            `${BASE_URL}/get-chat`,
            {
              company_id: userDetails.details.company_id,
              sender_id: userDetails.details.id,
              receiver_id: selectedFeed.id,
              page: pageNumber,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(async function (response) {
            console.log("response", response)
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

  const Indepth = ({ item, onPress, style }) => {

    return (
      <View>
        <View style={styles.inMsgWrap}>
          <Image
            style={styles.profileImg}
            source={{ uri: item.image }}
          />
          <Text style={styles.inMsgContent}>{item.message}</Text>
        </View>
        <Text style={styles.inmsgTime}>{item.creationTime && Moment.unix(parseInt(item.creationTime)).fromNow()}</Text>
      </View>
    )
  };

  const Indepths = ({ item, onPress, style }) => {

    return (
      <View>
        <View style={styles.inMsgWrap}>
          <Image source={{ uri: item.gender == 'male' ? CONFIG_URL + defaultMaleImage : CONFIG_URL + defaultFeMaleImage }} style={styles.profileImg} />
          <Text style={styles.inMsgContent}>{item.message}</Text>
        </View>
        <Text style={styles.inmsgTime}>{item.creationTime && Moment.unix(parseInt(item.creationTime)).fromNow()}</Text>
      </View>
    )
  };

  const Service = ({ item, onPress, style }) => {
    return (
      <View>
        <View style={styles.outMsgWrap}>
          <Text style={styles.outMsgContent}>{item.message}</Text>
          <Icon name="checkmark-done-outline" style={styles.readIcon} />
        </View>
        <Text style={styles.outmsgTime}>{item.creationTime && Moment.unix(parseInt(item.creationTime)).fromNow()}</Text>
      </View>
    )
  };

  const services = ({ item }) => {
    if (item.sender_id == appUser.id) {
      return <Service item={item} style={styles.flatListBox} />;
    }
    else {
      if (item.image != '') {
        return <Indepth item={item} style={styles.flatListBox} />;
      }
      else {
        return <Indepths item={item} style={styles.flatListBox} />;
      }
    }
  };

  const deleteFeedAlert = (feed_id) =>
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete selected Note ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => deleteFeed(feed_id) },
      ],
      { cancelable: false },
    );

  const deleteFeed = (feed_id) => {
    axios
      .post(
        `${BASE_URL}/delete-notes`,
        {
          note_id: feed_id,
          user_id: appUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        getServices();
        setVisible(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.response.data.msg);
        console.log(e.response.data);
      });
  };

  const onDelete = (id) => {
    console.log('onload', id)
    //deleteFeedAlert(id);
  };

  return (
    <AuthContainer>
      <View style={{ flex: 1 }}>


        {/* <ScrollView style={styles.chatContainer} ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
             */}
        <View>
          <ImageBackground
            source={require('../../Image/chat.png')}
            style={styles.headerBG} >
            <Heading style={styles.titleText}>{selectedFeed.first_name} {selectedFeed.last_name} <Icon name="ellipse" style={selectedFeed.livestatus == 'active' ? styles.online : styles.offline} /></Heading>
          </ImageBackground>
        </View>
        {data && (
          <FlatList
            ref={scrollViewRef}

            data={data}
            inverted
            renderItem={services}
            keyExtractor={(item) => 'ses' + item.id}
            initialNumToRender={10}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (isLoadMore) {
                getMoreData();
              }
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        {/* </ScrollView> */}

        <EmergencyAlarmModal setLoading={setLoading} />
        <Loading loading={loading} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>

          <View style={{
            //  paddingBottom: 40,
            backgroundColor: '#fff'
          }}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                message: '',
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                sendIssue(values);
                resetForm();
                setSubmitting(false);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  <View style={styles.msgTypeWrap}>
                    <TextInput style={styles.input}
                      onFocus={() => {
                        console.log("scrollRef", scrollViewRef)
                      }}
                      name="message"
                      placeholder="Type Message here..."
                      underlineColorAndroid='rgba(0,0,0,0)'
                      onChangeText={handleChange('message')}
                      onBlur={handleBlur('message')}
                      value={values.message}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                    <Text style={styles.sendMsg}><Icon name="send" style={styles.sendIcon} onPress={handleSubmit} /></Text>
                  </View>

                </>
              )}
            </Formik>

          </View>
        </KeyboardAvoidingView>


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
  online: {
    fontSize: 14,
    color: 'green',
  },
  offline: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  container: {
    // paddingHorizontal: 15,
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
    flex: 1,
  },
  chatContainer: {
    height: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  inMsgWrap: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  profileImg: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginRight: 10,
  },
  inMsgContent: {
    // flex: 1,
    maxWidth: '90%',
    backgroundColor: '#F7F7F8',
    color: '#333',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    textAlign: 'left',
  },
  outMsgWrap: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  outMsgContent: {
    backgroundColor: '#FDD88D',
    color: '#333',
    // flex: 1,
    maxWidth: '90%',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    textAlign: 'left',
  },
  readIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  msgTypeWrap: {
    height: 80,
    bottom: 0,
    left: 0,
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 50,
    width: '100%',
    paddingRight: 30,
    backgroundColor: '#F7F7F8',
    borderRadius: 0,
    color: '#333',
    paddingLeft: 10,
    fontWeight: '700',
  },
  sendMsg: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  sendIcon: {
    fontSize: 26,
    color: '#979797',
  },
  inmsgTime: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: 50,
    marginBottom: 15,
    fontSize: 10,
  },

  outmsgTime: {
    marginBottom: 15,
    width: '100%',
    textAlign: 'right',
    paddingRight: 50,
    fontSize: 10,
  },
});






