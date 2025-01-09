import {SubmitHandler, useForm} from "react-hook-form";
import Input from "../components/input/Input.tsx";
import {useUserStore} from "../store.ts";
import {useEffect} from "react";
import {useNavigate} from "react-router";

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
        watch
    } = useForm<Inputs>({
        mode: "onChange"
    });

    const navigate = useNavigate();
    const isLogin = window.location.pathname === "/login";
    const user = useUserStore().user;

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    const auth = useUserStore(state => {
        return isLogin ? state.login : state.register;
    })

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    }

    const password = watch("password");

    return (
        <div className="flex justify-center items-center p-10 bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">{isLogin ? "Connexion" : "Inscription"}</h2>

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

                {!isLogin && <Input
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
                />}

                <Input
                    id="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    register={register}
                    validationRules={{
                        required: "Le mot de passe est obligatoire.",
                        minLength: {
                            value: 6,
                            message: "Le mot de passe doit contenir au moins 6 caractères.",
                        },
                    }}
                    errors={errors as any}
                />

                {!isLogin && <Input
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    register={register}
                    validationRules={{
                        required: "Le mot de passe est obligatoire.",
                        minLength: {
                            value: 6,
                            message: "Le mot de passe doit contenir au moins 6 caractères.",
                        },
                        validate: (value: string) => {
                            if (value !== password) {
                                return "Les mots de passe ne correspondent pas.";
                            }
                            return true;
                        },
                    }}
                    errors={errors as any}
                />}

                <button type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                    {isLogin ? "Se connecter" : "S'inscrire"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;