import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  // Picker,
  ScrollView,
} from 'react-native';
import {isIos, spacing} from '../constants/appStyles';
import {Button, Radio} from '../screens/AddProperty/StepFirst';
import PopView from './popupView';
import Icon from 'react-native-vector-icons/Ionicons';
import Picker from './popupView/picker';

const PropertyFilters = (props) => {
  const [values, setValues] = React.useState({});
  const {visible, onClose} = props;

  const onChange = (value, name) => {
    const filters = {...values};
    filters[name] = value;
    if (!value) {
      delete filters[name];
    }
    setValues(filters);
  };

  const onChangeFurnished = (value, name) => {
    const cValue = values[name];
    const aValues = {...values};
    aValues[name] = value;
    if (value === cValue) {
      delete aValues[name];
    }
    setValues(aValues);
  };

  const resetFilters = () => {
    setValues({});
  }

  return (
    <PopView
      visible={visible === true}
      onRequestClose={onClose}
      cardstyle={[styles.popupView]}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View />
          <Text style={styles.title}>Choose Filters</Text>
          <TouchableOpacity
            onPress={onClose}
            style={{padding: spacing(10), paddingTop: 0}}>
            <Icon name="close-outline" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.labelText}>Price</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.minPrice}
                  onValueChange={(minPrice) => onChange(minPrice, 'minPrice')}
                  placeholder={'Min'}
                  data={[
                    {label: 'Min', value: ''},
                    {label: '1000', value: '1000'},
                    {label: '5000', value: '5000'},
                    {label: '10000', value: '10000'},
                    {label: '15000', value: '15000'},
                    {label: '20000', value: '20000'},
                    {label: '25000', value: '25000'},
                  ]}
                />
              </View>
            </View>
            <Text>to</Text>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.maxPrice}
                  onValueChange={(maxPrice) => onChange(maxPrice, 'maxPrice')}
                  placeholder={'Max'}
                  data={[
                    {label: 'Max', value: ''},
                    {label: '1000', value: '1000'},
                    {label: '5000', value: '5000'},
                    {label: '10000', value: '10000'},
                    {label: '15000', value: '15000'},
                    {label: '20000', value: '20000'},
                    {label: '25000', value: '25000'},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.labelText}>Beds</Text>
          <View style={styles.typeRow}>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.minBeds}
                  onValueChange={(minBeds) => onChange(minBeds, 'minBeds')}
                  placeholder={'Min'}
                  data={[
                    {label: 'Min', value: ''},
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                  ]}
                />
              </View>
            </View>
            <Text>to</Text>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.maxBeds}
                  onValueChange={(maxBeds) => onChange(maxBeds, 'maxBeds')}
                  placeholder={'Max'}
                  data={[
                    {label: 'Max', value: ''},
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.labelText}>Baths</Text>
          <View style={styles.typeRow}>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.minBaths}
                  onValueChange={(minBaths) => onChange(minBaths, 'minBaths')}
                  placeholder={'Min'}
                  data={[
                    {label: 'Min', value: ''},
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                  ]}
                />
              </View>
            </View>
            <Text>to</Text>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.maxBaths}
                  onValueChange={(maxBaths) => onChange(maxBaths, 'maxBaths')}
                  placeholder={'Max'}
                  data={[
                    {label: 'Max', value: ''},
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.labelText}>Lease Length</Text>
          <View style={styles.typeRow}>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.minLeaseLength}
                  onValueChange={(minLeaseLength) =>
                    onChange(minLeaseLength, 'minLeaseLength')
                  }
                  placeholder={'Min'}
                  data={[
                    {label: 'Min', value: ''},
                    {label: '3 months', value: '3 months'},
                    {label: '6 months', value: '6 months'},
                    {label: '9 months', value: '9 months'},
                    {label: '1 Year', value: '1 Year'},
                    {label: '2 Years', value: '2 Years'},
                    {label: '3 Years', value: '3 Years'},
                    {label: '999 Years', value: '999 Years'},
                  ]}
                />
              </View>
            </View>
            <Text>to</Text>
            <View style={{width: '45%'}}>
              <View style={styles.select}>
                <Picker
                  selectedValue={values.maxLeaseLength}
                  onValueChange={(maxLeaseLength) =>
                    onChange(maxLeaseLength, 'maxLeaseLength')
                  }
                  placeholder={'Max'}
                  data={[
                    {label: 'Max', value: ''},
                    {label: '3 months', value: '3 months'},
                    {label: '6 months', value: '6 months'},
                    {label: '9 months', value: '9 months'},
                    {label: '1 Year', value: '1 Year'},
                    {label: '2 Years', value: '2 Years'},
                    {label: '3 Years', value: '3 Years'},
                    {label: '999 Years', value: '999 Years'},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.labelText}>Furnished</Text>
          <View style={styles.radioGroupWrap}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onChangeFurnished('True', 'furnished')}
              style={styles.radioGroup}>
              <Radio
                onPress={() => onChangeFurnished('True', 'furnished')}
                label="Yes"
                checked={values.furnished === 'True'}
                style={{marginRight: spacing(10)}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onChangeFurnished('False', 'furnished')}
              style={styles.radioGroup}>
              <Radio
                onPress={() => onChangeFurnished('False', 'furnished')}
                label="No"
                checked={values.furnished === 'False'}
                style={{marginRight: spacing(10)}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: spacing(15),
          }}>
          <Button
            onPress={resetFilters}
            label="Reset"
          />
          <Button
            onPress={() => props.onChange(values)}
            btnStyle={styles.applyButton}
            label="Apply Filters"
          />
        </View>
      </ScrollView>
    </PopView>
  );
};

const styles = StyleSheet.create({
  popupView: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    paddingVertical: spacing(10),
    paddingRight: spacing(5),
    height: isIos ? '90%' : '94%',
  },
  formItem: {
    marginBottom: spacing(25),
    paddingHorizontal: spacing(15),
  },
  labelText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  select: {
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  typeView: (selected) => {
    return {
      width: '48%',
      borderWidth: selected ? 1.5 : 1,
      borderColor: selected ? 'black' : '#B2B2B2',
      borderRadius: 10,
      paddingVertical: spacing(20),
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  typeRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing(20),
    fontWeight: 'bold',
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
  applyButton: {
    marginRight: spacing(15),
    width: spacing(140)
  },
});

export default PropertyFilters;
