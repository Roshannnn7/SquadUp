import { Phone, PhoneOff } from 'lucide-react';

const IncomingCall = ({ callerName, onAccept, onReject }) => {
    return (
        <div className="fixed top-8 right-8 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="glass-effect p-6 rounded-2xl border border-white/20 shadow-2xl flex items-center space-x-6 min-w-[300px]">
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-2xl font-bold">{callerName?.[0]}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Incoming Call</h3>
                    <p className="text-gray-400">{callerName} is calling you...</p>

                    <div className="flex items-center space-x-4 mt-4">
                        <button
                            onClick={onAccept}
                            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Accept</span>
                        </button>

                        <button
                            onClick={onReject}
                            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
                        >
                            <PhoneOff className="w-4 h-4" />
                            <span>Reject</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;
