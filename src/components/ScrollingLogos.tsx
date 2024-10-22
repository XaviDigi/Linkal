import React from 'react';

const logos = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
    '/images/10.png',
    '/images/11.png',
    '/images/12.png',
    '/images/13.png',
    '/images/14.png',
    '/images/15.png',
    '/images/16.png',
    '/images/17.png',
    '/images/18.png',
    '/images/19.png',
    '/images/20.png',
    '/images/21.png',
    '/images/22.png',
    '/images/23.png',
    '/images/24.png',
    '/images/25.png',
    '/images/26.png',
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
