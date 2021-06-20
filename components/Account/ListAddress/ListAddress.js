import { useState,useEffect } from "react";
import { Grid,Button } from "semantic-ui-react";
import { map,size } from "lodash";
import { getAddressApi,deleteAddressApi } from "../../../api/address";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";


export default function ListAddress(props) {
    const {reloadAdresses,setReloadAdresses,openModal} = props;
    const [addresses, setAddresses] = useState(null);
    const { auth, logout } = useAuth();

    //funcion anonima autoejecutable
    useEffect(() => {
        (async () => {
            const response = await getAddressApi(auth.idUser,logout);
            setAddresses(response || []); //si response tiene contenido lo vas a añadir, y si viene como nulo añades un array vacio
            setReloadAdresses(false);
        })() 
    }, [reloadAdresses]);

    if(!addresses) return null; //evitar que salga "no tienes diracciones" cuando si tienes

    //Size, funcion de lodash, nos devuelve el tamaño del array
    return (
        <div className="list-address">
            {size(addresses) === 0 ? (
                <h3>No dispones de ninguna dirección</h3>
            ): (
                <Grid>
                    {map(addresses, (address) => (
                        <Grid.Column key={address.id} computer={4}>
                            <Address address={address} logout={logout} setReloadAdresses={setReloadAdresses} openModal={openModal}/>
                        </Grid.Column>
                    ))}
                </Grid>
            )}
        </div>
    )
}

function Address(props)
{
    const { address,logout,setReloadAdresses,openModal } = props;

    //estado para loading
    const [loading,setLoading] = useState(false);

    const deleteAddress = async () => {
        setLoading(true);
        //console.log(address._id);
        const response = await deleteAddressApi(address._id,logout);
        if(response)
        {
            setReloadAdresses(true);
            toast.info("La dirección ha sido eliminada de la lista");
        }
        setLoading(false);
    };

    return (
        <div className="address">
            <p>{address.title}</p>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>{address.state},{address.city} {address.postal}</p>
            <p>{address.phone}</p>

            <div className="actions">
                <Button primary onClick={ () =>openModal(`Editando dirección: ${address.title}`,address) }>
                    Editar
                </Button>
                <Button onClick={deleteAddress} loading={loading}>
                    Borrar
                </Button>
            </div>
        </div>
    );
}