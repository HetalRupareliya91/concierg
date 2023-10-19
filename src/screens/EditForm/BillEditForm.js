import React, { Component } from 'react';
import axios from 'axios';
import {
  Image,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  // Picker,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontSize, isIos, spacing } from '../../constants/appStyles';
import Picker from '../../components/popupView/picker';
import { AuthContainer } from '../../components/AuthContainer';
import { FilledButton } from '../../components/FilledButton';
import { BASE_URL } from '../../config';
import SecureStorage from 'react-native-secure-storage';
import { Loading } from '../../components/Loading';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import PopView from '../../components/popupView';
import { validURL } from '../../components/AddFeed';

export const Label = (props) => (
  <Text style={styles.labelText}>{props.value}</Text>
);
export const InputBox = (props) => (
  <TextInput
    style={{
      // ...styles.input(props.multiline),
      ...(props.style ? props.style : {}),
    }}
    // placeholderTextColor="grey"
    {...props}
  />
);

class BillEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = { user: '' };
  updateUser = (user) => {
    this.setState({ user: user });
  };

  static contextType = UserContext;
  componentDidMount() {
    const initState = this.props.getState();
    console.log('componentDidMount', initState, this.props.navigation);
    const state = {
      home_insurance: initState.home_insurance || '',
      electricity_provider: initState.electricity_provider || '',
      gas_provider: initState.gas_provider || '',
      water: initState.water || '',
      telephone: initState.telephone || '',
      broadband: initState.broadband || '',
      mobile: initState.mobile || '',
      council_tax: initState.council_tax || '',
      tv_license: initState.tv_license || '',
      car_expenses: initState.car_expenses || '',
      service_charge: initState.service_charge || '',
      ground_rent: initState.ground_rent || '',
      parking_fees: initState.parking_fees || '',
      gym: initState.gym || '',
      errors: {},
    };
    this.setState(state);
  }

  validate = () => {
    const { next, saveState } = this.props;
    const { state } = this;
    const { home_insurance,electricity_provider,gas_provider,water,telephone,broadband,mobile,council_tax,tv_license,car_expenses,service_charge,ground_rent,parking_fees,gym } = state;
    let errors = {};
    if (!home_insurance) {
      errors.home_insurance = 'Please enter Home Insurance';
    }
    if (!electricity_provider) {
      errors.electricity_provider = 'Please enter Electricity Provider';
    }
    if (!gas_provider) {
      errors.gas_provider = 'Please enter Gas Provider';
    }
    if (!water) {
      errors.water = 'Please enter Water';
    }
    if (!telephone) {
      errors.telephone = 'Please enter Telephone';
    }
    if (!broadband) {
      errors.broadband = 'Please enter Broadband';
    }
    if (!mobile) {
      errors.mobile = 'Please enter Mobile';
    }
    if (!council_tax) {
      errors.council_tax = 'Please enter Council Tax';
    }
    if (!tv_license) {
      errors.tv_license = 'Please enter Tv License';
    }
    if (!car_expenses) {
      errors.car_expenses = 'Please enter Car Expenses';
    }
    if (!service_charge) {
      errors.service_charge = 'Please enter Service Charge';
    }
    if (!ground_rent) {
      errors.ground_rent = 'Please enter Ground Rent';
    }
    if (!parking_fees) {
      errors.parking_fees = 'Please enter Parking Fees';
    }
    if (!gym) {
      errors.gym = 'Please enter Gym';
    }
    

    console.log('validate', state, errors);
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    //saveState(this.state);
    //next();
    this.submit();
  };

  submit = () => {
    const state = this.props.getState() || {};
    const { token } = this.context;

    // return;
    this.setState({ loading: true });
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        const isEdit = this.state.isEdit;

        const formData = new FormData();

        formData.append('id', state.id);
        formData.append('company_id', userDetails.details.company_id);
        formData.append('user_id', userDetails.details.id);
        formData.append('unit_id', userDetails.details.unit_id);
        formData.append('home_insurance', this.state.home_insurance);
        formData.append('electricity_provider', this.state.electricity_provider);
        formData.append('gas_provider', this.state.gas_provider);
        formData.append('telephone', this.state.telephone);
        formData.append('water', this.state.water);
        formData.append('broadband', this.state.broadband);
        formData.append('mobile', this.state.mobile);
        formData.append('council_tax', this.state.council_tax);
        formData.append('tv_license', this.state.tv_license);
        formData.append('car_expenses', this.state.car_expenses);
        formData.append('service_charge', this.state.service_charge);
        formData.append('ground_rent', this.state.ground_rent);
        formData.append('parking_fees', this.state.parking_fees);
        formData.append('gym', this.state.gym);

        console.log('onSubmit state', {
          thisState: this.state,
          token,
          state,
          formData,
        });
        // return;
        axios
          .post(
            `${BASE_URL}/${isEdit ? 'bill-apartments-update' : 'bill-apartments-update'}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(this.onSuccess)
          .catch(this.onFail);
      }
    });
  };

  onSuccess = (response) => {
    this.setState({ loading: false });
    const propsState = this.props.getState() || {};
    const { backScreen } = propsState;
    console.log({ response, props: this.props });
    alert(this.state.isEdit ? 'Bill Apartment Update Successfully' : 'Bill Apartment Update Successfully');

    const state = this.props.getState() || {};
    setTimeout(() => {
      this.props.navigation.replace('BillApartment');
    }, 1000);
  };

  onFail = (error) => {
    this.setState({ loading: false });
    console.log("Failed",error.response);
    alert(`Failed: ${error.data ? error.data.message : 'Add Failed'}`);
  };

  setChecked = (value) => {
    this.setState({ checked: value });
  };

  handleChange = (text, name) => {
    const errors = { ...this.state.errors };
    errors[name] = undefined;
    this.setState({ [name]: text, errors });
  };

  render() {
    const { errors = {} } = this.state;

    return (
      <AuthContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView}
          showsVerticalScrollIndicator={false}>
          
            <View style={styles.container}>
              <Text style={styles.lableInput}>Home Insurance</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'home_insurance')}
                  value={this.state.home_insurance}
                  placeholder={'Home Insurance'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.home_insurance}</Text>
              </View>

              <Text style={styles.lableInput}>Electricity Provider</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'electricity_provider')}
                  value={this.state.electricity_provider}
                  placeholder={'Electricity Provider'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.electricity_provider}</Text>
              </View>

              <Text style={styles.lableInput}>Gas Provider</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'gas_provider')}
                  value={this.state.gas_provider}
                  placeholder={'Gas Provider'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.gas_provider}</Text>
              </View>

              <Text style={styles.lableInput}>Water</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'water')}
                  value={this.state.water}
                  placeholder={'Water'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.water}</Text>
              </View>

              <Text style={styles.lableInput}>Telephone</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'telephone')}
                  value={this.state.telephone}
                  placeholder={'Telephone'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.telephone}</Text>
              </View>

              <Text style={styles.lableInput}>Broadband</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'broadband')}
                  value={this.state.broadband}
                  placeholder={'Broadband'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.broadband}</Text>
              </View>

              <Text style={styles.lableInput}>Mobile</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'mobile')}
                  value={this.state.mobile}
                  placeholder={'Mobile'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.mobile}</Text>
              </View>

              <Text style={styles.lableInput}>Council Tax</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'council_tax')}
                  value={this.state.council_tax}
                  placeholder={'Council Tax'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.council_tax}</Text>
              </View>

              <Text style={styles.lableInput}>Tv License</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'tv_license')}
                  value={this.state.tv_license}
                  placeholder={'Tv License'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.tv_license}</Text>
              </View>

              {/* <Text style={styles.lableInput}>Car Expenses</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'car_expenses')}
                  value={this.state.car_expenses}
                  placeholder={'Car Expenses'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.car_expenses}</Text>
              </View> */}

              {/* <Text style={styles.lableInput}>Service Charge</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'service_charge')}
                  value={this.state.service_charge}
                  placeholder={'Service Charge'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.service_charge}</Text>
              </View> */}

              {/* <Text style={styles.lableInput}>Ground Rent</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'ground_rent')}
                  value={this.state.ground_rent}
                  placeholder={'Ground Rent'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.ground_rent}</Text>
              </View>

              <Text style={styles.lableInput}>Parking Fees</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'parking_fees')}
                  value={this.state.parking_fees}
                  placeholder={'Parking Fees'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.parking_fees}</Text>
              </View> */}

              <Text style={styles.lableInput}>Gym</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'gym')}
                  value={this.state.gym}
                  placeholder={'Gym'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.gym}</Text>
              </View>



              {/* <Button onPress={this.nextStep} style={styles.loginButton}/> */}
              <FilledButton title={'Update'} onPress={this.submit} style={styles.loginButton} />
            </View>
            
          </ScrollView>
        </KeyboardAvoidingView>
      </AuthContainer>
    );
  }
}

// export default BillEditScreen;

export default function (props) {
  const navigation = useNavigation();

  return <BillEditScreen {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    backgroundColor: '#EDB43C',
  },
  container: {
    paddingHorizontal: 20,
  },
  SectionStyle: {
    height: 40,
    marginTop: 20,
  },
  ImageSectionStyle: {
    marginTop: 20,
  },
  pickersection: {
    width: 100,
  },
  titleTextStyle: {
    color: '#FFF',
    fontSize: 40,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  titleCaptionStyle: {
    marginBottom: 20,
    color: '#FFF',
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
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
    borderBottomColor: '#000',
    borderBottomWidth: 1,
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
  flatListBox: {
    width: '100%',
    backgroundColor: '#000',
    color: '#FFF',
  },
  loginButton: {
    marginLeft: 0,
    width: '100%',
    backgroundColor: '#000',
    color: '#FFF',
  },
  selectImg: {
    padding: 12,
    marginLeft: 0,
    borderRadius: 20,
    width: 120,
    backgroundColor: '#000',
    color: '#FFF',
    textAlign: 'center',
  },
  haveAccount: {
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorTextStyle: {
    marginTop: 15,
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactGrids: {
    width: '100%',
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
    margin: 10,
  },
  textareaContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  textarea: {
    textAlignVertical: 'top',
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