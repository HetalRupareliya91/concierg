import React from 'react';
import {ActivityIndicator, View, StyleSheet, Image} from 'react-native';

export function SplashScreen() {
  let [animating, setAnimating] = React.useState(true);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../Image/new-logo.png')}
        style={{width: 240, height: 128, resizeMode: 'contain', margin: 30}}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#04131a',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
