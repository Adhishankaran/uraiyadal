import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import Peer from 'peerjs';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const socket = useSocket();
    const { user } = useAuth();
    
    const [call, setCall] = useState({ isReceivingCall: false, from: "", name: "", signal: null });
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [remoteStream, setRemoteStream] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        if (!socket) return;

        socket.on("call user", ({ from, name, signal }) => {
            setCall({ isReceivingCall: true, from, name, signal });
        });
        
        socket.on("call accepted", (signal) => {
            setCallAccepted(true);
            connectionRef.current.signal(signal);
        });

        socket.on("call ended", () => {
            setCallEnded(true);
            connectionRef.current?.destroy();
            window.location.reload();
        });

        return () => {
            socket.off("call user");
            socket.off("call accepted");
            socket.off("call ended");
        };
    }, [socket]);

    const callUser = (id) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: currentStream,
            });

            peer.on("signal", (data) => {
                socket.emit("call user", {
                    userToCall: id,
                    signalData: data,
                    from: user._id,
                    name: user.name,
                });
            });

            peer.on("stream", (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            connectionRef.current = peer;
        });
    };

    const answerCall = () => {
        setCallAccepted(true);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: currentStream,
            });

            peer.on("signal", (data) => {
                socket.emit("answer call", { signal: data, to: call.from });
            });

            peer.on("stream", (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            peer.signal(call.signal);
            connectionRef.current = peer;
        });
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current?.destroy();
        socket.emit("end call", { to: call.from || selectedChat?.users.find(u => u._id !== user._id)._id });
        window.location.reload();
    };

    return (
        <CallContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            callEnded,
            callUser,
            answerCall,
            leaveCall
        }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
