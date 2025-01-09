import { create } from "zustand/react";
import { Todo, User } from "./types/types.ts";
import { api } from "./api/api.ts";

type TodoStore = {
    todos: Array<Todo>;
    updateTodos: (todo: Partial<Todo>, inLocalStorage: boolean) => Promise<true | string>;
    getTodos: (inLocalStorage: boolean) => Promise<true | string>;
    deleteTodo: (id: number, inLocalStorage: boolean) => Promise<true | string>;
};

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],

    async getTodos(inLocalStorage) {
        try {
            if (inLocalStorage) {
                const todos = localStorage.getItem('todos');
                if (todos) {
                    set(() => ({ todos: JSON.parse(todos) }));
                }
                return true;
            } else {
                const todos = await api('GET', "/todos");
                set(() => ({ todos }));
                return true;
            }
        } catch (error: any) {
            return error.message;
        }
    },

    async updateTodos(newTodo, inLocalStorage) {
        try {
            if (inLocalStorage) {
                const newTodos = useTodoStore.getState().todos.map((todo) =>
                    todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
                );
                localStorage.setItem('todos', JSON.stringify(newTodos));
                set(() => ({ todos: newTodos }));
                return true;
            } else {
                const result = await api('POST', '/todos', newTodo);
                const newTodos = [...useTodoStore.getState().todos, result.data];
                set(() => ({ todos: newTodos }));
                return true;
            }
        } catch (error: any) {
            return error.message;
        }
    },

    async deleteTodo(id, inLocalStorage) {
        try {
            const newTodos = [...useTodoStore.getState().todos].filter((todo) => todo.id !== id);
            if (inLocalStorage) {
                localStorage.setItem('todos', JSON.stringify(newTodos));
                set(() => ({ todos: newTodos }));
                return true;
            } else {
                await api('DELETE', `/todos/${id}`);
                set(() => ({ todos: newTodos }));
                return true;
            }
        } catch (error: any) {
            return error.message;
        }
    },
}));

type UserStore = {
    user: User | null;
    login(email: string, password: string): Promise<true | string>;
    register(email: string, username: string, password: string, confirmPassword: string): Promise<true | string>;
    logout(): Promise<true | string>;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,

    async login(email, password) {
        try {
            const result = await api('POST', '/auth/login', { email, password });
            set(() => ({ user: result.data }));
            return true;
        } catch (error: any) {
            return error.message;
        }
    },

    async register(email, username, password, confirmPassword) {
        try {
            await api('POST', '/auth/register', { email, username, password, confirmPassword });
            return true;
        } catch (error: any) {
            return error.message;
        }
    },

    async logout() {
        try {
            await api('GET', '/auth/logout');
            set(() => ({ user: null }));
            return true;
        } catch (error: any) {
            return error.message;
        }
    },
}));
