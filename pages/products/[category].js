import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BasicLayout from "../../layouts/BasicLayout";
import { getProductsByCategoryApi,getTotalProducstsCategoryApi } from "../../api/product";
import { size } from "lodash";
import { Loader, loader } from "semantic-ui-react";
import ListProducts from "../../components/listProducts/ListProducts";
import Pagination from "../../components/Pagination";
import parse from "node-html-parser";
import Seo from "../../components/Seo"; 

const limitPorPag = 10;

export default function Category()
{
    const { query } = useRouter();

    const [products,setProducts] = useState(null);
    // console.log(query);

    const [totalProducts,setTotalProducts] = useState(null);

    //function para obtener desde que item vamos a empezar
    const getStartItem = () => {
        //obtener la pagina actual
        const currentPag = parseInt(query.page);

        if(!query.page || currentPag === 1)
        {
            return 0;
        }
        else
        {
            //calcular porque item tiene que empezar
            return currentPag * limitPorPag - limitPorPag;
        }
    }

    //console.log(getStartItem());

    //peticion para obtener los productos por categoria
    useEffect(() => {
        (async () => {
            if(query.category) //para evitar que salga "No hay productos" durante un segundo aunqe los haya
            {
                const response = await getProductsByCategoryApi(query.category,limitPorPag,getStartItem());

                setProducts(response);
            }
        })()
    }, [query]); //para que se vuelva a ejecutar cuadno query sufra cambios

    //peticion para obtener el nuemro total de productos por categoria
    useEffect(() => {
        (async () => {
            const response = await getTotalProducstsCategoryApi(query.category);
            // console.log(response);
            setTotalProducts(response);

        })()
    }, [query]);

    return (
        <BasicLayout className="category">
            <Seo
                title="GameWorks"
            />
            {!products && <Loader active>Cargando...</Loader>}
            {products && size(products) === 0 && (
                <div>
                    <h3>No hay productos que mostrar...</h3>
                </div>
            )}
            {size(products) > 0 && (
                <ListProducts products={products} />
            )}

            {totalProducts ? <Pagination totalProducts={totalProducts} page={query.page ? parseInt(query.page) : 1}
                                         limitPorPag={limitPorPag}/> : null}
        </BasicLayout>
    );
}