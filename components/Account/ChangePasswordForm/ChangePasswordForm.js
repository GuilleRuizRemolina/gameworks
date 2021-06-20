import { useState } from "react";
import { Form,Button } from "semantic-ui-react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updatePasswordApi } from "../../../api/user";

export default function ChangePasswordForm(props) {
    const {user,logout} = props;
    const [loading,setLoading] = useState(false);

    const formik = useFormik( {
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            const response = await updatePasswordApi(user.id,formData.password,logout);
            if(!response)
            {
                toast.error("No se pudo actualizar la contraseña");
            }
            else
            {
                toast.success("Contraseña actualizada correctamente");
                logout();
            }
            setLoading(false);
        },
    });
    
    return (
        <div className="change-password-form">
            <h4>Cambiar tu contraseña</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths="equal">
                    <Form.Input name="password" type="password" placeholder="Tu nueva contraseña" onChange={formik.handleChange}
                    value={formik.values.password} error={formik.errors.password}/>
                    <Form.Input name="confirmPassword" type="password" placeholder="Repetir contraseña" onChange={formik.handleChange}
                    value={formik.values.confirmPassword} error={formik.errors.confirmPassword}/>
                </Form.Group>
                <Button className="submit" type="submit" loading={loading}>
                    Actualizar contraseña
                </Button>
            </Form>
        </div>
    );
}

function initialValues(){
    return {
        password: "",
        confirmPassword: "",
    };
}

function validationSchema(){
    return {
        password: Yup.string().required(true).oneOf([Yup.ref('password'), null])
        .min(8, 'La contraseña debe tener al menos 8 caracteres').max(20, 'La contraseña no puede tener más de 20 caracteres'),
        confirmPassword: Yup.string().required(true).oneOf([Yup.ref('password'),null],true)
    };
}