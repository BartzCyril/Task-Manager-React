import {useEffect, useState} from "react";
import {Role, User} from "../types/types.ts";
import {api} from "../api/api.ts";
import {toast} from "react-toastify";
import Spinner from "../components/spinner/Spinner.tsx";
import {useUserStore} from "../store.ts";
import {useNavigate} from "react-router";

const Admin = () => {
    const [users, setUsers] = useState<User[]>([]);
    const user = useUserStore(state => state.user);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN)) {
            api("GET", "/admin")
                .then((result) => {
                    setUsers(result.data);
                }).catch((error) => {
                toast(error.message, {type: "error"});
            })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            toast("Vous n'êtes pas autorisé à accéder à cette page.", {type: "error"});
            setLoading(false);
            navigate("/");
        }
    }, []);

    return <div className="container mx-auto mt-5">
        <div className="flex justify-center">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-4">
                    <div className={"flex justify-center align-middle gap-2"}>
                        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
                        {loading && <Spinner/>}
                    </div>
                </div>

                {!loading && <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rôle
                            </th>
                            <th scope={"col"} className={"px-6 py-3"}>
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={`user-${user.id}`}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {user.id}
                                </th>
                                <td className="px-6 py-4">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    {user.role}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={"flex flex-col gap-1 justify-center align-middle"}>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                                            Gestion des tâches de l'utilisateur
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm flex">
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
    </div>

}

export default Admin;