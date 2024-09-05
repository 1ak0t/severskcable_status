import {useAppSelector} from "../../hooks";
import BreakElement from "../break-element/break-element";
import {RepairStage} from "../../constants";

function BreaksList() {
    const {breaks} = useAppSelector(state => state);
    const currentsBreaks = breaks.filter(el => !el.status);

    currentsBreaks.sort(function (a,b) {
        if (a.priority > b.priority) {
            return 1;
        }
        if (a.priority < b.priority) {
            return -1;
        }
        return 0;
    });


    return (
        <section className="repair-list">
            {currentsBreaks.find(el => el.stages === RepairStage.Register) &&
                <h2 className="repair-list__sub-title">Зарегистрированы</h2>
            }
            {currentsBreaks.filter(el => el.stages === RepairStage.Register).map(el => <BreakElement repair={el} key={el.breakName}/>)}
            {currentsBreaks.find(el => el.stages === RepairStage.RepairSuccess) &&
                <h2 className="repair-list__sub-title">Поломка подтверждена</h2>
            }
            {currentsBreaks.filter(el => el.stages === RepairStage.RepairSuccess).map(el => <BreakElement repair={el} key={el.breakName}/>)}
            {currentsBreaks.find(el => el.stages === RepairStage.Repairing) &&
                <h2 className="repair-list__sub-title">Ремонтируются</h2>
            }
            {currentsBreaks.filter(el => el.stages === RepairStage.Repairing).map(el => <BreakElement repair={el} key={el.breakName}/>)}
            {currentsBreaks.find(el => el.stages === RepairStage.RepairCompleted) &&
                <h2 className="repair-list__sub-title">Ремонт завершен</h2>
            }
            {currentsBreaks.filter(el => el.stages === RepairStage.RepairCompleted).map(el => <BreakElement repair={el} key={el.breakName}/>)}
        </section>
    );
}

export default BreaksList;