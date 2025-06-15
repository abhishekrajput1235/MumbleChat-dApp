import React from 'react';
import { motion } from 'framer-motion';

const DeviceMockup: React.FC = () => {
    return (
        <motion.div
            className="w-full max-w-4xl relative"
            initial={{ y: 80 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
            <div className="relative mx-auto w-full p-4 bg-[#16161E] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-[#2D2D3A]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0AFFF1] to-[#9772FB] rounded-t-2xl"></div>

                {/* Browser mockup header */}
                <div className="flex items-center p-2 border-b border-[#2D2D3A] mb-2">
                    <div className="flex space-x-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-[#0F0F17] rounded-md py-1 px-3 text-xs text-gray-400 flex items-center justify-center">
                        mumblechat.com
                    </div>
                </div>

                {/* Chat interface mockup */}
                <div className="flex h-[500px]">
                    {/* Left sidebar */}
                    <div className="w-1/4 border-r border-[#2D2D3A] p-2 flex flex-col">
                        <div className="flex items-center justify-between mb-4 p-2">
                            <h3 className="font-semibold text-[#0AFFF1]">Chats</h3>
                            <div className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#2D2D3A] cursor-pointer">
                                <span className="font-bold text-sm text-gray-400">⋮</span>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-[#0F0F17] text-gray-300 rounded-md py-2 pl-8 pr-3 text-sm placeholder-gray-500"
                                readOnly
                            />
                            <div className="absolute left-2 top-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>

                        {/* Contact list */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {['0xe9..2d9', 'jsreigns.rama', '0x35..1c028', 'findus.rama', '0x45..db6b', '0xe74b..3d440'].map((contact, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-2 rounded-lg mb-1 ${index === 0 ? 'bg-[#0AFFF1]/10' : 'hover:bg-[#2D2D3A]/50'} cursor-pointer`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium mr-3">
                                        {contact.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm ${index === 0 ? 'text-[#0AFFF1]' : 'text-gray-300'}`}>{contact}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main chat area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#2D2D3A]">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium mr-3">
                                    0
                                </div>
                                <div>
                                    <h3 className="font-semibold">0xe9..2d9</h3>
                                    <p className="text-xs text-[#0AFFF1]">Online</p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2D2D3A] cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="5" r="1"></circle>
                                        <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                </div>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2D2D3A] cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Chat messages */}
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-center mb-6">
                                <span className="text-xs bg-[#2D2D3A] text-gray-400 rounded-full px-3 py-1">Today</span>
                            </div>

                            {/* Outgoing message */}
                            <div className="mb-4 flex flex-col items-end">
                                <div className="max-w-[80%] bg-[#0AFFF1] text-black rounded-tl-lg rounded-tr-lg rounded-bl-lg p-3 mb-1">
                                    <p className="text-sm">How about we get together for Reigns this weekend!</p>
                                </div>
                                <div className="flex items-center text-xs text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#0AFFF1]">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    3:33pm
                                </div>
                            </div>

                            {/* Incoming message */}
                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium mr-2">
                                        0
                                    </div>
                                    <span className="text-sm font-medium">0xe9..2d9</span>
                                    <span className="text-xs text-gray-400 ml-2">3:34pm</span>
                                </div>
                                <div className="max-w-[80%] bg-[#2D2D3A] rounded-tl-lg rounded-tr-lg rounded-br-lg p-3">
                                    <p className="text-sm">That sounds like an awesome plan to me! 👍</p>
                                </div>
                            </div>
                        </div>

                        {/* Message input */}
                        <div className="p-4 border-t border-[#2D2D3A]">
                            <div className="flex items-center bg-[#0F0F17] rounded-lg p-2">
                                <input
                                    type="text"
                                    placeholder="Write a reply"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500"
                                    readOnly
                                />
                                <button className="ml-2 w-10 h-10 rounded-md bg-[#0AFFF1] flex items-center justify-center text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1/4 h-[1px] bg-[#2D2D3A]"></div>
        </motion.div>
    );
};

export default DeviceMockup;