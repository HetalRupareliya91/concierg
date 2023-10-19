import React from 'react';
import axios from 'axios';

import {
    StyleSheet,
    FlatList,
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
    Alert,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Ionicons';
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
import { spacing } from '../constants/appStyles';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const { width, height } = Dimensions.get('window');

export function NoAccessScreen({ navigation, route }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const { logout } = React.useContext(AuthContext);
    const switchTheme = React.useContext(ThemeContext);
    const { token } = React.useContext(UserContext);
    const [data, setData] = React.useState([]);
    const [appUser, setAppUser] = React.useState();
    const [loadMore, setLoadMore] = React.useState(false);
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [refreshing, setRefreshing] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const { params = {} } = route;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getServices();
    }, []);
    React.useEffect(function () {
        getServices();
    }, []);

    React.useEffect(function () {
        if (params.refetch) {
            getServices();
        }
    }, [params.refetch]);

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    function getServices() {
        setRefreshing(false);
        setLoading(true);
        SecureStorage.getItem('user').then((user) => {
            if (user) {
                const userDetails = JSON.parse(user);
                setAppUser(userDetails.details);
                console.log('userDetails', userDetails);
                axios
                    .post(
                        `${BASE_URL}/user-properties`,
                        {
                            // user_id: userDetails.details.id,
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

    //

    const services = ({ item }) => {
        return <Service item={item} style={styles.flatListBox} />;
    };
    return (
        <AuthContainer>
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView}>
                <SafeAreaView style={styles.container} keyboardShouldPersistTaps="handled">

                    <View>
                        <KeyboardAvoidingView enabled>
                            <ImageBackground
                                source={require('../../Image/real-estateDetail-banner.png')}
                                style={styles.headerBG}>
                                <Heading style={styles.titleText}>My Property</Heading>
                            </ImageBackground>
                        </KeyboardAvoidingView>

                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: spacing(50),
                        }}>
                        <Text style={{ fontSize: 15 }}> You do not have permission to add property.</Text>
                        <Text onPress={() => navigation.navigate('RealEstate', 'sale')} style={{ fontSize: 15, color: 'navy', marginTop: 10 }}>
                            View Buy Properties</Text>
                        <Text onPress={() => navigation.navigate('RealEstate', 'rent')} style={{ fontSize: 15, color: 'navy', marginTop: 10 }}>
                            View Rent Properties</Text>
                    </View>

                    <EmergencyAlarmModal setLoading={setLoading} />
                    <Loading loading={loading || deleteLoading} />
                </SafeAreaView>
            </ScrollView>
        </AuthContainer>
    );
}

const styles = StyleSheet.create({
    mainBody: {
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    titleText: {
        position: 'absolute',
        top: 50,
        left: 0,
        color: '#000',
        fontSize: 22,
        textAlign: 'left',
    },
    headerBG: {
        position: 'relative',
        height: 180,
        width: '100%',
        // backgroundColor: '#FFF',
    },
    filtersWrap: {
        marginVertical: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconImage: {
        marginHorizontal: 5,
        height: 20,
        width: 26,
    },
    iconImageSort: {
        marginHorizontal: 5,
        height: 20,
        width: 20,
    },
    filters: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#555',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    listTitleText: {
        color: '#FFF',
        fontSize: 34,
        textAlign: 'left',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    listingWrap: {
        marginHorizontal: 15,
        marginBottom: 50,
        display: 'flex',
        flexDirection: 'row',
        // overflow: 'scroll',
    },
    listItem: {
        width: '100%',
        marginBottom: 20,
    },
    listingImage: {
        width: '100%',
        height: 200,
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 3,
    },
    listingInfo: {
        marginBottom: 5,
        fontSize: 12,
        color: '#444',
    },
    listingDetail: {
        fontSize: 12,
        color: '#444',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontWeight: '700',
    },
    time: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        marginTop: 2,
        marginRight: 5,
    },
    titleCaptionStyle: {
        marginBottom: 20,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 35,
        marginRight: 35,
        fontWeight: 'bold',
    },
    buttonStyle: {
        backgroundColor: '#BA9551',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#BA9551',
        height: 50,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    FlateSelect: {
        color: '#FFF',
        height: 50,
        marginLeft: 35,
        marginRight: 35,
        paddingLeft: 0,
        paddingRight: 0,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRadius: 0,
        borderBottomColor: '#FFF',
        borderColor: '#FFF',
    },
    buttonTextStyle: {
        color: '#FFF',
        paddingVertical: 14,
        fontSize: 16,
    },
    lableInput: {
        color: '#BA9551',
        fontSize: 14,
        marginLeft: 35,
        marginRight: 35,
    },
    inputStyle: {
        flex: 1,
        color: '#FFF',
        paddingLeft: 0,
        paddingRight: 0,
        borderWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 0,
        borderColor: '#FFF',
    },
    forgotTextStyle: {
        marginLeft: 35,
        marginRight: 35,
        marginBottom: 30,
        color: '#FFF',
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 14,
    },
    orwithTextStyle: {
        marginBottom: 20,
        color: '#FFF',
        textAlign: 'center',
        fontSize: 14,
    },
    registerTextStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    haveAccount: {
        marginBottom: 20,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    errorTextStyle: {
        marginLeft: 35,
        color: 'red',
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionIcon: {
        paddingLeft: spacing(20),
        padding: spacing(10),
    },
});
