import React, { useState,useEffect } from "react";
import Head from 'next/head'
import { size } from "lodash";
import BasicLayout from "../layouts/BasicLayout";
import { getLastProductsApi } from "../api/product";
import { async } from "regenerator-runtime";
import { List, Loader } from "semantic-ui-react";
import ListProducts from "../components/listProducts/ListProducts";
import { map } from "lodash";
import Seo from "../components/Seo";

export default function Home() {
  const [products,setProducts] = useState(null);
  // console.log(products);

  useEffect(() => {
    (async () => {
      const response = await getLastProductsApi(50);

      if(size(response) > 0) //si es mayor que 0 significa que han llegado productos
      {
        setProducts(response);
      }
      else
      {
        setProducts([]); //si no hay productos seteamos setProducst con un array vacio
      }
    })();
  }, []);


  return (
    <BasicLayout className="home">
      <Seo
        title="GameWorks"
      />
      {!products && <Loader active>Cargando...</Loader>}
      {products && size(products) === 0 && (
        <div>
          <h3>No hay productos que msotrar...</h3>
        </div>
      )}
      {size(products)>0 && (
        <ListProducts products={products}/>
      )}
    </BasicLayout>
  );
}
