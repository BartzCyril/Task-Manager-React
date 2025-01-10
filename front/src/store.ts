import {create} from "zustand/react";
import {TypeTask, User} from "./types/types.ts";
import {api} from "./api/api.ts";
import {createJSONStorage, persist} from "zustand/middleware";

type TaskStore = {
    tasks: Array<TypeTask>;
    updateTasks: (todo: TypeTask, callServer: boolean) => Promise<true | string>;
    createTask: (todo: TypeTask, callServer: boolean) => Promise<true | string>;
    getTasks: (callServer: boolean) => Promise<true | string>;
    deleteTask: (id: number, callServer: boolean) => Promise<true | string>;
    deleteAllTasks: () => void;
};

export const useTaskStore = create(
    persist<TaskStore>(
        (set, get) => ({
            tasks: [],
            async getTasks(callServer) {
                try {
                    if (callServer) {
                        const tasks = await api('GET', '/todos');
                        set({tasks: tasks.data});
                        return true;
                    }
                } catch (error: any) {
                    return error.message;
                }
            },

            async createTask(newTodo, callServer) {
                try {
                    if (callServer) {
                        const task = await api('POST', '/todos', newTodo);
                        set({tasks: [...get().tasks, task.data]});
                        return true;
                    } else {
                        const lastId = get().tasks.length > 0 ? get().tasks[get().tasks.length - 1].id : 0;
                        set({
                            tasks: [...get().tasks, {
                                title: newTodo.title,
                                description: newTodo.description,
                                id: lastId + 1,
                                completed: false,
                                user_id: 0,
                                created_at: new Date()
                            }]
                        });
                        return true;
                    }
                } catch (error: any) {
                    return error.message;
                }
            },

            async updateTasks(newTodo, callServer) {
                try {
                    if (callServer) {
                        const updatedTask = await api('PUT', '/todos', newTodo);
                        const newTasks = get().tasks.map((task) => {
                            if (task.id === newTodo.id) {
                                return updatedTask.data;
                            }
                            return task;
                        });
                        set({tasks: newTasks});
                        return true;
                    } else {
                        const newTasks = get().tasks.map((task) => {
                            if (task.id === newTodo.id) {
                                return {...task, ...newTodo};
                            }
                            return task;
                        });
                        set({tasks: newTasks});
                        return true;
                    }
                } catch (error: any) {
                    return error.message;
                }
            },

            async deleteTask(id, callServer) {
                try {
                    const newTasks = get().tasks.filter((task) => task.id !== id);
                    if (callServer) {
                        await api('DELETE', `/todos/${id}`);
                    }
                    set({tasks: newTasks});
                } catch (error: any) {
                    return error.message;
                }
            },

            deleteAllTasks() {
                set({tasks: []});
            }
        }),
        {
            name: 'tasks'
        }
    )
);

type UserStore = {
    user: User | null;
    login(username: string, password: string): Promise<true | string>;
    register(email: string, username: string, password: string, confirmPassword: string): Promise<true | string>;
    logout(callServer?: boolean): Promise<true | string>;
};

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,

            async login(username, password) {
                try {
                    const result = await api('POST', '/auth/login', {
                        username,
                        password,
                        todos: useTaskStore.getState().tasks
                    });
                    const user = result.data;
                    set(() => ({user}));
                    return true;
                } catch (error: any) {
                    return error.message;
                }
            },

            async register(email, username, password, confirmPassword) {
                try {
                    await api('POST', '/auth/register', {email, username, password, confirmPassword});
                    return true;
                } catch (error: any) {
                    return error.message;
                }
            },

            async logout(callServer = true) {
                try {
                    if (callServer)
                        await api('GET', '/auth/logout');
                    set(() => ({user: null}));
                    return true;
                } catch (error: any) {
                    return error.message;
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

