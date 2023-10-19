import React from 'react';
import {StyleSheet, View} from 'react-native';
import { spacing } from '../../constants/appStyles';

const RoundCard = ({children, style}) => (
  <View style={[styles.roudedLayout, style]}>{children}</View>
);

const styles = StyleSheet.create({
  roudedLayout: {
    marginTop: -spacing(44),
    paddingHorizontal: 15,
    paddingVertical: spacing(20),
    backgroundColor: '#FFF',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
  },
});

export default RoundCard;
