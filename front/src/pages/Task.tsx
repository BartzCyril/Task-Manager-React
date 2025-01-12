import {SubmitHandler} from "react-hook-form";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {toast} from "react-toastify";
import {AuthStatus, TaskInputs, TypeTask} from "../types/types.ts";
import {useTaskStore, useUserStore} from "../store.ts";
import {ThemeContext} from "../context/Theme.tsx";
import TaskForm from "../components/form/TaskForm.tsx";

const Task = () => {
    const {theme} = useContext(ThemeContext);
    const id = useParams().id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<TypeTask | null>(null);
    const tasks = useTaskStore(state => state.tasks);
    const updateTasks = useTaskStore(state => state.updateTasks);
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);
    const createTask = useTaskStore(state => state.createTask);
    const user = useUserStore(state => state.user);
    const logout = useUserStore(state => state.logout);

    useEffect(() => {
        if (id) {
            const task = tasks.find(task => task.id === +id);
            if (!task) {
                toast(`Tâche #${id} non trouvée`, {type: "error", toastId: "createTask"});
                navigate("/");
            } else {
                setTask(task);
            }
        }
    }, [id]);

    const onSubmit: SubmitHandler<TaskInputs> = (data) => {
        setLoading(true);

        let taskData: Partial<TypeTask> = { title: data.title, description: data.description };

        if (id) {
            const task = tasks.find(task => task.id === +id);
            if (task) {
                taskData = { ...taskData, id: task.id, completed: task.completed, user_id: task.user_id };
            }
        }

        const fn = id ? updateTasks : createTask;

        fn(taskData as TypeTask, user !== null)
            .then((result) => {
                if (typeof result === "string") {
                    if (result === AuthStatus.NOT_AUTHENTICATED) {
                        logout(true);
                        deleteAllTasks();
                        toast("Session expirée, veuillez vous reconnecter.", { type: "error", toastId: "createTask" });
                        navigate("/login");
                    } else {
                        toast(result, { type: "error", toastId: "createTask" });
                    }
                } else {
                    toast(`Tâche ${data.title} ${id ? "mise à jour" : "créée"} avec succès`, { type: "success", toastId: "createTask" });
                    navigate("/");
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <section style={{height: "calc(100% - 96px)"}} className={`flex justify-center items-center p-10 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <TaskForm onSubmit={onSubmit} loading={loading} task={task}/>
        </section>
    );
};

export default Task;
