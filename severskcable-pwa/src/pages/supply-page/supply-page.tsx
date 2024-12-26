import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {useAppSelector} from "../../hooks";
import {getBreaks} from "../../store/data-process/selectors";
import {useDispatch} from "react-redux";
import {RepairStage} from "../../constants";
import SuppliesByBreak from "../../components/supplies-by-break/supplies-by-break";

function SupplyPage() {
    const breaks = useAppSelector(getBreaks);
    const dispatch = useDispatch();
    const breaksInSupplyStage = breaks.filter(el => el.stages === RepairStage.Supply);

    return (
        <div className="supply-page">
            <Helmet>
                <title>Текущие запросы снабжения</title>
            </Helmet>
            <h1 className="supply-page__title">Текущие запросы снабжения</h1>
            {breaksInSupplyStage.length > 0 && breaksInSupplyStage.map(el => <SuppliesByBreak repair={el} />)}
            <BottomMenu />
        </div>
    );
}

export default SupplyPage;