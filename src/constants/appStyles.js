import {Dimensions, Platform, StatusBar, PixelRatio} from 'react-native';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const colors = {
  tint: '#316BF4',
  primary: '#43E0A9',
  danger: '#FF0000',
  success: '#3BB54A',
  secondary: '#fff',
  darkGrey: '#646870',
  grey: '#8D8D8D',
  lightGrey: '#C4C3C3',
  lightGrey2: '#F5F5F5',
  yellowGrey: '#9D9D9C',
  lightGrayishRed: '#faf7f7',
  gold: '#FDD37A',
  white: '#fff',
  black: '#000',
  red: '#FA393E',

  lightGrey3: '#a3a3a3',
  veryDarkGrey: '#3b3b3b',
  borderGrey: '#E3E2E2',
  borderDarkGrey: '#7E8989',
  error: 'red',
  carrotOrange: '#F39422',
  darkGreen: '#006021',

  grayishBlue: '#646870',
  grayishRed: '#c4c3c3',
  darkGrayishRed: '#b0afaf',
  brightBlue: '#3A61EC',
  blue: '#5080F4',
  paleBlue: '#316BF4',
  darkBlue: '#2858ac',
  turquoise: '#43E0A9',
  silver: '#A19F9F',
  lightBlue: '#009DDC',
  darkBlue2: '#2B488D',
  yellow: '#F7F739',
  yellowDark: '#F4B92F',
  red2: '#F4562F',

  lightOrange: '#FAF7F7',
  lightBlack: '#1D1A1A',

  orange2: '#FBFBFB',
};

export const rgbaColor = {
  borderDarkGrey: '126, 137, 137',
  white: '255, 255, 255',
  darkBlue2: '43, 72, 141',
  primary: '67, 224, 169',
  lightGrey: '196, 195, 195',
  tint: '49, 107, 244',
  turquoise: '67, 224, 169',
  yellowDark: '244, 185, 47',
};

export const getRgbaColor = (color, opacity) => {
  return `rgba(${rgbaColor[color]}, ${opacity})`;
};


export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return isIos
    ? dimen.height === 812 ||
        dimen.width === 812 ||
        dimen.height === 896 ||
        dimen.width === 896
    : dimen.height > 736;
};

export const isIphone6 = () => {
  const dimen = Dimensions.get('window');
  return dimen.height > 600 && dimen.height < 750;
};

const widthPercentageToDP = (
  iphoneWidthPercent,
  androidWidthPercent = iphoneWidthPercent,
) => {
  const elemWidth =
    typeof iphoneWidthPercent === 'number'
      ? isIos
        ? iphoneWidthPercent
        : androidWidthPercent
      : parseFloat(isIos ? iphoneWidthPercent : androidWidthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

export const HeightPercentageToDP = (
  iphoneHeightPercent,
  androidHeightPercent = iphoneHeightPercent,
) => {
  const elemHeight =
    typeof iphoneHeightPercent === 'number'
      ? isIos
        ? iphoneHeightPercent
        : androidHeightPercent
      : parseFloat(isIos ? iphoneHeightPercent : androidHeightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

export const deviceDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  WPTDP: widthPercentageToDP,
  HPTDP: HeightPercentageToDP,
  WHRatio: SCREEN_WIDTH / SCREEN_HEIGHT,
};

export const heiWidScale = 0.125;

export const scales = (size, type = 'height') => {
  if (type == 'height') {
    return deviceDimensions.HPTDP(heiWidScale * size);
  }
  return deviceDimensions.WPTDP(heiWidScale * size);
};

const iphoneXBottomSpace = scales(35);

export const dimensions = {
  statusBar: getStatusBar(true),
  topExtraSpace: 6,
  topSpace: getStatusBar(true) + 6,
  roundBtnHeight:
    Math.min(deviceDimensions.height, deviceDimensions.width) * 0.2,
  bottomButtonHeight: 60,
  numKeyboardHeight: deviceDimensions.height * 0.67,
  iphoneXBottomSpace,
  tabBarHeight: deviceDimensions.HPTDP(isIphoneX() ? '7.5%' : '10%', '10%'),
  safeHeight:
    deviceDimensions.height -
    getStatusBar(true) -
    (isIphoneX() ? iphoneXBottomSpace : 0),
};

function getStatusBar() {
  return StatusBar.currentHeight;
}

export const fontScale = 0.123;

//New Font Size Measure
export const fontSize = (size) => {
  const fontScale2 = deviceDimensions.WHRatio < 0.5 ? 0.123 : 0.18;
  return deviceDimensions.HPTDP(fontScale2 * size);
};

export const fontSizes = {
  extraLarge: fontSize(72), // 72
  large: fontSize(58), // 58
  heading: fontSize(33),
  title: fontSize(28),
  h1: fontSize(25),
  h2: fontSize(24),
  h3: fontSize(22),
  h4: fontSize(21),
  h5: fontSize(20),
  h6: fontSize(19),
  h7: fontSize(17),
  body1: fontSize(18), // 18
  body2: fontSize(16),
  body3: fontSize(15),
  subtitle1: fontSize(14),
  subtitle2: fontSize(13),
  caption: fontSize(12),
};

export const marginPaddingScale = 0.125;
export const svgWidthScale = 0.122;
export const svgHeightScale = 0.126;

export const spacing = (size) => {
  return deviceDimensions.HPTDP(marginPaddingScale * size);
};

export const svgWidth = (size) => {
  return deviceDimensions.HPTDP(svgWidthScale * size);
};

export const svgHeight = (size) => {
  return deviceDimensions.HPTDP(svgHeightScale * size);
};

export const stringToHslColor = (str = 'Cash', s = 30, l = 60) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var h = hash % 360;
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};
