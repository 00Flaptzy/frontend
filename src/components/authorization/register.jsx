import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchRegister } from "../../api_fetching/urlParserAuthorization";
import { verifyUsernameLength, verifyEmail, verifyPasswordLength } from "../../utils/verifyData";
import { handleResponseError } from "../../utils/handleResponse";
import { defineCookiesToken } from "../../utils/cookieHandling";
import NavBar from "../navBar";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Target,
  Zap,
  Loader2
} from "lucide-react";

const Register = () => {
    const [token, setToken] = defineCookiesToken();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errorMessage) setErrorMessage("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const form = e.target;
        if (!form.checkValidity()) {
            form.reportValidity();
            setIsLoading(false);
            return;
        }

        const { username, email, password } = formData;

        if (!verifyUsernameLength(username)) {
            setErrorMessage("Invalid username. Length must be from 3 to 50 characters.");
            setIsLoading(false);
            return;
        }

        if (!verifyEmail(email)) {
            setErrorMessage("Invalid Email. Must be a valid email address.");
            setIsLoading(false);
            return;
        }

        if (!verifyPasswordLength(password)) {
            setErrorMessage("Password must be at least 8 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetchRegister(username, password, email);
            const responseJSON = await response.json();

            if (response.status === 400) {
                setErrorMessage("Invalid username or email. Please check your input.");
                setIsLoading(false);
                return;
            }

            if (response.status === 409) {
                setErrorMessage("User with these credentials already exists.");
                setIsLoading(false);
                return;
            }

            // Handle successful response
            handleResponseError(response, responseJSON, navigate, null, setToken, "/");
            
            if (response.ok) {
                setToken(responseJSON.token);
                setSuccessMessage("Account created successfully! Redirecting...");
                
                // Redirect after showing success message
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Server error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: "None", color: "gray" };
        
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        if (score === 0) return { score: 0, label: "None", color: "gray" };
        if (score === 1) return { score: 25, label: "Weak", color: "red" };
        if (score === 2) return { score: 50, label: "Fair", color: "yellow" };
        if (score === 3) return { score: 75, label: "Good", color: "blue" };
        return { score: 100, label: "Strong", color: "green" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Background particle effect component
    const ParticleBackground = () => {
        return (
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900/20 text-white">
            <ParticleBackground />
            
            <NavBar />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
                            <Rocket className="text-yellow-400" />
                            <span className="font-bold">JOIN OUR COMMUNITY</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Start Your{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Transformation
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Join thousands who are building better habits and achieving their goals
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Registration Form */}
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 md:p-12 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                                    <User className="text-blue-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">Create Account</h2>
                                    <p className="text-gray-400">Join the habit revolution today</p>
                                </div>
                            </div>

                            <form className="space-y-8" onSubmit={handleRegister}>
                                {/* Status Messages */}
                                {errorMessage && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                        <AlertCircle className="text-red-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-red-300">{errorMessage}</p>
                                            <p className="text-sm text-red-400/80 mt-1">Please check your information and try again</p>
                                        </div>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                                        <CheckCircle className="text-green-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-green-300">{successMessage}</p>
                                            <p className="text-sm text-green-400/80 mt-1">Welcome to the community!</p>
                                        </div>
                                    </div>
                                )}

                                {/* Username Field */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User size={18} className="text-blue-400" />
                                            Username
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                            placeholder="Choose your username"
                                            minLength="3"
                                            maxLength="50"
                                            required
                                            disabled={isLoading}
                                        />
                                    </label>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        3-50 characters, letters and numbers only
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail size={18} className="text-purple-400" />
                                            Email Address
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                            placeholder="your.email@example.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </label>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        We'll never share your email with anyone
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lock size={18} className="text-green-400" />
                                            Password
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pr-12"
                                                placeholder="Create a strong password"
                                                minLength="8"
                                                required
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </label>
                                    
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-400">Password Strength:</span>
                                                <span className={`font-medium ${
                                                    passwordStrength.color === 'green' ? 'text-green-400' :
                                                    passwordStrength.color === 'blue' ? 'text-blue-400' :
                                                    passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        passwordStrength.color === 'green' ? 'bg-green-500' :
                                                        passwordStrength.color === 'blue' ? 'bg-blue-500' :
                                                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}
                                                    style={{ width: `${passwordStrength.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        Minimum 8 characters with letters and numbers
                                    </div>
                                </div>

                                {/* Terms Agreement */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className="relative mt-1">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            required
                                            disabled={isLoading}
                                        />
                                        <div className="w-5 h-5 bg-gray-800 border border-gray-700 rounded-lg peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <CheckCircle size={14} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        I agree to the{" "}
                                        <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </div>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="group-hover:animate-pulse" />
                                                <span>Create My Account</span>
                                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-gray-900/50 text-gray-500">Already have an account?</span>
                                    </div>
                                </div>

                                {/* Login Link */}
                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-all duration-300 group"
                                    >
                                        <span>Sign In to Existing Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Benefits Sidebar */}
                        <div className="space-y-8">
                            {/* Benefits Card */}
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Sparkles className="text-yellow-400" />
                                    Why Join Us?
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: "🎯", title: "Smart Goal Tracking", desc: "AI-powered insights for your habits" },
                                        { icon: "📊", title: "Detailed Analytics", desc: "Track progress with beautiful charts" },
                                        { icon: "👥", title: "Community Support", desc: "Join 15K+ motivated users" },
                                        { icon: "🏆", title: "Achievement System", desc: "Earn badges and rewards" },
                                        { icon: "🔒", title: "Bank-level Security", desc: "Your data is always protected" },
                                        { icon: "📱", title: "Multi-platform", desc: "Access anywhere, anytime" }
                                    ].map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                                            <div className="text-2xl group-hover:scale-110 transition-transform">{benefit.icon}</div>
                                            <div>
                                                <div className="font-bold text-white mb-1">{benefit.title}</div>
                                                <div className="text-sm text-gray-400">{benefit.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        15K+
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2">Active Users</div>
                                </div>
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        98%
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2">Success Rate</div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Shield className="text-green-400" />
                                    Your Security Matters
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm">End-to-end encryption</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm">Two-factor authentication</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm">GDPR compliant</span>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-3xl">⭐</div>
                                    <div>
                                        <div className="font-bold">"Changed My Life"</div>
                                        <div className="text-sm text-gray-400">- Alex, 120 day streak</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">
                                    "This platform helped me build habits I've struggled with for years. The community and tracking system kept me accountable."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center border-t border-gray-800 pt-8">
                        <div className="flex flex-wrap justify-center gap-8 mb-6">
                            <a href="#" className="text-gray-500 hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="text-gray-500 hover:text-white transition">Terms of Service</a>
                            <a href="#" className="text-gray-500 hover:text-white transition">Support Center</a>
                            <a href="#" className="text-gray-500 hover:text-white transition">Contact Us</a>
                        </div>
                        <p className="text-gray-600">
                            © {new Date().getFullYear()} HabitTracker Pro. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            Start your journey today • Free 14-day premium trial
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;