import { Pagination as PaginationSemantic } from "semantic-ui-react";
import { useRouter } from "next/router";
import queryString from "query-string";

export default function Pagination(props) {
    const {totalProducts,page,limitPorPag} = props;

    //calculo de total de paginas
    const totalPages = Math.ceil(totalProducts / limitPorPag); //math ceil para que redonde por lo alto

    const router = useRouter();
    const urlParse = queryString.parseUrl(router.asPath);

    const goToPag = (newPage) => {
        urlParse.query.page = newPage;
        const url = queryString.stringifyUrl(urlParse);
        router.push(url);
    }

    return (
        <div className="pagination">
            <PaginationSemantic 
            defaultActivePage={page}
            totalPages={totalPages}
            firstItem={null}
            lastItem={null}
            onPageChange={(_, data) => goToPag(data.activePage)} //pagina activa, pagina que estamos haciendo click
            boundaryRange={0}
            siblingRange={1}
            ellipsisItem={null}/>
        </div>
    )
}