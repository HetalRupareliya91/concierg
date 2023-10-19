import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useSwipe } from '../utils/useSwipe'
import { useNavigation } from '@react-navigation/native'
export function AuthContainer({ children }) {
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 10)
  const navigation = useNavigation()
  function onSwipeLeft() {
    navigation.navigate("Advertise")
  }

  function onSwipeRight() {
    //alert('SWIPE_RIGHT')
  }
  return (
    <View style={styles.mainBody}>{children}</View>
    // <ScrollView scrollEnabled={false} contentContainerStyle={styles.mainBody} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    //   <SafeAreaView style={{ flex: 1 }}>
    //     {children}
    //   </SafeAreaView>
    // </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    color: '#000',
  },
});
