import { BASE_PATH,CART } from "../utils/constants";
import { toast } from "react-toastify";
import { size,includes,remove, add } from "lodash";
import { authFetch } from "../utils/fetch";

export function getProductCart() {
    const cart = localStorage.getItem(CART); //los productos se van a guardar en una variable en el local storage

    if(!cart)
    {
        return null;
    }
    else
    {
        const products = cart.split(","); //en el carrtio abra un string con el id de los productos
        return products;
    }
}

export function addProductCart(product) {
    const cart = getProductCart();

    if(!cart) //no hay productos en el carrito
    {
        localStorage.setItem(CART, product);
        toast.success("Este producto fue añadido al carrito");
    }
    else //ya hay productos en el carrito
    {
        //sacar productos, añadir el nuevo y setear el localStorage
        const productFound = includes(cart, product) //quiero que busques en cart si el producto que me llega esta ya añadido

        if(productFound)
        {
            toast.warning("Ya has añadido este producto al carrito");
        }
        else
        {
            cart.push(product);
            localStorage.setItem(CART,cart);
            toast.success("Este producto fue añadido al carrito");
        }
    }
}

export function countProductsCart() {
    const cart = getProductCart();

    if(!cart)
    {
        return 0;
    }
    else
    {
        return size(cart);
    }
}

export function removeProductCart(product)
{
    //Buscar el producto en localstorage y elminarlo

    const cart = getProductCart();

    //extraemos el producto que nos esta llegando
    remove(cart, (object) => {
        return object === product;
    }); 

    //si cart tiene mas de un producto, tenemos que mandarle a localStorage todos los productos menos el que estamos borrando
    if(size(cart) > 0)
    {
        localStorage.setItem(CART,cart);
    }
    else //si el carrito tiene un unico producto, borramos el carrito entero
    {
        localStorage.removeItem(CART);
    }
}

export async function paymentCartApi(token,products,idUser,address,logout)
{
    try{
        const addressShipping = address;

        // console.log(products.id);

        //borramos propiedades que no nos sirven
        delete addressShipping.user;
        delete addressShipping.createdAt;

        const url = `${BASE_PATH}/orders`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                token,
                products,
                idUser,
                addressShipping
            }),
        };

        const result = await authFetch(url, params, logout);
        return result;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

