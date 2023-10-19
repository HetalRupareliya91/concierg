import React, {Component} from 'react';
import {View, Modal, TouchableHighlight} from 'react-native';
import styles from './styles';

class PopView extends Component {
  render() {
    const {children, transparency} = this.props;
    return (
      <Modal
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <TouchableHighlight
          activeOpacity={1}
          onPress={this.props.onRequestClose}
          style={[styles.container(transparency), this.props.containerStyle]}>
          <TouchableHighlight style={this.props.cardstyle}>
            {children || <View />}
          </TouchableHighlight>
        </TouchableHighlight>
      </Modal>
    );
  }
}

export default PopView;
