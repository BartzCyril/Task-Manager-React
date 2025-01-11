import {Link} from "react-router";
import {useTaskStore, useUserStore} from "../store.ts";
import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import Spinner from "../components/spinner/Spinner.tsx";
import {AuthStatus} from "../types/types.ts";
import {ThemeContext} from "../context/Theme.tsx";

function App() {
    const tasks = useTaskStore(state => state.tasks);
    const deleteTask = useTaskStore(state => state.deleteTask);
    const getTasks = useTaskStore(state => state.getTasks);
    const updateTasks = useTaskStore(state => state.updateTasks);
    const user = useUserStore(state => state.user);
    const [loading, setLoading] = useState(true);
    const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);
    const logout = useUserStore(state => state.logout);
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const {theme} = useContext(ThemeContext);

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy === "date") {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "completion") {
            if (a.completed === b.completed) {
                return 0;
            }
            return sortOrder === "asc"
                ? Number(a.completed) - Number(b.completed)
                : Number(b.completed) - Number(a.completed);
        }
        return 0;
    });

    useEffect(() => {
        getTasks(user !== null)
            .then((result) => {
                if (typeof result === "string") {
                    toast(result, {type: "error", toastId: "getTasks"});
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section style={{height: "calc(100% - 96px)"}} className={`overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className={`container mx-auto py-5`}>
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="text-center mb-4">
                            <div className="flex justify-center align-middle gap-2">
                                <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    Liste de Tâches
                                </h1>
                                {loading && <Spinner/>}
                            </div>
                            {!user && (
                                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                    Organisez vos tâches ! <Link to="/login" className="font-bold text-blue-500">
                                    Connectez-vous
                                </Link> pour enregistrer vos tâches de manière permanente. <br/>
                                    Si vous n'êtes pas connecté, vos tâches seront enregistrées temporairement dans
                                    le <strong>Local Storage</strong> de votre navigateur. Remarque : Le Local Storage
                                    conserve
                                    les données uniquement sur cet appareil. Si vous effacez votre navigateur ou changez
                                    d'appareil, vos tâches seront perdues.
                                </p>
                            )}
                        </div>

                        <div className="text-center mb-4">
                            <Link
                                to="/task/create"
                                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${theme === "dark" ? "hover:bg-green-400" : "hover:bg-green-600"}`}
                            >
                                Ajouter une Tâche
                            </Link>
                        </div>

                        {sortedTasks.length > 1 && (
                            <div className="mb-8 mt-8 flex justify-between">
                                <div>
                                    <label htmlFor="sortBy"
                                           className={`mr-2 font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        Trier par :
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="py-2 px-3 rounded border"
                                        id="sortBy"
                                    >
                                        <option value="date">Date de création</option>
                                        <option value="completion">Statut de complétion</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sortOrder"
                                           className={`mr-2 font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        Ordre :
                                    </label>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="py-2 px-3 rounded border"
                                        id="sortOrder"
                                    >
                                        <option value="desc">Descendant</option>
                                        <option value="asc">Ascendant</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {!loading && (
                            <ul style={{height: "500px"}} className="list-none overflow-y-scroll scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                                {sortedTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`bg-white shadow-md rounded-lg p-4 mb-2 flex items-center justify-between ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-green-500 mr-4"
                                                checked={task.completed}
                                                onChange={() => {
                                                    updateTasks({
                                                        ...task,
                                                        completed: !task.completed,
                                                    }, user !== null)
                                                        .then((result) => {
                                                            if (typeof result === "string") {
                                                                if (result === AuthStatus.NOT_AUTHENTICATED) {
                                                                    toast("Session expirée, veuillez vous reconnecter.", {
                                                                        type: "error",
                                                                        toastId: "updateTask",
                                                                    });
                                                                    logout(false);
                                                                    deleteAllTasks();
                                                                } else {
                                                                    toast(result, {
                                                                        type: "error",
                                                                        toastId: "updateTask"
                                                                    });
                                                                }
                                                            } else {
                                                                toast(`Tâche ${task.title} modifiée avec succès`, {
                                                                    type: "success",
                                                                    toastId: "updateTask",
                                                                });
                                                            }
                                                        });
                                                }}
                                            />
                                            <div>
                                                <strong
                                                    className={task.completed ? "line-through text-gray-400" : "text-black"}
                                                >
                                                    {task.title}
                                                </strong>
                                                <p
                                                    className={`mt-1 ${task.completed ? "line-through text-gray-400" : "text-gray-600"}`}
                                                >
                                                    {task.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/task/update/${task.id}`}
                                                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm ${theme === "dark" ? "hover:bg-yellow-400" : "hover:bg-yellow-600"}`}
                                            >
                                                Editer
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    deleteTask(task.id, user !== null)
                                                        .then((result) => {
                                                            if (typeof result === "string") {
                                                                if (result === AuthStatus.NOT_AUTHENTICATED) {
                                                                    toast("Session expirée, veuillez vous reconnecter.", {
                                                                        type: "error",
                                                                        toastId: "deleteTask",
                                                                    });
                                                                    logout(false);
                                                                    deleteAllTasks();
                                                                } else {
                                                                    toast(result, {
                                                                        type: "error",
                                                                        toastId: "deleteTask"
                                                                    });
                                                                }
                                                            } else {
                                                                toast(`Tâche ${task.title} supprimée avec succès`, {
                                                                    type: "success",
                                                                    toastId: "deleteTask",
                                                                });
                                                            }
                                                        })
                                                        .finally(() => setDeleteTaskLoading(false));
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm flex"
                                            >
                                                Supprimer
                                                {deleteTaskLoading && <Spinner/>}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App
