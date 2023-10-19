import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Formik } from 'formik';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
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
import { spacing } from '../constants/appStyles';
import ImageViewer from '../components/imageViewer';
import { SliderBox } from '../components/imageSlider';
import Textarea from 'react-native-textarea';
import { defaultPropertyImage } from './MyPropertyListingScreen';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function RealEstateDetailScreen({ route, navigation }) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { logout } = useContext(AuthContext);
  const switchTheme = useContext(ThemeContext);
  const { token } = useContext(UserContext);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { selectedFeed, feedLiked, backScreen } = route.params;
  const [appUser, setAppUser] = useState({});
  const [showImage, setShowImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { images = [] } = data;

  useEffect(() => {
    getRealEstateDetails();
  }, []);

  function dialCall(number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  const loginValidationSchema = yup.object().shape({
    name: yup.string().required('Name is Required'),
    phone: yup
      .string()
      .required('Contact Number is Required')
      .matches(/^[0-9]+$/, 'Must be only digits'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    message: yup.string().required('Message is Required'),
  });

  function addEmailForm(values, dataemail) {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        axios
          .post(
            `${BASE_URL}/email-realEstate`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              name: values.name,
              message: values.message,
              phone: values.phone,
              email: values.email,
              sendemail: dataemail,
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
            setSuccess('Mail Send Successfully');
            setTimeout(() => {
              navigation.navigate('RealEstateDetail');
            }, 1000);
          })
          .catch(function (error) {
            setLoading(false);
            setError(error.response.data.msg);
            setLoading(false);
            console.log(error.response);
            console.log(loginValidationSchema);
          });
      }
    });
  }

  const getRealEstateDetails = () => {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      const userDetails = JSON.parse(user);
      setAppUser(userDetails.details || {});
      axios
        .post(
          `${BASE_URL}/detail-realEstate`,
          {
            id: selectedFeed.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          setLoading(false);
          var dataSource = response.data.data || {};
          setData(dataSource);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    });
  };

  const deletePropertyAlert = (property_id) =>
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete selected property ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => deleteProperty(property_id) },
      ],
      { cancelable: false },
    );

  const deleteProperty = (property_id) => {
    setDeleteLoading(false);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user) || { details: {} };
        axios
          .post(
            `${BASE_URL}/delete-realEstate`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              property_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setDeleteLoading(false);
            navigation.navigate('RealEstate', { refetch: true });
            console.log('DeleteSuccess');
          })
          .catch(function (error) {
            setDeleteLoading(false);
            console.log('DeleteError');
          });
      }
    });
  };

  console.log('detail appUser', appUser, data);

  const header = (data) => {
    return (
      <View>
        <KeyboardAvoidingView enabled>
          <ImageBackground
            source={require('../../Image/real-estateDetail-banner.png')}
            style={styles.headerBG}>
            <Heading style={styles.titleText}>{data.property_type}</Heading>
          </ImageBackground>
        </KeyboardAvoidingView>
      </View>
    );
  };
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40,
    gestureIsClickThreshold: 5,
  };
  function onSwipeLeft(direction) {
    navigation.navigate('Advertise');
  }

  const renderActionButtons = () => {
    console.log('renderActionButtons', appUser, data);
    return appUser.id == data.user_id ? (
      <View style={styles.actionButtons}>
        <Icon
          size={20}
          name="md-pencil"
          style={styles.actionIcon}
          color="#999"
          onPress={() =>
            navigation.replace('AddProperty', { item: data, backScreen })
          }
        />
        <Icon
          name="trash"
          size={20}
          color="#999"
          style={styles.actionIcon}
          onPress={() => deletePropertyAlert(data.id)}
        />
      </View>
    ) : null;
  };

  const renderAgent = () => {
    console.log('renderAgent', { selectedFeed, data });
    if (!data.agent_id) return;
    return (
      <View style={{ marginBottom: spacing(15) }}>
        <Text
          style={{ fontSize: 26, marginBottom: spacing(15), fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          Agent Info
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Image source={{ uri: data.agentimageurl }}
            style={{
              height: spacing(55),
              width: spacing(55),
              borderRadius: spacing(30),
              marginRight: spacing(15),
              marginTop: 7,
            }}
          />
          <View style={styles.agentInfoWrap}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
              {data.agent_name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dialCall(data.agent_phone_no);
              }}>
              <View style={styles.agentInfo}>
                <Image source={require('../../Image/phonewithbg.png')} style={styles.contactIcon} />
                <Text style={styles.agentInfoText}>{data.agent_phone_no}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('mailto:data.agent_email');
              }}>
              <View style={styles.agentInfo}>
                <Image source={require('../../Image/mailwithbg.png')} style={styles.contactIcon} />
                <Text style={styles.agentInfoText}>{data.agent_email}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onShowImage = (index) => {
    if (!images.length) return;
    setImageIndex(index);
    setShowImage(true);
  };

  let imageData = [];
  if (images.length) {
    images.map((img) => {
      imageData.push({ url: img });
    });
  }

  let faci = [];
  if (data && data.facilities) {
    faci = data.facilities.split(',');
  }

  let leaseNum = '';
  let leaseText = '';
  if (data && data.lease_length) {
    const splitArr = data.lease_length.split(' ');
    leaseNum = splitArr[0];
    leaseText = splitArr[1];
  }
  console.log('faci', {
    faci,
    leaseNum,
    leaseText,
    leaseLength: data && data.lease_length,
  });

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  return (
    // <AuthContainer>

    <SafeAreaView style={styles.container} keyboardShouldPersistTaps="handled">
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView}>
        <View>{data && data !== '' && data !== null && header(data)}</View>
        {console.log('Last Data', data)}

        {data && data.id && data !== null && (
         
            <View style={styles.mainContent}>

              {renderActionButtons()}

              <Text style={styles.headingText}>{data.title}</Text>
              <Text style={styles.description}>{data.description}</Text>
              <Text style={styles.address}>{data.address}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing(10) }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Availability:</Text><Text style={{ fontSize: 14, }}> {data.availability}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'green',
                    paddingHorizontal: 10,
                    paddingTop: 1,
                    paddingBottom: 3,
                    borderRadius: 12,
                  }}>
                  <Text style={{ color: 'white' }}>{data.status}</Text>
                </View>
              </View>
              <View style={styles.rentInfo}>
                <Text style={styles.rent}>£{formatNumber(data.price)}</Text>
                {data.furnished == 'No' && (
                  <Text style={styles.furnished}>
                    <Icon name="checkmark-circle" style={styles.furnishedIcon} />
                    UnFurnished
                  </Text>
                )}
                {data.furnished == 'Yes' && (
                  <Text style={styles.furnished}>
                    <Icon name="checkmark-circle" style={styles.furnishedIcon} />
                    Furnished
                  </Text>
                )}
              </View>
              <SliderBox
                dotColor="#EDB43C"
                inactiveDotColor="#90A4AE"
                onCurrentImagePressed={onShowImage}
                resizeMode={'contain'}
                imageLoadingColor="#EDB43C"
                images={!images.length ? [defaultPropertyImage] : images}
              />
              <View style={styles.baseInfoWrap}>
                <View style={styles.baseInfo}>
                  <Text style={styles.value}>
                    <Image
                      source={require('../../Image/bed.png')}
                      style={styles.bedIcon}
                    />{' '}
                    {data.beds}
                  </Text>
                  <Text style={styles.basicInfo}>Bedrooms</Text>
                </View>
                <View style={styles.baseInfo}>
                  <Text style={styles.value}>
                    <Image
                      source={require('../../Image/bath.png')}
                      style={styles.bathIcon}
                    />{' '}
                    {data.baths}
                  </Text>
                  <Text style={styles.basicInfo}>Bathroooms</Text>
                </View>
                <View style={styles.baseInfo}>
                  <View style={styles.valueWrap}>
                    <Text style={styles.value}>
                      <Image
                        source={require('../../Image/lease.png')}
                        style={styles.leaseIcon}
                      />{' '}
                      {leaseNum}
                    </Text>
                    <Text style={styles.subText}>{leaseText}</Text>
                  </View>
                  <Text style={styles.basicInfo}>Lease Length</Text>
                </View>
              </View>
              {console.log(faci.length)}
              {faci.length != 0 && (
                <Image
                  source={require('../../Image/line-shape.png')}
                  style={styles.linePatern}
                />
              )}
              {faci.length ? (
                <View style={styles.listingWrap}>
                  {faci.map((f) =>
                    f ? (
                      <View style={{}}>
                        <Text style={styles.list}>
                          <Icon name="checkmark-circle" style={styles.listIcon} />{' '}
                          {f}
                        </Text>
                      </View>
                    ) : null,
                  )}
                </View>
              ) : null}
              {data.agent_id != null && (
                <Image
                  source={require('../../Image/line-shape.png')}
                  style={styles.linePatern}
                />
              )}
              {renderAgent()}
              {data.agent_id == null && (
                <Image
                  source={require('../../Image/line-shape.png')}
                  style={styles.linePatern}
                />
              )}

              {data.agent_id == null && (
                <View style={styles.contactusWrap}>
                  <Text style={styles.contactTitle}>Contact Us</Text>
                  <View>

                    <Formik
                      validationSchema={loginValidationSchema}
                      initialValues={{
                        name: '',
                        message: '',
                        email: '',
                        phone: '',
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        addEmailForm(values, data.email);
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
                          <Text style={styles.lableInput}>Name</Text>
                          <View style={styles.SectionStyle}>
                            <Input
                              name="name"
                              placeholder="Enter Your Name"
                              style={styles.textInput}
                              onChangeText={handleChange('name')}
                              onBlur={handleBlur('name')}
                              value={values.name}
                              keyboardType="default"
                            />
                          </View>
                          {errors.name && (
                            <Text style={styles.errorTextStyle}>{errors.name}</Text>
                          )}
                          <Text style={styles.lableInput}>Message</Text>
                          <View style={styles.TextareaSectionStyle}>
                            <Textarea
                              containerStyle={styles.textareaContainer}
                              style={styles.textarea}
                              onChangeText={handleChange('message')}
                              onBlur={handleBlur('message')}
                              defaultValue={values.message}
                              maxLength={200}
                              placeholder={'Message 。。。'}
                              placeholderTextColor={'#c7c7c7'}
                              underlineColorAndroid={'transparent'}
                            />
                          </View>
                          {errors.message && (
                            <Text style={styles.errorTextStyle}>
                              {errors.message}
                            </Text>
                          )}
                          <Text style={styles.lableInput}>Contact Email</Text>
                          <View style={styles.SectionStyle}>
                            <Input
                              name="email"
                              placeholder="Enter Contact Email"
                              style={styles.textInput}
                              onChangeText={handleChange('email')}
                              onBlur={handleBlur('email')}
                              value={values.email}
                              keyboardType="email-address"
                            />
                          </View>
                          {errors.email && (
                            <Text style={styles.errorTextStyle}>{errors.email}</Text>
                          )}
                          <Text style={styles.lableInput}>Contact Number</Text>
                          <View style={styles.SectionStyle}>
                            <Input
                              name="phone"
                              placeholder="Enter Contact Number"
                              style={styles.textInput}
                              onChangeText={handleChange('phone')}
                              onBlur={handleBlur('phone')}
                              value={values.phone}
                              keyboardType="numeric"
                            />
                          </View>
                          {errors.phone && (
                            <Text style={styles.errorTextStyle}>{errors.phone}</Text>
                          )}

                          {error !== '' && <Error error={error} />}
                          {success !== '' && <Success error={success} />}
                          <FilledButton title={'Submit'} style={styles.loginButton} onPress={handleSubmit} />
                          <Loading loading={loading} />
                        </>
                      )}
                    </Formik>
                  </View>
                </View>
              )}
              <EmergencyAlarmModal setLoading={setLoading} />
              <ImageViewer
                images={imageData}
                visible={showImage}
                onClose={() => setShowImage(false)}
                index={imageIndex} />
            </View>
         
        )}
        <Loading loading={loading || deleteLoading} />
      </ScrollView>
    </SafeAreaView>
    // </AuthContainer>
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
  mainContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headingText: {
    marginBottom: 5,
    fontSize: 26,
    color: '#333',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  address: {
    marginBottom: 10,
    fontSize: 12,
    color: '#888',
  },
  rentInfo: {
    flexDirection: 'row-reverse',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rent: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#444',
  },
  furnished: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  furnishedIcon: {
    marginRight: 5,
    fontSize: 14,
    color: '#2E7D26',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 30,
  },
  baseInfoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  baseInfo: {
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#FDFDFD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F1F2',
    alignItems: 'center',
  },
  value: {
    display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    fontSize: 18,
    justifyContent: 'space-between',
    color: '#333',
    fontWeight: 'bold',
  },
  bedIcon: {
    height: 30,
    width: 43,
  },
  bathIcon: {
    height: 30,
    width: 30,
  },
  leaseIcon: {
    height: 30,
    width: 19,
  },
  basicInfo: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  subText: {
    marginLeft: 2,
    fontSize: 11,
    color: '#888',
  },
  listingWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  list: {
    // width: '32%',
    fontSize: 14,
    marginBottom: 10,
    marginRight: spacing(20),
  },
  listIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  linePatern: {
    width: 200,
    marginVertical: 25,
    marginHorizontal: 'auto',
    position: 'relative',
    left: '50%',
    marginLeft: -100,
  },
  agentInfo: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  agentInfoText: {
    fontSize: 12,
    color: '#333',
  },
  contactTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  contactCaption: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  contactInfoWrap: {
    marginVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#FDFDFD',
    borderColor: '#F1F1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    // color: '#333',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionIcon: {
    paddingLeft: spacing(20),
    padding: spacing(10),
  },
  lableInput: {
    fontWeight: '700',
  },
  loginButton: {
    width: '100%',
    marginLeft: 0,
    backgroundColor: '#000',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
