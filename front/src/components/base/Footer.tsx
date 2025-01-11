import {Link} from "react-router";
import {useContext} from "react";
import {ThemeContext} from "../../context/Theme.tsx";

const Footer = () => {
    const {theme} = useContext(ThemeContext);

    return (
        <footer className={`w-full pt-2 pb-2 shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} sm:text-center`}>
                © {new Date().getFullYear()} <Link to="/" className={`hover:underline ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Dumb Task Manager™</Link>. All Rights Reserved.
            </span>
        </footer>
    );
}

export default Footer;
