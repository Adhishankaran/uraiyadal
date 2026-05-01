import React from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoCall = ({ stream, remoteStream, answerCall, leaveCall, receivingCall, callerName, callAccepted }) => {
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            >
                <div className="relative w-full max-w-4xl aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                    {/* Remote Video (Main) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {remoteStream ? (
                             <video playsInline ref={remoteStream} autoPlay className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-white flex flex-col items-center gap-4">
                                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                                    {callerName?.[0]}
                                </div>
                                <p className="text-xl font-medium">{receivingCall && !callAccepted ? `Incoming call from ${callerName}...` : 'Connecting...'}</p>
                            </div>
                        )}
                    </div>

                    {/* Local Video (PIP) */}
                    <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl z-10">
                         <video playsInline muted ref={stream} autoPlay className="w-full h-full object-cover" />
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <button className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                            <Mic />
                        </button>
                        <button className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                            <Video />
                        </button>
                        
                        {receivingCall && !callAccepted ? (
                            <button onClick={answerCall} className="p-4 bg-green-500 hover:bg-green-600 rounded-full text-white transition-all animate-pulse">
                                <Phone />
                            </button>
                        ) : null}

                        <button onClick={leaveCall} className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all">
                            <PhoneOff />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VideoCall;
