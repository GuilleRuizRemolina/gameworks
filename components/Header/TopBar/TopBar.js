import { Container, Grid, GridColumn,Button, Image, Input } from "semantic-ui-react";
import Link from "next/link";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";

export default function TopBar() {
    return (
        <div className="top-bar">
            <Container>
                <Grid className="top-bar">
                    <Grid.Column width={8} className="top-bar__left">
                        <Logo/>
                    </Grid.Column>
                    <GridColumn width={8} className="top-bar__right">
                        <Search/>
                    </GridColumn>
                </Grid>
            </Container>
        </div>
    );
}

function Logo()
{
    return (
        <>
            <Link href="/secretPage">
                <a>
                    <h1>Créditos</h1>
                </a>
            </Link>
            <Link href="/">
                <a>
                    <Image src="https://gameworks-ecommerce.s3.eu-west-3.amazonaws.com/logo_abe7a68622.png" alt="Gaming" />
                </a>
            </Link>
        </>
    );
}

function Search()
{
    const [searchString,setSearchString] = useState("");
    const router = useRouter();
    const [load,setLoad] = useState(false);

    // console.log(query);

    //solo se va a ejecutar cuando el componente este cargado, solo queremos que se haga redireccion cuando de esciba en la search bar
    //bloquearemos la primera ejecucion de este useEffect
    useEffect(() => {
        if(load) //la primera vez load es false, asi que no entra
        { 
            router.push(`/search?query=${searchString}`);
        }
        setLoad(true);
    }, [searchString]);

    //gracias al onChange podemos detecar cada vez que la search bar sufre un cambio
    //el router.query iguala el valor del searchinput al escrito en al url par ano perder caracteres
    return (
        <Input id="search-product" icon={{ name: "search" }} value={router.query.query} 
        onChange={(_,data) => setSearchString(data.value) }/>
    )
}