import React from 'react';
import {View, StyleSheet} from 'react-native';
import MenuItem from './MenuItem';
import {colors, deviceDimensions, fontSize, spacing} from '../../constants/appStyles';

const submenuStyles = {
  2: {
    hPadding: -250,
    fontSize: fontSize(9),
    0: {style: {marginRight: spacing(10)}},
    1: {style: {marginLeft: spacing(10)}},
  },
  3: {
    hPadding: -150,
    fontSize: fontSize(9),
    0: {style: {marginBottom: '50%'}},
    1: {style: {position: 'absolute', right: '66%', top: '45%'}},
    2: {style: {position: 'absolute', left: '66%', top: '45%'}},
  },
  4: {
    hPadding: 35,
    fontSize: fontSize(9),
    0: {isCenter: true, style: {}},
    1: {style: {position: 'absolute', left: '10.5%', top: '35%'}},
    2: {style: {position: 'absolute', left: '70%', top: '13.5%'}},
    3: {style: {position: 'absolute', left: '62%', top: '65.7%'}},
  },
  5: {
    hPadding: 30,
    fontSize: fontSize(8),
    0: {isCenter: true, style: {}},
    1: {style: {position: 'absolute', left: '20%', top: '60%'}},
    2: {style: {position: 'absolute', left: '20%', top: '15%'}},
    3: {style: {position: 'absolute', left: '75%', top: '15%'}},
    4: {style: {position: 'absolute', left: '75%', top: '60%'}},
  },
  7: {
    hPadding: 30,
    fontSize: fontSize(8),
    0: {isCenter: true, style: {}},
    1: {style: {position: 'absolute', left: '10%', top: '38%'}},
    2: {style: {position: 'absolute', left: '28%', top: '11%'}},
    3: {style: {position: 'absolute', left: '70%', top: '11%'}},
    4: {style: {position: 'absolute', left: '92%', top: '38%'}},
    5: {style: {position: 'absolute', left: '70%', top: '65%'}},
    6: {style: {position: 'absolute', left: '28%', top: '64%'}},
  },
};

const hPadding = 35;

const SubMenu = (props) => {
  const {data = {}} = props;
  const {sub_menus = []} = data;

  const defaultStyle = submenuStyles[sub_menus.length];
  const circleWidth = deviceDimensions.width - 2 * hPadding;
  const width = circleWidth - defaultStyle.hPadding / 2; // inner padding

  const labelStyle = {
    fontSize: defaultStyle.fontSize,
  };

  return (
    <View style={styles.submenu(circleWidth)}>
      {sub_menus.map((menu, index) => {
        const sStyle = defaultStyle[index] || {};
        console.log('Submenus', {menu, sStyle, defaultStyle});
        return (
          <MenuItem
            key={index}
            icon={menu.icon}
            label={menu.name}
            isCenter={sStyle.isCenter}
            labelStyle={labelStyle}
            style={sStyle.style}
            width={width}
            onPress={() => {
              if(menu.redirectTo){
                props.redirect(menu.redirectTo, menu.params || {});
              } else {
                props.resetSubmenu();
              }
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  submenu: (circleWidth) => {
    return {
      flexDirection: 'row',
      paddingHorizontal: hPadding,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gold,
      marginHorizontal: hPadding,
      height: circleWidth,
      position: 'absolute',
      width: circleWidth,
      borderRadius: circleWidth / 2,
      top: -circleWidth / 3,
      right: 5,
    };
  },
});

export default SubMenu;
