import {Helmet} from "react-helmet-async";

function NotFoundPage () {
    return(
        <>
            <Helmet>
                <title>Страница не найдена</title>
            </Helmet>
            <h1>Страница не найдена</h1>
        </>
    );
}

export default NotFoundPage;