import Input from "../input/Input.tsx";
import Spinner from "../spinner/Spinner.tsx";
import {useContext, useEffect} from "react";
import {ThemeContext} from "../../context/Theme.tsx";
import {useForm} from "react-hook-form";
import {TypeTask} from "../../types/types.ts";

type TaskFormProps = {
    onSubmit: any;
    loading: boolean;
    task: TypeTask | null;
    showCompleted?: boolean;
}

type Inputs = {
    title: string;
    description: string;
    completed: boolean;
};

const TaskForm = ({onSubmit, loading, task, showCompleted}: TaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<Inputs>({
        mode: "onChange"
    });

    useEffect(() => {
        if (task) {
            setValue("title", task.title);
            setValue("description", task.description);
            if (showCompleted)
                setValue("completed", task.completed);
        }
    }, [task]);

    const {theme} = useContext(ThemeContext);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`bg-white p-8 rounded-lg shadow-md w-96 ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
        >
            <h2 className={`text-2xl font-bold mb-6 text-center`}>
                {task ? `Modifier la tâche #${task.id}` : "Créer une tâche"}
            </h2>

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

            {showCompleted && <Input
                id={"completed"}
                label={"Complétion"}
                type={"checkbox"}
                placeholder={"Est-ce que la tâche est complétée ?"}
                register={register}
                errors={errors as any}
            />}

            <div className={"flex"}>
                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"}`}
                >
                    {task ? "Modifier" : "Créer"}
                </button>
                {loading && <Spinner/>}
            </div>
        </form>
    )
}

export default TaskForm;