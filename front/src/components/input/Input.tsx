import {FieldError, UseFormRegister} from "react-hook-form";
import {useContext} from "react";
import {ThemeContext} from "../../context/Theme.tsx";

type InputProps = {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    register: UseFormRegister<any>;
    validationRules?: Record<string, any>;
    errors: Record<string, FieldError | undefined>;
}

const Input = ({
                   id,
                   label,
                   type,
                   placeholder,
                   register,
                   validationRules,
                   errors
               }: InputProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className={`block font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-600"
                }`}
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                } focus:ring-blue-400 focus:border-transparent ${
                    errors[id] ? "border-red-500" : ""
                }`}
                placeholder={placeholder}
                {...register(id, validationRules)}
            />
            {errors[id] && (
                <p className="text-red-500 text-sm mt-1">{errors[id]?.message}</p>
            )}
        </div>
    );
}

export default Input;