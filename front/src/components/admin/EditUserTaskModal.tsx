import Modal from 'react-modal';
import {SubmitHandler} from "react-hook-form";
import {AuthStatus, TaskInputs, TypeTask} from "../../types/types.ts";
import {toast} from "react-toastify";
import {useContext, useState} from "react";
import {api} from "../../api/api.ts";
import TaskForm from "../form/TaskForm.tsx";
import {useTaskStore, useUserStore} from "../../store.ts";
import {useNavigate} from "react-router";
import {ThemeContext} from "../../context/Theme.tsx";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

type EditUserTaskModalProps = {
    modalIsOpen: boolean;
    setModalIsOpen: (modalIsOpen: boolean) => void;
    task: TypeTask;
    tasks: TypeTask[];
    setTasks: (tasks: TypeTask[]) => void;
}

const EditUserTaskModal = ({modalIsOpen, setModalIsOpen, task, tasks, setTasks}: EditUserTaskModalProps) => {
    const [loading, setLoading] = useState(false);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);
    const {theme} = useContext(ThemeContext);

    const onSubmit: SubmitHandler<TaskInputs> = (data) => {
        setLoading(true);

        api('PUT', '/todos', {
            id: task.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            user_id: task.user_id
        })
            .then(() => {
                toast("Tâche modifiée avec succès.", {type: "success", toastId: "update-task"});
                setModalIsOpen(false);
                const updatedTasks = tasks.map((t) =>
                    t.id === task.id
                        ? { ...t, title: data.title, description: data.description, completed: data.completed }
                        : t
                );
                setTasks(updatedTasks);
            })
            .catch((error) => {
                toast(error.message, {type: "error", toastId: "update-task"});
                if (error.message === AuthStatus.NOT_AUTHENTICATED) {
                    logout(false);
                    navigate("/");
                    deleteAllTasks();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={{
                ...customStyles,
                content: {
                    ...customStyles.content,
                    background: theme === 'dark' ? '#2d3748' : '#f7fafc',
                    color: theme === 'dark' ? 'white' : 'black',
                }
            }}
        >
            <TaskForm onSubmit={onSubmit} loading={loading} task={task} showCompleted={true}/>
        </Modal>
    );
}

export default EditUserTaskModal;