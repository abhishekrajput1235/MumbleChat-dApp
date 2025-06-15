import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="wave-container">
                <motion.div
                    className="wave"
                    style={{
                        top: '50%',
                        left: '30%',
                        transform: 'translate(-50%, -50%) rotate(0deg)'
                    }}
                    animate={{
                        transform: ['translate(-50%, -50%) rotate(0deg)', 'translate(-50%, -50%) rotate(360deg)']
                    }}
                    transition={{
                        duration: 25,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
            </div>
            <div className="wave-container">
                <motion.div
                    className="wave"
                    style={{
                        top: '70%',
                        left: '70%',
                        transform: 'translate(-50%, -50%) rotate(0deg)'
                    }}
                    animate={{
                        transform: ['translate(-50%, -50%) rotate(0deg)', 'translate(-50%, -50%) rotate(-360deg)']
                    }}
                    transition={{
                        duration: 35,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0A0A10] opacity-90"></div>
        </div>
    );
};

export default WaveBackground;