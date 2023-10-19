import React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {AuthContainer} from '../components/AuthContainer';
import {Heading} from '../components/Heading';
import SecureStorage from 'react-native-secure-storage';
import {UserContext} from '../contexts/UserContext';
import {Input} from '../components/Input';
import {FilledButton} from '../components/FilledButton';
import {Error} from '../components/Error';
import {BASE_URL} from '../config';
import {Loading} from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import {Formik} from 'formik';
import * as yup from 'yup';
import {EmergencyAlarmModal} from '../components/EmergencyAlarmModal';

export function FeedsScreen({navigation}) {
  const {logout} = React.useContext(AuthContext);
  const switchTheme = React.useContext(ThemeContext);
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState();
  const [appUser, setAppUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: '#000',
    padding: 30,
    marginHorizontal: 15,
    borderRadius: 10,
    borderColor: '#FFF',
    borderWidth: 2.5,
  };
  const [error, setError] = React.useState('');
  const validationSchema = yup.object().shape({
    description: yup.string().required('description is Required'),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFeeds();
  }, []);
  React.useEffect(function () {
    getFeeds();
  }, []);

  function addFeed(description) {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/add-feeds`,
        {
          description: description,
          company_id: appUser.company_id,
          user_id: appUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        setLoading(false);
        console.log(response);
        getFeeds();
        setVisible(false);
      })
      .catch(function (e) {
        setLoading(false);
        setError(e.response.data.msg);
        setLoading(false);
        console.log(e.response.data);
      });
  }

  function getFeeds() {
    setRefreshing(false);
    setLoading(true);
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        console.log(userDetails);
        setAppUser(userDetails.details);
        axios
          .post(
            `${BASE_URL}/get-feeds`,
            {
              company_id: userDetails.details.company_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function (response) {
            setLoading(false);
            setData(response.data.data.data);
            console.log(response.data.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error.response.data);
          });
      }
    });
  }

  const Feed = ({item, onPress, style}) => (
    <View style={[styles.item, style]}>
      <View style={styles.leftView}>
        <Icon name="person" style={styles.iconSize} />
      </View>
      <View style={styles.rightView}>
        <Text style={styles.name}>
          {item.owner}
          {'\n'}
          <View>
            <Text>{Moment(item.createDate, 'YYYY.MM.DD HH:II').fromNow()}</Text>
          </View>
        </Text>
        <Text>{item.description}</Text>
      </View>
    </View>
  );

  const feed = ({item}) => {
    return <Feed item={item} style={styles.flatListBox} />;
  };
  return (
    <AuthContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView style={styles.container}>
          <Heading>Feeds</Heading>
          <Formik
            validationSchema={validationSchema}
            initialValues={{description: ''}}
            onSubmit={(values) => {
              addFeed(values.description);
              values.description = '';
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
                <View style={styles.SectionStyle}>
                  <Input
                    name="description"
                    placeholder="Post a message your neighborhood"
                    style={styles.textInput}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    keyboardType="default"
                  />
                </View>
                {errors.description && (
                  <Text style={styles.errorTextStyle}>
                    {errors.description}
                  </Text>
                )}
                {error !== '' && <Error error={error} />}
                <FilledButton title={'Post'} onPress={handleSubmit} />
              </>
            )}
          </Formik>

          <View style={styles.listWrap}>
            {data && (
              <FlatList
                data={data}
                renderItem={feed}
                keyExtractor={(item) => 'ses' + item.id}
              />
            )}
          </View>
        </SafeAreaView>
        {/* <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>+</Text>
        </TouchableOpacity> */}
      </ScrollView>
      <EmergencyAlarmModal setLoading={setLoading} />
      <Loading loading={loading} />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  listWrap: {
    marginTop: 20,
  },
  flatListBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  leftView: {
    width: '15%',
  },
  rightView: {
    width: '85%',
  },
  statusOpen: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'green',
    borderRadius: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  statusClose: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'red',
    borderRadius: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconSize: {
    fontSize: 46,
  },
  buttonStyle: {
    backgroundColor: '#fc454e',
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 45,
    marginBottom: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  lableInput: {
    color: '#BA9551',
    fontSize: 28,
    marginLeft: 35,
    marginRight: 35,
  },
  errorTextStyle: {
    marginLeft: 35,
    color: 'red',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
