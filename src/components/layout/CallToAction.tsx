import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallToActionProps {
    navigate: (path: string) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ navigate }) => {
    return (
        <section className="py-24 px-6">
            <motion.div
                className="max-w-4xl mx-auto bg-gradient-to-r from-[#16161E] to-[#1A1A24] rounded-2xl p-12 border border-[#2D2D3A] relative overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* Background glow effect */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0AFFF1]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#9772FB]/10 rounded-full blur-3xl"></div>

                <div className="text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to take control of your conversations?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Join thousands of users who've already made the switch to truly private,
                        decentralized messaging on the Ramestta blockchain.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            onClick={() => navigate('/connect')}
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Connect Wallet
                            <ArrowRight size={18} className="ml-2" />
                        </motion.button>

                        <motion.a
                            href="#"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Roadmap
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CallToAction;