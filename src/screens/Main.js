import React, { Component } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Text,
    SectionList,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    KeyboardAwareScrollView,
    Button,
    FlatList,
  } from 'react-native';
import FormStep1 from './FormStep1';

export class Main extends Component {

  state = {
    step: 1,
    firstName: '',
    lastName: '',
    email: '',
    occupation: '',
    city: '',
    bio: ''
  };

    // Proceed to Next Step
    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }

    // Go Back to Prev Step
    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }

    // Handle Fields Change

    handleChange = input => e => {
      console.log({ [input]: e.target.value });
      this.setState({
        [e.target.name]: e.target.value
  });
      // this.setState({ [input]: e.target.value });
    };

      render() {
        const { step } = this.state;
        const { firstName, lastName, email, occupation, city, bio } = this.state;
        const values = { firstName, lastName, email, occupation, city, bio };

        switch(step) {
            case 1:
            return (
                <FormStep1
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                values={values}
              />
            );
            case 2:
              return (
                <FormStep1
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                values={values}
              />
            );
            case 3:
                return 
                <View>
                    <Text>
                       <h2>Step 3</h2>
                    </Text>
                </View>;
            case 4:
                return 
                <View>
                    <Text>
                       <h2>Step 4</h2>
                    </Text>
                </View>;
        }

        // return (
        //     <view>
        //         <Text>
        //             Hello
        //         </Text>
        //     </view>
        // )
    }
}

export default Main;
