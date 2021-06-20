import { BASE_PATH } from "../utils/constants";

export async function getLastProductsApi(limit)
{
    try{
        const limitItems = `_limit=${limit}`;
        const shortItems = "_sort=createdAt:desc"

        const url = `${BASE_PATH}/products?${limitItems}&${shortItems}`; 

        const response = await fetch(url);
        const result = await response.json();

        return result;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function getProductsByCategoryApi(category,limit,start)
{
    // ve a la coleccion de productos, busca todos los productos que tengan en el parametro category, dentro de category en
    // url, que tenga el category especifico a mostrar
    try{
        const limitItems = `_limit=${limit}`; 
        const sortItems = `_sort=createdAt:desc`; //ordena por orden de creacion
        const startItems = `_start=${start}`; //desde que item se empieza, para la paginación

        const url =`${BASE_PATH}/products?category.url=${category}&${limitItems}&${sortItems}&${startItems}`;

        const response = await fetch(url);
        const result = await response.json();
        return result;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

//obtener el numero total de juegos de una categoria
export async function getTotalProducstsCategoryApi(category)
{
    try{
        const url = `${BASE_PATH}/products/count?category.url=${category}`;
        const response = await fetch(url);
        const result = await response.json();
        return result;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function getProductByUrlApi(path)
{
    try{
        const url = `${BASE_PATH}/products?url=${path}`;

        const response = await fetch(url);
        
        const result = await response.json();
        
        return result[0]; //el item 0, pues en el array nunca nos va a devovler mas de un elemento, peus la url es unica
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export async function searchProductApi(title)
{
    try{
        // _q es para buscar una query
        const url= `${BASE_PATH}/products?_q=${title}`;
        const response = await fetch(url);
        const result = await response.json();
        
        return result; 
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}