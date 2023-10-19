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

class UpdateBillScreen extends Component {
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
      floor_plan: initState.floor_plan || '',
      type_of_paint: initState.type_of_paint || '',
      lightbulbs: initState.lightbulbs || '',
      window_sizes: initState.window_sizes || '',
      oven: initState.oven || '',
      fridge: initState.fridge || '',
      dishwasher: initState.dishwasher || '',
      washing_machine: initState.washing_machine || '',
      boiler_information: initState.boiler_information || '',
      air_conditioning: initState.air_conditioning || '',
      heating: initState.heating || '',
      hob: initState.hob || '',
      errors: {},
    };
    this.setState(state);
  }

  validate = () => {
    const { next, saveState } = this.props;
    const { state } = this;
    const { floor_plan, type_of_paint, lightbulbs, window_sizes, oven, fridge, dishwasher, washing_machine, boiler_information, air_conditioning, heating, hob } = state;
    let errors = {};
    if (!floor_plan) {
      errors.floor_plan = 'Please enter Floor Plan';
    }
    if (!type_of_paint) {
      errors.type_of_paint = 'Please enter Type Of Paint';
    }
    if (!lightbulbs) {
      errors.lightbulbs = 'Please enter Lightbulbs';
    }
    if (!window_sizes) {
      errors.window_sizes = 'Please enter Window Sizes';
    }
    if (!oven) {
      errors.oven = 'Please enter Oven';
    }
    if (!fridge) {
      errors.fridge = 'Please enter Fridge';
    }
    if (!dishwasher) {
      errors.dishwasher = 'Please enter Dishwasher';
    }
    if (!washing_machine) {
      errors.washing_machine = 'Please enter Washing Machine';
    }
    if (!boiler_information) {
      errors.boiler_information = 'Please enter Boiler Information';
    }
    if (!air_conditioning) {
      errors.air_conditioning = 'Please enter Air Conditioning';
    }
    if (!heating) {
      errors.heating = 'Please enter Heating';
    }
    if (!hob) {
      errors.hob = 'Please enter Hob';
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
        formData.append('floor_plan', this.state.floor_plan);
        formData.append('type_of_paint', this.state.type_of_paint);
        formData.append('lightbulbs', this.state.lightbulbs);
        formData.append('oven', this.state.oven);
        formData.append('window_sizes', this.state.window_sizes);
        formData.append('fridge', this.state.fridge);
        formData.append('dishwasher', this.state.dishwasher);
        formData.append('washing_machine', this.state.washing_machine);
        formData.append('boiler_information', this.state.boiler_information);
        formData.append('air_conditioning', this.state.air_conditioning);
        formData.append('heating', this.state.heating);
        formData.append('hob', this.state.hob);

        console.log('onSubmit state', {
          thisState: this.state,
          token,
          state,
          formData,
        });
        // return;
        axios
          .post(
            `${BASE_URL}/${isEdit ? 'about-apartments-update' : 'about-apartments-update'}`,
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
    alert(this.state.isEdit ? 'About Apartment Update Successfully' : 'About Apartment Update Successfully');

    const state = this.props.getState() || {};
    setTimeout(() => {
      this.props.navigation.replace('AboutApartmentScreen');
    }, 1000);

  };

  onFail = (error) => {
    this.setState({ loading: false });
    console.log(error.response);
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
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView} showsVerticalScrollIndicator={false}>
           
              <View style={styles.container}>
                {/* <Text style={styles.lableInput}>Floor Plan</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'floor_plan')}
                  value={this.state.floor_plan}
                  placeholder={'Floor Plan'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.floor_plan}</Text>
              </View> */}

                <Text style={styles.lableInput}>Type Of Paint</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'type_of_paint')}
                    value={this.state.type_of_paint}
                    placeholder={'Type Of Paint'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.type_of_paint}</Text>
                </View>

                <Text style={styles.lableInput}>Lightbulbs</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'lightbulbs')}
                    value={this.state.lightbulbs}
                    placeholder={'Lightbulbs'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.lightbulbs}</Text>
                </View>

                <Text style={styles.lableInput}>Window Sizes</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'window_sizes')}
                    value={this.state.window_sizes}
                    placeholder={'Window Sizes'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.window_sizes}</Text>
                </View>

                <Text style={styles.lableInput}>Oven</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'oven')}
                    value={this.state.oven}
                    placeholder={'Oven'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.oven}</Text>
                </View>

                <Text style={styles.lableInput}>Fridge</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'fridge')}
                    value={this.state.fridge}
                    placeholder={'Fridge'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.fridge}</Text>
                </View>

                <Text style={styles.lableInput}>Dishwasher</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'dishwasher')}
                    value={this.state.dishwasher}
                    placeholder={'Dishwasher'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.dishwasher}</Text>
                </View>

                <Text style={styles.lableInput}>Washing Machine</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'washing_machine')}
                    value={this.state.washing_machine}
                    placeholder={'Washing Machine'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.washing_machine}</Text>
                </View>

                <Text style={styles.lableInput}>Boiler Information</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'boiler_information')}
                    value={this.state.boiler_information}
                    placeholder={'Boiler Information'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.boiler_information}</Text>
                </View>

                <Text style={styles.lableInput}>Air Conditioning</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'air_conditioning')}
                    value={this.state.air_conditioning}
                    placeholder={'Air Conditioning'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.air_conditioning}</Text>
                </View>

                <Text style={styles.lableInput}>Heating</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'heating')}
                    value={this.state.heating}
                    placeholder={'Heating'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.heating}</Text>
                </View>

                <Text style={styles.lableInput}>Hob</Text>
                <View style={styles.SectionStyle}>
                  <InputBox
                    onChangeText={(text) => this.handleChange(text, 'hob')}
                    value={this.state.hob}
                    placeholder={'Hob'}
                    style={styles.textInput}
                  />
                  <Text style={{ color: 'red' }}>{errors.hob}</Text>
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

// export default UpdateBillScreen;
export default function (props) {
  const navigation = useNavigation();

  return <UpdateBillScreen {...props} navigation={navigation} />;
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