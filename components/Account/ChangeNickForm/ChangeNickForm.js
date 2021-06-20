import { useState } from "react"; 
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateNameApi } from "../../../api/user";

export default function ChangeNickForm(props)
{
    const { user,logout,setReloadUser } = props;
    const [loading, setLoading] = useState(false);

    const formik = useFormik({ //es una funcion que recibe un objeto con la configuración
        initialValues: initialValues(user.username),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => { //asincrona por la espera del response
            //console.log(formData);
            setLoading(true);
            const response = await updateNameApi(user.id,formData, logout) //datos del formulario
            if(!response)
            {
                toast.error("No se pudo actualizar el nick");
            }
            else
            {
                setReloadUser(true); //actualizar nick dinamicamente
                toast.success("El nick se actualizado correctamente");
            }
            setLoading(false);
        },
    });

    return (
        <div className="change-userName-form">
            <h4>Cambiar tu nick</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group>
                    <Form.Input name="username" placeholder="Tu nuevo nick" onChange={formik.handleChange} 
                    value={formik.values.username} error={formik.errors.username}/>
                </Form.Group>
                <Button className="submit" type="submit" loading={loading}>
                    Actualizar nick
                </Button>
            </Form>
        </div>
    );
}

function initialValues(username){
    //si name llega, lo pones, en caso contrario, lo dejas vacio
    return{
        username: username || "",
    };
}

function validationSchema(){
    return {
        username: Yup.string().required(true).max(20, 'El nick no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\d]+$/, 'Este campo solo admite letras y números'),
    }
}