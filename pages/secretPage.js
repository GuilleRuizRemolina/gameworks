import SecretLayout from "../layouts/SecretLayout";
import Seo from "../components/Seo"; 

export default function paginaOculta() {
    return (
        <SecretLayout className="secret"> 
        <Seo
                title="GameWorks"
            />
            <h3 className="text">
                <p align="center">Página realizada por:<pre/>Guillermo Ruiz Remolina<pre/>08/06/2021 - 20/06/2021</p>
            </h3>
        </SecretLayout>
    );
}