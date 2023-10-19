import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const FeedCard = props => {
  const renderPhoto = ({index, item}) => {
    return index !== 0 ? (
      <Image style={styles.image} source={{uri: item}} />
    ) : null;
  };
  const {
    owner,
    createDate,
    description,
    images,
    likesCount,
    commentsCount,
    onDelete,
    isCurrentUser,
    onEdit,
    onLike,
    onPressComment,
    selected,
    userimage,
    liked,
  } = props;
  return (
    <View style={styles.item}>
      <View style={styles.leftView}>
      {userimage ? (
                <Image
                  style={styles.iconContainer}
                  source={{uri: userimage}}
                />
              ) : (
                <Icon name="person" style={styles.iconSize} />
              )}
      </View>
      <View style={styles.rightView}>
        <View style={styles.editOptions}>
          <View style={styles.nameWrap}>
            <Text style={styles.name}>{owner}</Text>
            <Text>{Moment(createDate, 'YYYY.MM.DD HH:II').fromNow()}</Text>
          </View>
          <View style={styles.iconsWrap}>
            {!props.hideEditOptions && isCurrentUser && (
             <View style={styles.editBtn}>
                <Icon
                  name="md-pencil"
                  style={[styles.iconSize, styles.padding]}
                  onPress={onEdit}
                />
                <Icon
                  name="trash"
                  style={[styles.iconSize, styles.padding]}
                  onPress={onDelete}
                />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
        {images && images.length > 0 && (
          <>
            <Image source={{uri: images[0]}} style={styles.descriptionImage} />
            <FlatList
              data={images}
              horizontal
              renderItem={renderPhoto}
              keyExtractor={(item, index) => `${index}`}
            />
          </>
        )}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
            <Icon name="heart" style={[styles.hearticonSize, {color: liked ? 'red': "#999"} ]} />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onPressComment}>
            <Icon name="chatbubble" style={styles.iconSize} />
            <Text style={styles.actionText}>{commentsCount} comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingLeft: 15,
    paddingVertical: 15,
  },
  leftView: {
    width: '10%',
  },
  rightView: {
    width: '90%',
    paddingLeft: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2CBB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#999',
  },
  image: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 5,
  },
  hearticonSize: {
    fontSize: 22,
    color: '#999',
  },
  iconSize: {
    fontSize: 20,
    color: '#999',
  },
  actionBtn: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
  },
  padding: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  description: {
    fontWeight: '200',
  },
  editOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameWrap: {
    flex: 1,
  },
  iconsWrap: {
    width: 90,
  },
  editBtn: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  description: {
    marginVertical: 20,
    fontWeight: '200',
  },
  descriptionImage: {
    height: 200,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
});
