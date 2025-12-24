import React, { useState, useEffect } from "react";
import { defineCookiesToken } from "../utils/cookieHandling";
import { fetchGetAllCompletions, fetchGetHabits } from "../api_fetching/urlParserMainFucntionality";
import { handleResponseError } from "../utils/handleResponse";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./navBar";
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BarChart3,
  Trophy,
  TrendingUp,
  CalendarDays,
  Hash,
  RefreshCw,
  Target,
  Sparkles,
  Zap,
  Grid3x3
} from "lucide-react";

const HabitCompletions = () => {
    const currentPage = parseInt(useParams().id) || 1;
    const [token, setToken] = defineCookiesToken();
    const navigate = useNavigate();

    const [allCompletions, setAllCompletions] = useState([]);
    const [habits, setHabits] = useState([]);
    const [visibleCompletions, setVisibleCompletions] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCompletions: 0,
        todayCompletions: 0,
        streakDays: 0,
        mostCompletedHabit: null
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                
                const [completionsResponse, habitsResponse] = await Promise.all([
                    fetchGetAllCompletions(token),
                    fetchGetHabits(token)
                ]);

                const completionsJSON = await completionsResponse.json();
                const habitsJSON = await habitsResponse.json();

                let errorFlag = handleResponseError(completionsResponse, completionsJSON, navigate, setToken);
                if (errorFlag) return;
                
                errorFlag = handleResponseError(habitsResponse, habitsJSON, navigate, setToken);
                if (errorFlag) return;

                setHabits(habitsJSON);
                setAllCompletions(completionsJSON);
                
                // Calculate statistics
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStart = Math.floor(today.getTime() / 1000);
                const todayEnd = todayStart + 86400;

                const todayCompletions = completionsJSON.filter(c => 
                    c.completed_at >= todayStart && c.completed_at < todayEnd
                ).length;

                // Find most completed habit
                const habitCounts = {};
                completionsJSON.forEach(c => {
                    habitCounts[c.habit_id] = (habitCounts[c.habit_id] || 0) + 1;
                });
                
                let mostCompletedHabit = null;
                let maxCount = 0;
                Object.entries(habitCounts).forEach(([habitId, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        const habit = habitsJSON.find(h => h.habit_id === parseInt(habitId));
                        mostCompletedHabit = habit?.habit_name || "Unknown";
                    }
                });

                setStats({
                    totalCompletions: completionsJSON.length,
                    todayCompletions,
                    streakDays: Math.floor(completionsJSON.length / habitsJSON.length) || 0,
                    mostCompletedHabit
                });

                // Set visible completions for current page
                const startIdx = (currentPage - 1) * 10;
                const endIdx = startIdx + 10;
                setVisibleCompletions(completionsJSON.slice(startIdx, endIdx));

            } catch (err) {
                console.error("Error fetching completions:", err);
                navigate("/internal-server-error", { 
                    state: { errorMessage: "Server down. Please, try again later" } 
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchAll();
    }, [currentPage, reload, token, navigate]);

    const formatUNIX = (UNIX) => {
        const date = new Date(UNIX * 1000);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        const timeString = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        if (isToday) {
            return `Today at ${timeString}`;
        }

        const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
        if (isYesterday) {
            return `Yesterday at ${timeString}`;
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ` at ${timeString}`;
    };

    const handleSortByHabit = (habitId) => {
        setSelectedHabit(habitId);
        
        if (!habitId) {
            const startIdx = (currentPage - 1) * 10;
            const endIdx = startIdx + 10;
            setVisibleCompletions(allCompletions.slice(startIdx, endIdx));
            return;
        }

        const filtered = allCompletions.filter(completion => 
            completion.habit_id === habitId
        );
        setVisibleCompletions(filtered.slice(0, 10));
    };

    const handleNavigate = (direction) => {
        const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
        if (newPage < 1 || newPage > Math.ceil(allCompletions.length / 10)) return;
        navigate(`/habit_completions/${newPage}`);
    };

    const getHabitColor = (index) => {
        const colors = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
            "from-indigo-500 to-purple-500",
            "from-teal-500 to-cyan-500",
            "from-yellow-500 to-orange-500",
            "from-pink-500 to-rose-500"
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <NavBar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Loading Your Progress
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Fetching your completion history...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(allCompletions.length / 10);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
            </div>

            <NavBar />

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                                    <CheckCircle className="text-white" size={24} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                                    Completion History
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Track your progress and celebrate your consistency
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setReload(!reload)}
                            className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                            <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={20} />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                Refresh Data
                            </span>
                        </button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Completions</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {stats.totalCompletions}
                                    </p>
                                </div>
                                <Trophy className="text-blue-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {stats.todayCompletions}
                                    </p>
                                </div>
                                <CalendarDays className="text-green-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Streak Days</p>
                                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {stats.streakDays}
                                    </p>
                                </div>
                                <TrendingUp className="text-purple-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Habit</p>
                                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400 truncate">
                                        {stats.mostCompletedHabit || "None"}
                                    </p>
                                </div>
                                <Zap className="text-orange-500" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Filter className="text-gray-600 dark:text-gray-400" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Filter by Habit
                            </h2>
                        </div>
                        
                        <button
                            onClick={() => handleSortByHabit(null)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                !selectedHabit 
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            Show All
                        </button>
                    </div>

                    {/* Habit Filters */}
                    <div className="flex flex-wrap gap-3">
                        {habits.map((habit, index) => (
                            <button
                                key={habit.habit_id}
                                onClick={() => handleSortByHabit(habit.habit_id)}
                                className={`group relative overflow-hidden px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    selectedHabit === habit.habit_id
                                        ? 'bg-gradient-to-r text-white shadow-lg scale-105'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
                                } ${selectedHabit === habit.habit_id ? getHabitColor(index) : ''}`}
                            >
                                {selectedHabit === habit.habit_id && (
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                )}
                                <div className="relative flex items-center gap-2">
                                    <Target size={16} />
                                    <span>{habit.habit_name}</span>
                                    {selectedHabit === habit.habit_id && (
                                        <CheckCircle className="ml-1" size={16} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Active Filter Info */}
                    {selectedHabit && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-blue-500" size={20} />
                                <p className="text-blue-700 dark:text-blue-300">
                                    Showing completions for <span className="font-bold">
                                        {habits.find(h => h.habit_id === selectedHabit)?.habit_name}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Completions List */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Completion History
                            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2 font-normal">
                                ({visibleCompletions.length} shown)
                            </span>
                        </h2>
                        
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Grid3x3 size={16} />
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                    </div>

                    {visibleCompletions.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 border border-gray-200 dark:border-gray-700">
                            <div className="text-center max-w-md mx-auto">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Calendar className="text-gray-400" size={64} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                    No Completions Yet
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    {selectedHabit 
                                        ? "This habit hasn't been completed yet. Start tracking your progress!"
                                        : "Start building habits and track your progress here!"
                                    }
                                </p>
                                <button
                                    onClick={() => navigate("/habits")}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                                >
                                    <Target size={20} />
                                    Go to Habits
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {visibleCompletions.map((completion, index) => (
                                <div
                                    key={`${completion.completion_id}-${index}`}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-2 rounded-xl bg-gradient-to-r ${getHabitColor(index)}`}>
                                                        <CheckCircle className="text-white" size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                            {completion.habit_name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            <Hash size={12} />
                                                            <span>ID: {completion.completion_id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        <Clock size={14} />
                                                        <span>Completed</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                                                        {formatUNIX(completion.completed_at)}
                                                    </div>
                                                </div>
                                                
                                                <div className="hidden lg:block">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                                                        <BarChart3 className="text-green-600 dark:text-green-400" size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Completion Progress</span>
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    #{index + 1 + ((currentPage - 1) * 10)} of {allCompletions.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                                                    style={{ 
                                                        width: `${((index + 1 + ((currentPage - 1) * 10)) / allCompletions.length) * 100}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-12">
                        <button
                            onClick={() => handleNavigate("prev")}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => navigate(`/habit_completions/${pageNum}`)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                                            currentPage === pageNum
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            {totalPages > 5 && (
                                <span className="px-3 text-gray-500 dark:text-gray-400">...</span>
                            )}
                        </div>

                        <button
                            onClick={() => handleNavigate("next")}
                            disabled={currentPage >= totalPages}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Summary Section */}
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">
                                🎉 You're Making Progress!
                            </h3>
                            <p className="opacity-90">
                                {stats.totalCompletions} total completions across {habits.length} habits
                            </p>
                            <p className="text-sm opacity-80 mt-2">
                                Keep going! Every completion brings you closer to your goals.
                            </p>
                        </div>
                        <div className="text-5xl">
                            {stats.todayCompletions > 0 ? "🔥" : 
                             stats.totalCompletions > 10 ? "⭐" : "🌱"}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Consistency is Key</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track your streaks and maintain daily progress for best results.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Review Often</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Regular reviews help identify patterns and areas for improvement.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Target className="text-purple-600 dark:text-purple-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Celebrate Wins</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Every completion is a victory. Celebrate your progress!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitCompletions;