import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

export const validURL = (str) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};

const AddFeed = (props) => {
  const [title, setTitle] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [photos, setPhoto] = React.useState([]);
  const [height, setHeight] = React.useState(0);
  const [deletedPhotos, setDeletedPhotos] = React.useState([]);

  useEffect(() => {
    if (props.feed) {
      setTitle(props.feed.description ? props.feed.description : '');
      setPhoto(props.feed.properties);
      setShowSubmit(true);
    }
  }, [props.feed]);

  useEffect(() => {
    if (!props.feed) {
      setShowSubmit(photos.length > 0 || title.length > 0);
    }
  }, [photos]);

  const handleChoosePhoto = () => {
    const options = {
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
    };
    ImagePicker.openCamera(options).then(response => {
      console.log("images", response)

      console.log(response);
      if (photos.length === 0) {
        setPhoto([response]);
      } else {
        setPhoto([...photos, response]);
      }

      console.log([...photos, response]);
    });

    // ImagePicker.launchCamera(options, (response) => {
    //   if (response.uri) {
    //     console.log(response);
    //     if (photos.length === 0) {
    //       setPhoto([response]);
    //     } else {
    //       setPhoto((arr) => [...arr, response]);
    //     }
    //   }
    //   console.log(photos);
    // });
  };

  const handleChooseGallery = () => {
    const options = {
      includeBase64: true,
      // maxWidth: 500,
      // maxHeight: 500,
      multiple: true
    };

    ImagePicker.openPicker(options).then(response => {


      // if (response.uri) {
      console.log("response[]", response);
      if (photos.length === 0) {
        setPhoto(response);
      } else {
        setPhoto([...photos, ...response]);
      }
      // }
      // console.log(photos);
    }).catch((ex) => {
      // alert(ex)
    });

    // ImagePicker.launchImageLibrary(options, (response) => {
    //   if (response.uri) {
    //     console.log(response);
    //     if (photos.length === 0) {
    //       setPhoto([response]);
    //     } else {
    //       setPhoto((arr) => [...arr, response]);
    //     }
    //   }
    //   console.log(photos);
    // });
  };

  const reload = () => {
    setTitle('');
    setPhoto([]);
    setShowSubmit(false);
  };

  const renderPhoto = ({ item }) => {
    var source = typeof item === 'object' ? item.path : item;
    console.log("source", source)
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: source }} />
        <Icon
          name="close-circle-sharp"
          onPress={() => {
            var newPhotos = photos.filter((photo) => {
              return photo !== item;
            });
            setPhoto(newPhotos);
            if (validURL(item)) {
              setDeletedPhotos((arr) => [...arr, item]);
            }
          }}
          style={styles.cancelIcon}
        />
      </View>
    );
  };
  let numOfLinesCompany = 0;

  return (
    <View style={styles.container}>
      <View style={styles.orangeView}>
        <View style={styles.textInputContainer}>
          <View style={styles.leftView}>
            <View style={styles.iconContainer}>
              {props.currentUser && props.currentUser.image ? (
                <Image
                  style={styles.iconContainer}
                  source={{ uri: props.currentUser.image }}
                />
              ) : (
                <Icon name="person" style={styles.iconSize} />
              )}
            </View>
          </View>
          <TextInput
            multiline={true}
            placeholder="Post a message"
            style={[styles.textInput, { height: Math.max(40, height) }]}
            paddingLeft={12}
            paddingRight={12}
            value={title}
            // numberOfLines={numOfLinesCompany}
            onContentSizeChange={(event) => {
              // numOfLinesCompany = event.nativeEvent.contentSize.height / 18;

              setHeight(event.nativeEvent.contentSize.height);
            }}
            onChangeText={(text) => {
              setTitle(text);
              setShowSubmit(text.length > 0 || photos.length > 0);
            }}
          />
          {showSubmit && (
            <Icon
              name="send"
              style={styles.sendIcon}
              onPress={() => {
                var data = {
                  description: title,
                  user_feed_image: photos,
                  deleted_images: deletedPhotos,
                }

                console.log("setShowSubmit", data)

                props.onSubmit(data);
                setTitle('');
                setShowSubmit(false);
                setPhoto([]);
                setDeletedPhotos([]);
              }}
            />
          )}
        </View>

        <View style={styles.sendContainer}>
          <FlatList
            data={photos}
            horizontal
            renderItem={renderPhoto}
            keyExtractor={(item, index) => `${index}`}
          />
          <Icon
            name="camera"
            style={styles.sendIcon}
            onPress={handleChoosePhoto}
          />
          <Icon
            name="images"
            style={styles.sendIcon}
            onPress={handleChooseGallery}
          />
          {showSubmit && (
            <Icon name="reload" style={styles.sendIcon} onPress={reload} />
          )}
        </View>
      </View>
    </View>
  );
};

export default AddFeed;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  leftView: {},
  imageContainer: {
    width: 60,
    height: 60,
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 10,
    borderRadius: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSize: {
    fontSize: 20,
    color: '#999',
  },
  orangeView: {
    backgroundColor: '#EDB43C',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 40,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  sendIcon: {
    fontSize: 25,
    color: '#FFF',
    marginHorizontal: 10,
  },
  textInput: {
    fontSize: 18,
    backgroundColor: '#FFF',
    flex: 1,
    overflow: 'hidden',
    marginHorizontal: 8,
    borderRadius: 30,
  },
  cancelIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 25,
    color: 'white',
  },
});
