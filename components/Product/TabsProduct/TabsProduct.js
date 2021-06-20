import { Tab } from "semantic-ui-react";
import InfoProduct from "../InfoProduct";

export default function TabsProduct(props) {
    const { product } = props;

    //configuracion de tabs, es una array de objetos
    const panes = [
        {
            menuItem: "Imagenes",
            render: () => (
                <Tab.Pane>
                    <InfoProduct product={product}/>
                </Tab.Pane>
            ),
        },
    ];

    return (
        <Tab className="tabs-product" panes={panes} />
    )
}