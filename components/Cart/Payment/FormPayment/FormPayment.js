import { Button } from "semantic-ui-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { size } from "lodash";
import useAuth from "../../../../hooks/useAuth";
import useCart from "../../../../hooks/useCart";
import { async } from "regenerator-runtime";
import { paymentCartApi } from "../../../../api/cart";

export default function FormPayment(props) {
    const {products,address } = props;
    const [loading,setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const { auth,logout } = useAuth();

    const handlerSubmit = async (event) => {
        event.preventDefault(); //evitar que se recarge la pagina
        setLoading(true);

        if(!stripe || !elements)
        {
            return null;
        }
        
        const card = elements.getElement(CardElement);
        const result = await stripe.createToken(card) //crear el acuerdo de cobro

        if(result.error)
        {
            toast.error(result.error.message);
        }
        else
        {
            const response = await paymentCartApi(
                result.token,
                products,
                auth.idUser,
                address,
                logout
            );

            if(size(response) > 0)
            {
                toast.success("Pedido completado ¡Muchas gracias!");
            }
            else
            {
                toast.error("Error al realizar el pedido");
            }
        }

        setLoading(false);
    };

    return (
        <form className="form-payment" onSubmit={handlerSubmit}>
            <CardElement />
            <Button type="submit" loading={loading} disabled={!stripe}>Realizar pago</Button>
        </form>
    );d
}