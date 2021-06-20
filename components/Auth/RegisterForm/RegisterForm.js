import { userState, useState } from "react";
import { Form,Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerApi } from "../../../api/user";

export default function RegisterForm(props) {
    const {showLoginForm} = props;
    const [loading, setLoading] = useState(false);

    //funcion que recibe objeto con datos
    const  formik = useFormik({
        initialValues: initialValues(), //valores inicales de nuestro formulario
        validationSchema: Yup.object(validationSchema()), //se ecarga de las validaciones del formulario
        onSubmit: async (formData) => { //nos va a devolver los valores del formulario
            setLoading(true);
            const response = await registerApi(formData);
            if(response?.jwt) //primero comprueba si le llega un objeto .jwt, si le llega va a entrar, despues lo comprueba
            {
                showLoginForm();
                toast.success("Usuario registrado correctamente");
            }
            else
            {
                toast.error("Error al registrar el usuario");
            }

            setLoading(false);
        },
    });

    return (
        <Form className="login-form" onSubmit={formik.handleSubmit}>
            <Form.Input name="name" type="text" placeholder="Nombre" onChange={formik.handleChange} error={formik.errors.name} />
            <Form.Input name="lastname" type="text" placeholder="Apellidos" onChange={formik.handleChange} error={formik.errors.lastname}/>
            <Form.Input name="username" type="text" placeholder="Nombre de usuario" onChange={formik.handleChange} error={formik.errors.username}/>
            <Form.Input name="email" type="text" placeholder="Correo Electrónico" onChange={formik.handleChange} error={formik.errors.email}/>
            <Form.Input name="password" type="password" placeholder="Contraseña" onChange={formik.handleChange} error={formik.errors.password}/>
            <Form.Input name="confirmPassword" type="password" placeholder="Repetir contraseña" onChange={formik.handleChange} error={formik.errors.confirmPassword}/>
            <div className="actions">
                <Button type="button" basic onClick={showLoginForm}>
                    Volver a inicio sesión
                </Button>
                <Button type="submit" className="submit" loading={loading}>
                    Crear cuenta
                </Button>
            </div>
        </Form>
    )
}

function initialValues() {
    return {
        name: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
}

function validationSchema() {
    return {
        name: Yup.string().required(true).max(20, 'El nombre no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        lastname: Yup.string().required(true).max(20, 'Los apellidos no pueden tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        username: Yup.string().required(true).max(20, 'El nick no puede tener más de 20 caracteres')
        .matches(/^[aA-zZ\s\dÀ-ÿ\u00f1\u00d1]+$/, 'Este campo solo admite letras y números'),
        email: Yup.string().email(true).required(true),
        password: Yup.string().required(true).oneOf([Yup.ref('password'), null]).min(8, 'La contraseña debe tener al menos 8 caracteres').max(20, 'La contraseña no puede tener más de 20 caracteres'),
        confirmPassword: Yup.string().required(true).oneOf([Yup.ref("password"), null], true)
    };
}