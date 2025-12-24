import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./navBar";
import {
  Home,
  Search,
  Compass,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Satellite,
  Rocket,
  Zap,
  Globe
} from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/5 left-1/5 animate-float">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30"></div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 animate-float-delayed">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30"></div>
                </div>
                <div className="absolute top-1/2 left-1/3 animate-float-slow">
                    <div className="w-4 h-4 rounded-full bg-pink-500/20 border border-pink-500/30"></div>
                </div>
            </div>

            <NavBar />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-8">
                            <AlertTriangle className="text-yellow-400" />
                            <span className="font-bold">PAGE NOT FOUND</span>
                        </div>

                        <div className="relative mb-12">
                            <h1 className="text-9xl md:text-[200px] font-bold mb-4 tracking-tighter">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    404
                                </span>
                            </h1>
                            <div className="absolute -top-4 -right-4 animate-pulse">
                                <Satellite className="text-blue-400 w-16 h-16" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 animate-pulse delay-300">
                                <Rocket className="text-purple-400 w-16 h-16" />
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Lost in{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Digital Space
                            </span>
                        </h2>
                        
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                            This page has drifted into the cosmic void. But don't worry, 
                            we've got plenty of amazing things waiting for you back home.
                        </p>
                    </div>

                    {/* Stats/Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                                    <Search className="text-blue-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold">Search Failed</h3>
                            </div>
                            <p className="text-gray-400">
                                We couldn't locate the page you're looking for in our cosmic database.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                                    <Compass className="text-purple-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold">Navigation Help</h3>
                            </div>
                            <p className="text-gray-400">
                                Use the navigation bar or return to explore our known territories.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                                    <Globe className="text-green-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold">Explore More</h3>
                            </div>
                            <p className="text-gray-400">
                                Discover amazing features and tools on our main platform.
                            </p>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-12 mb-16">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
                                <Zap className="text-yellow-400" />
                                <span className="font-bold">QUICK NAVIGATION</span>
                            </div>
                            
                            <h3 className="text-3xl font-bold mb-8">
                                Ready to{" "}
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Get Back on Track?
                                </span>
                            </h3>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                                <Link
                                    to="/"
                                    className="group relative overflow-hidden px-12 py-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        <Home className="group-hover:scale-110 transition-transform" />
                                        <span>Back to Dashboard</span>
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </Link>

                                <Link
                                    to="/habits"
                                    className="group px-12 py-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <Sparkles className="group-hover:animate-pulse" />
                                    <span>Explore Habits</span>
                                </Link>
                            </div>
                            
                            <p className="text-gray-400 max-w-xl mx-auto">
                                Or use the navigation menu above to explore other areas of the platform
                            </p>
                        </div>
                    </div>

                    {/* Fun Stats */}
                    <div className="text-center mb-12">
                        <h4 className="text-2xl font-bold mb-6">While You're Here</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            <div className="bg-gray-900/30 p-4 rounded-2xl">
                                <div className="text-3xl font-bold text-blue-400">99.9%</div>
                                <div className="text-sm text-gray-400">Uptime</div>
                            </div>
                            <div className="bg-gray-900/30 p-4 rounded-2xl">
                                <div className="text-3xl font-bold text-purple-400">15K+</div>
                                <div className="text-sm text-gray-400">Active Users</div>
                            </div>
                            <div className="bg-gray-900/30 p-4 rounded-2xl">
                                <div className="text-3xl font-bold text-green-400">∞</div>
                                <div className="text-sm text-gray-400">Possibilities</div>
                            </div>
                            <div className="bg-gray-900/30 p-4 rounded-2xl">
                                <div className="text-3xl font-bold text-pink-400">24/7</div>
                                <div className="text-sm text-gray-400">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Easter Egg / Fun Message */}
                    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                    <span className="text-3xl">✨</span>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold mb-2">Did You Know?</h4>
                                <p className="text-gray-300">
                                    Even astronauts sometimes get lost in space! The important thing is knowing how to 
                                    navigate back to safety. Consider this your friendly space station beacon guiding you home.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated CSS */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(10deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default NotFound;