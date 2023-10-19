import React, {Component} from 'react';
import {View} from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
// import UpdateScreen from './UpdateScreen';
import BillEditForm from './BillEditForm';

const allSteps = [
  {name: 'Screen 1', component: BillEditForm},
];

export default class BillProfiles extends Component {
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
