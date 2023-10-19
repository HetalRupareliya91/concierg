import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {spacing, deviceDimensions, fontSize} from '../../constants/appStyles';

export const hPadding = 20;
const itemPadding = 10;

const MenuItem = (props) => {
  const width = props.width || deviceDimensions.width;
  const safeWidth = width - (2 * hPadding + 2 * itemPadding);
  const cItemWidth = safeWidth * 0.38;
  const sItemWidth = safeWidth * 0.31;
  const w = props.isCenter ? cItemWidth : sItemWidth;
  const style = {
    height: w,
    width: w,
    borderRadius: w / 2,
    ...props.style,
  };

  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.menuItem, style]}>
      <Image
        source={props.icon}
        style={[
          {
            height: w / 3.5,
            width: w / 3.5,
            marginBottom: 5,
            resizeMode: 'contain',
          },
          props.iconStyle,
        ]}
      />
      <Text style={[styles.menuLable, props.labelStyle]}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(10),
  },
  menuLable: {
    textAlign: 'center',
    width: '100%',
    color: '#000',
    fontSize: fontSize(10),
  },
});

export default MenuItem;
