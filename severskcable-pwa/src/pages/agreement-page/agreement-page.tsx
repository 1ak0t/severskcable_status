import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import AgreementList from "../../components/agreement-list/agreement-list";

function AgreementPage() {
    return (
        <div className="agreement-page">
            <Helmet>
                <title>Требуют подтвердения</title>
            </Helmet>
            <h1 className="agreement-page__title">Требуют подтвердения</h1>
            <AgreementList />
            <BottomMenu />
        </div>
    );
}

export default AgreementPage;