import { BASE_PATH } from "../utils/constants";

export async function getCategoriesApi() {
    try {
        const url = `${BASE_PATH}/categories`;
        const response = await fetch(url);

        // console.log("reponse:");
        // console.log(response);

        const result = await response.json();
        
        // console.log("result:");
        // console.log(result);

        return result;
        
    }
    catch (error)
    {
        console.log(error);
        return null;
    }
}