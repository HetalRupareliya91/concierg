import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Heading} from '../components/Heading';
import { RadioButton } from 'react-native-paper';
// import styles from './styles';

class AddPropertyStep1Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: '',
      currentStep: '',
      checked: 'first',
    };
  }
  state = {user: ''}
  updateUser = (user) => {
    this.setState({ user: user })
  }
  
  static getDerivedStateFromProps = (props) => {
    const {getTotalSteps, getCurrentStep} = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
  };

  nextStep = () => {
    const {next, saveState} = this.props;
    // Save state for use in other steps
    saveState({name: 'samad'});

    // Go to next step
    next();
  };
  setChecked = (value) => {
    this.checked = value;
  }

  goBack() {
    const {back} = this.props;
    // Go to previous step
    back();
  }

  render() {
    const {currentStep, totalSteps} = this.state;
    return (
        <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.mainView}>
          <View style={styles.headerBG} >
            <Heading style={styles.titleText}>Add Property</Heading>
            <Image source={require('../../Image/add.png')} style={styles.headerImage}/>
          </View>
          <View style={styles.roudedLayout}>
            <View style={[styles.container, styles.step1]}>
              <View style={styles.formSteps}>
                <Icon name="checkmark-circle" style={styles.step1}/>
                <Icon name="remove-outline" style={styles.step1to2}/>
                <Icon name="checkmark-circle" style={styles.step2}/>
                <Icon name="remove-outline" style={styles.step2to3}/>
                <Icon name="checkmark-circle" style={styles.step3}/>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Title</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  placeholder={'Tea Trade Wharf'}
                  placeholderTextColor="#000"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Description (Limit text (200))</Text>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  placeholder={'Tea trade Wharf, 26 shad Thames, London, United Kingdom is a laxury real estate listing for sale by Mansion Global.'}
                  placeholderTextColor="#000"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Property Type</Text>
                <View style={styles.radioGroupWrap}>
                  <View style={styles.radioGroup}>
                    <RadioButton
                      value="rent"
                      status={ this.checked === 'rent' ? 'checked' : 'unchecked' }
                      onPress={() => this.setChecked('rent')} style={styles.radioBtn}/>
                    <Text style={styles.radioText}>For Rent</Text>
                  </View>
                  <View style={styles.radioGroup}>
                    <RadioButton
                      value="sale"
                      status={ this.checked === 'sale' ? 'checked' : 'unchecked' }
                      onPress={() => this.setChecked('sale')} style={styles.radioBtn}
                    />
                    <Text style={styles.radioText}>For Sale</Text>
                  </View>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Price</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  placeholder={'$ 1,500'}
                  placeholderTextColor="#000"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Property Address</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  placeholder={'26 Shad Thames, London SE2AS, UK'}
                  placeholderTextColor="#000"
                />
              </View>
              <View style={styles.formItemSelect}>
                <View style={{width: 100, marginRight: 30}}>
                  <Text style={styles.labelText}>Beds</Text>
                  <View style={styles.select}>
                    <Picker selectedValue = {this.state.user} onValueChange = {this.updateUser} style={{height: 50, width: 100}}>
                      <Picker.Item label="0 - 10" value="0 - 10" />
                      <Picker.Item label="0 - 10" value="0 - 10" />
                    </Picker>
                  </View>
                </View>
                <View style={{width: 100}}>
                  <Text style={styles.labelText}>Baths</Text>
                  <View style={styles.select}>
                    <Picker selectedValue = {this.state.user} onValueChange = {this.updateUser} style={{height: 50, width: 100}}>
                      <Picker.Item label="0 - 5" value="0 - 5" />
                      <Picker.Item label="0 - 5" value="0 - 5" />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={this.nextStep} style={styles.btnStyle}>
                  <Text style={styles.nextBtn}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
