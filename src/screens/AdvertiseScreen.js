import React from 'react';
import axios from 'axios';
import {
  RefreshControl,
  View,
  FlatList,
  StyleSheet,
  Text,
  WebView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContainer } from '../components/AuthContainer';
import SecureStorage from 'react-native-secure-storage';
import { UserContext } from '../contexts/UserContext';
import { BASE_URL } from '../config';
import { Loading } from '../components/Loading';
import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export function AdvertiseScreen({ navigation }) {
  const { logout } = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const { token } = React.useContext(UserContext);
  const [data, setData] = React.useState([]);
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAdverts();
  }, []);
  React.useEffect(function () {
    getAdverts();
  }, []);

  function getAdverts() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/adverts`,
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
            console.log(response.data.data.data);
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
  function getMoreData() {
    setLoadMore(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/adverts`,
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
  function onSwipeRight(direction) {
    navigation.goBack();
  }
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };

  const Adverts = ({ item, onPress, style }) => (
    <GestureRecognizer

      // onSwipeLeft={(state) => onSwipeLeft(state)}
       onSwipeRight={(state) => onSwipeRight(state)}
      config={config}

    >
      <View style={styles.addMainWrap}>
        <ImageBackground
          source={{ uri: item.imageUri }}
          // repeat
          style={styles.video}>
          <View style={styles.mainContainer}>
            <View style={styles.innerRight}>
              <Icon
                name="logo-instagram"
                size={30}
                style={styles.instaBtn}
                onPress={() => {
                  Linking.openURL(item.instagram_url);
                }}
              />
              <Icon
                name="arrow-redo"
                size={30}
                style={styles.forwardBtn}
                onPress={() => {
                  Linking.openURL(item.redirect_url);
                }}
              />
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.backbuttonStyle} onPress={() => navigation.goBack(null)}>
              <Icon name="chevron-back-outline" style={styles.backArrow} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </GestureRecognizer>
  );

  const adverts = ({ item }) => {
    return <Adverts item={item} />;
  };
  return (
    <AuthContainer>

      <View style={{ height: height }}>
        <FlatList
          data={data}
          pagingEnabled={true}
          keyExtractor={(item) => 'ses' + item.id}
          renderItem={adverts}
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
      </View>
      <EmergencyAlarmModal setLoading={setLoading} />
      <Loading loading={loading} />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  addMainWrap: {
    position: 'relative',
  },
  video: {
    height: height,
    width: width,
    backgroundColor: '#000',
  },
  header: {
    width: width,
    height: 50,
    justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    marginRight: 15,
  },
  mainContainer: {
    height: '100%',
    flexDirection: 'row',
    width: width,
    position: 'absolute',
    bottom: 0,
  },
  innerLeft: {
    width: '100%',
    height: '100%',
  },
  innerRight: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: '100%',
    height: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    color: '#FFF',
  },
  backbuttonStyle: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFF',
  },
  backArrow: {
    width: 40,
    height: 40,
    padding: 5,
    color: '#FFF',
    fontSize: 30,
  },
  forwardBtn: {
    marginHorizontal: 15,
    color: '#FFF',
  },
  instaBtn: {
    marginHorizontal: 15,
    color: '#FFF',
  },
  profile: {
    height: 50,
    width: 50,
    alignItems: 'center',
    marginBottom: 25,
  },
  btn: {
    backgroundColor: '#ff5b77',
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -10,
  },
  // dataContainer: {
  //   height: 'auto',
  //   width: '100%',
  //   position: 'absolute',
  //   top: 30,
  //   padding: 5,
  // },
  title: {
    position: 'absolute',
    top: 75,
    left: 0,
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 22,
    paddingHorizontal: 15,
    textTransform: 'capitalize',
  },
  description: {
    position: 'absolute',
    top: 'auto',
    bottom: 20,
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 18,
  },
  music: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
