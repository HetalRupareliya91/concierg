import React, { Component } from 'react';
import { View } from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
import SecureStorage from 'react-native-secure-storage';
import { AuthContainer } from '../../components/AuthContainer';
import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import StepThird from './StepThird';
// const allSteps = ;

export default class AddProperty extends Component {
  componentDidMount() {
    console.log('AddProperty componentDidMount', this.props)
    SecureStorage.getItem('user').then((user) => {
      if (user) {
        const userDetails = JSON.parse(user);
        if (userDetails.details.member_type == 'tenant') {
          setTimeout(() => {
            this.props.navigation.replace('NoAccessScreen');
          }, 1000);
          // alert(
          //   "You don't have permission to add property",
          //   "My Alert Msg",
          //   [
          //     {
          //       text: "Cancel",
          //       onPress: () => console.log("Cancel Pressed"),
          //       style: "cancel"
          //     },
          //     { text: "OK", onPress: () => console.log("OK Pressed") }
          //   ],
          //   { cancelable: false }
          // );
        }
      }
    });
  }
  onNext = () => {
    console.log('Next');
  };

  onBack = () => {
    console.log('Back');
  };

  finish = (finalState) => {
    console.log(finalState);
  };

  render() {

    const { route = {}, navigation } = this.props;
    console.log("this.props", this.props, navigation)
    const { params = {} } = route;
    const { item = {}, backScreen } = params;
    return (
      <AuthContainer>
        <View style={{ flex: 1 }}>

          <AnimatedMultistep
            steps={[
              { name: 'step 1', component: StepFirst },
              { name: 'step 2', component: StepSecond },
              { name: 'step 3', component: StepThird },
            ]}
            onFinish={this.finish}
            onBack={this.onBack}
            onNext={this.onNext}
            defaultState={{ ...item, backScreen, navigation }}
          />
        </View>
      </AuthContainer>

    );
  }
}
