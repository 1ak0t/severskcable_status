import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import RepairsList from "../../components/repairs-list/repairs-list";

function RepairRegisterPage () {
    return (
        <div className="repair-registration-page">
            <Helmet>
                <title>Завершить ремонт</title>
            </Helmet>
            <h1 className="repair-registration-page__title">Завершить ремонт</h1>
            <RepairsList />
            <BottomMenu />
        </div>
    );
}

export default RepairRegisterPage;