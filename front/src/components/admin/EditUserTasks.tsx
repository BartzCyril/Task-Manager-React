import {useContext, useEffect, useState} from "react";
import Spinner from "../spinner/Spinner.tsx";
import {AuthStatus, TypeTask, User} from "../../types/types.ts";
import {ThemeContext} from "../../context/Theme.tsx";
import {api} from "../../api/api.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {useTaskStore, useUserStore} from "../../store.ts";
import EditUserTaskModal from "./EditUserTaskModal.tsx";

type EditUserTasksProps = {
    user: User,
    setEditUserTasks: (user: User | null) => void;
};

const EditUserTasks = ({user, setEditUserTasks}: EditUserTasksProps) => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<TypeTask[]>([]);
    const [task, setTask] = useState<TypeTask | null>(null);
    const {theme} = useContext(ThemeContext);
    const navigate = useNavigate();
    const logout = useUserStore(state => state.logout);
    const [open, setOpen] = useState(false);
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);

    useEffect(() => {
        api("GET", '/admin/tasks/user/', {}, user.id.toString())
            .then((result) => {
                if (result.data.length === 0) {
                    toast("Aucune tâche trouvée pour cet utilisateur.", {type: "info", toastId: "no-tasks"});
                    setEditUserTasks(null);
                } else {
                    setTasks(result.data);
                }
            })
            .catch((error) => {
                toast(error.message, {type: "error", toastId: "get-tasks"});
                if (error.message === AuthStatus.NOT_AUTHENTICATED) {
                    logout(false);
                    navigate("/");
                    deleteAllTasks();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <EditUserTaskModal modalIsOpen={open} setModalIsOpen={setOpen} task={task as TypeTask} tasks={tasks} setTasks={setTasks}/>

            <div className="text-center mb-4">
                <div className="flex justify-center align-middle gap-2">
                    <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Gestion des tâches de l'utilisateur {user.username}
                    </h1>
                    {loading && <Spinner/>}
                </div>
            </div>

            <div className={"flex justify-end mt-4 mb-4"}>
                <button
                    onClick={() => setEditUserTasks(null)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                >
                    Revenir à la liste des utilisateurs
                </button>
            </div>

            {!loading && <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 bg-white">
                    <thead className="text-xs text-gray-700 bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Titre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Complété
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (
                        <tr key={`task-${task.id}`} className="border-b bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {task.title}
                            </td>
                            <td className="px-6 py-4">
                                {task.description}
                            </td>
                            <td className="px-6 py-4">
                                {task.completed ? "Oui" : "Non"}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => {
                                        setTask(task);
                                        setOpen(true);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                                >
                                    Éditer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>}
        </>
    );
};

export default EditUserTasks;