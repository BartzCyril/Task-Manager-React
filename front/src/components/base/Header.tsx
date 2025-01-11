import {Link} from "react-router";
import {useTaskStore, useUserStore} from "../../store.ts";
import {AuthStatus, Role} from "../../types/types.ts";
import {useContext, useState} from "react";
import Spinner from "../spinner/Spinner.tsx";
import {toast} from "react-toastify";
import ToggleTheme from "./ToggleTheme.tsx";
import {ThemeContext} from "../../context/Theme.tsx";

type HeaderLinkProps = {
    to: string;
    description: string;
}

const HeaderLink = ({to, description}: HeaderLinkProps) => {
    const {theme} = useContext(ThemeContext);

    return (
        <Link
            to={to}
            className={`hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none 
            ${theme === 'dark' ? 'text-white hover:bg-gray-700 focus:ring-gray-800' : 'text-gray-800 hover:bg-gray-200 focus:ring-gray-300'}`}
        >
            <p>{description}</p>
        </Link>
    )
}

const Header = () => {
    const user = useUserStore(state => state.user);
    const logout = useUserStore(state => state.logout);
    const [loading, setLoading] = useState(false);
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);
    const {theme} = useContext(ThemeContext);

    return (
        <header>
            <nav className={`px-4 py-2.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to={"/"} className={"flex"}>
                        <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Projet Logo"/>
                        <span className={`self-center text-xl font-semibold whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            Dumb Task Manager
                        </span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        {!user &&
                            <>
                                <HeaderLink to={"/login"} description={"Connexion"}/>
                                <HeaderLink to={"/register"} description={"Inscription"}/>
                            </>
                        }
                        {user &&
                            <p className={`text-xs px-4 lg:px-5 py-2 lg:py-2.5 mr-2 rounded-lg font-medium ${theme === 'dark' ? 'text-white hover:bg-gray-700 focus:ring-gray-800' : 'text-gray-800 hover:bg-gray-200 focus:ring-gray-300'}`}>
                                Bonjour {user.username}
                            </p>
                        }
                        <HeaderLink to={"/task/create"} description={"Ajouter une tâche"}/>
                        {user && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) &&
                            <HeaderLink to={"/admin"} description={"Admin"}/>}
                        {user &&
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    logout()
                                        .then((result) => {
                                            if (typeof result === "string") {
                                                if (result === AuthStatus.NOT_AUTHENTICATED) {
                                                    logout(true);
                                                    toast("Déconnexion réussie", {type: "success"});
                                                } else {
                                                    toast(result, {type: "error"});
                                                }
                                            } else {
                                                toast("Déconnexion réussie", {type: "success"});
                                            }
                                        }).finally(() => {
                                        setLoading(false);
                                        deleteAllTasks();
                                    });
                                }}
                                className={`flex ${theme === 'dark' ? 'text-white hover:bg-gray-700 focus:ring-gray-800' : 'text-gray-800 hover:bg-gray-200 focus:ring-gray-300'} font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none`}
                            >
                                Déconnexion
                                {loading && <Spinner />}
                            </button>
                        }
                        <ToggleTheme />
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;
