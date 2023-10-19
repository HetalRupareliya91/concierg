import React, {Component} from 'react';
import {View} from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
// import UpdateScreen from './UpdateScreen';
import BillUpdate from './BillUpdate';

const allSteps = [
  {name: 'Screen 1', component: BillUpdate},
];

export default class UpdateProfiles extends Component {
  componentDidMount(){
    console.log('AddProperty componentDidMount', this.props)
  }
  
  finish = (finalState) => {
    console.log(finalState);
  };

  render() {
    const {route={}} = this.props;
    const {params={}} = route;
    const {data={}, backScreen} = params;
    return (
      <View style={{flex: 1}}>
        <AnimatedMultistep
          steps={allSteps}
          defaultState={{...data, backScreen}}
        />
      </View>
    );
  }
}
