import { useState } from "react"; 
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateNameApi } from "../../../api/user";

export default function ChangeNameForm(props)
{
    const { user,logout } = props;
    const [loading, setLoading] = useState(false);

    const formik = useFormik({ //es una funcion que recibe un objeto con la configuración
        initialValues: initialValues(user.name, user.lastname),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => { //asincrona por la espera del response
            //console.log(formData);
            setLoading(true);
            const response = await updateNameApi(user.id,formData, logout) //datos del formulario
            if(!response)
            {
                toast.error("No se pudo actualizar el nombre y apellidos");
            }
            else
            {
                toast.success("Nombre y apellidos actualizados correctamente");
            }
            setLoading(false);
        },
    });

    return (
        <div className="change-name-form">
            <h4>Cambiar tu nombre y apellidos</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths="equal">
                    <Form.Input name="name" placeholder="Tu nuevo nombre" onChange={formik.handleChange} 
                    value={formik.values.name} error={formik.errors.name}/>
                    <Form.Input name="lastname" placeholder="Tus nuevos apellidos" onChange={formik.handleChange} 
                    value={formik.values.lastname} error={formik.errors.lastname}/>
                </Form.Group>
                <Button className="submit" type="submit" loading={loading}>
                    Actualizar nombre
                </Button>
            </Form>
        </div>
    );
}

function initialValues(name,lastname){
    //si name llega, lo pones, en caso contrario, lo dejas vacio
    return{
        name: name || "",
        lastname: lastname || "",
    };
}

function validationSchema(){
    return {
        name: Yup.string().required(true).max(20, 'El nombre no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\d]+$/, 'Este campo solo admite letras y números'),
        lastname: Yup.string().required(true).max(20, 'Los apellidos no pueden tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\d]+$/, 'Este campo solo admite letras y números'),
    }
}