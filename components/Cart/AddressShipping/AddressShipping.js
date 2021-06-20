import { useState,useEffect } from "react";
import { Grid,Button,Icon } from "semantic-ui-react";
import { add, map,size } from 'lodash';
import Link from "next/link";
import classNames from "classnames";
import { getAddressApi } from "../../../api/address";
import useAuth from "../../../hooks/useAuth";
import { async } from "regenerator-runtime";

export default function AddressShipping(props) {
    const { setAddress } = props;
    const [addresses,setAddresses] = useState(null);
    const [addressActive,setAddressActive] = useState(null); //para seleccionar la direccion de envio
    const { auth,logout} = useAuth();

    useEffect(() => {
        (async () => {
            const response = await getAddressApi(auth.idUser,logout);
            // console.log(response);
            setAddresses(response || []); //si response llega vacio le pasamos una array
        })()
    },[])

    return (
        <div className="address-shipping">
            <div className="title">
                <Icon className="icono" name="address card"/>
                Dirección de envio
            </div>
            <div className="data">
                {size(addresses) === 0 ? (
                    <>
                        <h3>No dispones de ninguna dirección</h3>
                        <Button href="/account" className="button-anadir-direccion-primera">
                            Añadir tu primera dirección
                        </Button>
                    </>
                ) : (
                    <Grid>
                        {map(addresses, (address) => (
                            <Grid.Column key={address.id} computer={4}>
                                <Address address={address} addressActive={addressActive} 
                                setAddressActive={setAddressActive} setAddress={setAddress}/>
                            </Grid.Column>
                        ))}
                    </Grid>
                )}
            </div>
        </div>
    );
}

function Address(props)
{
    const { address,addressActive,setAddressActive,setAddress } = props;

    const changeAddress = () => {
        setAddressActive(address._id); //id de la direccion seleccionada
        setAddress(address); //setear todos los datos de la dirección
    };

    return(
        <div className={classNames("address-ship-2", {
            active: addressActive === address._id,
        })} onClick={changeAddress}>
            <p>{address.title}</p>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>{address.city}, {address.state} {address.postal}</p>
            <p>{address.phone}</p>
        </div>
    )
}