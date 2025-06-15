import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
    navigate: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigate }) => {
    return (
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="w-24 h-24 rounded-full bg-[#0AFFF1]/10 flex items-center justify-center text-[#0AFFF1] mb-8 relative"
                    >
                        <MessageCircle size={48} />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-[#0AFFF1]/30"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.2, opacity: [1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-[#0AFFF1]/20"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.4, opacity: [1, 0] }}
                            transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0AFFF1] to-[#9772FB] tracking-tight"
                    >
                        MumbleChat
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
                    >
                        Secure, decentralized messaging powered by the
                        <span className="text-[#0AFFF1] font-medium"> Ramestta </span>
                        blockchain
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <motion.button
                            onClick={() => navigate('/connect')}
                            className="btn btn-primary group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Connect Wallet
                            <motion.div
                                initial={{ x: 0 }}
                                animate={{ x: 5 }}
                                transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.6 }}
                            >
                                <ArrowRight size={18} className="ml-2" />
                            </motion.div>
                        </motion.button>

                        <motion.a
                            href="https://ramestta.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn about Ramestta
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;