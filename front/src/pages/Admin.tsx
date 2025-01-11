import {useEffect, useState} from "react";
import EditUserTasks from "../components/admin/EditUserTasks.tsx";
import EditUser from "../components/admin/EditUser.tsx";
import {Role, User} from "../types/types.ts";
import {useUserStore} from "../store.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

const Admin = () => {
    const [editUserTasks, setEditUserTasks] = useState<User | null>(null);
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
            toast("Vous n'êtes pas autorisé à accéder à cette page.", {type: "error", toastId: "not-authorized"});
            navigate("/");
        }
    }, [user]);

    return (
        <div style={{height: "calc(100% - 96px)"}} className="container mx-auto">
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    {editUserTasks !== null ? <EditUserTasks user={editUserTasks} setEditUserTasks={setEditUserTasks}/> : <EditUser setEditUserTasks={setEditUserTasks}/>}
                </div>
            </div>
        </div>
    );
}

export default Admin;