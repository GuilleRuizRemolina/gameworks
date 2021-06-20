import React, { useState,useEffect } from "react"; 
import { Container, Menu, Grid, Icon, GridColumn, Label} from "semantic-ui-react";
import Link from "next/link";
import BasicModal from "../../Modal/BasicModal";
import Auth from "../../Auth";
import useAuth from "../../../hooks/useAuth";
import { getMeApi } from "../../../api/user";
import { async } from "regenerator-runtime";
import { getCategoriesApi } from "../../../api/categories";
import { map } from "lodash";
import useCart from "../../../hooks/useCart";

export default function MenuWeb() {
    //estado para las categorias
    const [categories,setCategories] = useState([]);

    const [showModal,setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Iniciar Sesión");
    const [user,setUser] = useState(undefined);
    const { auth, logout } = useAuth();

    useEffect(() => {
        (async () => { //funcion asincrona que se autollama
            const response = await getMeApi(logout);
            setUser(response); //aqui tenemos los datos del usuario logeado
            //console.log(response);
        })() 
    },[auth]); //que se efectue cuando cambien de valor el auth

    useEffect(() => {
        (async () => { 
            const response = await getCategoriesApi();
            setCategories(response || []); //en caso de que no llege, pasamos un array vacio
            // console.log(response);
        })();
    },[]); 

    //funcion que muestra el modal
    const onShowModal = () => {
        setShowModal(true);
    }

    const onCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div className="menu">
            <Container>
                <Grid>
                    <Grid.Column className="menu__left" width={6}>
                        <MenuCategorias categories={categories}/>
                    </Grid.Column>
                    <GridColumn className="menu__right" width={10}>
                        {user !== undefined && <MenuOpciones onShowModal={onShowModal} user={user} logout={logout}/>} 
                    </GridColumn>
                </Grid>
            </Container>
            <BasicModal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}>
                <Auth 
                    onCloseModal={onCloseModal}
                    setTitleModal={setTitleModal}/>
            </BasicModal>
        </div>
    )
}

function MenuCategorias(props)
{
    const { categories } = props;

    //map: funcion de lodash
    return(
        <Menu>
            <Link href="/">
                <Menu.Item as="a">
                    Inicio
                </Menu.Item>
            </Link>
            
            {map(categories,(category) => (
                <Link href={`/products/${category.url}`} key={category._id}>
                    <Menu.Item as="a" name={category.url}>
                        {category.title}
                    </Menu.Item>
                </Link>
            ))}
        </Menu>
    )
}

function MenuOpciones(props){
    const { onShowModal,user,logout } = props;
    const { productsCart } = useCart();

    return(
        <Menu>
            {user ? (
                <>
                    <Link href="/orders">
                        <Menu.Item as="a">
                            <Icon name="game"/>
                            Encargos
                        </Menu.Item>
                    </Link>
                    <Link href="/wishlist">
                        <Menu.Item as="a">
                            <Icon name="star"/>
                            Lista de deseos
                        </Menu.Item>
                    </Link>
                    <Link href="/account">
                        <Menu.Item as="a">
                            <Icon name="user"/>
                            {user.username}
                        </Menu.Item>
                    </Link>
                    <Link href="/cart">
                        <Menu.Item as="a" className="n-0">
                            <Icon name="cart"/>
                            {productsCart!==0 && (
                                <Label color="red" floating box>
                                    {productsCart}
                                </Label>
                            )}
                        </Menu.Item>
                    </Link>
                    
                    <Menu.Item onClick={logout} className="n-0">
                        <Icon name="power off"/>
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item onClick={onShowModal}>
                    <Icon name="user outline"/>
                    Mi cuenta
                </Menu.Item>
            )}
            
        </Menu>
    );

}