import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  TextInput,
  // Picker,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import AddPropertyHeader from './header';
import RoundCard from './RoundCard';
import { colors, fontSize, spacing } from '../../constants/appStyles';
import { Button, InputBox, Radio } from './StepFirst';
import Checkbox from '../../components/checkBox';
import Picker from '../../components/popupView/picker';
const FacilitiesData = [
  'Parking',
  'Central Heating',
  'Cable Television',
  'Washing Machine',
  'Dryer',
  'Dishwasher',
  'Microwave',
  'Pets Allowed',
  'Wheelchair Access',
  'Internet',
  'Garden / Patio / Balcony',
  'Concierge',
  'Gym',
  'Residents Lounge',
  'Community Events',
  'Co-working Space',
  'Laundry',
];

class AddPropertyStep2Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = { user: '' };
  updateUser = (user) => {
    this.setState({ user: user });
  };

  componentDidMount() {
    const initState = this.props.getState();
    console.log('AddPropertyStep2Screen componentDidMount', initState);
    const { facilities } = initState;

    const state = {
      lease_length: initState.lease_length || '3 Months',
      furnished: initState.furnished || 'Yes',
      availability: initState.availability || 'Immediately',
      facilities: this.getFacilities(facilities) || [],
      email: initState.email || '',
      phone: initState.phone || '',
      errors: {},
    };
    this.setState(state);
  }

  getFacilities = (faci = '') => {
    let facilities = [];
    if (typeof faci !== 'string') return faci;
    const splitArr = faci.split(',');
    if (splitArr.length) {
      splitArr.map((f) => {
        facilities.push(f);
      });
    }
    return facilities;
  };

  nextStep = () => {
    console.log(this.props);
    const { next, saveState } = this.props;

    const { state } = this;
    const { lease_length, furnished, facilities, email, phone } = state;
    let errors = {};
    if (!lease_length) {
      errors.lease_length = 'Please select Lease Length';
    }
    if (!furnished) {
      errors.furnished = 'Please select Furnished';
    }
    if (!facilities || !facilities.length) {
      errors.facilities = 'Please select Facilities';
    }
    if (!email || !this.validateEmail(email)) {
      errors.email = !email ? 'Please enter email' : 'Please enter valid email';
    }
    if (!phone || phone.length < 10) {
      errors.phone = !phone
        ? 'Please enter phone number'
        : 'Please enter 10 number';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    saveState(this.state);

    next();
  };
  setChecked = (value) => {
    this.checked = value;
  };

  goBack = () => {
    const { back } = this.props;
    // Go to previous step
    back();
  };

  validateEmail = (email) => {
    const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regEmail.test(email);
  };

  onChangeEmail = (text) => {
    console.log('onChangeEmail validateEmail', this.validateEmail(text), text);

    const errors = { ...this.state.errors };
    errors.email = undefined;
    this.setState({ email: text, errors });
  };

  onChangePhone = (text) => {
    const phone = text.replace(/[^0-9]/g, '');
    const errors = { ...this.state.errors };
    errors['phone'] = undefined;
    this.setState({ phone, errors });
  };

  handleChange = (text, name) => {
    const errors = { ...this.state.errors };
    errors[name] = undefined;
    this.setState({ [name]: text, errors });
  };

  onSelectFacilities = (f) => {
    if (!f) return;
    const facilities = [...this.state.facilities];
    if (facilities.includes(f)) {
      const index = facilities.indexOf(f);
      facilities.splice(index, 1);
    } else {
      facilities.push(f);
    }
    const errors = { ...this.state.errors };
    errors[facilities] = undefined;
    this.setState({ facilities, errors });
  };

  render() {
    const { errors = {}, facilities = [] } = this.state;
    console.log('StepSecond render', {
      propsState: this.props.getState(),
      state: this.state,
    });
    const props = this.props.getState();
    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView} showsVerticalScrollIndicator={false}>
    
          <AddPropertyHeader {...this.props} />
          <RoundCard>
            <View style={[styles.container, styles.step1]}>
              <View style={[styles.formSteps, { marginBottom: spacing(20) }]}>
                <Icon name="checkmark-circle" style={styles.step1} />
                <Icon name="remove-outline" style={styles.step1to2} />
                <Icon name="checkmark-circle" style={styles.step2} />
                <Icon name="remove-outline" style={styles.step2to3} />
                <Icon name="checkmark-circle" style={styles.step3} />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Lease Length</Text>
                <View style={styles.select}>
                  <Picker
                    selectedValue={this.state.lease_length}
                    onValueChange={(text) =>
                      this.handleChange(text, 'lease_length')
                    }
                    placeholder={'Select'}
                    data={[
                      { label: '3 Months', value: '3 Months' },
                      { label: '6 Months', value: '6 Months' },
                      { label: '9 Months', value: '9 Months' },
                      { label: '1 Year', value: '1 Year' },
                      { label: '2 Years', value: '2 Years' },
                      { label: '3 Years', value: '3 Years' },
                      { label: '999 Years', value: '999 Years' },
                    ]}
                  />
                </View>
                <Text style={{ color: 'red' }}>{errors.lease_length}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Furnished</Text>
                <View style={styles.radioGroupWrap}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.handleChange('Yes', 'furnished')}
                    style={styles.radioGroup}>
                    <Radio
                      onPress={() => this.handleChange('Yes', 'furnished')}
                      label="Yes"
                      checked={this.state.furnished === 'Yes'}
                      style={{ marginRight: spacing(10) }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.handleChange('No', 'furnished')}
                    style={styles.radioGroup}>
                    <Radio
                      onPress={() => this.handleChange('No', 'furnished')}
                      label="No"
                      checked={this.state.furnished === 'No'}
                      style={{ marginRight: spacing(10) }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: 'red' }}>{errors.furnished}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Facilities</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {FacilitiesData.map((f) => (
                    <Checkbox
                      isGreenCheck
                      style={[]}
                      onCheck={() => this.onSelectFacilities(f)}
                      checked={facilities.includes(f)}
                      text={f}
                    />
                  ))}
                </View>
                <Text style={{ color: 'red' }}>{errors.facilities}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Availability</Text>
                <View style={styles.select}>
                  <Picker
                    selectedValue={this.state.availability}
                    onValueChange={(text) =>
                      this.handleChange(text, 'availability')
                    }
                    placeholder={'Select'}
                    data={[
                      { label: 'Immediately', value: 'Immediately' },
                      { label: '3 Months', value: '3 Months' },
                      { label: '9 Months', value: '9 Months' },
                      { label: '1 Year', value: '1 Year' },
                    ]}
                  />
                </View>
                <Text style={{ color: 'red' }}>{errors.availability}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Contact Mail</Text>
                <InputBox
                  onChangeText={this.onChangeEmail}
                  value={this.state.email}
                  placeholder={'eq. xyz@email.com'}
                  placeholderTextColor="grey"
                  keyboardType="email-address"
                />
                <Text style={{ color: 'red' }}>{errors.email}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Phone Number</Text>
                <InputBox
                  onChangeText={(text) => this.onChangePhone(text, 'phone')}
                  value={this.state.phone}
                  placeholder={'123987654'}
                  placeholderTextColor="grey"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text style={{ color: 'red' }}>{errors.phone}</Text>
              </View>
              <View style={styles.btnContainer}>
                <Button label="Previous" onPress={this.goBack} />
                <Button onPress={this.nextStep} />
              </View>
            </View>
          </RoundCard>
     
      </ScrollView>
    );
  }
}

export default AddPropertyStep2Screen;
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
    color: '#000',
  },
  step3: {
    fontSize: 26,
    color: '#797979',
  },
  step1to2: {
    fontSize: 40,
    color: '#000',
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
    fontSize: 34,
    textAlign: 'left',
  },
  formItem: {
    marginBottom: spacing(25),
  },
  labelText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 0.6,
    borderColor: '#B2B2B2',
    borderRadius: 10,
    paddingHorizontal: spacing(15),
    fontSize: fontSize(11),
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
    width: '30%',
    borderRadius: 8,
    paddingVertical: spacing(20),
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
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  nextBtn: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    color: '#FFF',
    width: 130,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    textTransform: 'capitalize',
  },
});
