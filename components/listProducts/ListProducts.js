import { map } from "lodash";
import { Image, Grid } from "semantic-ui-react";
import Link from "next/link";

export default function ListProducts(props) {
    const { products } = props; 

    //por cada interacción va a obtener cada uno de los productos
    return(
        <div className="list-products">
            <Grid>
                <Grid.Row columns={5}>
                    {map(products, (product) => (
                        <Product product={product} />
                    ))}
                </Grid.Row>
            </Grid>
        </div>
    );
}

function Product(props)
{
    const {product} = props;
    return (
        <Grid.Column className="list-products__product">
            <Link href={`/${product.url}`}>
                <a>
                    <div className="list-products__product-imagen">
                        <Image src={product.image.url} alt={product.title} />
                        <div className="list-products__product-imagen-info">
                            {product.discount ? (
                                <span className="discount">-{product.discount}%</span>
                            ) : (
                                <span/>
                            )}
                            <span className="price">{product.price}€</span>
                        </div>
                    </div>
                    <h2>{product.title}</h2>
                </a>
            </Link>
        </Grid.Column>
    );
}