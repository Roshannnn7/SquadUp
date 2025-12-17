import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Users, Globe, Cpu, Star, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { currentUser } = useAuth();

    const features = [
        {
            icon: <Rocket className="w-8 h-8" />,
            title: 'Launch Your Ideas',
            description: 'Turn your concepts into reality with a team of like-minded student builders.',
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Find Your Squad',
            description: 'Connect with peers who share your passion for coding, design, and innovation.',
            color: 'from-purple-500 to-indigo-500'
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: 'Global Mentorship',
            description: 'Get guidance from industry experts across the globe to level up your skills.',
            color: 'from-cyan-500 to-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative selection:bg-purple-500 selection:text-white">
            <Navbar />

            {/* Background Blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 blob animation-delay-4000"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-float">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold text-sm">
                            ✨ The #1 Platform for Student Devs
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-tight">
                        Build the <br />
                        <span className="animate-shine">Future Together</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                        Join an elite community of builders, designers, and innovators.
                        Launch projects, find your squad, and get expert guidance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to={currentUser ? "/dashboard" : "/signup"}
                            className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:transform hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                Start Building Now
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                            to="/projects"
                            className="px-8 py-4 glass-nav rounded-full font-bold text-lg text-white border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md flex items-center"
                        >
                            <Cpu className="mr-2 w-5 h-5 text-purple-400" />
                            Explore Projects
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3D Features Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-500 card-3d"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-xl p-8 relative overflow-hidden border border-white/5 group-hover:border-white/20 transition-all">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <div className="text-white">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section with Glass */}
            <section className="pb-32 px-4 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="glass-nav rounded-3xl p-12 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-[64px]"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                            {[
                                { number: '500+', label: 'Builders', icon: <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" /> },
                                { number: '100+', label: 'Projects', icon: <Rocket className="w-6 h-6 mx-auto mb-2 text-pink-400" /> },
                                { number: '50+', label: 'Mentors', icon: <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" /> },
                            ].map((stat, index) => (
                                <div key={index} className="group">
                                    {stat.icon}
                                    <div className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 relative bg-black/40 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <Logo className="w-6 h-6" />
                        <span className="text-xl font-bold text-white">SquadUp</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 SquadUp Inc. Built for the future.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
