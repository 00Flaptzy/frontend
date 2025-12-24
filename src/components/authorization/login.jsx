import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLogin } from "../../api_fetching/urlParserAuthorization";
import { verifyUsernameLength, verifyPasswordLength } from "../../utils/verifyData";
import { handleResponseError } from "../../utils/handleResponse";
import { defineCookiesToken } from "../../utils/cookieHandling";
import NavBar from "../navBar";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  LogIn,
  Sparkles,
  ArrowRight,
  Shield,
  Key,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";

const Login = () => {
  const [token, setToken] = defineCookiesToken();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    
    // Limpiar mensajes de error cuando el usuario empieza a escribir
    if (errorMessage) setErrorMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      setIsLoading(false);
      return;
    }

    // Validaciones
    if (!verifyUsernameLength(username)) {
      setErrorMessage("Invalid username. Length must be from 3 to 50 characters.");
      setIsLoading(false);
      return;
    }

    if (!verifyPasswordLength(password)) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchLogin(username, password);
      const responseJSON = await response.json();

      if (response.status === 401) {
        setErrorMessage("Invalid credentials. Please check your username and password.");
        setIsLoading(false);
        return;
      }

      if (response.status === 429) {
        setErrorMessage("Too many attempts. Please try again later.");
        setIsLoading(false);
        return;
      }

      // Manejar respuesta exitosa
      handleResponseError(response, responseJSON, navigate, setToken, null, "/");
      
      if (response.ok) {
        setToken(responseJSON.token);
        setSuccessMessage("Login successful! Redirecting...");
        
        // Redirección después de mostrar mensaje de éxito
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error. Please try again later.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Efectos de partículas para el fondo
  const ParticleBackground = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20 text-white">
      <ParticleBackground />
      
      <NavBar />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header con información */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
              <Shield className="text-blue-400" />
              <span className="font-bold">SECURE LOGIN</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome Back to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HabitTracker Pro
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access your personalized dashboard and continue your journey towards better habits
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Formulario de Login */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <Key className="text-blue-400" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Sign In</h2>
                  <p className="text-gray-400">Enter your credentials to continue</p>
                </div>
              </div>

              <form className="space-y-8" onSubmit={handleLogin}>
                {/* Mensajes de estado */}
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-300">{errorMessage}</p>
                      <p className="text-sm text-red-400/80 mt-1">Please check your credentials and try again</p>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                    <CheckCircle className="text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-300">{successMessage}</p>
                      <p className="text-sm text-green-400/80 mt-1">You will be redirected shortly</p>
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
                      placeholder="Enter your username"
                      minLength="3"
                      maxLength="50"
                      required
                      disabled={isLoading}
                    />
                  </label>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    Must be 3-50 characters long
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={18} className="text-purple-400" />
                      Password
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pr-12"
                        placeholder="Enter your password"
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
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    Minimum 8 characters required
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        disabled={isLoading}
                      />
                      <div className="w-5 h-5 bg-gray-800 border border-gray-700 rounded-lg peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="group-hover:translate-x-1 transition-transform" />
                        <span>Sign In to Account</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform opacity-0 group-hover:opacity-100" />
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
                    <span className="px-4 bg-gray-900/50 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                  
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-2.52-1.01-3.74-1.01-1.22 0-1.842.864-3.722.99-1.88.125-3.664-1.02-3.664-3.55 0-2.42 1.925-4.05 3.664-4.05 1.88 0 2.902 1.01 3.74 1.01.838 0 2.157-1.01 3.74-1.01 1.476 0 3.23.997 3.664 3.23-1.476 1.01-1.476 2.52 0 3.55-1.476 1.01-2.102 1.01-3.74 1.01z"/>
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-8 border-t border-gray-800">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-400 hover:text-blue-300 font-semibold hover:underline inline-flex items-center gap-1 group"
                    >
                      Create account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Información lateral */}
            <div className="space-y-8">
              {/* Características */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles className="text-yellow-400" />
                  Why Join Us?
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: "📊", title: "Advanced Analytics", desc: "Track your progress with detailed insights" },
                    { icon: "🎯", title: "Smart Goals", desc: "AI-powered habit recommendations" },
                    { icon: "👥", title: "Community Support", desc: "Join thousands of motivated users" },
                    { icon: "🔒", title: "Bank-level Security", desc: "Your data is encrypted and secure" }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <div className="font-bold">{feature.title}</div>
                        <div className="text-sm text-gray-400">{feature.desc}</div>
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
                    <span className="text-sm">Two-factor authentication available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">No data sharing with third parties</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-8">
                <h3 className="text-xl font-bold mb-4">💡 Quick Tip</h3>
                <p className="text-gray-300">
                  Use a password manager for secure and easy access to all your accounts.
                </p>
                <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Password strength: Strong
                </div>
              </div>
            </div>
          </div>

          {/* Footer de la página de login */}
          <div className="mt-16 text-center border-t border-gray-800 pt-8">
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <a href="#" className="text-gray-500 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Support</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Contact</a>
            </div>
            <p className="text-gray-600">
              © {new Date().getFullYear()} HabitTracker Pro. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Secure login • Protected by advanced security protocols
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;