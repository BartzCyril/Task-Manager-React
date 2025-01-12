import {useNavigate} from "react-router";
import {AuthStatus, Role, User} from "../../types/types.ts";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useTaskStore, useUserStore} from "../../store.ts";
import {api} from "../../api/api.ts";
import {toast} from "react-toastify";
import Spinner from "../spinner/Spinner.tsx";
import Modal from 'react-modal';

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
            style={customStyles}
            contentLabel="Modifier le rôle de l'utilisateur"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Modifier le rôle de l'utilisateur</h1>
                <div className="flex flex-col gap-2">
                    <label htmlFor="role">Rôle</label>
                    <select
                        {...register("role", {required: "Ce champ est requis"})}
                        id="role"
                        className="border border-gray-300 rounded p-2"
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
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        {loading ? <Spinner/> : "Modifier"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default EditUserRoleModal;