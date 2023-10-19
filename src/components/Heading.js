import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

export function Heading({children, style, ...props}) {
  const {colors} = useTheme();
  return (
    <Text {...props} style={[styles.titleTextStyle, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  titleTextStyle: {
    color: '#FFF',
    fontSize: 30,
    textAlign: 'left',
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '700',
  },
});
