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
  Button,
} from 'react-native';
import {Picker} from '@react-native-community/picker';

import {Heading} from '../components/Heading';
import {Input} from '../components/Input';
import {FilledButton} from '../components/FilledButton';
import {Error} from '../components/Error';
import {AuthContainer} from '../components/AuthContainer';
import {Loading} from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../config';
import {Formik} from 'formik';
import * as yup from 'yup';
import { isIos } from '../constants/appStyles';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function ForgotPasswordScreen({navigation}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
  });

  function sendVerificationCode(email) {
    setLoading(true);
    axios
      .post(`${BASE_URL}/sendVerificationCode`, {
        email: email,
      })
      .then(function (response) {
        setLoading(false);
        console.log(response);
        navigation.navigate('ChangePassword');
      })
      .catch(function (error) {
        setLoading(false);
        setError(error.response.data.msg);
        setLoading(false);
        console.log(error.response.data);
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

  return (
    <AuthContainer>
      
        <SafeAreaView keyboardShouldPersistTaps="handled" style={styles.mainView}>
          <View style={styles.container}>
            <KeyboardAvoidingView enabled>
              <Image source={require('../../Image/Opps.png')} style={styles.headerImage}/>
              <Heading style={styles.heading}>Forgot Password</Heading>
              <Text style={styles.titleCaptionStyle}>
                Enter e-mail to resest password
              </Text>
              <Formik
                validationSchema={loginValidationSchema}
                initialValues={{email: ''}}
                onSubmit={(values) => {
                  sendVerificationCode(values.email);
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
                    <Text style={styles.lableInput}>Email Address</Text>
                    <View style={styles.SectionStyle}>
                      <Input
                        name="email"
                        placeholder="Enter Email Address"
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
                    <Error error={error} />
                    <FilledButton 
                      title={'Send Verification Code'}
                      onPress={handleSubmit} style={styles.loginButton}
                    />
                  </>
                )}
              </Formik>
              <TouchableOpacity style={styles.loginButtonStyle}>
                <Text
                  style={styles.haveAccount}
                  onPress={() => {
                    navigation.navigate('Login');
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
              <Loading loading={loading} />
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EDB43C',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
  },
  backicon: {
    fontSize: 22,
  },
  container: {
    paddingHorizontal: 15,
  },
  headerImage: {
    marginVertical: 30,
    width: 116,
    height: 120,
  },
  heading: {
    marginLeft: 0,
    fontSize: 40,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
    },
  pickersection: {
    width: 100,
  },
  titleTextStyle: {
    color: '#000',
    fontSize: 40,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  titleCaptionStyle: {
    marginBottom: 20,
    color: '#000',
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: '#000',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#000',
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  FlateSelect: {
    color: '#000',
    height: 50,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderBottomColor: '#000',
    borderColor: '#000',
  },
  buttonTextStyle: {
    color: '#FFF',
    paddingVertical: 14,
    fontSize: 16,
  },
  lableInput: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    color: '#000',
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    borderBottomWidth: isIos ? 1 : 0,
    borderRadius: 0,
    borderColor: '#000',
  },
  forgotTextStyle: {
    marginBottom: 30,
    color: '#000',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orwithTextStyle: {
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
  },
  registerTextStyle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  haveAccount: {
    marginBottom: 20,
    color: '#FFF',
    fontSize: 16,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 30,
    textAlign: 'center',
  },
  errorTextStyle: {
    marginLeft: 35,
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    marginLeft: 0,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#000',
    color: '#FFF',
  },
});
