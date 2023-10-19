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
import { useIsFocused } from '@react-navigation/native'
export function NotificationScreen({ navigation }) {
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
    const isFocused = useIsFocused();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getServices(filters);
    }, []);
    React.useEffect(function () {
        getServices(filters);
    }, [isFocused]);

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

        let url = isFilter ? 'filters' : 'all-notification';
        setData({});
        SecureStorage.getItem('user').then((user) => {
            if (user) {
                const userDetails = JSON.parse(user);
                setAppUser(userDetails.details);
                const data = isFilter ? filterData : {};
                console.log("userDetails.details.id,", userDetails.details.id, userDetails.details.company_id,)
                axios
                    .post(
                        `${BASE_URL}/all-notification`,
                        {
                            user_id: userDetails.details.id,//6
                            company_id: userDetails.details.company_id,//5

                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )
                    .then(function (response) {
                        console.log("data.data", response);
                        setLoading(false);
                        let data = response.data;
                        if (isFilter) {
                            data = response.data ? response.data.property : {};
                        }

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
        <View style={[styles.item, style]}>
            <View style={styles.leftView}>
                <Text
                    style={styles.name}
                    numberOfLines={1}
                    onPress={() => {
                        if (item.type == 'facility') {
                            navigation.navigate('Facility', { selectedFeed: item })
                        } else if (item.type == 'Store') {
                            navigation.navigate('Loyalty Card Stores', { selectedFeed: item })
                        } else if (item.type == 'poll') {
                            navigation.navigate('Polls', { selectedFeed: item })
                        } else if (item.type == 'service') {
                            navigation.navigate('Service', { selectedFeed: item })
                        } else if (item.type == 'visitor') {
                            navigation.navigate('Visitors', { selectedFeed: item })
                        } else if (item.type == 'issue') {
                            navigation.navigate('Issue', { selectedFeed: item })
                        } else if (item.type == 'chat') {
                            navigation.navigate('ChatListing', { selectedFeed: item })
                        } else if (item.type == 'real-estate') {
                            navigation.navigate('RealEstate', { property_type: 'sale' })
                        } else if (item.type == 'parcel') {
                            navigation.navigate('Parcels', { selectedFeed: item })
                        } else if (item.type == 'feed') {
                            navigation.navigate('Feeds', { selectedFeed: item })
                        }
                        // else if(item.type == 'Notice') 
                        // {
                        //     navigation.navigate('Loyalty Card Stores', { selectedFeed: item })
                        // } 
                    }}>
                    {item.data}
                </Text>
                <Text style={styles.contact}>
                    {Moment(item.created_at).fromNow()}
                </Text>
            </View>
            <View style={styles.deleteIcon}>
                <Icon
                    name="trash"
                    style={styles.DelIconSize}
                    onPress={() => deleteFeedAlert(item.id)}
                />
            </View>
        </View>
    );

    const deleteFeedAlert = (feed_id) =>
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete selected Notification ?',
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
                `${BASE_URL}/delete-notification`,
                {
                    notification_id: feed_id,
                    company_id: appUser.company_id,
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

    const getMoreData = () => { };

    const services = ({ item }) => {
        return (
            <Service navigation={navigation} item={item} style={styles.flatListBox} />
        );
    };

    const dataKeys = Object.keys(data);
    return (
        
            <AuthContainer>
                <ScrollView>

                    <SafeAreaView
                        style={styles.mainView}>
                        <ImageBackground
                            source={require('../../Image/notification.png')}
                            style={styles.headerBG} >
                            <Heading style={styles.titleText}>Notifications</Heading>
                        </ImageBackground>
                        <View style={styles.container}>
                            {dataKeys.length
                                ? dataKeys.map((key) => (
                                    <>
                                        <Text style={styles.dateText}>
                                            {data[key].formatdate}
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
                            {/* {data && (
                        <View style={styles.listingWrap}>
                            <FlatList
                                horizontal={true}
                                data={data}
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
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                            />
                        </View>
                    )} */}
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
    titleText: {
        position: 'absolute',
        top: 80,
        left: 0,
        color: '#000',
        fontSize: 22,
        textAlign: 'left',
    },
    headerBG: {
        position: 'relative',
        height: 185,
        width: '100%',
        marginBottom: 30,
    },
    listWrap: {
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
    },
    leftView: {
        flex: 1,
    },
    DelIconSize: {
        color: '#D00404',
        fontSize: 20,
    },
    dateText: {
        fontSize: 30,
        color: '#555',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#888',
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
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    provider: {
        marginTop: 5,
        marginBottom: 5,
        color: '#666',
    },
    contact: {
        fontSize: 14,
        color: '#666',
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
