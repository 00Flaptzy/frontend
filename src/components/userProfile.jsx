import React from "react";
import { useState, useContext, useEffect } from "react";
import { TokenContext } from "../tokenContext";
import { fetchGetUserProfile } from "../api_fetching/urlParserMainFucntionality";
import NavBar from "./navBar";
import { useNavigate } from "react-router";
import { handleResponseError } from "../utils/handleResponse";
import "../index.css"
import { fetchChangePassword, fetchChangeUsername } from "../api_fetching/urlParserAuthorization";
import { defineCookiesToken } from "../utils/cookieHandling";
import { navigateToServerInternalError } from "../utils/navigateUtils";
import { defineColorTheme } from "../utils/cookieHandling";
import ThemeToggler from "./themeToggler";

const UserProfile = () => {
    const [token, setToken] = defineCookiesToken();
    const [ darkTheme, toggleTheme ] = defineColorTheme();

    const [ profile, setProfile ] = useState({});
    const [ refresh, setRefresh ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ showChangeUsernameForm, setShowChangeUsernameForm ] = useState(false);
    const [ showChangePasswordForm, setShowChangePasswordForm ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ successMessage, setSuccessMessage ] = useState("");

    const [ oldPassword, setOldPassword ] = useState("");
    const [ newPasswordFirst, setNewPasswordFirst ] = useState("");
    const [ newPasswordSecond, setNewPasswordSecond ] = useState("");
    const [ newUsername, setNewUsername ] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetchGetUserProfile(token);
                const responseJSON = await response.json();

                handleResponseError(response, responseJSON, navigate, setToken);
                setProfile(responseJSON);
            } catch (err) {
                console.error(err);
                navigateToServerInternalError(navigate, "Unknown Error Occurred. Please, try again later");
                return 
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [refresh]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        
        if(newPasswordFirst !== newPasswordSecond) {
            setErrorMessage("Passwords do not match");
            return;
        };

        if(newPasswordFirst.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            return;
        };

        try {
            const response = await fetchChangePassword(oldPassword, newPasswordFirst, token);
            const responseJSON = await response.json();
            
            handleResponseError(response, responseJSON, navigate, setToken, setErrorMessage);
            
            if(!response.ok) {
                return;
            };

            setSuccessMessage("Password changed successfully!");
            setOldPassword("");
            setNewPasswordFirst("");
            setNewPasswordSecond("");
            setTimeout(() => {
                setShowChangePasswordForm(false);
                setSuccessMessage("");
            }, 1500);
        } catch (err) {
            console.error(err);
            navigateToServerInternalError(navigate);
            return;
        };            
    };

    const handleChangeUsername = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        
        if(newUsername === profile.username) {
            setErrorMessage("New username cannot be the same as the old one");
            return;
        };

        if(newUsername.length < 3) {
            setErrorMessage("Username must be at least 3 characters long");
            return;
        };

        try {
            const response = await fetchChangeUsername(newUsername, token);
            const responseJSON = await response.json();

            handleResponseError(response, responseJSON, navigate, setToken);
            
            if(!response.ok) {
                return;
            }

            setProfile({...profile, "username": newUsername});
            setSuccessMessage("Username updated successfully!");
            setNewUsername("");
            setTimeout(() => {
                setShowChangeUsernameForm(false);
                setSuccessMessage("");
            }, 1500);
        } catch(err) {
            console.error(err);
            navigate("/internal-server-error", { state: {errorMessage: "Server down. Please, try again later"}});
            return;
        }
    };

    const getPercentageOfWidthProgressBar = () => {
        return profile.xp ? (profile.xp / profile.xp_to_next_level) * 100 : 0;
    }

    const getLevelProgress = () => {
        if (!profile.xp || !profile.xp_to_next_level) return 0;
        return Math.min((profile.xp / profile.xp_to_next_level) * 100, 100);
    };

    if(!token) {
        navigate("/register");
        return null;
    }

    if(loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <NavBar />
                <ThemeToggler />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <NavBar />
            <ThemeToggler />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                        Your Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Manage your account settings and view your progress
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Avatar Section */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=4f46e5&color=fff&size=256&bold=true&font-size=0.5`}
                                            alt="User avatar"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Level {profile.level || 1}
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {profile.username || 'User'}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                                                <span className="text-sm">@</span>
                                                {profile.email}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold mt-3 md:mt-0">
                                            <span>✨</span>
                                            Member since {new Date().getFullYear()}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Level Progress
                                            </span>
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                {getPercentageOfWidthProgressBar().toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${getLevelProgress()}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            <span>{profile.xp || 0} XP</span>
                                            <span>{profile.xp_to_next_level || 100} XP for next level</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-center">
                                            <div className="text-yellow-500 text-2xl mb-2">🏆</div>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {profile.level || 1}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Current Level</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-center">
                                            <div className="text-green-500 text-2xl mb-2">📊</div>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {profile.user_xp_total || 0}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total XP</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-center">
                                            <div className="text-purple-500 text-2xl mb-2">⚡</div>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {profile.next_level_xp_remaining || 100}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">XP to Next</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <span className="text-blue-600 dark:text-blue-400 text-xl">🔐</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Security</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {setShowChangePasswordForm(!showChangePasswordForm); setErrorMessage(""); setSuccessMessage("");}}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <span>🔐</span>
                                    Change Password
                                </button>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <span className="text-purple-600 dark:text-purple-400 text-xl">✏️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Profile</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Edit your username</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {setShowChangeUsernameForm(!showChangeUsernameForm); setErrorMessage(""); setSuccessMessage("");}}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <span>✏️</span>
                                    Change Username
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Achievements & Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-green-500">✅</span>
                                Account Security
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Verified</span>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                                        Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">2FA Status</span>
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
                                        Optional
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Details</h3>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {new Date().toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {new Date().toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePasswordForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <span className="text-blue-600 dark:text-blue-400 text-xl">🔐</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Change Password
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Secure your account
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowChangePasswordForm(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    ✕
                                </button>
                            </div>

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                                        <span>✅</span>
                                        {successMessage}
                                    </p>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleChangePassword}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            type="password"
                                            placeholder="Enter your current password"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            value={newPasswordFirst}
                                            onChange={(e) => setNewPasswordFirst(e.target.value)}
                                            type="password"
                                            placeholder="Enter new password"
                                            required
                                            minLength="8"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            value={newPasswordSecond}
                                            onChange={(e) => setNewPasswordSecond(e.target.value)}
                                            type="password"
                                            placeholder="Confirm new password"
                                            required
                                            minLength="8"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Username Modal */}
            {showChangeUsernameForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                        
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <span className="text-purple-600 dark:text-purple-400 text-xl">✏️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Change Username
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Update your display name
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowChangeUsernameForm(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    ✕
                                </button>
                            </div>

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                                        <span>✅</span>
                                        {successMessage}
                                    </p>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleChangeUsername}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Username
                                    </label>
                                    <input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        type="text"
                                        placeholder="Enter new username"
                                        required
                                        minLength="3"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Must be at least 3 characters long
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        Update Username
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;