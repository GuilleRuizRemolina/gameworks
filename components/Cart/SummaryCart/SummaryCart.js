import { useState,useEffect } from "react";
import { Table,Image,Icon } from "semantic-ui-react";
import { forEach,map } from "lodash";
import useCart from "../../../hooks/useCart";
import { toast } from "react-toastify";

export default function SummaryCart(props) {
    const { products,reloadCart, setReloadCart } = props;
    const [totalPrice,setTotalPrice] = useState(0);
    const { removeProductCart } = useCart();

    useEffect(() => {
        let price = 0;

        //por cada iteraccion vamos a ir sumando cada precio para obtener el total a pagar
        forEach(products, (p)=> {
            //comprobar primero si el producto tiene descuento
            if(p.discount)
            {
                price += p.price - Math.floor(p.price*p.discount) / 100;
            }
            else
            {
                price +=  p.price;
            }
        });
        setTotalPrice(price);
    },[reloadCart,products]);

    const removeProduct = async (product) => {
        removeProductCart(product);
        // console.log(product);
        setReloadCart(true);
    
        window.location.replace('');
    }

    return (
        <div className="summary-cart">
            <div className="title">
                <Icon className="icono" name="cart"/>
                Carrito
            </div>
            <div className="data">
                <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Producto</Table.HeaderCell>
                            <Table.HeaderCell>Categoria</Table.HeaderCell>
                            <Table.HeaderCell>Entrega</Table.HeaderCell>
                            <Table.HeaderCell>Precio</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {map(products, (product) => (
                            <Table.Row key={product.id} className="summary-cart__product">
                                <Table.Cell>
                                    <Icon name="close" link 
                                    onClick={() => removeProduct(product.url)} />

                                    <Image src={product.image.url} alt={product.title} />
                                    {product.title}
                                </Table.Cell>
                                <Table.Cell>
                                    {product.category.title}
                                </Table.Cell>
                                <Table.Cell>
                                    En proceso
                                </Table.Cell>

                                {product.discount ? (
                                    <Table.Cell>
                                        {product.price} -{product.discount} %<Icon className="icono" name="angle right"/>
                                        {(product.price - Math.floor(product.price*product.discount) / 100).toFixed(2)}€ 
                                    </Table.Cell>
                                ) : (
                                    <Table.Cell>
                                        {(product.price).toFixed(2)} €
                                    </Table.Cell>
                                )}
                                    
                            </Table.Row>
                        ))}

                        <Table.Row className="sumary-cart__resume">
                            <Table.Cell className="clear"/>
                            <Table.Cell colSpan="2">Total:</Table.Cell>
                            <Table.Cell className="total-price">{(totalPrice).toFixed(2)} €</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}