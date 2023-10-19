import axios from 'axios';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import SecureStorage from 'react-native-secure-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import AddFeed from '../components/AddFeed';
import { AuthContainer } from '../components/AuthContainer';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import FeedCard from '../components/FeedCard';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function FeedsScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState([]);
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [editFeed, setEditFeed] = React.useState();
  const [error, setError] = React.useState('');
  const scrollRef = useRef();
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFeeds();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFeeds();
    });
    return unsubscribe;
  }, [navigation]);

  const reset = () => {
    setEditFeed(null);
  };

  function addFeed(postItem) {
    setLoading(true);
    const formData = new FormData();
    formData.append('description', postItem.description);
    formData.append('company_id', appUser.company_id);
    formData.append('user_id', appUser.id);
    if (editFeed) {
      formData.append('feed_id', editFeed.id);
    }


    console.log("postItem.user_feed_image", postItem.user_feed_image)

    if (postItem.user_feed_image.length > 0) {
      postItem.user_feed_image.map((anImage) => {
        if (anImage.path) {
          const newFile = {
            uri: anImage.path,
            name: 'image.jpg',
            type: anImage.mime,
          };
          formData.append('user_feed_image[]', newFile);
        }
      });
    }
    console.log("formData", formData)
    if (postItem.deleted_images.length > 0) {
      var imagesArray = [];
      postItem.deleted_images.map((anImage) => {
        var filename = anImage.substring(anImage.lastIndexOf('/') + 1);
        imagesArray.push(filename);
        // formData.append('deleted_images', filename});
        // formData.append('deleted_images', filename);
      });
      //   for (var i = 0; i < imagesArray.length; i++) {
      //     formData.append('deleted_images[]', imagesArray[i]);
      // }
      formData.append('deleted_images', imagesArray.toString());
    }
    var url = editFeed ? `${BASE_URL}/update-feed` : `${BASE_URL}/add-feeds`;
    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      })
      .then(function (response) {
        setEditFeed(null);
        setLoading(false);
        console.log(response);
        getFeeds();
        setVisible(false);
      })
      .catch(function (e) {
        setEditFeed(null);
        setError(e.response.data.msg);
        setLoading(false);
        console.log(e.response.data);
      });
  }

  function getFeeds() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log(userDetails);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/get-feeds`,
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
            setData(response.data.data.data);
            console.log(response.data.data.data);
            if (
              response.data.data.last_page > response.data.data.current_page
            ) {
              setPageNumber(
                parseInt(response.data.data.current_page) + parseInt(1),
              );
              setIsLoadMore(true);
              setRefreshing(false);
            }
          })
          .catch(function (error) {
            setLoading(false);
            setRefreshing(false);
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
            `${BASE_URL}/get-feeds`,
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

  const like = (item) => {
    axios
      .post(
        `${BASE_URL}/likePost`,
        { feed_id: item.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        getFeeds();
        setVisible(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.response.data.msg);
        console.log(e.response.data);
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

  const dislike = (item) => {
    axios
      .post(
        `${BASE_URL}/disLikePost`,
        { feed_id: item.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        getFeeds();
        setVisible(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.response.data.msg);
        console.log(e.response.data);
      });
  };

  const deleteFeedAlert = (feed_id) =>
    Alert.alert(
      'Delete feed',
      'Are you sure you want to delete selected feed ?',
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
        `${BASE_URL}/delete-feed`,
        { feed_id: feed_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        getFeeds();
        setVisible(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.response.data.msg);
        console.log(e.response.data);
      });
  };

  const onDelete = useRef((id) => {
    deleteFeedAlert(id);
  });

  const onEdit = useRef((item) => {
    setEditFeed(item);
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  });
  const onLike = useRef((item) => {
    if (item.likeUserIds.findIndex((userid) => userid == item.userId) != -1) {
      dislike(item);
    } else {
      like(item);
    }
  });
  const onPressComment = useRef((item) => {
    var liked =
      item.likeUserIds.findIndex((userid) => userid == item.userId) != -1;
    navigation.navigate('FeedsComment', { selectedFeed: item, feedLiked: liked });
  });

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
      {/* <ScrollView ref={scrollRef}> */}
     
        <View style={styles.container}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              console.log('NotLikesIDS', item.likeUserIds),
              <FeedPureFunctional
                item={item}
                onPressComment={onPressComment.current}
                onDelete={onDelete.current}
                userId={appUser.id}
                liked={
                  item.likeUserIds !== undefined && item.likeUserIds.findIndex((userid) => userid == appUser.id) !=
                  -1
                }
                onEdit={onEdit.current}
                onLike={onLike.current}
              />
            )}
            keyExtractor={(item) => 'ses' + item.id}
            initialNumToRender={10}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (isLoadMore) {
                getMoreData();
              }
            }}
            ListHeaderComponent={() => (
              <>
                <ImageBackground
                  source={require('../../Image/plain-background.png')}
                  style={styles.headerBG}>
                  {/* <Icon
                    name="arrow-back"
                    style={styles.backicon}
                    onPress={() => navigation.goBack()}
                  /> */}
                  <Heading style={styles.titleText}>Message Board</Heading>
                </ImageBackground>
                <AddFeed
                  currentUser={appUser}
                  onSubmit={addFeed}
                  feed={editFeed}
                  onReset={reset}
                />
              </>
            )}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <EmergencyAlarmModal setLoading={setLoading} />
          <Loading loading={loading} />
        </View>
        {/* </ScrollView> */}
    
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

  name: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
  },
  iconSize: {
    fontSize: 25,
    color: '#999',
  },
  headerBG: {
    // position: 'absolute',
    height: 185,
    width: '100%',
    top: 0,
  },
  backicon: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 30,
  },
  titleText: {
    position: 'absolute',
    top: 100,
    left: 10,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  editOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editBtn: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 5,
  },
});

function FeedPureFunctional({
  item: {
    id,
    owner,
    createDate,
    properties,
    description,
    likesCount,
    commentsCount,
    likeUserIds,
    user_id,
    userimage,
  },
  userId,
  liked,
  onPressComment,
  onDelete,
  onEdit,
  onLike,
}) {
  return useMemo(() => {
    return (
      <FeedCard
        owner={owner}
        userimage={userimage}
        createDate={createDate}
        description={description}
        images={properties}
        likesCount={likesCount}
        liked={liked}
        isCurrentUser={userId == user_id}
        commentsCount={commentsCount}
        onLike={() =>
          onLike({ id, owner, description, properties, likeUserIds, userId })
        }
        onPressComment={() =>
          onPressComment({
            id,
            owner,
            description,
            createDate,
            properties,
            likesCount,
            likeUserIds,
            commentsCount,
            userId,
            userimage,
          })
        }
        onDelete={() => onDelete(id)}
        onEdit={() =>
          onEdit({
            id,
            description,
            owner,
            properties,
            likeUserIds,
            userId,
            user_id,
          })
        }
      />
    );
  }, [
    id,
    owner,
    createDate,
    properties,
    description,
    likesCount,
    commentsCount,
    onPressComment,
    onDelete,
    onLike,
    likeUserIds,
    userId,
    onEdit,
    liked,
    userimage,
  ]);
}
