import React from 'react';
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
import { RadioButton, TextInput } from 'react-native-paper';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { AuthContainer } from '../components/AuthContainer';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../contexts/UserContext';
import SecureStorage from 'react-native-secure-storage';
import Textarea from 'react-native-textarea';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export function EditAboutApartmentScreen({ navigation }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [data, setData] = React.useState();
    const [lease, setLease] = React.useState('');
    const [beds, setBeds] = React.useState();
    const [baths, setBaths] = React.useState();
    const [availability, setAvailability] = React.useState();
    const [checked, setChecked] = React.useState('Yes');
    const [propertyType, setPropertyType] = React.useState('rent');
    const [enquiry_by, setEnquiry] = React.useState();
    const [appUser, setAppUser] = React.useState();
    const [status, setStatus] = React.useState();
    const [refreshing, setRefreshing] = React.useState(false);
    const [photos, setPhoto] = React.useState([]);
    const { token } = React.useContext(UserContext);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        getConciergeDetails();
    }, []);
    function getConciergeDetails() {
        // setRefreshing(false);
        // setLoading(true);
        SecureStorage.getItem('user').then((user) => {
            if (user) {
                const userDetails = JSON.parse(user);
                setAppUser(userDetails.details);

            }
        });
    }
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 40,
        gestureIsClickThreshold: 5,
    };
    function onSwipeLeft(direction) {
        navigation.navigate('Advertise');
    }
    React.useEffect(function () {
        getConciergeDetails();
    }, []);

    const loginValidationSchema = yup.object().shape({
        first_name: yup.string().required('First Name is Required'),
        last_name: yup.string().required('Last Name is Required'),
        phone_number: yup
            .string()
            .required('Phone Number is Required')
            .matches(/^[0-9]+$/, 'Must be only digits'),
        email: yup
            .string()
            .email('Please enter valid email')
            .required('Email Address is Required'),
    });

    function addProperty(values) {
        console.log(values)
        setLoading(true);
        SecureStorage.getItem('user').then((user) => {
            if (user) {
                const userDetails = JSON.parse(user);
                axios
                    .post(
                        `${BASE_URL}/update-user`,
                        {
                            company_id: userDetails.details.company_id,
                            user_id: userDetails.details.id,
                            first_name: values.first_name,
                            middle_name: values.middle_name,
                            last_name: values.last_name,
                            email: values.email,
                            phone_number: values.phone_number,
                            // images: photos,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )
                    .then(function (response) {
                        setLoading(false);
                        console.log(response)
                        setSuccess('Update successfully');
                        // setPhoto([]);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 1000);
                    })
                    .catch(function (error) {
                        console.log(error)
                        setLoading(false);
                        setError(error.response.data.msg);
                        setLoading(false);
                    });
            }
        });
    }

    const handleChoosePhoto = () => {
        const options = {
            includeBase64: true,
        };


        ImagePicker.openPicker(options).then(response => {
            console.log(response);
            if (response.uri) {

                if (photos.length === 0) {
                    setPhoto([response]);
                } else {
                    setPhoto((arr) => [...arr, response]);
                }
            }
            console.log(photos);
        });


        // ImagePicker.launchImageLibrary(options, (response) => {
        //     if (response.uri) {

        //         if (photos.length === 0) {
        //             setPhoto([response]);
        //         } else {
        //             setPhoto((arr) => [...arr, response]);
        //         }
        //     }
        //     console.log(photos);
        // });
    };
    const EstateImage = ({ item, onPress, style }) => (
        <View style={styles.listItem}>
            <Image source={{ uri: item.uri }} style={styles.listingImage} />
        </View>
    );

    const estateImage = ({ item }) => {
        return <EstateImage item={item} style={styles.flatListBox} />;
    };

    var { amount } = 'teet';
    return (
        <AuthContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <ScrollView keyboardShouldPersistTaps="handled" style={styles.mainView} showsVerticalScrollIndicator={false}>
              
                        <View style={styles.container}>
                            <Formik
                                validationSchema={loginValidationSchema}
                                initialValues={{
                                    first_name: '',
                                    middle_name: '',
                                    last_name: '',
                                    email: '',
                                    phone_number: '',
                                }}
                                onSubmit={(values) => {
                                    // console.log(values);
                                    addProperty(values);
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
                                        <Text style={styles.lableInput}>Floor Plan</Text>
                                        <View style={styles.SectionStyle}>

                                            <Input
                                                name="email"
                                                placeholder="Floor Plan"
                                                style={styles.textInput}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                value={values.email}
                                                defaultValue={values.email}
                                                keyboardType="email-address"
                                            />

                                        </View>
                                        {errors.email && (
                                            <Text style={styles.errorTextStyle}>{errors.email}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Type of Paint</Text>
                                        <View style={styles.SectionStyle}>

                                            <Input
                                                name="phone_number"
                                                placeholder="Type of Paint"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />

                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Light bulbs</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Light bulbs"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Window Sizes</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Window Sizes"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Oven</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Oven"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Fridge</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Fridge"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Dish Washer</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Dish Washer"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Washing Machine/Dryer</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Washing Machine or Dryer"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Boiler Information</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Boiler Information"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Air Conditioning</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Air Conditioning"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Heating</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Heating"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}

                                        <Text style={styles.lableInput}>Hob</Text>
                                        <View style={styles.SectionStyle}>
                                            <Input
                                                name="phone_number"
                                                placeholder="Hob"
                                                style={styles.textInput}
                                                onChangeText={handleChange('phone_number')}
                                                onBlur={handleBlur('phone_number')}
                                                value={values.phone_number}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.phone_number && (
                                            <Text style={styles.errorTextStyle}>{errors.phone_number}</Text>
                                        )}


                                        {error !== '' && <Error error={error} />}
                                        {success !== '' && <Success error={success} />}
                                        <FilledButton title={'Update'} onPress={handleSubmit} style={styles.loginButton} />
                                        <Loading loading={loading} />
                                    </>
                                )}
                            </Formik>
                        </View>
            
                </ScrollView>
            </KeyboardAvoidingView>
        </AuthContainer>
    );
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
