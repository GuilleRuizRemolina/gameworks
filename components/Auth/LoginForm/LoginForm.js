import { useState } from "react";
import { Form,Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { loginApi,resetPasswordApi } from "../../../api/user";


export default function LoginForm(props) {
    const {showRegisterForm, onCloseModal} = props;
    const [loading, setLoading] = useState(false); //estado para el spinner
    const {login} = useAuth();
    

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            const response = await loginApi(formData);
            if(response?.jwt) //login correcto
            {
                login(response.jwt);
                toast.success("¡Bienvenid@!");
                onCloseModal();
            }
            else //login error
            {
                toast.error("Email o contraseña incorrectos");
            }
            setLoading(false);
        },
    });

    const resetPassword = () => {
        formik.setErrors({}); //reinica toods los errores del formulario
        const validateEmail = Yup.string().email(true).required(); /*con esta constante se valida que solo se enrte en este if si
                                                                    el correo es valido*/
        if(!validateEmail.isValidSync(formik.values.identifier)) { //si la validacion resulta ser false
            formik.setErrors({ identifier:true });
        }
        else
        {
            toast.error("Email valido");
            resetPasswordApi(formik.values.identifier); 
        }

        console.log(formik.values.identifier);

    }

    return (
        <Form className="login-form" onSubmit={formik.handleSubmit}>
            <Form.Input name="identifier" type="text" placeholder="Correo electronico" 
            onChange={formik.handleChange} error={formik.errors.identifier}/>
            <Form.Input name="password" type="password" placeholder="Contraseña" 
            onChange={formik.handleChange} error={formik.errors.password}/>
            <div className="actions">
                <Button type="button" basic onClick={showRegisterForm}>
                    Registrar nueva cuenta
                </Button>
            </div>
            <div>
                <Button className="submit" type="submit" loading={loading}>
                    Entrar
                </Button>
                
                {/* <Button type="button" onClick={resetPassword}>
                    ¿No recuerdas la contraseña?
                </Button> */}
            </div>
        </Form>
    )
}

function initialValues(){
    return {
        identifier: "",
        password: "",
    };
}

function validationSchema(){
    return {
        identifier: Yup.string().email(true).required(true),
        password: Yup.string().required(true),
    };
}