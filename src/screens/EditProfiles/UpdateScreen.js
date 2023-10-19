import React, { Component } from 'react';
import axios from 'axios';
import {
  Image,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  // Picker,
  Text,
  Alert,
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
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
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

class UpdateDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { photos: '' };
  }
  state = {
    user: '',
    appUser: {},
    issubmiting: false
  };
  updateUser = (user) => {
    this.setState({ user: user });
  };

  static contextType = UserContext;
  componentDidMount() {
    const initState = this.props.getState();
    const state = {
      first_name: initState.first_name || '',
      middle_name: initState.middle_name || '',
      last_name: initState.last_name || '',
      email: initState.email || '',
      phone_number: initState.phone_number || '',
      photos: initState.images,
      errors: {},
    };
    this.setState(state);
  }

  validate = () => {
    const { next, saveState } = this.props;
    const { state } = this;
    const { first_name, last_name, email, phone_number } = state;
    let errors = {};
    if (!first_name) {
      errors.first_name = 'Please enter First Name';
    }
    if (!last_name) {
      errors.last_name = 'Please enter Last Name';
    }
    // if (!phone_number) {
    //   errors.phone_number = 'Please enter Phone Number';
    // }
    // if (!photos || !photos.length) {
    //   errors.photos = 'Please select atleast one photo';
    // }
console.log("errors",errors)
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    //saveState(this.state);
    //next();
    this.submit();
  };

  submit = () => {
    this.setState({ issubmiting: true }, () => {
      const state = this.props.getState() || {};
      const { token } = this.context;
console.log("start")
      // return;
      this.setState({ loading: true });
      SecureStorage.getItem('user').then((user) => {
        if (user) {
          const userDetails = JSON.parse(user);
          const isEdit = this.state.isEdit;
          this.setState({ appUser: userDetails });

          const formData = new FormData();

          formData.append('id', state.id);
          formData.append('company_id', userDetails.details.company_id);
          formData.append('user_id', userDetails.details.id);
          formData.append('first_name', this.state.first_name);
          formData.append('middle_name', this.state.middle_name);
          formData.append('last_name', this.state.last_name);
          formData.append('phone_number', this.state.phone_number);
          formData.append('email', this.state.email);

          console.log('this', this.state.photos);
          if (this.state.photos === undefined) {

          }
          else {
            if (this.state.photos.length) {
              console.log("photoes",this.state.photos)
              
              this.state.photos.map((img) => {
                const image = {
                  name: img.modificationDate,
                  path: img.path,
                  uri: img.path,
                  type: img.mime,
                };
                if (!image.path) return;
                formData.append('images', image);
              });
            }
          }

          console.log('onSubmit state', {
            thisState: this.state,
            token,
            state,
            formData,
          });
          // return;
          axios
            .post(
              `${BASE_URL}/${isEdit ? 'update-user' : 'update-user'}`,
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
    })
  };


  onSuccess = (response) => {
    this.setState({ loading: false, issubmiting: false });
    const propsState = this.props.getState() || {};
    const { backScreen } = propsState;

    alert(this.state.isEdit ? 'User Details Update Successfully' : 'User Details Update Successfully');
    this.setState({ photos: [] });

    const state = this.props.getState() || {};
    setTimeout(() => {
      this.props.navigation.navigate('Profile', { refetch: Math.random() });
      // this.props.navigation.goBack()
    }, 1000);

    console.log('UpdateScreen onSuccess', { response, state: this.state })
  };

  onFail = (error) => {
    this.setState({ loading: false, issubmiting: false });
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

  handleChoosePhoto = () => {


    ImagePicker.openPicker({
      // width: 400,
      // height: 400,
      // cropping: true,
    }).then(response => {
      const { photos = [] } = this.state;
      // if (response.uri) {
      if (photos.length === 0) {
        this.setState({ photos: [response] });
      } else {
        this.setState({ photos: [...photos, response] });
      }
      // }
    }).then((error)=>{
      console.log("image error",error)
    });

    // ImagePicker.launchImageLibrary({}, (response) => {

    // });
  };

  handleChooseCamera = () => {


    ImagePicker.openCamera({

    }).then(response => {
      const { photos = [] } = this.state;
      // if (response.path) {
       
        if (photos.length === 0) {
          this.setState({ photos: [response] });
        } else {
          this.setState({ photos: [...photos, response] });
        }
      // }
    });
  };

  estateImage = ({ item }) => {
    return <EstateImage item={item} style={styles.flatListBox} />;
  };

  chooseImage = (type) => {
    this.setState({ showImagePopup: false });
    if (type === 'gallery') {
      this.handleChoosePhoto();
    } else {
      this.handleChooseCamera();
    }
  };


  renderPhoto = ({ item }) => {
    
    var source = typeof item === 'object' ? item.path : item;
    console.log("image item",item,source)
    return (
      <View style={styles.imageContainer}>
        <Image style={[styles.image,{width:50,height:50}]} source={{ uri: source }} />
        <View style={styles.deleteButton}>
          <Icon
            name="close-circle-sharp"
            onPress={() => {
              const { photos = [] } = this.state;
              var newPhotos = photos.filter((photo) => {
                return photo !== item;
              });
              this.setState({ photos: newPhotos });
              if (validURL(item)) {
                this.setState({
                  deleted_images: [...this.state.deleted_images, item],
                });
              }
            }}
            style={styles.cancelIcon}
          />
        </View>
      </View>
    );
  };


  render() {
    const { errors = {}, photos = [] } = this.state;

    return (
      <AuthContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView}>
            <View style={styles.container}>
              <Text style={styles.lableInput}>First Name</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'first_name')}
                  value={this.state.first_name}
                  placeholder={'First Name'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.first_name}</Text>
              </View>

              <Text style={styles.lableInput}>Middle Name</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'middle_name')}
                  value={this.state.middle_name}
                  placeholder={'Middle Name'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.middle_name}</Text>
              </View>

              <Text style={styles.lableInput}>Last Name</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                  onChangeText={(text) => this.handleChange(text, 'last_name')}
                  value={this.state.last_name}
                  placeholder={'Last Name'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.last_name}</Text>
              </View>

              <Text style={styles.lableInput}>Email Address</Text>
              <View style={styles.SectionStyle}>
                <InputBox
                 editable={false}
                  onChangeText={(text) => this.handleChange(text, 'email')}
                  value={this.state.email}
                  placeholder={'Email Address'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.email}</Text>
              </View>

            {/*  <Text style={styles.lableInput}>Phone Number</Text>
               <View style={styles.SectionStyle}>
                <InputBox
                 editable={false}
                  onChangeText={(text) => this.handleChange(text, 'phone_number')}
                  value={this.state.phone_number}
                  placeholder={'Phone Number'}
                  style={styles.textInput}
                />
                <Text style={{ color: 'red' }}>{errors.phone_number}</Text>
              </View> */}

              {/* <Text style={styles.lableInput}>Member Image</Text>
              <View style={styles.SectionStyle}>
                <Text style={styles.selectImg}>Select Image</Text>
              </View> */}

              <Text style={styles.lableInput}>Member Image</Text>
              <View>
                {photos.length > 0 && (
                  <FlatList
                    data={photos}
                    horizontal
                    renderItem={this.renderPhoto}
                    keyExtractor={(item, index) => `${index}`}
                  />
                )}
                <View style={styles.sendContainer}>
                  <Icon
                    name="camera"
                    style={styles.sendIcon}
                    onPress={this.handleChooseCamera}
                  />
                  <Icon
                    name="images"
                    style={styles.sendIcon}
                    onPress={this.handleChoosePhoto}
                  />
                </View>
                {errors.photos ? <Text style={{ color: 'red', marginBottom: spacing(20) }}>{errors.photos}</Text> : null}
              </View>
              {
                this.state.issubmiting &&
                <View>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              }

              {/* <Button onPress={this.nextStep} style={styles.loginButton}/> */}
              <FilledButton title={'Update'} onPress={this.validate} style={styles.loginButton} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AuthContainer>
    );
  }
}

// export default UpdateDetailScreen;

export default function (props) {
  const navigation = useNavigation();

  return <UpdateDetailScreen {...props} navigation={navigation} />;
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
  imageContainer: {
    width: spacing(60),
    height: spacing(60),
    marginBottom: spacing(10),
  },
  image: {
    width: spacing(50),
    height: spacing(50),
    marginTop: 10,
    borderRadius: 5,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(20),
  },
  sendIcon: {
    fontSize: fontSize(22),
    marginRight: spacing(20),
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    elevation: 5,
  },
});