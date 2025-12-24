import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGetHabits, fetchHabitCompletion, fetchUncompleteHabit } from "../api_fetching/urlParserMainFucntionality";
import { fetchGetUNIXFromMidnight } from "../api_fetching/urlParserUtils";
import NavBar from "./navBar";
import AddHabitButton from "./addHabitButton";
import DeleteHabit from "./deleteHabit";
import { minutesToReset } from "../utils/getTimeUntilReset";
import { handleResponseError } from "../utils/handleResponse";
import { defineCookiesToken } from "../utils/cookieHandling";
import "../index.css";
import {
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  RefreshCw,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";

export const Habits = () => {
    const [token, setToken] = defineCookiesToken();
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);
    const [refreshHabits, setRefreshHabits] = useState(false);
    const [loading, setLoading] = useState(true);
    const [UNIXFromMidnight, setUNIXFromMidnight] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Efecto para cargar hábitos
    useEffect(() => {
        const fetchHabitsData = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                
                // Obtener tiempo UNIX desde medianoche
                const unixResponse = await fetchGetUNIXFromMidnight(token);
                const unixJSON = await unixResponse.json();
                
                if (!unixResponse.ok) {
                    handleResponseError(unixResponse, unixJSON, navigate, setToken);
                    return;
                }
                
                setUNIXFromMidnight(unixJSON.UNIX_time);

                // Obtener hábitos
                const habitsResponse = await fetchGetHabits(token);
                const habitsJSON = await habitsResponse.json();
                
                if (!habitsResponse.ok) {
                    handleResponseError(habitsResponse, habitsJSON, navigate, setToken);
                    return;
                }

                // Procesar hábitos con tiempo de reinicio
                const processedHabits = await Promise.all(
                    habitsJSON.map(async (habit) => {
                        const resetTime = await getClosestResetTime(habit.reset_at, habit.completed, unixJSON.UNIX_time);
                        return {
                            ...habit,
                            resetAt: resetTime
                        };
                    })
                );

                setHabits(processedHabits);
            } catch (err) {
                console.error("Error fetching habits:", err);
                navigate("/internal-server-error", { 
                    state: { errorMessage: "Server down. Please, try again later" } 
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHabitsData();
    }, [refreshHabits, token, navigate]);

    // Función para obtener tiempo de reinicio
    const getClosestResetTime = async (resetAt, completed, unixTime) => {
        if (!resetAt || !unixTime) return "Calculating...";
        
        try {
            const resetAtKeys = Object.keys(resetAt).sort((a, b) => Number(a) - Number(b));
            
            for (const window of resetAtKeys) {
                if (unixTime < Number(window)) {
                    return minutesToReset(window, unixTime);
                }
            }
            
            return completed 
                ? "🎉 All done for today!" 
                : "⏰ Next reset tomorrow";
        } catch (err) {
            console.error("Error calculating reset time:", err);
            return "Time calculation error";
        }
    };

    // Manejar completar/incompletar hábito
    const handleToggleCompletion = async (habitId, index, currentlyCompleted) => {
        if (completingId === habitId) return;
        
        setCompletingId(habitId);
        const updatedHabits = [...habits];
        
        try {
            if (!currentlyCompleted) {
                // Marcar como completado
                const response = await fetchHabitCompletion(habitId, token);
                const responseJSON = await response.json();
                
                if (!response.ok) {
                    handleResponseError(response, responseJSON, navigate, setToken);
                    return;
                }
                
                updatedHabits[index].completed = true;
            } else {
                // Marcar como incompleto
                const response = await fetchUncompleteHabit(habitId, token);
                const responseJSON = await response.json();
                
                if (!response.ok) {
                    handleResponseError(response, responseJSON, navigate, setToken);
                    return;
                }
                
                updatedHabits[index].completed = false;
            }
            
            setHabits(updatedHabits);
        } catch (err) {
            console.error("Error toggling habit completion:", err);
        } finally {
            setCompletingId(null);
        }
    };

    // Manejar eliminación de hábito
    const handleDeleteHabit = (habitId) => {
        setDeletingId(habitId);
        setTimeout(() => {
            const updatedHabits = habits.filter(h => h.habit_id !== habitId);
            setHabits(updatedHabits);
            setDeletingId(null);
        }, 300);
    };

    // Calcular estadísticas
    const completedCount = habits.filter(h => h.completed).length;
    const totalCount = habits.length;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Si no hay token, redirigir a login
    if (!token) {
        navigate("/login");
        return null;
    }

    // Componente de carga
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <NavBar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Loading Your Habits
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Getting your daily routine ready...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <NavBar />
            
            {/* Fondo decorativo */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                                    <Target className="text-white" size={24} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                                    Daily Habits
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Build consistency, achieve greatness
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setRefreshHabits(!refreshHabits)}
                                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={20} />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Refresh
                                </span>
                            </button>
                            
                            {totalCount < 10 && (
                                <AddHabitButton 
                                    loadHabits={refreshHabits} 
                                    setLoadHabits={setRefreshHabits} 
                                />
                            )}
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today's Progress</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {completionPercentage}%
                                    </p>
                                </div>
                                <TrendingUp className="text-green-500" size={32} />
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                        completionPercentage >= 75 ? 'bg-green-500' :
                                        completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {completedCount}
                                    </p>
                                </div>
                                <CheckCircle className="text-green-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Habits</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {totalCount}
                                    </p>
                                </div>
                                <Target className="text-blue-500" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Habits Grid */}
                <div className="mb-12">
                    {totalCount === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-200 dark:border-gray-700">
                            <div className="text-center max-w-md mx-auto">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Star className="text-blue-500" size={64} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                    Start Your Journey
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    Your first habit is the most important step. 
                                    What positive change will you make today?
                                </p>
                                <AddHabitButton 
                                    loadHabits={refreshHabits} 
                                    setLoadHabits={setRefreshHabits} 
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Your Habits ({totalCount})
                                </h2>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="inline-block mr-2" size={16} />
                                    {new Date().toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {habits.map((habit, index) => (
                                    <div
                                        key={habit.habit_id}
                                        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                                            habit.completed
                                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-green-200 dark:border-emerald-800'
                                                : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                                        } ${deletingId === habit.habit_id ? 'opacity-50' : ''}`}
                                    >
                                        {/* Status Indicator */}
                                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                            habit.completed
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                                                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                                        }`}>
                                            {habit.completed ? (
                                                <>
                                                    <CheckCircle size={12} />
                                                    Completed
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} />
                                                    Pending
                                                </>
                                            )}
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6">
                                            {/* Habit Name */}
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 pr-16">
                                                {habit.habit_name}
                                            </h3>

                                            {/* Reset Time */}
                                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                                                <Clock size={16} />
                                                <span>{habit.resetAt}</span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[60px]">
                                                {habit.habit_desc || "No description provided"}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                {/* Toggle Completion Button */}
                                                <button
                                                    onClick={() => handleToggleCompletion(
                                                        habit.habit_id, 
                                                        index, 
                                                        habit.completed
                                                    )}
                                                    disabled={completingId === habit.habit_id}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                                        habit.completed
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                                    } ${completingId === habit.habit_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {completingId === habit.habit_id ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : habit.completed ? (
                                                        <>
                                                            <CheckCircle size={16} />
                                                            Mark Incomplete
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap size={16} />
                                                            Mark Complete
                                                        </>
                                                    )}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteHabit(habit.habit_id)}
                                                    disabled={deletingId === habit.habit_id}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    {deletingId === habit.habit_id ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : (
                                                        <>
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                                            habit.completed
                                                ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5'
                                                : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
                                        }`}></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Motivation Section */}
                {totalCount > 0 && (
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {completionPercentage === 100 ? (
                                        "🎉 Perfect Day! You're amazing!"
                                    ) : completionPercentage >= 75 ? (
                                        "🔥 Great job! Almost there!"
                                    ) : completionPercentage >= 50 ? (
                                        "💪 Keep going! You're halfway!"
                                    ) : (
                                        "🚀 Start strong! You've got this!"
                                    )}
                                </h3>
                                <p className="opacity-90">
                                    {completedCount} of {totalCount} habits completed today
                                </p>
                            </div>
                            <div className="text-5xl">
                                {completionPercentage === 100 ? "🏆" :
                                 completionPercentage >= 75 ? "⭐" :
                                 completionPercentage >= 50 ? "⚡" : "🌱"}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Target className="text-blue-600 dark:text-blue-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Small Steps</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Consistency beats intensity. Focus on daily progress.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Track Progress</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            What gets measured gets improved. Review daily.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Be Consistent</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Habits form through repetition. Stick to your schedule.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                <Zap className="text-yellow-600 dark:text-yellow-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Stay Motivated</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Celebrate small wins. They lead to big achievements.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Habits;