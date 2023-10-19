import React, { Component } from 'react';
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
import {Input} from '../components/Input';
import {RadioButton, TextInput} from 'react-native-paper';
import {FilledButton} from '../components/FilledButton';
import {Error} from '../components/Error';
import {Success} from '../components/Success';
import {AuthContainer} from '../components/AuthContainer';
import {Loading} from '../components/Loading';
import {BASE_URL} from '../config';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Col, Row, Grid} from 'react-native-easy-grid';
import DropDownPicker from 'react-native-dropdown-picker';
import {UserContext} from '../contexts/UserContext';
import SecureStorage from 'react-native-secure-storage';
import Textarea from 'react-native-textarea';

export class FormStep1 extends Component {

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
      };
    

      render() {
        const { values, handleChange } = this.props;

        return (
            <View>
                <View style={styles.formItem}>
                <Text style={styles.labelText}>First Name</Text>
                  <TextInput
                   placeholder="Enter Your First Name"
                   label="First Name"
                   onChange={handleChange('firstName')}
                   defaultValue={values.firstName}
                   margin="normal"
                   fullWidth
                   />
            </View>
            <View style={styles.formItem}>
                <Text style={styles.labelText}>Last Name</Text>
                <TextInput
                    placeholder="Enter Your Last Name"
                    label="Last Name"
                    onChange={handleChange('lastName')}
                    defaultValue={values.lastName}
                    margin="normal"
                    fullWidth
                   />
            </View>
            <View style={styles.formItem}>
                <Text style={styles.labelText}>Email</Text>
                <TextInput
                    placeholder="Enter Your Email"
                    label="Email"
                    onChange={handleChange('email')}
                    defaultValue={values.email}
                    margin="normal"
                    fullWidth
                   />
            </View>
            <FilledButton title={'Next'} onPress={this.continue} />
            
            </View>
        )
    }
}

export default FormStep1;

const styles = StyleSheet.create({
    mainView: {
      backgroundColor: '#FFF',
    },
    container: {
      paddingHorizontal: 15,
    },
    headerImage: {
      position: 'absolute',
      right: 20,
      top: 10,
      width: 150,
      height: 115,
    },
    headerBG: {
      position: 'relative',
      height: 180,
      width: '100%',
      backgroundColor: '#EDB43C',
      // backgroundColor: '#FFF',
    },
    roudedLayout: {
      marginTop: -36,
      paddingHorizontal: 15,
      paddingVertical: 30,
      backgroundColor: '#FFF',
      borderTopRightRadius: 36,
      borderTopLeftRadius: 36,
    },
    formSteps: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    step1: {
      fontSize: 26,
      color: '#000',
    },
    step2: {
      fontSize: 26,
      color: '#797979',
    },
    step3: {
      fontSize: 26,
      color: '#797979',
    },
    step1to2: {
      fontSize: 40,
      color: '#797979',
    },
    step2to3: {
      fontSize: 40,
      color: '#797979',
    },
    titleText: {
      position: 'absolute',
      top: 50,
      left: 0,
      color: '#000',
      fontSize: 22,
      textAlign: 'left',
    },
    
    formItem: {
      marginBottom: 20,
    },
    formItemSelect: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    labelText: {
      marginBottom: 10,
      fontSize: 16,
      fontWeight: '700',
    },
    input: {
      borderWidth: 1,
      borderColor: '#B2B2B2',
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: '300',
      lineHeight: 26,
    },
    radioGroupWrap: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioGroup: {
      flexDirection: 'row',
      marginRight: 10,
      alignItems: 'center',
      width: '40%',
      borderWidth: 1,
      borderColor: '#B2B2B2',
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    radioBtn: {
      borderWidth: 1,
      borderColor: '#B2B2B2',
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: '300',
      lineHeight: 26,
      color: 'red',
    },
    select: {
      borderWidth: 1,
      borderColor: '#B2B2B2',
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: '300',
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    nextBtn: {
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: '#000',
      color: '#FFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      textAlign: 'center',
      fontSize: 18,
    },
  });