import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import { Heading } from '../components/Heading';
import { UserContext } from '../contexts/UserContext';
import { Loading } from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import FeedCard from '../components/FeedCard';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import SecureStorage from 'react-native-secure-storage';
import { BASE_URL } from '../config';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function FeedsCommentScreen({ route, navigation }) {
  const { logout } = useContext(AuthContext);
  const switchTheme = useContext(ThemeContext);
  const { token } = useContext(UserContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedFeed, feedLiked } = route.params;
  const [appUser, setAppUser] = useState();
  const [title, setTitle] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [liked, setLike] = useState(feedLiked);
  const [localLikeCount, setLocalLikeCount] = useState(parseInt(selectedFeed.likesCount));
  const [keyboardOffset, setKeyboardOffset] = useState(20);
  const onKeyboardShow = event =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(20);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow,
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    setLoading(true);
    SecureStorage.getItem('user').then(user => {
      const userDetails = JSON.parse(user);
      console.log(userDetails);
      setAppUser(userDetails.details);
      axios
        .post(
          `${BASE_URL}/getComment`,
          {
            feed_id: selectedFeed.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(response => {
          setLoading(false);
          var dataSource = response.data[0].feed;
          setData(dataSource);
          console.log(response.data.feed);
        })
        .catch(error => {
          setLoading(false);
          console.log(error.response.data);
        });
    });
  };

  const onSubmit = () => {
    axios
      .post(
        `${BASE_URL}/postComment`,
        {
          feed_id: selectedFeed.id,
          comment: title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setLoading(false);
        getComments();
        setTitle('');
        setShowSubmit(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error.response.data);
      });
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }

  const like = () => {
    axios
      .post(
        `${BASE_URL}/likePost`,
        { feed_id: selectedFeed.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setLoading(false);
        setLike(true);
        setLocalLikeCount(localLikeCount + 1)
        console.log(response);
      })
      .catch(e => {
        setLoading(false);
        console.log(e.response.data);
      });
  };

  const dislike = () => {
    axios
      .post(
        `${BASE_URL}/disLikePost`,
        { feed_id: selectedFeed.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setLoading(false);
        setLike(false);
        setLocalLikeCount(localLikeCount - 1)
        console.log(response);
      })
      .catch(e => {
        setLoading(false);
        console.log(e.response.data);
      });
  };

  const onLike = () => {
    if (liked) {
      dislike();
    } else {
      like();
    }
  };

  const header = () => {
    return (
      <View>
        <ImageBackground
          source={require('../../Image/plain-background.png')}
          style={styles.headerBG}>
          <Icon
            name="arrow-back"
            style={styles.backicon}
            onPress={() => navigation.goBack()}
          />
          <Heading style={styles.titleText}>Message Board</Heading>
        </ImageBackground>
        <FeedCard
          owner={selectedFeed.owner}
          userimage={selectedFeed.userimage}
          hideEditOptions={true}
          createDate={selectedFeed.createDate}
          description={selectedFeed.description}
          images={selectedFeed.properties}
          likesCount={localLikeCount}
          liked={liked}
          commentsCount={selectedFeed.commentsCount}
          onLike={() => onLike()}
        />
      </View>
    );
  };
  const footer = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: keyboardOffset,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: 'white',
        }}>
        <View style={styles.leftView}>
          <View style={styles.chaticonContainer}>
            {appUser && appUser.image ? (
              <Image
                style={styles.chaticonContainer}
                source={{ uri: appUser.image }}
              />
            ) : (
              <Icon name="person" style={styles.iconSize} />
            )}
          </View>
        </View>
        <TextInput
          placeholder="Post a message"
          style={styles.textInput}
          paddingLeft={12}
          paddingRight={12}
          value={title}
          onChangeText={text => {
            setTitle(text);
            setShowSubmit(text.length > 0);
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
        {showSubmit && (
          <Icon
            name="send"
            style={styles.sendIcon}
            onPress={() => {
              onSubmit();
            }}
          />
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View style={styles.leftView}>
          <View style={styles.iconContainer}>
            {item.userimage ? (
              <Image
                style={styles.iconContainer}
                source={{ uri: item.userimage }}
              />
            ) : (
              <Icon name="person" style={styles.iconSize} />
            )}
          </View>
        </View>
        <View style={styles.rightView}>
          <Text style={styles.name}>{item.username}</Text>
          <Text>{Moment(item.created_at).fromNow()}</Text>
          <Text style={styles.description}>{item.comment}</Text>
        </View>
      </View>
    );
  };

  return (
   
      <AuthContainer>
        <ScrollView
          style={{
            marginBottom: keyboardOffset + 50,
          }}>
          {header()}
          <FlatList
            contentContainerStyle={{}}
            scrollEnabled={false}
            // ListFooterComponent={header()}
            style={{
              marginBottom: keyboardOffset + 50,
            }}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => 'ses' + item.id}
          />
        </ScrollView>
        {/* <EmergencyAlarmModal setLoading={setLoading} /> */}
        {footer()}
        <Loading loading={loading} />
      </AuthContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#ffffff',
    paddingLeft: 15,
    paddingVertical: 15,
  },
  leftView: {
    width: '15%',
  },
  rightView: {
    width: '85%',
    paddingLeft: 10,
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
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  description: {
    marginVertical: 10,
    fontWeight: '200',
  },
  descriptionImage: {
    height: 250,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#999',
  },
  iconSize: {
    fontSize: 25,
    color: '#999',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2CBB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBG: {
    //position: 'absolute',
    height: 180,
    width: '100%',
    top: 0,
  },
  backicon: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 30,
  },
  chatIcon: {
    color: '#999',
    fontSize: 20,
  },
  sendIcon: {
    color: '#EDB43C',
    fontSize: 25,
    marginRight: 10,
  },
  chaticonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    position: 'absolute',
    top: 100,
    left: 10,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    height: 50,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 40,
  },
});
