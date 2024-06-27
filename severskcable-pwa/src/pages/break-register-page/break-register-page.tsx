import BreakForm from "../../components/break-form/break-form";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {Helmet} from "react-helmet-async";

function BreakRegisterPage() {
    return(
        <div className="breaking-page">
            <Helmet>
                <title>Сообщить о поломке/ремонте</title>
            </Helmet>
            <h1 className="breaking-page__title">Сообщить о поломке/ремонте</h1>
            <BreakForm />
            <BottomMenu />
        </div>
    );
}

export default BreakRegisterPage;