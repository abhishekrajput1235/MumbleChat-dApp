import React from 'react';
import { MessageCircle, Twitter, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-6 border-t border-[#2D2D3A]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#0AFFF1]/10 flex items-center justify-center text-[#0AFFF1] mr-3">
                                <MessageCircle size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-wide">MumbleChat</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Secure, decentralized messaging powered by the Ramestta blockchain.
                            Take control of your conversations.
                        </p>
                        <div className="flex space-x-4">
                            {[Twitter, Github, Linkedin].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-[#16161E] flex items-center justify-center text-gray-400 hover:text-[#0AFFF1] hover:bg-[#0AFFF1]/10 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Product</h3>
                        <ul className="space-y-3">
                            {['Features', 'Security', 'Roadmap', 'Tokenomics'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-[#0AFFF1] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Resources</h3>
                        <ul className="space-y-3">
                            {['Documentation', 'FAQs', 'Community', 'Support'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-[#0AFFF1] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-[#2D2D3A] flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} MumbleChat. Built on Ramestta.
                    </p>
                    <div className="flex space-x-6">
                        {['Terms', 'Privacy', 'Cookies'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-gray-500 hover:text-[#0AFFF1] transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;