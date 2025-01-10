import {useContext, useEffect, useState} from "react";
import {Role, User} from "../types/types.ts";
import {api} from "../api/api.ts";
import {toast} from "react-toastify";
import Spinner from "../components/spinner/Spinner.tsx";
import {useUserStore} from "../store.ts";
import {useNavigate} from "react-router";
import {ThemeContext} from "../context/Theme.tsx";

const Admin = () => {
    const [users, setUsers] = useState<(User & { is_admin: boolean })[]>([]);
    const user = useUserStore(state => state.user);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const {theme} = useContext(ThemeContext);
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
    }, [user]);

    const deleteUser = (id: number, username: string) => {
        api("DELETE", `/admin/`, {}, id.toString())
            .then(() => {
                setUsers(users.filter((user) => user.id !== id));
                toast(`L'utilisateur ${username} a été supprimé avec succès.`, {type: "success"});
            }).catch((error) => {
            toast(error.message, {type: "error"});
        }).finally(() => {
            setDeleting(false);
        });
    }

    return (
        <div style={{height: "calc(100% - 136px)"}} className="container mx-auto mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-4">
                        <div className="flex justify-center align-middle gap-2">
                            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Gestion des utilisateurs
                            </h1>
                            {loading && <Spinner/>}
                        </div>
                    </div>

                    {!loading && (
                        <div className="relative overflow-x-auto">
                            <table
                                className={`w-full text-sm text-left rtl:text-right ${theme === "dark" ? "text-gray-400 bg-gray-800" : "text-gray-500 bg-white"}`}>
                                <thead
                                    className={`text-xs ${theme === "dark" ? "text-gray-400 bg-gray-700" : "text-gray-700 bg-gray-50"}`}>
                                <tr>
                                    <th scope="col" className="px-6 py-3">Id</th>
                                    <th scope="col" className="px-6 py-3">Username</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Rôle</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user: any) => (
                                    <tr key={`user-${user.id}`}
                                        className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                                        <th scope="row"
                                            className={`px-6 py-4 font-medium whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                            {user.id}
                                        </th>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.is_admin ? "Admin" : "Utilisateur"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 justify-center align-middle">
                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                                                    Gestion des tâches de l'utilisateur
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleting(true);
                                                        deleteUser(user.id, user.username);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm flex">
                                                    Supprimer
                                                    {deleting && <Spinner/>}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Admin;