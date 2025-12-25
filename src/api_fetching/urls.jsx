// =========================
// urls.jsx
// =========================

const BASE_URL = process.env.REACT_APP_BASE_URL;

// =========================
// AUTHORIZATION
// =========================
export const testURL = `${BASE_URL}/auth/`; // prueba
export const loginURL = `${BASE_URL}/auth/login`;
export const registerURL = `${BASE_URL}/auth/register`;
export const logoutURL = `${BASE_URL}/auth/logout`;
export const getUserProfileURL = `${BASE_URL}/auth/get_user_profile`;
export const changeUsernameURL = `${BASE_URL}/auth/change_username`;
export const changePasswordURL = `${BASE_URL}/auth/change_password`;
export const checkTokenExpiery = `${BASE_URL}/auth/check_token`;

// =========================
// MAIN FUNCTIONALITY - HABITS
// =========================
export const addHabitURL = `${BASE_URL}/habits/add_habit`;
export const getHabitsURL = `${BASE_URL}/habits/get_habits`;
export const habitCompletionURL = `${BASE_URL}/habits/habit_completion`;
export const deleteHabitURL = `${BASE_URL}/habits/delete_habit`;
export const getHabitCompletionsURL = `${BASE_URL}/habits/get_habit_completions`;
export const getAllCompletionsURL = `${BASE_URL}/habits/get_all_completions`;
export const uncompleteHabitURL = `${BASE_URL}/habits/uncomplete_habit`;

// =========================
// UTILS
// =========================
export const getUNIXFromMidnightURL = `${BASE_URL}/utils/get_UNIX_from_midnight`;
