import {SubmitHandler, useForm} from "react-hook-form";
import Input from "../components/input/Input.tsx";
import {useUserStore} from "../store.ts";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import Spinner from "../components/spinner/Spinner.tsx";
import {toast} from "react-toastify";
import {ThemeContext} from "../context/Theme.tsx";

type Inputs = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset
    } = useForm<Inputs>({
        mode: "onChange"
    });

    const navigate = useNavigate();
    const isLogin = window.location.pathname === "/login";
    const user = useUserStore().user;
    const [loading, setLoading] = useState(false);
    const {theme} = useContext(ThemeContext);

    const validatePassword = (value: string) => {
        const errors: string[] = [];

        if (!/[a-z]/.test(value)) {
            errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
        }

        if (!/[A-Z]/.test(value)) {
            errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
        }

        if (!/\d/.test(value)) {
            errors.push("Le mot de passe doit contenir au moins un chiffre.");
        }

        if (!/[!@#$%^&*()_+=[\]{}|;:'",.<>?/~`]/.test(value)) {
            errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
        }

        if (errors.length > 0) {
            return errors;
        }

        return true;
    }

    const formattedErrors = (errors: Array<string>) => {
        return errors
            .map((error, index) => {
                let formattedError = error.replace(/\.$/, "");

                if (index > 0) {
                    formattedError = formattedError.charAt(0).toLowerCase() + formattedError.slice(1);
                }

                return formattedError;
            })
            .join(" et ");
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        } else {
            reset({
                email: "",
                username: "",
                password: "",
                confirmPassword: ""
            });
        }
    }, [location.pathname, user, reset])

    const authLogin = useUserStore((state) => state.login);
    const authRegister = useUserStore((state) => state.register);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(true);

        const {username, password, email, confirmPassword} = data;

        const authPromise = isLogin
            ? authLogin(username, password)
            : authRegister(email, username, password, confirmPassword);

        authPromise
            .then((result) => {
                if (typeof result === "boolean" && result) {
                    isLogin ? navigate("/") : navigate("/login");
                } else {
                    toast(result, {type: "error", toastId: "auth"});
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const password = watch("password");

    return (
        <div style={{height: "calc(100% - 136px)"}} className={`flex justify-center items-center p-10 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`bg-white p-8 rounded-lg shadow-md w-96 ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
            >
                <h2 className={`text-2xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                    {isLogin ? "Connexion" : "Inscription"}
                </h2>

                {!isLogin && (
                    <Input
                        id="email"
                        label="Adresse email"
                        type="email"
                        placeholder="Entrez votre email"
                        register={register}
                        validationRules={{
                            required: "L'adresse email est obligatoire.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Format de l'email invalide.",
                            },
                        }}
                        errors={errors as any}
                    />
                )}

                <Input
                    id="username"
                    label="Nom d'utilisateur"
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur"
                    register={register}
                    validationRules={{
                        required: "Le nom d'utilisateur est obligatoire.",
                        minLength: {
                            value: 3,
                            message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
                        },
                    }}
                    errors={errors as any}
                />

                <Input
                    id="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    register={register}
                    validationRules={{
                        required: "Le mot de passe est obligatoire.",
                        minLength: {
                            value: 8,
                            message: "Le mot de passe doit contenir au moins 8 caractères.",
                        },
                        validate: (value: string) => {
                            const errors = validatePassword(value);
                            if (Array.isArray(errors)) {
                                return formattedErrors(errors);
                            }
                            return true;
                        },
                    }}
                    errors={errors as any}
                />

                {!isLogin && (
                    <Input
                        id="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        register={register}
                        validationRules={{
                            required: "Le mot de passe est obligatoire.",
                            minLength: {
                                value: 8,
                                message: "Le mot de passe doit contenir au moins 8 caractères.",
                            },
                            validate: (value: string) => {
                                const errors = validatePassword(value);
                                if (value !== password) {
                                    if (Array.isArray(errors)) {
                                        errors.push("Les mots de passe ne correspondent pas.");
                                        return formattedErrors(errors);
                                    } else {
                                        return "Les mots de passe ne correspondent pas.";
                                    }
                                }
                                return true;
                            },
                        }}
                        errors={errors as any}
                    />
                )}

                <div className={"flex"}>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"}`}
                    >
                        {isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                    {loading && <Spinner/>}
                </div>

                {isLogin && (
                    <p className={`mt-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        Vous n'avez pas de compte ?
                        <Link to="/register" className="ml-2 text-blue-600 font-semibold hover:text-blue-700">
                            S'inscrire
                        </Link>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginForm;