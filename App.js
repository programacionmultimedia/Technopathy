import React, { useState , useEffect, useRef} from 'react';
import { View, Animated} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Swiper from './components/Swiper';
import { initialImages, blanco } from './img';
import styles from './css/general.js';
import { fadeOut, startTransition } from './lib/animation.js';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const REFRESH = 150;
  const [{ estado }, setEstado] = useState({ estado: 'pre'});
  const [{ posibleEstrella }, setPosibleEstrella] = useState({ posibleEstrella: false});
  const [{images} , setImages] =  useState(initialImages);
  const [subscription, setSubscription] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { _start(); return () => null; } , []);

  const inicia_efecto = ()  => {

    // pre **************
    if ( (estado === 'pre')
          && (x < 0.16 && x > -0.16)
          && (y < 0.16 && y > -0.16)
          && (z < 1.16 && z > 0.8)) {

            _unsubscribe();

            if (typeof timer === "undefined" && images[0].name !== 'blanco') {

              const timer = () => {
                  setTimeout( () => {
                    if ( (images[0].name !== 'blanco')
                      && (estado !== 'inicio') ) {
                        setImages(blanco);
                        setEstado({ estado: 'inicio'});
                        _subscribe();
                    }
                    clearTimeout(timer);
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
            if (  posibleEstrella && (y > 0.39)) {
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

  // ********************************************************************************

  const changeImage = (imageName) =>{
    initialImages.images.map((item, index) => {

      if (item.name === imageName){
        setPosibleEstrella({ posibleEstrella: false});
        setImages( {images:[item]});
        setEstado({ estado: 'final'});
       _unsubscribe();
      }
    });
  };

  // COMIENZO Y REINICIO JUEGO ***********
  const _start = () => {
    startTransition(fadeAnim);
    setImages(initialImages);
    setEstado({ estado: 'pre'});
    setPosibleEstrella({ posibleEstrella: false});
    setData({ x: 0, y: 0, z: 0, });
    _unsubscribe();
    _subscribe();
  };
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

  // DETECTANDO TRIPLE TAP *****************
  const onStartShouldSetResponder = (evt) => {
    if (evt.nativeEvent.touches.length === 3) {
      fadeOut(fadeAnim);
      return true;
    }
    return false;
  };

  const onResponderRelease = () => {
    _start();
  };

  // *************************************************

  if (subscription){
    Accelerometer.setUpdateInterval(REFRESH);
    inicia_efecto();
  }

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
      </Animated.View>
    </View>
  );
}
