import React, { useState } from "react";
import { fetchDeleteHabit } from "../api_fetching/urlParserMainFucntionality";
import { useNavigate } from "react-router-dom";
import { handleResponseError } from "../utils/handleResponse";
import { defineCookiesToken } from "../utils/cookieHandling";
import {
  Trash2,
  AlertCircle,
  X,
  Check,
  Loader2
} from "lucide-react";

const DeleteHabit = (props) => {
    const [token, setToken] = defineCookiesToken();
    const navigate = useNavigate();
    const [pop, setPop] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const habit = props.habit;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsDeleting(true);
        
        try {
            const response = await fetchDeleteHabit(habit.habit_id, token);
            const responseJSON = await response.json();

            if (!response.ok) {
                handleResponseError(response, responseJSON, navigate, setToken);
                return;
            }

            // Actualizar el estado de hábitos correctamente
            const updatedHabits = props.habits.filter(h => h.habit_id !== habit.habit_id);
            props.setHabits(updatedHabits);
            
            // Actualizar contador
            props.setHabitsNumber(prev => prev - 1);
            
        } catch(err) {
            console.error("Error deleting habit:", err);
            navigate("/internal-server-error", { 
                state: { errorMessage: "Server down. Please, try again later" } 
            });
        } finally {
            setIsDeleting(false);
            setPop(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPop(false);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPop(true);
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Delete Button */}
            <button
                type="button"
                onClick={handleButtonClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 disabled:opacity-50"
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <Loader2 className="animate-spin" size={16} />
                ) : (
                    <>
                        <Trash2 size={16} />
                        Delete
                    </>
                )}
            </button>

            {/* Confirmation Modal */}
            {pop && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                                        <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Delete Habit
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCancel} 
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    type="button"
                                    disabled={isDeleting}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="text-center mb-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
                                        Habit Details
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        {habit.habit_name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {habit.habit_desc || "No description"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>This will permanently remove the habit and all its data</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>Progress tracking will be lost</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    type="button"
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    type="button"
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete Permanently
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteHabit;