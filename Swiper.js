import React from 'react';
import { Image, ScrollView, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function Swiper(props) {

    const { images } = props

    return (
        <ScrollView
            horizontal={true}
            pagingEnabled={true}
            alwaysBounceHorizontal={true}
        >
            {images &&
                images.map((item, index) => {
                    return (
                        <Image
                            style={{ height: screenHeight, width: screenWidth }}
                            source={item.url}
                            key={index}
                        />
                    )
                })
            }
        </ScrollView>
    );
}

export default Swiper;

