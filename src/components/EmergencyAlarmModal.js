import React from 'react';
import axios from 'axios';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {Modal, Portal, Provider} from 'react-native-paper';
import {Col, Grid} from 'react-native-easy-grid';
import SecureStorage from 'react-native-secure-storage';
import {BASE_URL} from '../config';
import {UserContext} from '../contexts/UserContext';
import messaging from '@react-native-firebase/messaging';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Input} from '../components/Input';
import {Error} from '../components/Error';
import EmergencyPopup from '../utils/emergencyPopup';

export function EmergencyAlarmModal({setLoading}) {
	
  const {token} = React.useContext(UserContext);
  const [visible, setVisible] = React.useState(false);
  const [visibleNotSafe, setVisibleNotSafe] = React.useState(false);
  const [emergencyData, setEmergencyData] = React.useState();
  const showModal = () => {
    const isShowed = EmergencyPopup.getEmergencyPopupStatus();
    if(!isShowed){
      setVisible(true);
    }
  };
  const hideModal = () => {
    setVisible(false)
    EmergencyPopup.setEmergencyPopupStatus(true)
  };
  function showNotSafeModal() {
    hideModal(true);
    setVisibleNotSafe(true);
  }
  const hideNotSafeModal = () => setVisibleNotSafe(false);
  const containerStyle = {
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderRadius: 30,
    width: 300,
    // height: 200,
  };
  const containerNoteStyle = {
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderRadius: 30,
    width: '80%',
    marginLeft: 40,
    marginRight: 40,
  };
  const [error, setError] = React.useState('');
  const validationSchema = yup.object().shape({
    note: yup.string().required('Note is Required'),
  });

  React.useEffect(function () {
    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data.type === 'emergency') {
        setEmergencyData(remoteMessage);
        showModal();
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage.data.type === 'emergency') {
            setEmergencyData(remoteMessage);
            showModal();
          }
        }
      });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data.type === 'emergency') {
        setEmergencyData(remoteMessage);
        showModal();
      }
    });
  }, []);

  function emergencyResponse(ans, note) {
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log(userDetails.details.id);
        axios
          .post(
            `${BASE_URL}/safeUnsafeStatusUpdate`,
            {
              company_id: userDetails.details.company_id,
              user_id: userDetails.details.id,
              status: ans,
              alarm_id: emergencyData.data.alarm_id,
              note: note,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            hideNotSafeModal();
            hideModal(true);
            console.log(response);
          })
          .catch(function (error) {
            setLoading(false);
            hideNotSafeModal();
            hideModal(true);
            console.log(error.response.data);
          });
      }
    });
  }
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          dismissable={false}
          contentContainerStyle={containerStyle}>
          {emergencyData && (
            <View style={styles.SectionStyle}>
              <View style={styles.helpImage}>
                <Image
                  source={require('../../Image/safe-icon.png')}
                  style={styles.helpImage}
                />
              </View>
              <View style={{marginTop: 50}}>
                <Text style={styles.titleTextStyle}>
                  {emergencyData.notification.body}
                </Text>
              </View>
              <Grid style={{marginTop: 30}}>
                <Col>
                  <TouchableOpacity
                    onPress={() => emergencyResponse(1, '')}>
                    <Text style={styles.yesButtonStyle}>Yes</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    onPress={() => showNotSafeModal()}>
                    <Text style={styles.noButtonStyle}>No</Text>
                  </TouchableOpacity>
                </Col>
              </Grid>
            </View>
          )}
        </Modal>

        {/* NotSafeModal */}
        <Modal
          visible={visibleNotSafe}
          dismissable={false}
          // onDismiss={() => showNotSafeModal()}
          contentContainerStyle={containerNoteStyle}
          activeOpacity={20}>
          {emergencyData && (
            <View style={styles.NotSafeSectionStyle}>
              <View style={{marginTop: 50}}>
                <Text style={styles.titleTextStyle}>
                  {emergencyData.notification.body}
                </Text>

                <Formik
                  validationSchema={validationSchema}
                  initialValues={{note: ''}}
                  onSubmit={(values) => {
                    emergencyResponse(0, values.note);
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
                      <View style={styles.InputSectionStyle}>
                        <Input
                          name="note"
                          placeholder="Where Are You?"
                          style={styles.textInput}
                          onChangeText={handleChange('note')}
                          onBlur={handleBlur('note')}
                          value={values.note}
                          keyboardType="default"
                          multiline={true}
                          numberOfLines={4}
                        />
                      </View>
                      {errors.note && (
                        <Text style={styles.errorTextStyle}>{errors.note}</Text>
                      )}
                      <Error error={error} />
                      <TouchableOpacity
                        style={styles.ButtonStyle}
                        onPress={handleSubmit}>
                        <Text style={styles.buttonTextStyle}>Submit</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    height: 350,
    alignItems: 'center',
  },
  // modalBox: {
  //   top: 0,
  // },
  NotSafeSectionStyle: {
    height: 300,
    alignItems: 'center',
  },
  yesButtonStyle: {
    backgroundColor: '#FBB522',
    borderWidth: 0,
    color: '#000',
    borderColor: '#FBB522',
    height: 44,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 18,
  },
  noButtonStyle: {
    backgroundColor: '#03131A',
    borderWidth: 0,
    color: '#FFF',
    borderColor: '#03131A',
    height: 44,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 8,
  },
  
  titleTextStyle: {
    color: '#000',
    fontSize: 25,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '700',
  },
  helpImage: {
    marginTop: 20,
    height: 120,
    width: 101,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InputSectionStyle: {
    height: 60,
    width: 280,
    marginTop: 20,
    borderWidth: 0,
  },
  textInput: {
    width: '100%',
    paddingLeft: 10,
    color: '#000',
    borderBottomWidth: 0,
  },
  buttonTextStyle: {
    backgroundColor: '#FBB522',
    borderWidth: 0,
    color: '#000',
    borderColor: '#FBB522',
    height: 44,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 18,
  },
  lableInput: {
    color: '#BA9551',
    fontSize: 28,
    marginLeft: 35,
    marginRight: 35,
  },
  errorTextStyle: {
    marginTop: 5,
    color: 'red',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
