import { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const useCall = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerName, setCallerName] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        if (!socket) return;

        socket.on("call user", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerName(data.name);
            setCallerSignal(data.signal);
        });
    }, [socket]);

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream,
        });

        peer.on("signal", (data) => {
            socket.emit("call user", {
                userToCall: id,
                signalData: data,
                from: user._id,
                name: user.name,
            });
        });

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        socket.on("call accepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStream,
        });

        peer.on("signal", (data) => {
            socket.emit("answer call", { signal: data, to: caller });
        });

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    };

    return {
        callAccepted,
        myVideo,
        userVideo,
        receivingCall,
        caller,
        callerName,
        answerCall,
        callUser,
        leaveCall,
        setMyStream,
        callEnded
    };
};
