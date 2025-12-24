import { createContext, useContext, useState, useEffect, useRef } from 'react';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import VideoCall from '../components/VideoCall';
import IncomingCall from '../components/IncomingCall';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [activeCall, setActiveCall] = useState(null); // { receiverId, receiverName, type, initiator, signal }
    const [incomingCall, setIncomingCall] = useState(null); // { callerId, callerName, type, signal }

    useEffect(() => {
        if (!currentUser) return;

        socket.on('call:incoming', (data) => {
            console.log('Incoming call:', data);
            setIncomingCall(data);
        });

        socket.on('call:ended', () => {
            setActiveCall(null);
            setIncomingCall(null);
        });

        socket.on('call:rejected', () => {
            setActiveCall(null);
        });

        return () => {
            socket.off('call:incoming');
            socket.off('call:ended');
            socket.off('call:rejected');
        };
    }, [currentUser]);

    const startCall = (receiverId, receiverName, type = 'video') => {
        setActiveCall({ receiverId, receiverName, type, initiator: true });
    };

    const acceptCall = () => {
        if (incomingCall) {
            setActiveCall({
                receiverId: incomingCall.callerId,
                receiverName: incomingCall.callerName,
                type: incomingCall.type,
                initiator: false,
                signal: incomingCall.signal
            });
            setIncomingCall(null);
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            socket.emit('call:rejected', { callerId: incomingCall.callerId });
            setIncomingCall(null);
        }
    };

    const endCall = () => {
        setActiveCall(null);
        setIncomingCall(null);
    };

    return (
        <CallContext.Provider value={{ startCall, activeCall, endCall }}>
            {children}

            {incomingCall && (
                <IncomingCall
                    callerName={incomingCall.callerName}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                />
            )}

            {activeCall && (
                <VideoCall
                    receiverId={activeCall.receiverId}
                    receiverName={activeCall.receiverName}
                    initialSignal={activeCall.signal}
                    onEnd={endCall}
                />
            )}
        </CallContext.Provider>
    );
};

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        // Return safe defaults if CallProvider is not mounted
        return {
            startCall: () => console.warn('CallProvider not mounted'),
            activeCall: null,
            endCall: () => { }
        };
    }
    return context;
};
