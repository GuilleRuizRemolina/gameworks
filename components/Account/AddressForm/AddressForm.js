import { userState, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../../hooks/useAuth";
import { createAddressApi,updateAddressApi } from "../../../api/address";
import { toast } from "react-toastify";


export default function AddressesForm(props) {
    const { setShowModal,setReloadAdresses,newAddress,address } = props;

    const [loading,setLoading] = useState(false);
    //recuperar el usuarioId con el useAuth
    const { auth,logout } = useAuth();

    const formik = useFormik({
        initialValues: initialValues(address),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: (formData) => {
            if(newAddress) //crear nueva dirección
            {
                //console.log("creando");
                createAddress(formData);
            }
            else //editar dirección
            {
                //console.log("editando");
                updateAddress(formData);
            }
        },
    });

    const createAddress = async (formData) => {
        setLoading(true);
        //estructura de datos para enviar al endpoint
        //no podemos modificar el prarametro que nos llega, tenemos que igualar una nueva variable y modificarla
        
        //console.log(formData);
        
        const formDataTemp = {
            ...formData,
            user: auth.idUser,
        };

        //console.log(formDataTemp);

        const response = await createAddressApi(formDataTemp,logout);

        //console.log(response);
        
        if(!response)
        {
            toast.error("No se pudo crear la dirección");
            setLoading(false);
        }
        else
        {
            formik.resetForm();
            setReloadAdresses(true); //recargar direcciones para mostrar nueva
            setShowModal(false);
            setLoading(false);
            toast.success("Nueva dirección añadida a la lista de direcciones");
        }
    };

    const updateAddress = (formData) => {
        //console.log(formData);
        setLoading(true);
        const formDataTemp = 
        {
            ...formData,
            user: auth.idUser,
        };
        const response = updateAddressApi(address._id,formDataTemp,logout);

        if(!response)
        {
            toast.errors("No se pudo actualizar los datos de la dirección");
            setLoading(false);
        }
        else
        {
            formik.resetForm(); //borrar formulario
            setReloadAdresses(true); //recargar direcciones
            setLoading(false); //quitar estado loading
            setShowModal(false); //cerrar modal
            toast.success("Datos de la dirección actualizados");
        }  
    };

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Input name="title" type="text" label="Titulo de la dirección" placeholder="Titulo de la dirección"
            onChange={formik.handleChange} value={formik.values.title} error={formik.errors.title}/>

            <Form.Group widths="equal">
                <Form.Input name="name" type="text" label="Nombre y apellidos" placeholder="Nombre y apellidos"
                onChange={formik.handleChange} value={formik.values.name} error={formik.errors.name}/>
                <Form.Input name="address" type="text" label="Dirección" placeholder="Dirección"
                onChange={formik.handleChange} value={formik.values.address} error={formik.errors.address}/>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Input name="city" type="text" label="Ciudad" placeholder="Ciudad"
                onChange={formik.handleChange} value={formik.values.city} error={formik.errors.city}/>
                <Form.Input name="state" type="text" label="Provincia/Región" placeholder="Provincia/Región"
                onChange={formik.handleChange} value={formik.values.state} error={formik.errors.state}/>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Input name="postal" type="text" label="Código postal" placeholder="Código postal"
                onChange={formik.handleChange} value={formik.values.postal} error={formik.errors.postal}/>
                <Form.Input name="phone" type="text" label="Telefono" placeholder="Telefono"
                onChange={formik.handleChange} value={formik.values.phone} error={formik.errors.phone}/>
            </Form.Group>

            <div className="actions">
                <Button className="submit" type="submit" loading={loading}>
                    {newAddress ? "Crear dirección" : "Editar dirección"}
                </Button>
            </div>
        </Form>  
    );
}

function initialValues(address) {
    //si address.titulo tiene valor, me lo escribes en el valor del input, si no tiene nada lo dejas vacio
    return {
        title: address?.title || "",
        name: address?.name|| "",
        address: address?.address|| "",
        city: address?.city|| "",
        state: address?.state|| "",
        postal: address?.postal|| "",
        phone: address?.phone|| "",
    };
}

function validationSchema(){
    return {
        title: Yup.string().required(true).max(30, 'El titulo no puede tener más de 30 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        name: Yup.string().required(true).max(40, 'El nombre no puede tener más de 40 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        address: Yup.string().required(true).max(40, 'La dirección no puede tener más de 40 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        city: Yup.string().required(true).max(20, 'La ciudad no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        state: Yup.string().required(true).max(20, 'La provincia/región no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        postal: Yup.string().required(true).max(5, 'El código postal debe tener 5 números').min(5, 'El código postal debe tener 5 números')
        .matches(/^\d+$/, 'Este campo solo admite números').matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        phone: Yup.string().required(true).max(20, 'El telefono no puede tener más de 20 caracteres')
        .matches(/^\d+$/, 'Este campo solo admite números'),
    };
}