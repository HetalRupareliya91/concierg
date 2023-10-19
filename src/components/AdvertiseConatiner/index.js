import React, { useState } from 'react';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export default AdvertiseContainer = ({  children, navigation ,...props}) => {
    const onSwipeLeft = (gestureState) => {
        navigation.navigate('Advertise');
    }

    const onSwipeRight = (gestureState) => {
        alert('You swiped right!');

    }
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 40,
        gestureIsClickThreshold: 5,
        detectSwipeUp: false,
        detectSwipeDown: false,
        detectSwipeRight: false
    };

    return (
        <GestureRecognizer
        
            {...props} 
            onSwipeLeft={(state) => onSwipeLeft(state)}
            // onSwipeRight={(state) => onSwipeRight(state)}
            config={config}

        >
            {children}
        </GestureRecognizer>
    )
}