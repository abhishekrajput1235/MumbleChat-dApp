import React from 'react';
import { motion } from 'framer-motion';
import DeviceMockup from './DeviceMockup';

const MockupDisplay: React.FC = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A10] via-transparent to-[#0A0A10] z-10 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto px-6 flex justify-center"
            >
                <DeviceMockup />
            </motion.div>
        </section>
    );
};

export default MockupDisplay;