import { useContext } from "react";
import { ThemeContext } from "../../context/Theme.tsx";

const ToggleTheme = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={theme === "light"}
                onChange={toggleTheme}
                className="sr-only peer"
            />
            <div
                className={`relative w-11 h-6 rounded-full peer focus:outline-none peer-focus:ring-4 transition-all 
                ${theme === 'dark' ? 'bg-gray-600 peer-focus:ring-blue-600' : 'bg-gray-200 peer-focus:ring-blue-300'} 
                peer-checked:bg-blue-600
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
            ></div>
            <span className={`ms-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            </span>
        </label>
    );
};

export default ToggleTheme;
