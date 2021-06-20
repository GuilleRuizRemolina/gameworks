import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/fetch";
import { size } from "lodash";

export async function isFavoriteApi(idUser,idProduct,logout)
{
    try {
        //si se cumplen estas dos condiciones siginfica que el usuario a añadido este juego a su lista de favoritos
        const url = `${BASE_PATH}/favorites?user=${idUser}&product=${idProduct}`;
        return await authFetch(url,null,logout);
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function addFavoriteApi(idUser,idProduct,logout) {
    try{
        //comprobar si el producto esta en favortitos
        const dataFound = await isFavoriteApi(idUser,idProduct,logout);
        if(size(dataFound) > 0 || !dataFound) //el usuario tiene el producto en favoritos
        {
            return "Producto en favoritos";
        }
        else
        {
            const url=`${BASE_PATH}/favorites`;
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: idUser, product: idProduct }),
            };
            const result = await authFetch(url,params,logout);
            
            return result;
        }
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function removeFavoriteApi(idUser, idProduct, logout)
{
    try{
        const dataFound = await isFavoriteApi(idUser, idProduct, logout);
        if(size(dataFound)>0) //existe el producto
        {
            const url = `${BASE_PATH}/favorites/${dataFound[0]?._id}`; //producto que queremos eliminar de favoritos
            const params = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            };
            const result = authFetch(url,params,logout);
            return result;
        }
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function getFavoriteListApi(idUser,logout)
{
    try {
        const url = `${BASE_PATH}/favorites?user=${idUser}`;
        const result = await authFetch(url,null,logout);
        return result;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}