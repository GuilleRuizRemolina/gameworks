import { createContext } from "react";

const AuthContext = createContext({
    auth: undefined,
    login: () => null, //para logearse
    logout: () => null, //para deslogearse
    setReloadUser: () => null, //recarga la aplicacion completa
});

export default AuthContext;
