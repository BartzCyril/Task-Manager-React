import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './pages/App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Header from "./components/base/Header.tsx";
import Footer from "./components/base/Footer.tsx";
import './css/index.css'
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import CreateTask from "./pages/CreateTask.tsx";
import UpdateTask from "./pages/UpdateTask.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={"/"} element={<App/>}/>
                <Route path={"/login"} element={<Auth/>}/>
                <Route path={"/register"} element={<Auth/>}/>
                <Route path={"/admin"} element={<Admin/>}/>
                <Route path={"*"} element={<NotFound/>}/>
                <Route path={"/task/create"} element={<CreateTask/>}/>
                <Route path={"/task/update/:id"} element={<UpdateTask/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </StrictMode>,
)
