//fichero donde se importan los componentes de forma global para toda la aplicacion
import React, { useState,useEffect,useMemo, useReducer } from "react" 
import { ToastContainer } from "react-toastify";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import { setToken, getToken, removeToken } from "../api/token";
import "../scss/global.scss";
import "semantic-ui-css/semantic.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import CartContext from "../context/CartContext";
import { getProductCart,addProductCart,countProductsCart,removeProductCart } from "../api/cart";

import { CART } from "../utils/constants";
import { remove } from "lodash";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState(undefined); 
  const [reloadUser,setReloadUser] = useState(false);
  const router = useRouter();
  const [totalProductCart, setTotalProductCart] = useState(0); //numero de productos en carrito
  const [reloadCart,setReloadCart] = useState(false);
  
  useEffect(() => {
    const token = getToken();
    if(token) //si el token existe, significa que el usuario esta logeado
    {
      setAuth({
        token,
        idUser: jwtDecode(token).id,
      });
    }
    else
    {
      setAuth(null);
    }
    setReloadUser(false);
  },[reloadUser]);

  useEffect(() => {
    setTotalProductCart(countProductsCart());
    setReloadCart(false); //para mostrar dinamicamente el numero del carrito sin necesidad de actualizar
  },[reloadCart,auth]);

  const login = (token) => {
    setToken(token);
    setAuth({
      token,
      idUser: jwtDecode(token).id,
    });
  }

  const logout = () => {
    if(auth)
    {
      removeToken();
      setAuth(null);
      router.push("/"); //redireccionar a home
      toast.info("Cuenta cerrada ¡Nos vemos!");

      //al cerrar sesión los items que esten en el carrito no permanecen
      localStorage.removeItem(CART);
    }
  }

  //recordar siempre el nombre de usuario logeado
  const authData = useMemo( /*el uso de memo permite la no perdida de datos pese a que las funciones se ejecuten varias veces
                              gracias al useMemo, al recibir los mismo datos la apliaccion no se recargara*/
    () => ({
      auth,
      login,
      logout,
      setReloadUser, //fuerza la reutilizacion del useEffect para que se pueda vovler a utilizar
    }),
    [auth] //se acutauliza al cambiar de valor
  );

  const checkAuthCart = (product) => {
    const token = getToken();
    if(token)
    {
      addProductCart(product);
      setReloadCart(true); //refrescar carrito
    }
    else
    {
      toast.warning("Tienes que iniciar sesión para poder comprar");
    }
  }

  const removeProduct = (product) => {
    removeProductCart(product);
    setReloadCart(true);
  }

  //contexto
  const cartData = useMemo(
    () => ({
      productsCart: totalProductCart,
      addProductCart: (product) => checkAuthCart(product),
      getProductCart: getProductCart,
      removeProductCart: (product) => removeProductCart(product),
      removeAllProductsCart: () => null,
    }),
    [totalProductCart]
  );

  if(auth === undefined) 
  {
    return null;
  }

  return(
    <AuthContext.Provider value={authData}>
      <CartContext.Provider value={cartData}>
        <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
      </CartContext.Provider> 
    </AuthContext.Provider>
  );
}
