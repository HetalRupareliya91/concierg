import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import { isIos } from '../constants/appStyles';

export function Input({style, ...props}) {
  return (
    <TextInput
      {...props}
      style={[styles.inputStyle, style]}
      underlineColorAndroid="#000"
      placeholderTextColor="#000"
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
    />
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    color: '#000',
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 0,
    fontSize: 16,
    borderBottomWidth: isIos ? 1 : 0,
    borderRadius: 0,
    borderColor: '#000',
  },
});
