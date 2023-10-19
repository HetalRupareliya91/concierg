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
import { fontSize, isIos, spacing } from '../../constants/appStyles';
import RoundCard from './RoundCard';
import AddPropertyHeader from './header';
import Picker from '../../components/popupView/picker';
export const Label = (props) => (
  <Text style={styles.labelText}>{props.value}</Text>
);
export const InputBox = (props) => (
  <TextInput
    style={{
      ...styles.input(props.multiline),
      ...(props.style ? props.style : {}),
    }}
    placeholderTextColor="grey"
    {...props}
  />
);

export const Button = (props) => (
  <View style={styles.btnContainer}>
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.btnStyle]}>
      <Text style={[styles.nextBtn, props.textStyle]}>
        {props.label || 'Next'}
      </Text>
    </TouchableOpacity>
  </View>
);

export const Radio = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    activeOpacity={props.onPress ? 0.6 : 1}
    style={{ flexDirection: 'row' }}>
    <View
      style={[
        {
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#B2B2B2',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing(20),
        },
        props.style,
      ]}>
      {props.checked ? (
        <View
          style={{
            height: 12,
            width: 12,
            backgroundColor: '#EDB43C',
            borderRadius: 10,
          }}
        />
      ) : null}
    </View>
    <Text>{props.label}</Text>
  </TouchableOpacity>
);

class AddPropertyStep1Screen extends Component {
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
    console.log('componentDidMount', initState, this.props);
    const state = {
      title: initState.title || '',
      description: initState.description || '',
      property_type: initState.property_type || 'rent',
      price: initState.price || '',
      address: initState.address || '',
      beds: initState.beds || '1',
      baths: initState.baths || '1',
      errors: {},
    };
    this.setState(state);
  }
  nextStep = () => {
    const { next, saveState } = this.props;
    const { state } = this;
    const { title, description, price, address } = state;
    let errors = {};
    if (!title) {
      errors.title = !title
        ? 'Please enter title'
        : 'Please enter atlease 5 charactors';
    }
    if (!description || description.length < 5) {
      errors.description = !description
        ? 'Please enter description'
        : 'Please enter atlease 10 charactors';
    }
    if (!price) {
      errors.price = 'Please enter price';
    }
    if (!address) {
      errors.address = !address
        ? 'Please enter address'
        : 'Please enter atlease 10 charactors';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    saveState(this.state);

    next();
  };
  setChecked = (value) => {
    this.setState({ checked: value });
  };

  goBack() {
    const { back } = this.props;
    back();
  }

  onChangePrice = (text) => {
    const price = text.replace(/[^0-9]/g, '');
    const errors = { ...this.state.errors };
    errors['price'] = undefined;
    this.setState({ price, errors });
  };

  handleChange = (text, name) => {
    const errors = { ...this.state.errors };
    errors[name] = undefined;
    this.setState({ [name]: text, errors });
  };

  render() {
    const { errors = {} } = this.state;
    const props = this.props.getState();
    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView}
        showsVerticalScrollIndicator={false}>
       
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
                <Label value="Title" />
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'title')}
                  value={this.state.title}
                  placeholder={'Title'}
                />
                <Text style={{ color: 'red' }}>{errors.title}</Text>
              </View>
              <View style={styles.formItem}>
                <Label value="Description" />
                <InputBox
                  multiline={true}
                  numberOfLines={3}
                  onChangeText={(text) => this.handleChange(text, 'description')}
                  value={this.state.description}
                  placeholder={'Description'}
                />
                <Text style={{ color: 'red' }}>{errors.description}</Text>
              </View>
              <View style={styles.formItem}>
                <Label value="Property Type" />
                <View style={styles.radioGroupWrap}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setState({ property_type: 'rent' })}
                    style={styles.radioGroup}>
                    <Radio
                      onPress={() => this.setState({ property_type: 'rent' })}
                      label="For Rent"
                      checked={this.state.property_type === 'rent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setState({ property_type: 'sale' })}
                    style={styles.radioGroup}>
                    <Radio
                      onPress={() => this.setState({ property_type: 'sale' })}
                      label="For Sale"
                      checked={this.state.property_type === 'sale'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Price</Text>
                <InputBox
                  onChangeText={this.onChangePrice}
                  value={this.state.price}
                  placeholder={'Price'}
                  keyboardType="numeric"
                />
                <Text style={{ color: 'red' }}>{errors.description}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Property Address</Text>
                <InputBox
                  numberOfLines={3}
                  multiline={true}
                  onChangeText={(text) => this.handleChange(text, 'address')}
                  value={this.state.address}
                  placeholder={'Address'}
                />
                <Text style={{ color: 'red' }}>{errors.description}</Text>
              </View>
              <View style={styles.formItemSelect}>
                <View style={{ width: 120, marginRight: 30 }}>
                  <Text style={styles.labelText}>Beds</Text>
                  <View style={styles.select}>
                    <Picker
                      selectedValue={this.state.beds}
                      onValueChange={(beds) => this.setState({ beds })}
                      placeholder={"Select"}
                      data={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" }
                      ]}
                    />
                  </View>
                </View>
                <View style={{ width: 120 }}>
                  <Text style={styles.labelText}>Baths</Text>
                  <View style={styles.select}>
                    <Picker
                      selectedValue={this.state.baths}
                      onValueChange={(baths) => this.setState({ baths })}
                      placeholder={"Select"}
                      data={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                      ]}
                    />
                  </View>
                </View>
              </View>
              <Button onPress={this.nextStep} />
            </View>
          </RoundCard>
      
      </ScrollView>

    );
  }
}

export default AddPropertyStep1Screen;
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: spacing(10),
  },

  labelText: {
    marginBottom: spacing(10),
    fontSize: fontSize(12),
    fontWeight: '700',
  },
  input: (isMultiline) => {
    return {
      borderWidth: 0.6,
      borderColor: '#B2B2B2',
      borderRadius: 10,
      paddingHorizontal: spacing(15),
      fontSize: fontSize(11),
      fontWeight: '300',
      // lineHeight: 26,
      paddingVertical: isIos ? spacing(15) : undefined,
      minHeight: isMultiline ? spacing(60) : undefined,
    };
  },
  formItem: {
    marginBottom: spacing(25),
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
    paddingVertical: spacing(20),
    paddingHorizontal: 10,
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

  formItemSelect: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  radioBtn: {
    borderWidth: 0.5,
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
    alignItems: 'flex-end',
  },
  button: {
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: '#000',
    width: spacing(130),
    height: spacing(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
