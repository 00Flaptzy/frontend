import React, { useEffect, useState } from "react";
import { defineColorTheme } from "../utils/cookieHandling";
import { IoMoon, IoSunny } from "react-icons/io5";

const ThemeToggler = () => {
  let [darkTheme, toggleDarkTheme] = defineColorTheme();
  const [darkThemeState, setDarkThemeState] = useState(darkTheme);

  const handleToggleTheme = () => {
    toggleDarkTheme();
    setDarkThemeState(!darkThemeState);
  };

  useEffect(() => {
    // Dark mode suave (NO negro puro)
    document.documentElement.classList.toggle("dark", darkThemeState);

    document.documentElement.style.backgroundColor = darkThemeState
      ? "#0f172a" // slate-900
      : "#f8fafc"; // slate-50
  }, [darkThemeState]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleToggleTheme}
        className="
          w-14 h-14
          flex items-center justify-center
          rounded-2xl
          bg-white/80 backdrop-blur-md
          shadow-lg shadow-slate-300/40
          hover:scale-105 transition-all
          dark:bg-slate-800/80
          dark:shadow-slate-900/50
        "
        aria-label="Toggle theme"
      >
        {darkThemeState ? (
          <IoSunny className="text-yellow-400 text-2xl" />
        ) : (
          <IoMoon className="text-slate-600 text-2xl" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggler;
