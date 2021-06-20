import { getToken,hasExpiredToken } from '../api/token';

export async function authFetch(url,params,logout)
{
    const token = getToken();
    if(!token) //usuario no logeado o no ha recogido el token
    {
        logout();
    }
    else
    {
        if(hasExpiredToken(token)) //si el token a caducado
        {
            logout();
        }
        else
        {
            const paramsTemp = {
                ...params,
                headers: {
                    ...params?.headers,
                    Authorization: `Bearer ${token}` //standar de autorización de headers
                },
            };

            try{
                const response = await fetch(url,paramsTemp);
                const result = await response.json();
                return result;
            }
            catch(error)
            {
                console.log(error);
                return error;
            }
        }
    }
}