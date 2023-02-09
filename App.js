import React, { useState , useEffect, useRef} from 'react';
import { Text, TouchableOpacity, View, Animated} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Swiper from './components/Swiper';
import { initialImages, blanco } from './img';
import styles from './css/general.js';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const REFRESH = 150;
  //const REFRESH = 1000;

  const [{ estado }, setEstado] = useState({ estado: 'pre'});
  const [{ posibleEstrella }, setPosibleEstrella] = useState({ posibleEstrella: false});
  const [{images} , setImages] =  useState(initialImages);
  const [subscription, setSubscription] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { _start(); return () => null; } , []);

  const inicia_efecto = ()  => {

      // console.log('X: ',x.toFixed(2));
      // console.log('Y: ',y.toFixed(2));
      // console.log('Z: ',z.toFixed(2));

    // pre **************
    if ( (estado === 'pre')
          && (x < 0.16 && x > -0.16)
          && (y < 0.16 && y > -0.16)
          && (z < 1.16 && z > 0.8)) {

            // console.log('\x1B[34mTIMER----**************',typeof timer);
            // console.log('images ----**************', images[0].name);
            _unsubscribe();

            if (typeof timer === "undefined" && images[0].name !== 'blanco') {

              const timer = () => {
                  setTimeout( () => {
                    // console.log('\x1B[34m888888888 Initial timeout! 888888888888');
                    if ( (images[0].name !== 'blanco')
                      && (estado !== 'inicio') ) {
                        setImages(blanco);
                        setEstado({ estado: 'inicio'});
                        _subscribe();
                    }
                    clearTimeout(timer);
                    // console.log('\x1B[34mTIMER----**************',timer);
                  }
                  , 2000);
              };
              timer();
            }
    }
    // estrella *******************
    if ( (estado === 'inicio')
          && posibleEstrella
          && (x < 0.16 && x > -0.16)
          && (y < 0.16 && y > -0.16)
          && (z < 1.16 && z > 0.8)) {

            changeImage('estrella');
}
    // ondas
    if ( (estado === 'inicio')
          && (x < 0.16 && x > -0.16)
          && (y > 0.16 && y < 0.9)
          && (z < 1.16 && z > 0.8)) {

            !posibleEstrella ? setPosibleEstrella({ posibleEstrella: true}) : '' ;
            // console.log('\x1b[33m**** posibleEstrella *************', posibleEstrella);
            if (  posibleEstrella && (y > 0.39)) {

            // console.log('\x1b[32m ----> posibleEstrella => cambio a ondas  <----');
            changeImage('ondas');

            }
    }
    // circulo *************
    if ( (estado === 'inicio')
          && (x < 0.16 && x > -0.16)
          && (y < -0.16 && y > -0.9)
          && (z < 1.16 && z > 0.8)) {

            changeImage('circulo');

    }
    // más *****************
    if ( (estado === 'inicio')
          && (x > 0.16 && x < 0.9)
          && (y < 0.16 && y > -0.16)
          && (z < 1.16 && z > 0.8)) {

            changeImage('mas');
    }
     // cuadrado ************
    if ( (estado === 'inicio')
        && (x < -0.16 && x > -0.9)
        && (y < 0.16 && y > -0.16)
        && (z < 1.16 && z > 0.8)) {

          changeImage('cuadrado');
    }
  };

  const changeImage = (imageName) =>{
    initialImages.images.map((item, index) => {

      if (item.name === imageName){
        // console.log('\x1B[34mSELECCIONADO --->>>>>>>',item.name);
        setPosibleEstrella({ posibleEstrella: false});
        setImages( {images:[item]});
        setEstado({ estado: 'final'});
       _unsubscribe();
      }
    });

  };

  // COMIENZO Y REINICIO JUEGO ***********
  const _start = () => {
    startTransition();
    setImages(initialImages);
    setEstado({ estado: 'pre'});
    setPosibleEstrella({ posibleEstrella: false});
    setData({ x: 0, y: 0, z: 0, });
    _unsubscribe();
    _subscribe();
    // console.log('\x1B[35m ************ REINICIANDO');

  }

  // ACELEROMETRO **************

  const _subscribe = () => {
    setSubscription(
    Accelerometer.addListener(setData)
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };
  // *******************************

  // DETECTANDO TRIPLE TAP *****************
  const onStartShouldSetResponder = (evt) => {
    if (evt.nativeEvent.touches.length === 3) {
      // console.log('\x1B[35m ************ TRIPLE TAP DETECTADO === 3');
      fadeOut();
      return true;
    }
    return false;
  };

  const onResponderRelease = () => {
    _start();
  };

  // ***********************************

  // TRANSICIONES *********************

  const startTransition = () => {
    // console.log('\x1B[35m ************ fadeAnim]', fadeAnim);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  //*****************************************
  //*****************************************

  // console.log('images', images);
  // console.log('\x1b[33m----**** var estado: ',estado);

  if (subscription){
    Accelerometer.setUpdateInterval(REFRESH);
    // console.log('\x1B[31m ************ Subscription');
    inicia_efecto();
  }
  // else {
  //   console.log('\x1B[31m ************ No Subscription');
  // }

  return (

    <View
      style={styles.container}
      onStartShouldSetResponder = { (e) => onStartShouldSetResponder(e)}
      onResponderRelease ={onResponderRelease }
    >
      <Animated.View
      style={[
        styles.fadingContainer,
        {
          opacity: fadeAnim,
        },
      ]}>
         <Swiper
          images={images}
        />
        {/* <View style={styles.buttonContainer} >
          <Text style={styles.text}>x: {x.toFixed(2)}</Text>
          <Text style={styles.text}>y: {y.toFixed(2)}</Text>
          <Text style={styles.text}>z: {z.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
              <Text>{subscription ? 'parar suscribpción' : 'subscribir'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_start} style={styles.button}>
            <Text>Empezar</Text>
          </TouchableOpacity>
        </View> */}
      </Animated.View>
    </View>
  );
}
