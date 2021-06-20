import React, { useState, useEffect } from "react";
import BasicLayout from "../layouts/BasicLayout";
import { useRouter } from "next/router";
import { getMeApi } from "../api/user";
import useAuth from "../hooks/useAuth";
import { Icon,Button } from "semantic-ui-react";
import ChangeNameForm from "../components/Account/ChangeNameForm/ChangeNameForm";
import ChangeNickForm from "../components/Account/ChangeNickForm/ChangeNickForm";
import ChangeEmailForm from "../components/Account/ChangeEmailForm/ChangeEmailForm";
import ChangePasswordForm from "../components/Account/ChangePasswordForm/ChangePasswordForm";
import BasicModal from "../components/Modal/BasicModal";
import AddressesForm from "../components/Account/AddressForm/AddressForm";
import ListAddress from "../components/Account/ListAddress";
import Seo from "../components/Seo"; 

export default function Account(){
    const router = useRouter();
    const [user,setUser] = useState(undefined); 
    const { auth,logout,setReloadUser } = useAuth(); //para obtener los datos del usuario, setReloadUser permite actualizar el nick dinamicamente

    useEffect(() => {
        (async() => {
            const response = await getMeApi(logout);
            setUser(response || null)
        })();
    },[auth]); //afecta cuando auth cambia de valor

    if(user===undefined)
    {
        return null;
    }

    if(!auth && !user) //el usuario esta intentando entrar en una pagina sin estar logeado
    {
        router.replace("/");
        return null;
    }

    return( //el usuario esta logeado
        <BasicLayout className>
            <Seo
                title="GameWorks"
            />
            <Config user={user} logout={logout} setReloadUser={setReloadUser}/>
            <Addresses />
        </BasicLayout>
    );
}

function Config(props)
{
    const [open,setOpen] = useState(false);
    const [iconchange,setIconChange] = useState("angle down");

    const openData = () => {
        if(open)
        {
            setOpen(false);
            setIconChange("angle down");
        }
        else
        {
            setOpen(true);
            setIconChange("angle left");
        }
    }

    const { user,logout,setReloadUser } = props; //para los datos del usuario
    //setReloadUser es para actualizar el nick de fomra dinamica, sin tener que actualizar la página
    return(
        <div className="account__config">
            <div className="title">
                <Icon className="icono" name="edit"/>
                Datos
                <Icon className="icono-flecha" name={iconchange} size='big' link onClick={openData}/>
            </div>
            <div className="data" hidden={open}>
                <ChangeNameForm user={user} logout={logout}/>
                <ChangeNickForm user={user} logout={logout} setReloadUser={setReloadUser}/>
                <ChangeEmailForm user={user} logout={logout} setReloadUser={setReloadUser}/>
                <ChangePasswordForm user={user} logout={logout}/>
            </div>
        </div>
        
    );
}

function Addresses(){
    const [showModal,setShowModal] = useState(false); //guardar si se muestra o no
    const [titleModal,setTitleModal] = useState("");  //guardar el titulo
    const [formModal,setFormModal] = useState(null); //guardar el componente que va a renderizar el modal

    const [reloadAdresses, setReloadAdresses] = useState(false); //mostrar las direcciones de forma dinamica

    const [open,setOpen] = useState(false);
    const [iconChange,setIconChange] = useState("angle down");

    const openData = () => {
        if(open)
        {
            setOpen(false);
            setIconChange("angle down");
        }
        else
        {
            setOpen(true);
            setIconChange("angle left");
        }
    }

    const openModal = (title, address) => {
        setShowModal(true);   
        setTitleModal(title); //le pasamos el titulo pues usaremos este modal tanto para crear como para editar direcciones
        //a setFormModal le llega true o false, true: nueva dirección, false: no es nueva por lo que hay que editar
        setFormModal(<AddressesForm setShowModal={setShowModal} setReloadAdresses={setReloadAdresses} 
                     newAddress={address ?  false : true} address={address || null}/>);
        //si adress tienen contenido va a ser false(editar), si no tiene contenido va a ser true(nueva)
    }

    return (
        <div className="account__addresses">
            <div className="title">
                <Icon className="icono" name="address card"/>
                Direcciones
                <Icon className="icono-flecha" name={iconChange} size='big' link onClick={openData}/>
            </div>
            <div className="data" hidden={open}>
                <div className="actions">
                    <Button className="bt" onClick={() => openModal("Crear nueva dirección")}>
                        Nueva dirección
                    </Button>
                </div>

                <ListAddress reloadAdresses={reloadAdresses} setReloadAdresses={setReloadAdresses} openModal={openModal}/>

                <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
                    {formModal}
                </BasicModal>
            </div>
        </div>
    )
}