import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { Phone, PhoneOff, Video, VideoOff, Monitor, MonitorOff, Mic, MicOff } from 'lucide-react';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VideoCall = ({ receiverId, receiverName, initialSignal, onEnd }) => {
    const { currentUser, userProfile } = useAuth();
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callStatus, setCallStatus] = useState(initialSignal ? 'connected' : 'calling');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const screenStreamRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                const peer = new Peer({
                    initiator: !initialSignal,
                    trickle: false,
                    stream: currentStream,
                });

                peer.on('signal', (data) => {
                    if (!initialSignal) {
                        socket.emit('call:request', {
                            receiverId,
                            callerName: userProfile?.displayName || currentUser?.email,
                            type: 'video',
                            signal: data,
                        });
                    } else {
                        socket.emit('call:accepted', {
                            callerId: receiverId,
                            signal: data,
                        });
                    }
                });

                peer.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (userVideo.current) {
                        userVideo.current.srcObject = remoteStream;
                    }
                });

                if (initialSignal) {
                    peer.signal(initialSignal);
                }

                socket.on('call:accepted', (data) => {
                    setCallStatus('connected');
                    peer.signal(data.signal);
                });

                socket.on('call:rejected', () => {
                    toast.error('Call rejected');
                    handleEndCall();
                });

                connectionRef.current = peer;
            })
            .catch(err => {
                console.error("Failed to get local stream", err);
                toast.error("Could not access camera/microphone");
                onEnd();
            });

        socket.on('call:ended', () => {
            handleEndCall();
        });

        return () => {
            handleEndCall();
            socket.off('call:accepted');
            socket.off('call:rejected');
            socket.off('call:ended');
        };
    }, []);

    const handleEndCall = () => {
        setCallStatus('ended');
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        socket.emit('call:end', { to: receiverId });
        onEnd();
    };

    const toggleMute = () => {
        if (stream) {
            const enabled = stream.getAudioTracks()[0].enabled;
            stream.getAudioTracks()[0].enabled = !enabled;
            setIsMuted(!enabled);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const enabled = stream.getVideoTracks()[0].enabled;
            stream.getVideoTracks()[0].enabled = !enabled;
            setIsVideoOff(!enabled);
        }
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                screenStreamRef.current = screenStream;

                const videoTrack = screenStream.getVideoTracks()[0];

                if (connectionRef.current) {
                    connectionRef.current.replaceTrack(
                        stream.getVideoTracks()[0],
                        videoTrack,
                        stream
                    );
                }

                myVideo.current.srcObject = screenStream;
                setIsScreenSharing(true);

                videoTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (error) {
                console.error("Error sharing screen:", error);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        const videoTrack = stream.getVideoTracks()[0];
        if (connectionRef.current) {
            connectionRef.current.replaceTrack(
                screenStreamRef.current.getVideoTracks()[0],
                videoTrack,
                stream
            );
        }
        myVideo.current.srcObject = stream;
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        setIsScreenSharing(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-6xl aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {/* Remote Video (Major) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            playsInline
                            ref={userVideo}
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <span className="text-white text-4xl font-bold">{receiverName?.[0]}</span>
                            </div>
                            <p className="text-xl text-white font-semibold">
                                {callStatus === 'calling' ? `Calling ${receiverName}...` : 'Connecting...'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Local Video (Minor) */}
                <div className="absolute top-6 right-6 w-1/4 aspect-video bg-black rounded-xl overflow-hidden border-2 border-primary-500 shadow-xl z-20">
                    <video
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <VideoOff className="w-8 h-8 text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-30">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isMuted ? <MicOff /> : <Mic />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isVideoOff ? <VideoOff /> : <Video />}
                    </button>

                    <button
                        onClick={toggleScreenShare}
                        className={`p-4 rounded-full transition-all ${isScreenSharing ? 'bg-primary-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isScreenSharing ? <MonitorOff /> : <Monitor />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all hover:scale-110 shadow-lg shadow-red-600/30"
                    >
                        <PhoneOff className="w-8 h-8 rotate-[135deg]" />
                    </button>
                </div>

                {/* Info Overlay */}
                <div className="absolute top-6 left-6 z-30">
                    <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white">
                        <span className="font-semibold">{receiverName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
