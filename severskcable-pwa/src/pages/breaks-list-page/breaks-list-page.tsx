import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import BreaksList from "../../components/breaks-list/breaks-list";

function BreaksListPage () {
    return (
        <div className="repair-registration-page">
            <Helmet>
                <title>Текущие поломки</title>
            </Helmet>
            <h1 className="repair-registration-page__title">Текущие поломки</h1>
            <BreaksList />
            <BottomMenu />
        </div>
    );
}

export default BreaksListPage;