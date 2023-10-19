import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { spacing } from '../../constants/appStyles';
import {Heading} from '../../components/Heading';

const AddPropertyHeader = ({getState}) => {
  const state = getState() || {};
  return(
  <View style={styles.headerBG}>
    <Heading style={styles.titleText}>{state.id ? 'Edit Property' : 'Add Property'}</Heading>
    <Image
      source={require('../../../Image/add.png')}
      style={styles.headerImage}
    />
  </View>
)};

const styles = StyleSheet.create({
  headerBG: {
    position: 'relative',
    height: spacing(180),
    width: '100%',
    backgroundColor: '#EDB43C',
  },
  titleText: {
    position: 'absolute',
    left: 0,
    color: '#000',
    fontSize: 27,
    textAlign: 'left',
  },
  headerImage: {
    position: 'absolute',
    right: spacing(20),
    top: spacing(10),
    width: spacing(150),
    height: spacing(115),
  },
});

export default AddPropertyHeader;
