import React from 'react';

const logos = [
    '/src/images/1.png',
    '/src/images/2.png',
    '/src/images/3.png',
    '/src/images/4.png',
    '/src/images/5.png',
    '/src/images/6.png',
    '/src/images/7.png',
    '/src/images/8.png',
    '/src/images/9.png',
    '/src/images/10.png',
    '/src/images/11.png',
    '/src/images/12.png',
    '/src/images/13.png',
    '/src/images/14.png',
    '/src/images/15.png',
    '/src/images/16.png',
    '/src/images/17.png',
    '/src/images/18.png',
    '/src/images/19.png',
    '/src/images/20.png',
    '/src/images/21.png',
    '/src/images/22.png',
    '/src/images/23.png',
    '/src/images/24.png',
    '/src/images/25.png',
    '/src/images/26.png',
];

const ScrollingLogos: React.FC = () => {
    return (
        <div className="scrolling-container overflow-hidden whitespace-nowrap">
            <div className="logo-wrapper flex animate-scroll">
                {[...logos, ...logos].map((logo, index) => (
                    <img
                        key={index}
                        src={logo}
                        alt={`Logo ${index + 1}`}
                        className="logo h-24 mx-4 transition-transform duration-300 hover:scale-110"
                    />
                ))}
            </div>
        </div>
    );
};

export default ScrollingLogos;
