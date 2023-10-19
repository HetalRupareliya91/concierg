import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import PopView from '.';
import { spacing } from '../../constants/appStyles';
import Icon from 'react-native-vector-icons/Ionicons';

// const data = [
//   {label: 'label1', value: 'value1'},
//   {label: 'label2', value: 'value2'},
//   {label: 'label3', value: 'value3'},
//   {label: 'label4', value: 'value4'},
// ];

const Picker = (props) => {
  const [visible, setVisible] = useState(false);
  const {selectedValue, onValueChange, placeholder, data=[]} = props;

  const getLabel = (value) => {
    let label = '';
    data.map((item) => {
      if (item.value == value) {
        label = item.label;
      }
    });
    return label;
  };

  const onSelect = (item) => {
    setVisible(false);
    onValueChange(item.value);
  };

  return (
    <>
      <TouchableOpacity style={styles.picker} onPress={() => setVisible(true)}>
        <Text>{getLabel(selectedValue) || placeholder}</Text>
        <Icon name="caret-down-outline" style={styles.step1} />
      </TouchableOpacity>
      <PopView
        visible={visible === true}
        onRequestClose={() => setVisible(false)}
        cardstyle={[styles.popupView]}>
        <View style={styles.container}>
          {data.map((item) => (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              style={{padding: spacing(12)}}>
              <Text style={{fontSize: 16}}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </PopView>
    </>
  );
};

const styles = StyleSheet.create({
  popupView: {
    backgroundColor: 'white',
    width: '80%',
    paddingVertical: 10
  },
  select: {
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  picker: {
    paddingVertical: spacing(15),
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Picker;
