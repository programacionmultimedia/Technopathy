import { Animated} from 'react-native';

export const startTransition = (fadeAnim) => {
    // console.log('\x1B[35m ************ fadeAnim]', fadeAnim);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  export const fadeOut = (fadeAnim) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };
