import {SubmitHandler, useForm} from "react-hook-form";
import Input from "../components/input/Input.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import Spinner from "../components/spinner/Spinner.tsx";
import {toast} from "react-toastify";
import {AuthStatus, TypeTask} from "../types/types.ts";
import {useTaskStore, useUserStore} from "../store.ts";

type Inputs = {
    title: string;
    description: string;
};

const Task = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<Inputs>({
        mode: "onChange"
    });

    const id = useParams().id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
                setValue("title", task.title);
                setValue("description", task.description);
            }
        }
    }, [id]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
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
        <div className="flex justify-center items-center p-10 bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">{id ? `Modifier la tâche #${id}` : "Créer une tâche"}</h2>

                <Input
                    id="title"
                    label="Titre de la tâche"
                    type="text"
                    placeholder="Entrez le titre de la tâche"
                    register={register}
                    validationRules={{
                        required: "Le titre est obligatoire.",
                        minLength: {
                            value: 3,
                            message: "Le titre doit contenir au moins 3 caractères.",
                        },
                    }}
                    errors={errors as any}
                />

                <Input
                    id="description"
                    label="Description"
                    type="text"
                    placeholder="Entrez la description de la tâche"
                    register={register}
                    validationRules={{
                        required: "La description est obligatoire.",
                        minLength: {
                            value: 5,
                            message: "La description doit contenir au moins 5 caractères.",
                        },
                    }}
                    errors={errors as any}
                />

                <div className={"flex"}>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    >
                        {id ? "Modifier" : "Créer"}
                    </button>
                    {loading && <Spinner />}
                </div>
            </form>
        </div>
    );
};

export default Task;
