import { Container } from "semantic-ui-react";
import Header from "../../components/Header";
import classNames from "classnames";

export default function BasicLayout(props) {
    const { children,className } = props; 

    return (
        /*todo lo que mandemos desde el children utilizando BasicLayout se va a renderizar en {Children}
        Todo lo que se modifique en este componente,se modificara en todas las paginas en las que se utilize el BasicLayout */

        /*El contenido que llege  a class name me lo vas a ñaadir en el class name del contanir siempre y cuando tenga algun valor*/
        <Container fluid className={classNames("basic-layout", {
            [className]: className,
        })}>
            <Header/>
            <Container className="content">
                 { children }
            </Container>
        </Container>
    );
}