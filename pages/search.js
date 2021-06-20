import BasicLayout from "../layouts/BasicLayout";
import { useState,useEffect } from "react";
import { searchProductApi } from "../api/product";
import { useRouter } from "next/router";
import { size } from "lodash"; 
import ListProducts from "../components/listProducts";
import { Loader } from "semantic-ui-react";
import Seo from "../components/Seo";

export default function search() {
    const [products,setProduct] = useState(null);
    const { query } = useRouter();

    // console.log(query.query);

    useEffect(() => {
        document.getElementById("search-product").focus(); //linea con javascript, para no perder el foco
    }, []);

    useEffect(() => {
        (async () => {
            if(size(query.query) > 0) //si hay mas de una letra
            {
                const response = await searchProductApi(query.query);

                if(size(response)>0) //Si a encontrado algun valor
                {
                    setProduct(response);
                }
                else
                {
                    setProduct([]);
                }
            }
            else
            {
                setProduct([]);
            }
        })()
    }, [query]);

    return (
        <BasicLayout className="search">
            <Seo
                title={`Buscando: ${query.query}`}
            />
            {!products && <Loader active>Buscando...</Loader>}
            {products && size(products) === 0 && (
                <div>
                    <h3>Hemos buscado por todas partes, pero no hemos encontrado nada llamado: {query.query}</h3>
                </div>
            )}
            {size(products) > 0 && <ListProducts products={products} />}
        </BasicLayout>
    )
}