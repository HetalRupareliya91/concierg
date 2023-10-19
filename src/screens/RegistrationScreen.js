import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Picker} from '@react-native-community/picker';

import {Heading} from '../components/Heading';
import {Input} from '../components/Input';
import {FilledButton} from '../components/FilledButton';
import {Error} from '../components/Error';
import {IconButton} from '../components/IconButton';
import {AuthContainer} from '../components/AuthContainer';
import {AuthContext} from '../contexts/AuthContext';
import {Loading} from '../components/Loading';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function RegistrationScreen({navigation}) {
  const {register} = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('bithovendev@gmail.com');
  const [phone, setPhone] = React.useState();
  const [block, setBlock] = React.useState();
  const [flat, setFlat] = React.useState();
  const [password, setPassword] = React.useState('password');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  let [isRegistraionSuccess, setIsRegistraionSuccess] = React.useState(false);

  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Image/bg.jpg')}
          style={{height: 150, resizeMode: 'contain', alignSelf: 'center'}}
        />
        <Text style={styles.successTextStyle}>Registration Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex:1}}>
      <SafeAreaView keyboardShouldPersistTaps="handled">
        <View style={{marginTop: 50}}>
          <KeyboardAvoidingView enabled>
            <Heading>Register</Heading>
            <Text style={styles.titleCaptionStyle}>Get a new account</Text>
            <Error error={error} />
            <Text style={styles.lableInput}>First Name</Text>
            <View style={styles.SectionStyle}>
              <Input
                placeholder={'Email'}
                keyboardType={'email-address'}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Text style={styles.lableInput}>Phone Number</Text>
            <View style={styles.SectionStyle}>
              <Input
                placeholder={'Phone Number'}
                keyboardType={'email-address'}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View>
              <Text style={styles.lableInput}>Block Number</Text>
              <Picker
                underlineColorAndroid="#000"
                placeholder="Block"
                placeholderTextColor="#000"
                style={styles.FlateSelect}
                value={block}
                onChangeText={setBlock}>
                <Picker.Item label="Block - A" value="Block - A" />
                <Picker.Item label="Block - B" value="Block - B" />
                <Picker.Item label="Block - C" value="Block - C" />
              </Picker>
              
              <Text style={styles.lableInput}>Flate Number</Text>
              <Picker
                underlineColorAndroid="#000"
                placeholder="Flate"
                placeholderTextColor="#000"
                style={styles.FlateSelect}
                value={flat}
                onChangeText={setFlat}>
                <Picker.Item label="101" value="101" />
                <Picker.Item label="102" value="102" />
                <Picker.Item label="103" value="103" />
              </Picker>
            </View>
            <Text style={styles.lableInput}>Password</Text>
            <View style={styles.SectionStyle}>
              <Input
                placeholder={'Password'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <FilledButton
              title={'Register'}
              onPress={async () => {
                try {
                  setLoading(true);
                  await register(email, password);
                  navigation.pop();
                } catch (e) {
                  setError(e.message);
                  setLoading(false);
                }
              }}
            />
            <Text style={styles.haveAccount}>Already have an account?</Text>
            <TouchableOpacity style={styles.loginButtonStyle}>
              <Text
                style={styles.buttonTextStyle}
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <Loading loading={loading} />
          </KeyboardAvoidingView>
          {/* <ImageBackground
            source={require('../Image/bg.jpg')}
            style={styles.bottomBGimage}></ImageBackground> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EDB43C',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
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
  },
  textInput: {
    flex: 1,
    color: '#000',
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: '#000',
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
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
