import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Modal, Text, TouchableOpacity} from 'react-native';
import Viewer from 'react-native-image-zoom-viewer';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

const ImageViewer = (props) => {
  const [activeIndex, setActiveIndex] = useState(props.index);
  const [showConfirm, setShowConfirm] = useState(false);
  const {images} = props;

  const onDelete = () => {
    setShowConfirm(false);
    props.onDelete(images[activeIndex].id);
  };

  const renderDeleteButton = () =>
    props.onDelete ? (
      <TouchableOpacity
        onPress={() => {
          props.onClose();
          setShowConfirm(true);
        }}
        style={styles.backButton}>
        <Text color="white">Delete</Text>
      </TouchableOpacity>
    ) : null;

  const onChange = (i) => {
    setActiveIndex(i);
  };

  useEffect(() => {
    setActiveIndex(props.index);
  }, [props.index]);

  console.log('ImageViewer render', activeIndex, props.index);

  return (
    <>
      <Modal visible={props.visible} transparent={true}>
        <Icon
          name="arrow-back"
          size={30}
          style={{
            position: 'absolute',
            top: 35,
            color: 'white',
            zIndex: 1000,
            left: 20,
          }}
          onPress={props.onClose}
        />
        <Viewer
          onChange={onChange}
          index={props.index}
          onSwipeDown={props.onClose}
          enableSwipeDown={true}
          loadingRender={() => <ActivityIndicator />}
          imageUrls={images}
          renderFooter={renderDeleteButton}
        />
      </Modal>
      {/* <YnDialog
        visible={showConfirm}
        onPressYes={onDelete}
        onPressNo={() => setShowConfirm(false)}
        onRequestClose={() => setShowConfirm(false)}
        // icon={newsSVG()}
        title="Are you sure to delete?"
      /> */}
    </>
  );
};

export default ImageViewer;
