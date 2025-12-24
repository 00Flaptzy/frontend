import React, { useState } from "react";
import { fetchAddHabit } from "../api_fetching/urlParserMainFucntionality";
import { useNavigate } from "react-router-dom";
import { handleResponseError } from "../utils/handleResponse";
import { defineCookiesToken } from "../utils/cookieHandling";
import {
  X,
  Clock,
  Plus,
  AlertCircle,
  Loader2,
  Calendar,
  Info
} from "lucide-react";

const AddHabitWindow = (props) => {
    const [token, setToken] = defineCookiesToken();
    const navigate = useNavigate();
    const [resetTimeArray, setResettingTimes] = useState([]);
    const [habitName, setHabitName] = useState("");
    const [habitDesc, setHabitDesc] = useState("");
    const [resetHours, setResetHours] = useState("");
    const [resetMinutes, setResetMinutes] = useState("");
    const [timeErrorMessage, setTimeErrorMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatResetTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const deleteResetTime = (index) => {
        const updatedResetArray = [...resetTimeArray.slice(0, index), ...resetTimeArray.slice(index + 1)];
        setResettingTimes(updatedResetArray);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetchAddHabit(habitName, habitDesc, resetTimeArray, token);
            const responseJSON = await response.json();

            if (!response.ok) { 
                handleResponseError(response, responseJSON, navigate, setToken, setErrorMessage); 
                setIsSubmitting(false);
                return; 
            }

            // Limpiar formulario
            setHabitName("");
            setHabitDesc("");
            setResettingTimes([]);
            setResetHours("");
            setResetMinutes("");
            setTimeErrorMessage(null);
            
            // Actualizar lista de hábitos
            props.setLoadHabits(!props.loadHabits);
            
            // Cerrar modal
            if (props.toggle) {
                props.toggle();
            }

        } catch (err) {
            console.error("Error adding habit:", err);
            setErrorMessage("Failed to create habit. Please try again.");
            navigate("/internal-server-error", { 
                state: { errorMessage: "Server down. Please, try again later" } 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetTimeAdding = (e) => {
        e.preventDefault();
        const hours = Number(resetHours);
        const minutes = Number(resetMinutes);
        
        if (hours >= 0 && hours <= 24 && minutes >= 0 && minutes <= 59) {
            const resetAtUnix = ((hours * 60) * 60) + (minutes * 60);

            if (resetTimeArray.includes(resetAtUnix)) {
                setTimeErrorMessage("This time has already been added!");
                setTimeout(() => setTimeErrorMessage(null), 3000);
                return;
            }

            setTimeErrorMessage(null);
            const updatedResetArray = [...resetTimeArray, resetAtUnix].sort((a, b) => a - b);
            setResettingTimes(updatedResetArray);
            setResetHours("");
            setResetMinutes("");
        } else {
            setTimeErrorMessage("Invalid time! Hours: 0-24, Minutes: 0-59");
            setTimeout(() => setTimeErrorMessage(null), 3000);
        }
    };

    const handleClose = () => {
        if (props.toggle && !isSubmitting) {
            props.toggle();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                                <Plus className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    New Habit
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    Build a new daily routine
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                            type="button"
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                                <p className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                                <p className="text-red-500/80 dark:text-red-400/80 text-sm mt-1">
                                    Please check your inputs and try again
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Habit Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Habit Name *
                            </label>
                            <input
                                type="text"
                                value={habitName}
                                onChange={(e) => setHabitName(e.target.value)}
                                required
                                placeholder="e.g., Morning Exercise, Reading, Meditation"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={habitDesc}
                                onChange={(e) => setHabitDesc(e.target.value)}
                                placeholder="Describe your habit and why it's important..."
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Reset Time Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reset Times (24h format)
                                </label>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock size={12} />
                                    <span>Daily reset</span>
                                </div>
                            </div>

                            {timeErrorMessage && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">{timeErrorMessage}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="number"
                                        value={resetHours}
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (value === "" || (Number(value) >= 0 && Number(value) <= 24)) {
                                                setResetHours(value);
                                            }
                                        }}
                                        placeholder="HH"
                                        min="0"
                                        max="24"
                                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-medium"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Hours</p>
                                </div>
                                
                                <div className="flex items-center justify-center">
                                    <span className="text-gray-400 text-xl">:</span>
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        value={resetMinutes}
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (value === "" || (Number(value) >= 0 && Number(value) <= 59)) {
                                                setResetMinutes(value);
                                            }
                                        }}
                                        placeholder="MM"
                                        min="0"
                                        max="59"
                                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-medium"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Minutes</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={resetTimeAdding}
                                disabled={isSubmitting || !resetHours || !resetMinutes}
                                className="w-full py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={18} />
                                Add Reset Time
                            </button>
                        </div>

                        {/* Added Times List */}
                        {resetTimeArray.length > 0 && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Added Times
                                </label>
                                <div className="space-y-2">
                                    {resetTimeArray.map((time, index) => (
                                        <div
                                            key={`${time}-${index}`}
                                            className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                    <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                                                </div>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                                    {formatResetTime(time)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => deleteResetTime(index)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Info Note */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-blue-800 dark:text-blue-300 text-sm font-medium mb-1">
                                        About Reset Times
                                    </p>
                                    <p className="text-blue-700/80 dark:text-blue-400/80 text-xs">
                                        Habit completion will reset at these times daily. Add multiple times for flexible tracking.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !habitName.trim()}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating Habit...
                                </>
                            ) : (
                                <>
                                    <Calendar size={20} />
                                    Create Habit
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHabitWindow;