import React from 'react';
import { LockKeyhole, Database, Users, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <LockKeyhole size={24} />,
        title: 'End-to-End Encryption',
        description: 'Your messages are encrypted before they\'re stored on the blockchain, ensuring only you and your recipients can read them.'
    },
    {
        icon: <Database size={24} />,
        title: 'Decentralized Storage',
        description: 'All messages are stored on the Ramestta blockchain, making them immutable and free from censorship.'
    },
    {
        icon: <Users size={24} />,
        title: 'Community Owned',
        description: 'No central authority controls your data. Connect your wallet and own your conversations.'
    },
    {
        icon: <Shield size={24} />,
        title: 'Privacy First',
        description: 'Your identity is secured by your wallet. No phone numbers or emails required to start chatting.'
    },
    {
        icon: <Zap size={24} />,
        title: 'Lightning Fast',
        description: 'Experience near-instant messaging with optimized blockchain transactions and local caching.'
    },
    {
        icon: <Globe size={24} />,
        title: 'Global Access',
        description: 'Access your conversations from anywhere in the world. All you need is your wallet.'
    }
];

const Features: React.FC = () => {
    return (
        <section className="py-24 px-6 relative z-10" id="features">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why choose <span className="text-[#0AFFF1]">MumbleChat</span>?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Built for privacy, security, and true ownership of your communication
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="card p-6 hover:translate-y-[-4px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#0AFFF1]/10 flex items-center justify-center text-[#0AFFF1] mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;