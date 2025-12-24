import React from "react";
import { useContext, useState } from "react";
import tokenContext from "../tokenContext";
import { fetchAddHabit } from "../api_fetching/urlParserMainFucntionality"
import AddHabitWindow from "./addHabitWindow"
import "../index.css"

const AddHabitButton = (props) => {
    const [ seen, setSeen ] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };

    return(
        <div>
            <button 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2" 
                onClick={togglePop}
            >
                <span className="text-xl">+</span>
                <span>Add Habit</span>
            </button>
            {seen && (
                <AddHabitWindow 
                    toggle={() => setSeen(false)}
                    loadHabits={props.loadHabits}
                    setLoadHabits={props.setLoadHabits}
                />
            )}
        </div>
    );
};

export default AddHabitButton;