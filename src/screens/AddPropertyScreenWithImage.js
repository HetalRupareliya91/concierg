import React from 'react';
import axios from 'axios';

import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAwareScrollView,
  Button,
  FlatList,
} from 'react-native';
import { RadioButton, TextInput } from 'react-native-paper';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { AuthContainer } from '../components/AuthContainer';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../contexts/UserContext';
import SecureStorage from 'react-native-secure-storage';
import Textarea from 'react-native-textarea';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
export function AddPropertyScreenWithImage({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [lease, setLease] = React.useState('');
  const [beds, setBeds] = React.useState();
  const [baths, setBaths] = React.useState();
  const [availability, setAvailability] = React.useState();
  const [checked, setChecked] = React.useState('Yes');
  const [propertyType, setPropertyType] = React.useState('rent');
  const [enquiry_by, setEnquiry] = React.useState();

  const [status, setStatus] = React.useState();
  const [photos, setPhoto] = React.useState([]);
  const { token } = React.useContext(UserContext);

  const loginValidationSchema = yup.object().shape({
    title: yup.string().required('Title is Required'),
    price: yup
      .string()
      .required('Price is Required')
      .matches(/^[0-9.]+$/, 'Must be only digits'),
    phone: yup
      .string()
      .required('Phone is Required')
      .matches(/^[0-9]+$/, 'Must be only digits'),
    beds: yup
      .string()
      .required('Beds is Required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .test('max', 'Beds Must be a less than or equal to 10', function (value) {
        return value <= 10;
      })
      .test('min', 'Beds Must be a greater than 0', function (value) {
        return value > 0;
      }),
    baths: yup
      .string()
      .required('Baths is Required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .test(
        'BathsMax',
        'Baths Must be a less than or equal to 5',
        function (value) {
          return value <= 5;
        },
      )
      .test('BathsMin', 'Baths Must be a greater than 0', function (value) {
        return value > 0;
      }),
    leaseLength: yup.string().required('Lease Length is Required'),
    availability: yup.string().required('Availability is Required'),
    enquiry_by: yup.string().required('Enquiry By is Required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    description: yup
      .string()
      .required('Description is Required')
      .max(200, 'limit ma ho'),
    // .test('maxDesc', 'Description limit 200 character', function (value) {
    //   return value.length.toString() <= 200;
    // }),
    address: yup.string().required('Property address is Required'),
  });

  function addProperty(values) {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        axios
          .post(
            `${BASE_URL}/add-realEstate`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              title: values.title,
              description: values.description,
              price: values.price,
              address: values.address,
              beds: values.beds,
              baths: values.baths,
              email: values.email,
              furnished: values.furnished,
              lease_length: values.leaseLength,
              availability: values.availability,
              phone: values.phone,
              enquiry_by: values.enquiry_by,
              status: values.status,
              property_type: values.propertyType,
              images: photos,
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
            setSuccess('Added successfully');
            setPhoto([]);
            setTimeout(() => {
              navigation.navigate('RealEstate');
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

  const handleChoosePhoto = () => {
    const options = {
      includeBase64: true,
    };
    ImagePicker.openPicker(options).then(response => {
      if (response.uri) {
        console.log(response);
        if (photos.length === 0) {
          setPhoto([response]);
        } else {
          setPhoto((arr) => [...arr, response]);
        }
      }
      console.log(photos);
    });

    // ImagePicker.launchCamera(options, (response) => {
    //   console.log(response);
    //   if (response.uri) {
    //     setPhoto({photo: response});
    //   }
    // });
  };
  const EstateImage = ({ item, onPress, style }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.uri }} style={styles.listingImage} />
    </View>
  );

  const estateImage = ({ item }) => {
    return <EstateImage item={item} style={styles.flatListBox} />;
  };

  return (
    <AuthContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                title: '',
                price: '',
                baths: '',
                beds: '',
                leaseLength: '',
                furnished: '',
                availability: '',
                email: '',
                enquiry_by: '',
                phone: '',
                status: '',
                description: '',
                address: '',
                propertyType: '',
              }}
              onSubmit={(values) => {
                console.log(values);
                addProperty(values);
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
                  <Text style={styles.lableInput}>Property Type</Text>
                  <View style={styles.drinkCard}>
                    <RadioButton
                      value="rent"
                      status={
                        propertyType === 'rent' ? 'checked' : 'unchecked'
                      }
                      onPress={() => {
                        setPropertyType('rent');
                        values.propertyType = 'rent';
                      }}
                      uncheckedColor="gray"
                      color="white"
                      name="propertyType"
                      onChangeText={handleChange('propertyType')}
                      onBlur={handleBlur('propertyType')}
                    />
                    <Text style={{ fontSize: 20, color: '#fff' }}>For Rent</Text>
                    <RadioButton
                      value="sale"
                      status={
                        propertyType === 'sale' ? 'checked' : 'unchecked'
                      }
                      onPress={() => {
                        setPropertyType('sale');
                        values.propertyType = 'sale';
                      }}
                      color="white"
                      uncheckedColor="gray"
                      name="propertyType"
                      onChangeText={handleChange('propertyType')}
                      onBlur={handleBlur('propertyType')}
                    />
                    <Text style={{ fontSize: 20, color: '#fff' }}>For Sale</Text>
                  </View>
                  <Text style={styles.lableInput}>Title</Text>
                  <View style={styles.SectionStyle}>
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
                  <Text style={styles.lableInput}>Description</Text>
                  <View style={styles.TextareaSectionStyle}>
                    <Textarea
                      containerStyle={styles.textareaContainer}
                      style={styles.textarea}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      defaultValue={values.description}
                      maxLength={200}
                      placeholder={'Description 。。。'}
                      placeholderTextColor={'#c7c7c7'}
                      underlineColorAndroid={'transparent'}
                    />
                  </View>
                  {errors.description && (
                    <Text style={styles.errorTextStyle}>
                      {errors.description}
                    </Text>
                  )}
                  <Text style={styles.lableInput}>Price</Text>
                  <View style={styles.SectionStyle}>
                    <Input
                      name="price"
                      placeholder="Price"
                      onChangeText={handleChange('price')}
                      onBlur={handleBlur('price')}
                      value={values.price}
                      style={styles.textInput}
                      keyboardType="default"
                    />
                  </View>
                  {errors.price && (
                    <Text style={styles.errorTextStyle}>{errors.price}</Text>
                  )}
                  <Text style={styles.lableInput}>Image</Text>
                  <View style={styles.ImageSectionStyle}>
                    {photos.length > 0 && (
                      <FlatList
                        horizontal={true}
                        data={photos}
                        renderItem={estateImage}
                        keyExtractor={(item, index) => 'index' + index}
                        initialNumToRender={10}
                        style={{ marginBottom: 20 }}
                      />
                    )}
                    <Button title="Select Image" onPress={handleChoosePhoto} />
                  </View>

                  <Text style={styles.lableInput}>
                    Address - Property address
                  </Text>
                  <View style={styles.TextareaSectionStyle}>
                    <Textarea
                      containerStyle={styles.textareaContainer}
                      style={styles.textarea}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      defaultValue={values.address}
                      placeholder={'Address 。。。'}
                      placeholderTextColor={'#c7c7c7'}
                      underlineColorAndroid={'transparent'}
                    />
                  </View>
                  {errors.address && (
                    <Text style={styles.errorTextStyle}>{errors.address}</Text>
                  )}

                  <Grid style={styles.contactGrids}>
                    <Col style={styles.TimeText}>
                      <Text style={styles.lableInput}>Beds</Text>
                      <View style={styles.SectionStyle}>
                        <DropDownPicker
                          items={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' },
                            { label: '10', value: '10' },
                          ]}
                          defaultIndex={0}
                          containerStyle={{ height: 50 }}
                          onChangeItem={(item) => {
                            setBeds(item.value);
                            values.beds = item.value;
                          }}
                          name="beds"
                          placeholder="Beds"
                          onChangeText={handleChange('beds')}
                          onBlur={handleBlur('beds')}
                          defaultValue={beds}
                        />
                      </View>
                      {errors.beds && (
                        <Text style={styles.errorTextStyle}>{errors.beds}</Text>
                      )}
                    </Col>
                    <Col style={styles.TimeText}>
                      <Text style={styles.lableInput}>Baths</Text>
                      <View style={styles.SectionStyle}>
                        <DropDownPicker
                          items={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                          ]}
                          defaultIndex={0}
                          containerStyle={{ height: 50 }}
                          onChangeItem={(item) => {
                            setBaths(item.value);
                            values.baths = item.value;
                          }}
                          name="baths"
                          placeholder="Baths"
                          onChangeText={handleChange('baths')}
                          onBlur={handleBlur('baths')}
                          defaultValue={baths}
                        />
                      </View>
                      {errors.baths && (
                        <Text style={styles.errorTextStyle}>
                          {errors.baths}
                        </Text>
                      )}
                    </Col>
                  </Grid>

                  <Text style={styles.lableInput}>Lease Length</Text>
                  <View style={styles.SectionStyle}>
                    <DropDownPicker
                      items={[
                        { label: '3 Months', value: '3 Months' },
                        { label: '6 Months', value: '6 Months' },
                        { label: '9 Months', value: '9 Months' },
                        { label: '1 Years', value: '1 Years' },
                        { label: '2 Years', value: '2 Years' },
                        { label: '9 Years', value: '9 Years' },
                      ]}
                      defaultIndex={0}
                      containerStyle={{ height: 50 }}
                      onChangeItem={(item) => {
                        setLease(item.value);
                        values.leaseLength = item.value;
                      }}
                      name="leaseLength"
                      placeholder="Lease Length"
                      onChangeText={handleChange('leaseLength')}
                      onBlur={handleBlur('leaseLength')}
                      defaultValue={lease}
                    />
                  </View>
                  {errors.leaseLength && (
                    <Text style={styles.errorTextStyle}>
                      {errors.leaseLength}
                    </Text>
                  )}

                  <Text style={styles.lableInput}>Furnished</Text>
                  <View style={styles.drinkCard}>
                    <RadioButton
                      value="Yes"
                      status={checked === 'Yes' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('Yes');
                        values.furnished = 'Yes';
                      }}
                      uncheckedColor="gray"
                      color="white"
                      name="furnished"
                      onChangeText={handleChange('furnished')}
                      onBlur={handleBlur('furnished')}
                    />
                    <Text style={{ fontSize: 20, color: '#fff' }}>Yes</Text>
                    <RadioButton
                      value="No"
                      status={checked === 'No' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('No');
                        values.furnished = 'No';
                      }}
                      color="white"
                      uncheckedColor="gray"
                      name="furnished"
                      onChangeText={handleChange('furnished')}
                      onBlur={handleBlur('furnished')}
                    />
                    <Text style={{ fontSize: 20, color: '#fff' }}>No</Text>
                  </View>

                  {/* <Text style={styles.lableInput}>Facilities</Text> */}

                  <Text style={styles.lableInput}>Availability</Text>
                  <View style={styles.SectionStyle}>
                    <DropDownPicker
                      items={[
                        { label: 'Immediately', value: 'Immediately' },
                        { label: '3 Months', value: '3 Months' },
                        { label: '1 Years', value: '1 Years' },
                      ]}
                      defaultIndex={0}
                      containerStyle={{ height: 50 }}
                      onChangeItem={(item) => {
                        setAvailability(item.value);
                        values.availability = item.value;
                      }}
                      name="availability"
                      placeholder="Availability"
                      onChangeText={handleChange('availability')}
                      onBlur={handleBlur('availability')}
                      defaultValue={availability}
                    />
                  </View>
                  {errors.availability && (
                    <Text style={styles.errorTextStyle}>
                      {errors.availability}
                    </Text>
                  )}
                  <Text style={styles.lableInput}>Email Address</Text>
                  <View style={styles.SectionStyle}>
                    <Input
                      name="email"
                      placeholder="Email Address"
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
                  <Text style={styles.lableInput}>Phone Number</Text>
                  <View style={styles.SectionStyle}>
                    <Input
                      name="phone"
                      placeholder="Phone Number"
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

                  <Text style={styles.lableInput}>Enquiry by</Text>
                  <View style={styles.SectionStyle}>
                    <DropDownPicker
                      items={[
                        { label: 'Email only', value: 'Email only' },
                        { label: 'Phone', value: 'Phone' },
                        { label: 'Both', value: 'Both' },
                      ]}
                      defaultIndex={0}
                      containerStyle={{ height: 50 }}
                      onChangeItem={(item) => {
                        setEnquiry(item.value);
                        values.enquiry_by = item.value;
                      }}
                      name="enquiry_by"
                      placeholder="Enquiry by"
                      onChangeText={handleChange('enquiry_by')}
                      onBlur={handleBlur('enquiry_by')}
                      defaultValue={enquiry_by}
                    />
                  </View>
                  {errors.enquiry_by && (
                    <Text style={styles.errorTextStyle}>
                      {errors.enquiry_by}
                    </Text>
                  )}
                  <Text style={styles.lableInput}>Status</Text>
                  <View style={styles.SectionStyle}>
                    <DropDownPicker
                      items={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' },
                        { label: 'Let Agreed', value: 'Let Agreed' },
                        { label: 'Sale Agreed', value: 'Sale Agreed' },
                      ]}
                      defaultIndex={0}
                      containerStyle={{ height: 50 }}
                      onChangeItem={(item) => {
                        setStatus(item.value);
                        values.status = item.value;
                      }}
                      name="status"
                      placeholder="Status"
                      onChangeText={handleChange('status')}
                      onBlur={handleBlur('status')}
                      defaultValue={status}
                    />
                  </View>
                  {errors.status && (
                    <Text style={styles.errorTextStyle}>{errors.status}</Text>
                  )}

                  {error !== '' && <Error error={error} />}
                  {success !== '' && <Success error={success} />}
                  <FilledButton title={'Add Property'} onPress={handleSubmit} />
                  <Loading loading={loading} />
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#03131A',
  },
  SectionStyle: {
    // flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  ImageSectionStyle: {
    // flexDirection: 'row',
    // height: 150,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  pickersection: {
    width: 100,
  },
  titleTextStyle: {
    color: '#FFF',
    fontSize: 40,
    textAlign: 'left',
    marginLeft: 35,
    marginRight: 35,
    fontWeight: 'bold',
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
    marginTop: 15,
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
    marginTop: 15,
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactGrids: {
    width: '100%',
    // marginBottom: 120,
  },
  TimeText: {
    width: '50%',
  },
  picker: {
    height: 50,
    width: 150,
    color: '#fff',
    borderBottomWidth: 2,
    borderColor: '#FFF',
  },
  drinkCard: {
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    paddingLeft: 6,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    elevation: 1,
    borderRadius: 4,
  },
  TextareaSectionStyle: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  textareaContainer: {
    // height: 200,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#000',
  },
  listItem: {
    width: 100,
    marginRight: 20,
  },
  listingImage: {
    width: 100,
    height: 100,
  },
});
