import BasicLayout from "../layouts/BasicLayout";
import { Icon } from "semantic-ui-react";
import { useState,useEffect } from "react";
import { size,forEach } from "lodash";
import { getFavoriteListApi } from "../api/favorite";
import useAuth from "../hooks/useAuth";
import { Loader } from "semantic-ui-react";
import ListProducts from "../components/listProducts";
import Seo from "../components/Seo";

export default function wishlists() {
    const [ products,setProducts ] = useState(null);
    const { auth,logout } = useAuth();
    
    // console.log(products);

    useEffect(() => {
        (async() => {
            const response = await getFavoriteListApi(auth.idUser,logout);
            if(size(response)>0) //llegan productos
            {
                const productList = [];
                forEach(response, (data) => {
                    productList.push(data.product) //por cada interacción te devuelve el objeto product
                });
                setProducts(productList);
            }
            else
            {
                setProducts([]); //array vacio en caso de que no llege ningún producto
            }
        })()
    }, [])

    return (
        <BasicLayout className="wishlist">
            <Seo
                title="GameWorks"
            />    
            <div className="wishlist__block">
                <div className="title">
                    <Icon className="icono" name="star outline"/>
                    Lista de deseos</div>
                <div className="data">
                    {!products && <Loader active>Cargando...</Loader>}
                    {products && size(products) === 0 && (
                        <div className="data__not">
                            <h3>No tienes ningún producto en tu lista</h3>
                            <h3>Pulsa en el icono de la estrella</h3><Icon className="icono" size="big" name="star outline"/><h3>para añadir el articulos a tu lista de deseos</h3>
                        </div>
                    )}
                    {size(products) > 0 && (
                        <ListProducts products={products} />
                    )}
                </div>
            </div>
        </BasicLayout>
    );
}