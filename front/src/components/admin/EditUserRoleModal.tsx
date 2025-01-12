import {useNavigate} from "react-router";
import {AuthStatus, Role, User} from "../../types/types.ts";
import {useContext, useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useTaskStore, useUserStore} from "../../store.ts";
import {api} from "../../api/api.ts";
import {toast} from "react-toastify";
import Spinner from "../spinner/Spinner.tsx";
import Modal from 'react-modal';
import {ThemeContext} from "../../context/Theme.tsx";

type EditUserRoleModalProps = {
    modalIsOpen: boolean;
    setModalIsOpen: (modalIsOpen: boolean) => void;
    user: User;
    users: User[];
    setUsers: (users: User[]) => void;
}

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

type Inputs = {
    role: Role;
}

const EditUserRoleModal = ({modalIsOpen, setModalIsOpen, user, users, setUsers}: EditUserRoleModalProps) => {
    const [loading, setLoading] = useState(false);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const deleteAllTasks = useTaskStore(state => state.deleteAllTasks);
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<Inputs>();
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (user) {
            setValue("role", user.role);
        }
    }, [user]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(true);

        api('PUT', '/admin/user/role', {
            id: user.id,
            role: data.role
        })
            .then(() => {
                toast("Rôle modifié avec succès.", {type: "success", toastId: "update-role"});
                setModalIsOpen(false);
                const updatedUsers = users.map((u) =>
                    u.id === user.id
                        ? {...u, role: data.role}
                        : u
                );
                setUsers(updatedUsers);
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
            contentLabel="Modifier le rôle de l'utilisateur"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`flex flex-col gap-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} p-6 rounded`}
            >
                <h1 className="text-xl font-bold">Modifier le rôle de l'utilisateur</h1>
                <div className="flex flex-col gap-2">
                    <label htmlFor="role">Rôle</label>
                    <select
                        {...register("role", {required: "Ce champ est requis"})}
                        id="role"
                        className={`border rounded p-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    >
                        <option value={Role.USER}>Utilisateur</option>
                        <option value={Role.ADMIN}>Administrateur</option>
                        <option value={Role.SUPER_ADMIN}>Super administrateur</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => setModalIsOpen(false)}
                        className={`p-2 rounded ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className={`p-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    >
                        {loading ? <Spinner/> : "Modifier"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default EditUserRoleModal;
