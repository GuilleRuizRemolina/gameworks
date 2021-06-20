import { TOKEN } from "../utils/constants";
import jwtDecode from "jwt-decode";

export function setToken(token){
    localStorage.setItem(TOKEN,token);
}

//recupera la token de localstorage
export function getToken() {
    return localStorage.getItem(TOKEN);
}

export function removeToken() {
    localStorage.removeItem(TOKEN);
}

export function hasExpiredToken(token){
    const tokenDecode = jwtDecode(token);
    const expiredDate = tokenDecode.exp * 1000; //propiedad que tiene el propio token
    const currentDate = new Date().getTime(); //sacar la fecha actual
    if(currentDate > expiredDate) //si la fecha acual es mayor a la fecha de expiracion
    {
        return true; //token expirado
    }
    else
    {
        return false; //token no expirado
    }
}