import {Link} from "react-router";
import {useTodoStore} from "../store.ts";
import {useEffect} from "react";

function App() {
    const {todos, getTodos, updateTodos, deleteTodo} = useTodoStore();

    useEffect(() => {
        getTodos(true);
    }, []);

    return (
        <div className="container mx-auto mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Liste de Tâches</h1>
                        <p className="text-gray-500">
                            Organisez vos tâches ! <Link to={"/login"}
                                                         className="font-bold text-blue-500">Connectez-vous</Link> pour
                            enregistrer vos tâches de manière permanente. <br/>
                            Si vous n'êtes pas connecté, vos tâches seront enregistrées temporairement dans le <strong>Local
                            Storage</strong> de votre navigateur. Remarque : Le Local Storage conserve les données
                            uniquement sur cet appareil. Si vous effacez votre navigateur ou changez d'appareil, vos
                            tâches seront perdues.
                        </p>
                    </div>

                    <div className="text-center mb-4">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                data-bs-toggle="modal" data-bs-target="#addTaskModal">
                            Ajouter une Tâche
                        </button>
                    </div>

                    <ul className="list-none">
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="bg-white shadow-md rounded-lg p-4 mb-2 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-green-500 mr-4"
                                        checked={todo.completed}
                                        onChange={() => {
                                            updateTodos({id: todo.id, completed: !todo.completed}, true);
                                        }}
                                    />
                                    <div>
                                        <strong
                                            className={
                                                todo.completed
                                                    ? "line-through text-gray-400"
                                                    : "text-black"
                                            }
                                        >
                                            {todo.title}
                                        </strong>
                                        <p
                                            className={
                                                `mt-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-600"}`
                                            }
                                        >
                                            {todo.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link to={`/task/update/${todo.id}`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                                        Editer
                                    </Link>
                                    <button
                                        onClick={() => deleteTodo(todo.id, true)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm">
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default App
