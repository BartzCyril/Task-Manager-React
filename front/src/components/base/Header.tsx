import {Link} from "react-router";
import {useUserStore} from "../../store.ts";
import {Role} from "../../types/types.ts";

type HeaderLinkProps = {
    to: string;
    description: string;
}

const HeaderLink = ({to, description}: HeaderLinkProps) => {
    return (
        <Link to={to}
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
            <p>{description}</p>
        </Link>
    )
}

const Header = () => {
    const user = useUserStore().user;

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to={"/"} className={"flex"}>
                        <img src="/logo.png" className="mr-3 h-6 sm:h-9"
                             alt="Projet Logo"/>
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Dumb Task Manager</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        {!user &&
                            <>
                                <HeaderLink to={"/login"} description={"Connexion"} />
                                <HeaderLink to={"/register"} description={"Inscription"} />
                            </>
                        }
                        {user && <p className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Bonjour {user.username}</p>}
                        <HeaderLink to={"/task/create"} description={"Ajouter une tâche"} />
                        {user && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) && <HeaderLink to={"/admin"} description={"Admin"} />}
                        {user && <HeaderLink to={"/logout"} description={"Déconnexion"} />}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header