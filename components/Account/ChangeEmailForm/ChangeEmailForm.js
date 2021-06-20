import { Form,Button } from "semantic-ui-react";
import { userState, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify"
import { updateEmailApi } from "../../../api/user";

export default function ChangeEmailForm(props) {
    const {user, logout, setReloadUser} = props;
    const [ loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            const response = await updateEmailApi(user.id, formData.email,logout) ;
            if(!response)
            {
                toast.error("No se pudo actualizar el email");
            }
            else if (response?.statusCode === 400) //en caso de poner un email que ya tiene otro usuario
            {
                toast.error("Este email ya esta siendo usado por otro usuario");
            }
            else
            {
                setReloadUser(true);
                formik.handleReset(); //resetar el formulario
                toast.success("Email actualizado correctamente");   
            }
            setLoading(false);
        },
    });

    return (
        <div className="change-email-form">
            <h4>Cambiar tu email <span>(Email actual: {user.email})</span></h4>

            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths="equal">
                    <Form.Input name="email" placeholder="Tu nuevo email" onChange={formik.handleChange} 
                    value={formik.values.email} error={formik.errors.email}/>
                    <Form.Input name="confirmEmail" placeholder="Comfirmar nuevo email" onChange={formik.handleChange} 
                    value={formik.values.confirmEmail} error={formik.errors.confirmEmail}/>
                </Form.Group>
                <Button className="submit" type="submit" loading={loading}>
                    Actualizar email
                </Button>
            </Form>
        </div>
    )
}

function initialValues() {
    return {
        email: "",
        confirmEmail: "",
    };
}

function validationSchema(){
    return {
        email: Yup.string().email(true).required(true).oneOf([Yup.ref("email"), null], true),
        confirmEmail: Yup.string().email(true).required(true).oneOf([Yup.ref("email"), null], true),
    };
}