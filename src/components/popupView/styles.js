import {StyleSheet} from 'react-native';
import { scales } from '../../constants/appStyles';

export default StyleSheet.create({
  children: {
    height: scales(300),
    width: scales(300),
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: (transparency) => {
    return {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `rgba(0, 0, 0, ${transparency || 0.7})`,
    };
  },
});
