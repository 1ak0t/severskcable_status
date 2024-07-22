import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {Helmet} from "react-helmet-async";
import {Link, useParams} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import {Repair} from "../../types/initialState.type"
import RepairForm from "../../components/repair-form/repair-form";
import {AppRoutes} from "../../constants";

function RepairRegisterPage() {
    const {repairId} = useParams();
    const {machines} = useAppSelector(state => state);
    const repairs: Repair[]  = [];
    machines.forEach(machine => machine.repairs.forEach(repair => repairs.push(repair)));
    const currentRepair = repairs.find(repair => repair.id === repairId);

    if (currentRepair) {
        return(
            <div className="breaking-page">
                <Helmet>
                    <title>Сообщить о ремонте</title>
                </Helmet>
                <h1 className="breaking-page__title">Сообщить о ремонте</h1>
                <RepairForm repair={currentRepair} />
                <BottomMenu />
            </div>
        );
    }
    return(
        <div className="breaking-page">
            <Helmet>
                <title>Ремонт не зарегистрирован</title>
            </Helmet>
            <h1 className="breaking-page__title">Ремонт не зарегистрирован</h1>
            <Link to={AppRoutes.Root}>На главную</Link>
            <BottomMenu />
        </div>
    );
}

export default RepairRegisterPage;