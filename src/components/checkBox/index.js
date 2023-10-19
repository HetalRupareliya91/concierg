import React from 'react';
import {TouchableOpacity, Image, View, StyleSheet, Text} from 'react-native';
import {checkSVG} from '../../constants/commonSvg';
import {scales, spacing} from '../../constants/appStyles';

const Checkbox = ({checked, onCheck, text, style}) => {
  return (
    <TouchableOpacity
      onPress={() => onCheck()}
      style={[styles.container, style]}>
      <Image
        resizeMode="contain"
        source={
          checked
            ? require('../../../Image/checked.png')
            : require('../../../Image/unchecked.png')
        }
        style={styles.checkboxImage}
      />
      {!text ? null : (
        <View>
          <Text style={styles.checkboxText}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

Checkbox.defaultProps = {
  onCheck: () => null,
  checked: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing(10),
  },
  checkboxText: {
    marginRight: spacing(20),
  },
  checkboxImage: {
    height: scales(18),
    width: scales(18),
    marginRight: spacing(10),
  },
});

export default Checkbox;
