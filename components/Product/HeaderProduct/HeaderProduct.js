import React, { useState,useEffect } from "react";
import { Grid,Image,Icon,Button } from "semantic-ui-react";
import { size } from "lodash";
import { isFavoriteApi,addFavoriteApi,removeFavoriteApi } from "../../../api/favorite";
import useAuth from "../../../hooks/useAuth";
import classNames from "classnames";
import { toast } from "react-toastify";
import useCart from "../../../hooks/useCart";

export default function HeaderProduct(props) {
    const { product } = props;
    const { image, title } = product;
    //console.log(product);

    return (
        <Grid className="header-product">
            <Grid.Column computer={5}>
                <Image src={image.url} alt={title} fluid />
            </Grid.Column>

            <Grid.Column computer={11}>
                <Info product={product}/>
            </Grid.Column>
        </Grid>
    );
}

function Info(props) {
    const { product } = props;
    const { title,description,price,discount,url } = product;
    const [isFavorite,setIsFavorite] = useState(false);
    const { auth, logout } = useAuth();
    const [reloadFavorite,setReloadFavorite] = useState(false);
    const { addProductCart } = useCart();

    if(auth)
    {
        useEffect(() => {
            (async () => {
                const response = await isFavoriteApi(auth.idUser,product.id,logout);
                // console.log(response);
                
                if(size(response) > 0) //si llega algo en el response significa que ese juego esta en los favoritos del usuario
                {
                    setIsFavorite(true);
                }
                else
                {
                    setIsFavorite(false);
                }
            })();
            setReloadFavorite(false);
    
        }, [product, reloadFavorite]); //cada vez que un prodcuto cambie, se tiene que ejecutar este efecto de nuevo
    }
    
    const addFavorite = async () =>
    {
        if(!auth) {
            toast.warning("Es necesario iniciar sesión para añadir a la lista de deseos");
        }
        else
        {
            toast.success(title + " añadido a tu lista de deseos");
            await addFavoriteApi(auth.idUser,product.id,logout);
            setReloadFavorite(true); //referescar pagina para msotrar el favorito
        }
    }

    const removeFavorite = async () =>
    {
        //aqui no compruebo si esta registrado porque un usuaio sin inicar sesión nunca vera un producto como favorito
        toast.info(title + " quitado de tu lista de deseos");
        await removeFavoriteApi(auth.idUser,product.id,logout);
        setReloadFavorite(true); //referescar pagina para msotrar el favorito
    }

    return (
        <>
            <div className="header-product__title">
                {title}
                <Icon name={isFavorite ? "star" : "star outline"}
                link 
                onClick={isFavorite ? removeFavorite : addFavorite}/>
            </div>

            <div className="header-product__description">
                {description}
            </div>

            <div className="header-product__delivery">Entrega en 24/48 h</div>

            <div className="header-product__compra">
                <div className="header-product__compra-precio">
                    <p>Precio de venta:</p>
                    {product.discount ? (
                                <p> {price} € </p>
                            ) : (
                        <p className="precio-no-descuento"> {price} € </p> 
                    )}
                    
                    <div className="header-product__compra-precio-actions">
                        {product.discount ? (
                                <>
                                    <p>-{discount}%</p>
                                    <p>{(price - Math.floor(price*discount) / 100).toFixed(2)}€</p>
                                </>
                            ) : (
                                <span/>
                        )}
                        
                    </div>
                </div>
                <Button className="header-product__compra-bt" onClick={() => addProductCart(url)}>
                    Comprar
                </Button>
            </div>
        </>
    );
}