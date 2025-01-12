import {useContext, useEffect, useState} from "react";
import EditUserTasks from "../components/admin/EditUserTasks.tsx";
import EditUser from "../components/admin/EditUser.tsx";
import {Role, User} from "../types/types.ts";
import {useUserStore} from "../store.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {ThemeContext} from "../context/Theme.tsx";

const Admin = () => {
    const [editUserTasks, setEditUserTasks] = useState<User | null>(null);
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
            toast("Vous n'êtes pas autorisé à accéder à cette page.", {type: "error", toastId: "not-authorized"});
            navigate("/");
        }
    }, [user]);

    return (
        <section style={{height: "calc(100% - 96px)"}} className={`p-5 flex justify-center items-start w-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    {editUserTasks !== null ? <EditUserTasks user={editUserTasks} setEditUserTasks={setEditUserTasks}/> : <EditUser setEditUserTasks={setEditUserTasks}/>}
                </div>
            </div>
        </section>
    );
}

export default Admin;