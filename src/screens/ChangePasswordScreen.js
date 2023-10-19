import React from 'react';
import axios from 'axios';

import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Text,
  SectionList,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Picker } from '@react-native-community/picker';

import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import SecureStorage from 'react-native-secure-storage';
import { AuthContainer } from '../components/AuthContainer';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
import { AuthContext } from '../contexts/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { isIos } from '../constants/appStyles';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function ChangePasswordScreen({ navigation }) {

  // const [email, setEmail] = React.useState();
  // const [otp, setOtp] = React.useState();
  // const [password, setPassword] = React.useState();
  // const [confirmPassword, setConfirmPassword] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [appUser, setAppUser] = React.useState();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { logout } = React.useContext(AuthContext);

  const loginValidationSchema = yup.object().shape({
    old_password: yup
      .string()
      .required('Old Password is Required'),
    // otp: yup.string().required('Email OTP is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .min(8, ({ min }) => `Confirm Password must be at least ${min} characters`)
      .required('Confirm Password is required')
      .when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup
          .string()
          .oneOf(
            [yup.ref('password')],
            'Confirm Password must be same as password',
          ),
      }),
  });

  function resetPassword(values) {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log('userDetils', userDetails.details.id)
        setAppUser(userDetails.details);
        axios
          .post(`${BASE_URL}/changePassword`, {
            id: userDetails.details.id,
            old_password: values.old_password,
            // otp: values.otp,
            password: values.password,
            password_confirmation: values.confirmPassword,
          })
          .then(function (response) {
            setLoading(false);
            console.log(response);
            setSuccess('Password Change successfully');

            setTimeout(() => {
              logout()
            }, 1000);
          })
          .catch(function (error) {
            setLoading(false);
            setError(error.response.data.msg);
            setLoading(false);
            console.log(error.response.data.error);
            console.log(loginValidationSchema);
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

  return (
   
    <AuthContainer>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView>

          <SafeAreaView  style={styles.mainView}>
            <View style={styles.container}>
              <KeyboardAvoidingView enabled>
                <Image source={require('../../Image/change-icon.png')} style={styles.headerImage} />
                <Heading style={styles.heading}>Change Password</Heading>
                <Text style={styles.titleCaptionStyle}>The new password must be diffrent from the old password</Text>
                <Formik
                  validationSchema={loginValidationSchema}
                  initialValues={{
                    old_password: '',
                    // otp: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  onSubmit={(values) => {
                    resetPassword(values);
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
                      <Text style={styles.lableInput}>Old Password</Text>
                      <View style={styles.SectionStyle}>
                        <Input
                          name="old_password"
                          placeholder="Enter Old Password"
                          style={styles.textInput}
                          onChangeText={handleChange('old_password')}
                          onBlur={handleBlur('old_password')}
                          value={values.old_password}
                          secureTextEntry
                        />
                      </View>
                      {errors.old_password && (
                        <Text style={styles.errorTextStyle}>{errors.old_password}</Text>
                      )}

                      <Text style={styles.lableInput}>New Password</Text>
                      <View style={styles.SectionStyle}>
                        <Input
                          name="password"
                          placeholder="New Password"
                          style={{ borderBottomWidth: isIos ? 1 : 0, }}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          secureTextEntry
                        />
                      </View>
                      {errors.password && (
                        <Text style={styles.errorTextStyle}>{errors.password}</Text>
                      )}
                      <Text style={styles.lableInput}>Confirm Password</Text>
                      <View style={styles.SectionStyle}>
                        <Input
                          style={{ borderBottomWidth: isIos ? 1 : 0, }}
                          placeholder={'Confirm Password'}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          value={values.confirmPassword}
                          secureTextEntry
                        />
                      </View>
                      {errors.confirmPassword && (
                        <Text style={styles.errorTextStyle}>
                          {errors.confirmPassword}
                        </Text>
                      )}
                      <Success error={success} />
                      <FilledButton
                        title={'Reset Password'}
                        onPress={handleSubmit} style={styles.loginButton}
                      />
                      <Error error={error} />

                    </>
                  )}
                </Formik>
                {/* <TouchableOpacity style={styles.loginButtonStyle}>
                  <Text
                    style={styles.haveAccount} 
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    Login
                  </Text>
                </TouchableOpacity> */}
                <Loading loading={loading} />
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAwareScrollView>
    </AuthContainer>

  );
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    backgroundColor: '#EDB43C',
  },
  container: {
    paddingHorizontal: 20,
  },
  headerImage: {
    marginVertical: 30,
    width: 116,
    height: 120,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
  },
  heading: {
    marginLeft: 0,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  titleCaptionStyle: {
    marginBottom: 20,
    color: '#000',
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
  },
  loginWithStyle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  lableInput: {
    marginTop: 20,
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    color: '#000',
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: '#000',
    borderBottomWidth: isIos ? 1 : 0,
  },
  forgotTextStyle: {
    marginBottom: 0,
    color: '#000',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orWithTextStyle: {
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    marginLeft: 0,
    width: '100%',
    backgroundColor: '#000',
    color: '#FFF',
  },
  forgotTextStyle: {
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
    marginBottom: 40,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: '#000',
    color: '#FFF',
    borderRadius: 26,
    textAlign: 'center',
    fontSize: 16,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
