import React, { useState, useEffect } from 'react';

const ImageSlider = ({ images, interval = 3000, heroContent }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);
        return () => clearInterval(timer);
    }, [images.length, interval]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!images || images.length === 0) {
        return <div className="text-center dark:text-gray-400 p-4">No images.</div>;
    }

    return (
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ height: '400px', background: '#eee' }}>

            {/* Overlay - agar wapis heroContent use karna hai toh isko z-20 dena padega */}
            {/* Abhi ke liye yeh code Commented rehne dete hain jaisa simplified version mein tha */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-20 z-20"></div> */} 

            {/* Slider Images */}
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                />
            ))}

            {/* Hero Content (Text) - agar wapis use karna hai toh isko z-30 dena padega */}
            {/* Abhi ke liye yeh code Commented rehne dete hain jaisa simplified version mein tha */}
            {/* {heroContent && currentIndex === 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-4 z-30">
                    {heroContent}
                </div>
            )} */}

            {/* --- NAVIGATION BUTTONS UPDATE --- */}
            <button
                onClick={goToPrevious}
                // bg-transparent: background transparent kar diya
                // text-gray-300: arrow ka color grayish white kar diya
                // hover:text-white: hover karne par white ho jaayega
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent text-gray-300 text-3xl p-2 rounded-full hover:text-white focus:outline-none z-30"
            >
                &lt;
            </button>
            <button
                onClick={goToNext}
                // bg-transparent: background transparent kar diya
                // text-gray-300: arrow ka color grayish white kar diya
                // hover:text-white: hover karne par white ho jaayega
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent text-gray-300 text-3xl p-2 rounded-full hover:text-white focus:outline-none z-30"
            >
                &gt;
            </button>
            {/* --------------------------------- */}

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
                        } focus:outline-none`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;