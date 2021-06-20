import BasicLayout from "../layouts/BasicLayout";
import { useState,useEffect } from "react";
import useCart from "../hooks/useCart";
import { getProductByUrlApi } from "../api/product";
import { prepareDataForValidation } from "formik";
import SummaryCart from "../components/Cart/SummaryCart";
import AddressShipping from "../components/Cart/AddressShipping";
import Payment from "../components/Cart/Payment/Payment";
import Seo from "../components/Seo"; 

export default function Cart(){
    const { getProductCart } = useCart(); //devuelve la url de cada producto del carrito
    const products = getProductCart();

    if(!products)
    {
        return <EmptyCart/>;
    }
    else
    {
        return <ShowCart products={products}/>;
    }
}

function EmptyCart() {
    return (
        <BasicLayout>
            <Seo
                title="GameWorks"
            />
            <div className="empty-cart">
                <h2>Ningún producto en el carrito</h2>
            </div>
        </BasicLayout>
    );
}

function ShowCart(props) {
    const { products } = props;
    const[productsData,setProductsData] = useState(null);
    // console.log(productsData);
    const[reloadCart,setReloadCart] = useState(false);

    const[address,setAddress] = useState(null);

    // console.log(address);

    useEffect(() => {
        (async () => {
            const productsTemp = [] //obtener con la url los productos

            /*aqui vamos a realizar un for asincrono, el for asincronos ejectara los pasos uno a uno, pues si hicieramos un for comun
            al tener que hacer peticiones al SVGPathSegCurvetoQuadraticSmoothRel, si las hiciera todas a la vez se colgaria,
            para ello hacemos el for asincrono, este ejecutara las peticiones de una a una, la siguiente espera a que la anterior termine*/
            for await (const p of products)
            {
                const data = await getProductByUrlApi(p);
                productsTemp.push(data); //añadir a la array de productos
            }
            setProductsData(productsTemp);
        })();
        setReloadCart(false);
    }, [reloadCart]);

    return (
        <BasicLayout className="empty-cart">
            <Seo
                title="GameWorks"
            />
            <SummaryCart products={productsData} reloadCart={reloadCart} setReloadCart={setReloadCart} />
            <AddressShipping setAddress={setAddress}/>

            {address && <Payment products={products} address={address} />}
        </BasicLayout>
    );
}