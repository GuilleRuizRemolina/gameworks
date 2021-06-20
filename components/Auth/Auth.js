import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Auth(props){
    const { onCloseModal, setTitleModal } = props;
    const [showLogin, setShowLogin] = useState(true);

    const showLoginForm = () =>
    {
        setTitleModal("Iniciar sesión en GameWorks");
        setShowLogin(true);
    }
    const showRegisterForm = () => 
    {
        setTitleModal("Crea tu cuenta en GameWorks");
        setShowLogin(false);
    }

    if(showLogin)
    {
        return (<LoginForm showRegisterForm={showRegisterForm} onCloseModal={onCloseModal}/>);
    }
    else
    {
        return (<RegisterForm showLoginForm={showLoginForm} onCloseModal={onCloseModal}/>);
    }
}