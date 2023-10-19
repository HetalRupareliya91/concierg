import React, { Component } from 'react';
import {
  Image,
  View,
  FlatList,
  // Picker,
  Text,
  StyleSheet,
  ScrollView,
  Button as RNButton,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddPropertyHeader from './header';
import RoundCard from './RoundCard';
import { fontSize, spacing } from '../../constants/appStyles';
import { Button, Radio } from './StepFirst';
// import * as ImagePicker from 'react-native-image-picker';

import ImagePicker from 'react-native-image-crop-picker';
import { Loading } from '../../components/Loading';
import { BASE_URL } from '../../config';
import { UserContext } from '../../contexts/UserContext';
import SecureStorage from 'react-native-secure-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import PopView from '../../components/popupView';
import { validURL } from '../../components/AddFeed';
import Picker from '../../components/popupView/picker';
const EstateImage = ({ item, onPress, style }) => (
  <View style={styles.listItem}>
    <Image source={{ uri: item.uri }} style={styles.listingImage} />
  </View>
);

class AddPropertyStep3Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      photos: [],
      enquiry_by: '',
      status: 'Active',
      agents: [],
      agent_id: {},
      deleted_images: [],
      isEdit: false,
    };
  }

  static contextType = UserContext;

  componentDidMount() {
    this.getAgents();
    const initState = this.props.getState();
    const state = {
      enquiry_by: initState.enquiry_by || '',
      status: initState.status || 'Active',
      agent_id: initState.agent_id || '',
      errors: {},
      photos: initState.images,
      isEdit: !!initState.id,
      deleted_images: initState.deleted_images || [],
    };
    this.setState({ ...state });
  }

  validate = () => {
    const { state } = this;
    const { photos, enquiry_by, status } = state;
    let errors = {};
    if (!photos || !photos.length) {
      errors.photos = 'Please select atleast one photo';
    }
    if (!enquiry_by) {
      errors.enquiry_by = 'Please select enquiry by';
    }
    if (!status) {
      errors.status = 'Please select status';
    }

    console.log('validate', state, errors);
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

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
        if (isEdit) {
          formData.append('id', state.id);
        }
        if (this.state.photos.length) {
          this.state.photos.map((img) => {
            // const image = {
            //   name: img.fileName,
            //   path: img.uri,
            //   uri: img.uri,
            //   type: img.type,
            // };
            const newFile = {
              uri: img.path,
              name: 'image.jpg',
              type: img.mime,
            };
            if (!img.path) return;
            formData.append('images[]', newFile);
          });
        }

        if (state.facilities && state.facilities.length) {
          state.facilities.map((f) => {
            formData.append('facilities[]', f);
          });
        }

        if (
          this.state.isEdit &&
          this.state.deleted_images &&
          this.state.deleted_images.length
        ) {
          let imgs = '';
          this.state.deleted_images.map((img) => {
            const imageName = img.substring(img.lastIndexOf('/') + 1);
            imgs += `${imageName},`;
          });
          formData.append('deleted_images', imgs);
        }

        formData.append('company_id', userDetails.details.company_id);
        formData.append('user_id', userDetails.details.id);
        formData.append('title', state.title);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('address', state.address);
        formData.append('beds', state.beds);
        formData.append('baths', state.baths);
        formData.append('email', state.email);
        formData.append('furnished', state.furnished);
        formData.append('lease_length', state.lease_length);
        formData.append('availability', state.availability);
        formData.append('phone', state.phone);
        formData.append('enquiry_by', this.state.enquiry_by);
        formData.append('status', this.state.status);
        formData.append('property_type', state.property_type);
        formData.append('agent_id', this.state.agent_id);
        console.log('onSubmit state', {
          thisState: this.state,
          token,
          state,
          formData,
        });
        // return;
        axios
          .post(
            `${BASE_URL}/${isEdit ? 'update-realEstate' : 'add-realEstate'}`,
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

  getAgents = () => {
    const { token } = this.context;
    console.log('getAgents state', {});
    this.setState({ agentLoading: true });
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        axios
          .post(
            `${BASE_URL}/getAgent`,
            { company_id: userDetails.details.company_id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(this.onSuccessAgentsLoad)
          .catch(this.onFailAgentsLoad);
      }
    });
  };

  onSuccessAgentsLoad = (res = {}) => {
    const { data = {} } = res;
    console.log('onSuccessAgentsLoad', res);
    this.setState({ agentLoading: false, agents: data.data || [] });
  };

  onFailAgentsLoad = (err) => {
    console.log('onFailAgentsLoad', err);
    this.setState({ agentLoading: false });
  };

  onSuccess = (response) => {
    this.setState({ loading: false });
    const propsState = this.props.getState() || {};
    const { backScreen } = propsState;
    console.log({ response, props: this.props });
    console.log('Update Success', response.data.propertyId)
    alert(this.state.isEdit ? 'Update Success' : 'Added Success');
    this.setState({ photos: [] });

    const state = this.props.getState() || {};

    if (this.state.isEdit) {
      this.props.navigation.replace('RealEstateDetail', { selectedFeed: { id: state.id } });
      return;
    }

    setTimeout(() => {
      // this.props.navigation.replace('RealEstate');
      this.props.navigation.replace('RealEstateDetail', { selectedFeed: { id: response.data.propertyId } });

    }, 1000);
  };

  onFail = (error) => {
    this.setState({ loading: false });
    console.log(error.response);
    alert(`Failed: ${error.data ? error.data.message : 'Add Failed'}`);
  };

  goBack = () => {
    const { back } = this.props;
    const { saveState } = this.props;
    saveState({ ...this.state, images: this.state.photos });
    back();
  };

  handleChoosePhoto = () => {
    ImagePicker.openPicker({
      cropping: true,
      multiple: true
    }).then(response => {
      console.log(response);
      const { photos = [] } = this.state;
      
        if (photos.length === 0) {
          this.setState({ photos: response });
        } else {
          var merge =  [...photos, ...response]
          console.log("merge",merge)
          this.setState({ photos: [...photos, ...response] });
        }
    });

    // ImagePicker.launchImageLibrary({}, (response) => {
    //   const { photos = [] } = this.state;
    //   if (response.uri) {
    //     console.log(response);
    //     if (photos.length === 0) {
    //       this.setState({ photos: [response] });
    //     } else {
    //       this.setState({ photos: [...photos, response] });
    //     }
    //   }
    //   console.log(photos);
    // });
  };

  handleChooseCamera = () => {

    ImagePicker.openCamera({

    }).then(response => {
      console.log("images", response)
      const { photos = [] } = this.state;
      // if (response.uri) {
      // console.log(response);
      if (photos.length === 0) {
        this.setState({ photos: response });
      } else {
        this.setState({ photos: [...photos, response] });
      }
      //}
      // console.log(photos);
    });


    // ImagePicker.launchCamera({}, (response) => {
    //   const { photos = [] } = this.state;
    //   if (response.uri) {
    //     console.log(response);
    //     if (photos.length === 0) {
    //       this.setState({ photos: [response] });
    //     } else {
    //       this.setState({ photos: [...photos, response] });
    //     }
    //   }
    //   console.log(photos);
    // });
  };

  estateImage = ({ item }) => {
    return <EstateImage item={item} style={styles.flatListBox} />;
  };

  handleChange = (text, name) => {
    const errors = { ...this.state.errors };
    errors[name] = undefined;
    this.setState({ [name]: text, errors });
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
    console.log("renderPhoto",item)
    var source = typeof item === 'object' ? item.path : item ;
    
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri:source}} />
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

  filterAgentData = () => {
    const { agents } = this.state;
    let data = [{ label: 'No Agent require', value: '' }];
    if (agents && agents.length) {
      agents.map((a) => {
        data.push({ label: a.agent_name, value: a.id });
      });
    }
    return data;
  };

  render() {
    console.log('StepThird', {
      propsState: this.props.getState(),
      state: this.state,
    });
    const agentData = this.filterAgentData();
    const {
      loading,
      photos = [],
      agentLoading,
      agents = [],
      errors = {},
    } = this.state;
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
                <Text style={styles.labelText}>Enquiry By</Text>
                <View style={styles.select}>
                  <Picker
                    selectedValue={this.state.enquiry_by}
                    onValueChange={(text) =>
                      this.handleChange(text, 'enquiry_by')
                    }
                    placeholder={'Select'}
                    data={[
                      { label: 'Email Only', value: 'Email Only' },
                      { label: 'Phone', value: 'Phone' },
                      { label: 'Both', value: 'Both' },
                    ]}
                  />
                </View>
                <Text style={{ color: 'red' }}>{errors.enquiry_by}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>Status</Text>
                <View style={styles.select}>
                  <Picker
                    selectedValue={this.state.status}
                    onValueChange={(text) => this.handleChange(text, 'status')}
                    placeholder={'Select'}
                    data={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                      { label: 'Let Agreed', value: 'Let Agreed' },
                      { label: 'Sale Agreed', value: 'Sale Agreed' },
                    ]}
                  />
                </View>
                <Text style={{ color: 'red' }}>{errors.status}</Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.labelText}>
                  Have you got an estate agent?
              </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.select, { flex: 1 }]}>
                    <Picker
                      selectedValue={this.state.agent_id}
                      onValueChange={(agent_id) => this.setState({ agent_id })}
                      placeholder={'Select'}
                      data={agentData}
                    />
                  </View>
                  {agentLoading ? (
                    <ActivityIndicator
                      style={{ marginLeft: spacing(20) }}
                      color="red"
                    />
                  ) : null}
                </View>
              </View>

              <View>
                <Text style={styles.labelText}>Images</Text>
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

              <View style={styles.btnContainer}>
                <Button label="Previous" onPress={this.goBack} />
                <Button
                  label="Submit"
                  btnStyle={{ backgroundColor: '#EDB43C' }}
                  onPress={this.validate}
                />
              </View>
            </View>
          </RoundCard>
          <Loading loading={loading} />
          <PopView
            visible={this.state.showImagePopup === true}
            onRequestClose={() => this.setState({ showImagePopup: false })}
            cardstyle={[styles.popupView]}>
            <View style={styles.container}>
              <TouchableOpacity
                style={{ padding: spacing(12) }}
                onPress={() => this.chooseImage('gallery')}>
                <Text style={{ fontSize: 16 }}>Choose From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: spacing(12) }}
                onPress={() => this.chooseImage('photo')}>
                <Text style={{ fontSize: 16 }}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          </PopView>
        
      </ScrollView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <AddPropertyStep3Screen {...props} navigation={navigation} />;
}
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
    color: '#000',
  },
  step1to2: {
    fontSize: 40,
    color: '#000',
  },
  step2to3: {
    fontSize: 40,
    color: '#000',
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
  popupView: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    paddingVertical: spacing(10),
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

  ImageSectionStyle: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    marginBottom: spacing(40),
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
  cancelIcon: {
    fontSize: 25,
    color: 'grey',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    elevation: 5,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(20),
  },
  sendIcon: {
    fontSize: fontSize(22),
    color: '#EDB43C',
    marginRight: spacing(20),
  },
});
