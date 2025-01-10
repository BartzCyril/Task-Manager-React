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
import Task from "./pages/Task.tsx";
import { ToastContainer } from 'react-toastify';
import ThemeProvider from "./context/Theme.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <Header/>
                <Routes>
                    <Route path={"/"} element={<App/>}/>
                    <Route path={"/login"} element={<Auth/>}/>
                    <Route path={"/register"} element={<Auth/>}/>
                    <Route path={"/admin"} element={<Admin/>}/>
                    <Route path={"*"} element={<NotFound/>}/>
                    <Route path={"/task/create"} element={<Task/>}/>
                    <Route path={"/task/update/:id"} element={<Task/>}/>
                </Routes>
                <ToastContainer aria-label={""} closeButton={true} position={"bottom-center"}/>
                <Footer/>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
)
