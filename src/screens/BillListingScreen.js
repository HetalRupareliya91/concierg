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
import {
  FAB,
  Modal,
  Portal,
  Text as PapaerText,
  TextInput,
  Button,
  Provider,
} from 'react-native-paper';
import Picker from '../components/popupView/picker';
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
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker'
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import { spacing } from '../constants/appStyles';
import PropertyFilters from '../components/PropertyFilters';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function BillListingScreen({ navigation }) {
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
  const [isDateModel, setIsDateModel] = React.useState(false)
  const [filters, setFilters] = React.useState({});
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
  const validationSchema = yup.object().shape({
    bill_category: yup.string().required('Bill Category is Required'),
    title: yup.string().required('Title is Required'),
    // payment_date: yup.string().required('Bill Payment Date is Required'),
    //bill_amount: yup.string().required('Bill Amount is Required'),
    bill_amount: yup
      .string()
      .required('Bill Amount is Required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Must be only digits'),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getServices(filters);
  }, []);
  React.useEffect(function () {
    getServices(filters);
  }, []);

  const [date, setDate] = React.useState(new Date());

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

    let url = isFilter ? 'git-bill' : 'git-bill';
    setData({});
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        setAppUser(userDetails.details);
        const data = isFilter ? filterData : {};
        axios
          .post(
            `${BASE_URL}/git-bill`,
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
            let data = response.data;
            if (isFilter) {
              data = response.data ? response.data.property : {};
            }
            console.log(data.data);
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

  function sendIssue(issue) {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/add-bill`,
        {
          company_id: appUser.company_id,
          unit_id: appUser.unit_id,
          user_id: appUser.id,
          bill_category: issue.bill_category,
          title: issue.title,
          payment_date: date,
          bill_amount: issue.bill_amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        setLoading(false);
        console.log(response);
        getServices(filters);
        getServices(filters);
        setVisible(false);
      })
      .catch(function (e) {
        setLoading(false);
        setError(e.response.data.msg);
        setLoading(false);
        console.log(e.response.data);
      });
  }
  const deleteBill = (id) => {
    setLoading(true);
    Alert.alert(
      "Confirm",
      "Do you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => {
            setLoading(false);
          },
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            axios
              .post(
                `${BASE_URL}/delete-bill`,
                {
                  company_id: appUser.company_id,
                  user_id: appUser.id,
                  bill_id: id
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )
              .then(function (response) {
                setLoading(false);
                console.log("delete bill", response);
                getServices(filters);
                getServices(filters);
                setVisible(false);
              })
              .catch(function (e) {
                setLoading(false);
                setError(e.response.data.msg);
                setLoading(false);
                console.log(e.response.data);
              });
          }
        }
      ]
    );

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

  const Service = ({ item, onPress, style, navigation }) => {
    console.log("Service", item)
    return (
      <View style={[styles.item, style]}>
        <View style={styles.leftView}>
          <Text style={styles.name}>{item.bill_category}</Text>
          <Text style={styles.titlest}>{item.title}</Text>
          <Text style={styles.dateTime}>
            <Icon name="time-outline" style={styles.iconSize} />{' '}
            {Moment(item.payment_date).format('Do MMM, yyyy')}{' '}
          </Text>
        </View>
        <View>
          <Text style={styles.statusOpen}>£ {item.bill_amount}</Text>

        </View>

        <TouchableOpacity style={{ alignItems: 'flex-end',position:'absolute',bottom:5,right:15 }} onPress={() => { deleteBill(item.id) }}>
          <Icon name="trash" size={18} />
        </TouchableOpacity>
      </View>
    )
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={styles.mainView}>
     
          <View style={styles.headerBG} >
            <Heading style={styles.titleText}>My Account</Heading>
            <Image source={require('../../Image/report.png')} style={styles.headerImage} />
          </View>
          <View style={styles.roudedLayout}>
            <SafeAreaView style={styles.container}>
              <View style={styles.listWrap}>
                {dataKeys.length
                  ? dataKeys.map((key) => (
                    <>
                      <Text style={styles.headingText}>
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
                  : <Text style={{ textAlign: 'center' }}>Not Found</Text>}
              </View>
            </SafeAreaView>
          </View>
          <EmergencyAlarmModal setLoading={setLoading} />
          <Loading loading={loading} />
        
      </ScrollView>
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle} style={styles.modal}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{ bill_category: '', title: '', payment_date: '', bill_amount: '' }}
              onSubmit={(values) => {
                sendIssue(values);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}>
                  <Text style={styles.lableInput}>Add Bill Form</Text>
                  <View style={styles.dropdownContainer}>
                    <Picker
                      style={{ color: '#000', }}
                      contentContainerStyle={{
                        borderBottomWidth: 1,
                        backgroundColor: 'red',
                        borderBottomColor: '#000'
                      }}
                      selectedValue={values.bill_category}
                      onValueChange={handleChange('bill_category')}
                      placeholder={'Bill Category'}
                      data={[
                        { label: 'Home Insurance', value: 'Home Insurance' },
                        { label: 'Electricity Provider', value: 'Electricity Provider' },
                        { label: 'Gas Provider', value: 'Gas Provider' },
                        { label: 'Water', value: 'Water' },
                        { label: 'Telephone', value: 'Telephone' },
                        { label: 'Broadband', value: 'Broadband' },
                        { label: 'Council Tax', value: 'Council Tax' },
                        { label: 'TV License', value: 'TV License' },
                        //  { label: 'Car Expenses', value: 'Car Expenses' },
                        //  { label: 'Service Charge', value: 'Service Charge' },
                        //  { label: 'Ground Rent', value: 'Ground Rent' },
                        //  { label: 'Parking Fees', value: 'Parking Fees' },
                        { label: 'Gym', value: 'Gym' },
                      ]}
                    />
                  </View>
                  {errors.bill_category && (
                    <Text style={styles.errorTextStyle}>{errors.bill_category}</Text>
                  )}
                  <View style={styles.inputContainer}>
                    <Input
                      name="title"
                      placeholder="Title"
                      style={styles.textInput}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values.title}
                      keyboardType="default"
                    />
                  </View>
                  {errors.title && (
                    <Text style={styles.errorTextStyle}>{errors.title}</Text>
                  )}
                  <View style={styles.inputContainer}>

                    <TouchableOpacity
                      onPress={() => {
                        setIsDateModel(true)
                      }}
                    >
                      <View style={[styles.inputContainer, { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 5 }]}>
                        <Text >{Moment(date).format('MM/DD/YYYY')}</Text>
                        <View style={{ position: 'absolute', right: 10 }}>
                          <Icon name="calendar-outline" size={24} />
                        </View>
                      </View>
                    </TouchableOpacity>


                  </View>
                  {errors.payment_date && (
                    <Text style={styles.errorTextStyle}>{errors.payment_date}</Text>
                  )}
                  <View style={styles.inputContainer}>
                    <Input
                      name="bill_amount"
                      placeholder="Bill Amount"
                      style={styles.textInput}
                      onChangeText={handleChange('bill_amount')}
                      onBlur={handleBlur('bill_amount')}
                      value={values.bill_amount}
                      keyboardType="default"

                    />
                  </View>
                  {errors.bill_amount && (
                    <Text style={styles.errorTextStyle}>{errors.bill_amount}</Text>
                  )}
                  <Error error={error} />
                  <FilledButton style={styles.submitButton} title={'Add Bill'} onPress={handleSubmit} />
                </KeyboardAwareScrollView>
              )}
            </Formik>
          </Modal>
        </Portal>
      </Provider>
      <Modal
        visible={isDateModel}

        onDismiss={() => { setIsDateModel(false) }}
        contentContainerStyle={{ backgroundColor: '#fff', paddingTop: 20, borderRadius: 15, marginHorizontal: 25, }}>
        <View style={{ padding: 15, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 0 }}>
          <TouchableOpacity
            style={{ height: '100%', width: '100%' }} onPress={() => {
              setIsDateModel(false)
            }}>
            <Icon name="close" size={18} />
          </TouchableOpacity>
        </View>
        <DatePicker
          date={date}
          mode="date"


          onDateChange={(date) => {
            setDate(date);
          }}
        />
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <FilledButton style={[{ height: 40, width: '50%', justifyContent: 'center', alignItems: 'center' }]} title={'Confirm'} onPress={() => setIsDateModel(false)} />

        </View>
      </Modal>
      <FAB
        style={styles.fab}
        icon="plus"
        theme={{ colors: { accent: 'white' } }}
        onPress={showModal}
      />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  datePickerStyle: {
    // width: '100%',
    marginBottom: 10,
  },
  mainView: {
    backgroundColor: '#FFF',
  },
  headerImage: {
    position: 'absolute',
    right: 40,
    top: 5,
    
    width: 122,
    height: 115,
  },
  roudedLayout: {
    marginTop: -36,
    minHeight: '100%',
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
    width:'100%',
    position: 'absolute',
    top: 30,
    left: 0,
    color: '#000',
    fontSize: 22,
    textAlign: 'left',
  },
  headingText: {
    fontSize: 28,
    color: '#555',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  dropdownContainer: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingLeft: 5
  },
  inputContainer: {

    marginBottom: 5,
    paddingTop: 10,
  },
  listWrap: {
    marginTop: 20,
  },
  flatListBox: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  item: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,

  },
  leftView: {
    flex: 1,
  },
  rightView: {
   paddingHorizontal:10,
    flexDirection: 'row',
    justifyContent:'flex-end'
  },
  deleteBtn: { position: 'absolute', bottom: 5, right: 15 },
  statusOpen: {
    // textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 5,
    // paddingHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#000',
    textTransform: 'uppercase',
  },
  statusClose: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titlest: {
    fontSize: 16,
    marginBottom: 10,
  },
  iconSize: {
    fontSize: 16,
    color: '#999',
  },
  dateTime: {
    color: '#999',
    fontSize: 16,
  },
  buttonStyle: {
    backgroundColor: '#EDB43C',
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 45,
    marginBottom: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 80,
    padding: 10,

  },
  lableInput: {
    marginBottom: 40,
    color: '#EDB43C',
    fontSize: 28,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 0,
    backgroundColor: '#EDB43C',
    color: '#000',
  },
  errorTextStyle: {
    marginLeft: 15,
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modal: {
    height: '100%',
    overflow: 'hidden',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
  },
  lableInput: {
    marginBottom: 40,
    color: '#EDB43C',
    fontSize: 28,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 0,
    backgroundColor: '#EDB43C',
    color: '#000',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    padding: 5,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  select: {
    width: '100%',
    height: 'auto',
    borderBottomWidth: 1,
    borderColor: '#000',
    borderRadius: 0,
    paddingHorizontal: 5,
    fontWeight: '500',
  },
  selectField: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
});