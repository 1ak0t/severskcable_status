import {useAppSelector} from "../../hooks";
import BreakElement from "../break-element/break-element";
import {RepairStage} from "../../constants";
import {getBreaks} from "../../store/data-process/selectors";

function BreaksList() {
    const breaks = useAppSelector(getBreaks);
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

    const windowInnerWidth = window.innerWidth;

    return (
        <section className="repair-list">
            <article className="repair-list__type-wrapper">
                {(currentsBreaks.find(el => el.stages === RepairStage.Register) || windowInnerWidth > 1200) &&
                    <h2 className="repair-list__sub-title">Зарегистрированы</h2>
                }
                {currentsBreaks.filter(el => el.stages === RepairStage.Register).map(el => <BreakElement repair={el}
                                                                                                         key={el.breakName}/>)}
            </article>
            <article className="repair-list__type-wrapper">
                {(currentsBreaks.find(el => el.stages === RepairStage.RepairSuccess) || windowInnerWidth > 1200) &&
                    <h2 className="repair-list__sub-title">Поломка подтверждена</h2>
                }
                {currentsBreaks.filter(el => el.stages === RepairStage.RepairSuccess).map(el => <BreakElement repair={el}
                                                                                                              key={el.breakName}/>)}
            </article>
            <article className="repair-list__type-wrapper">
                {currentsBreaks.find(el => (el.stages === RepairStage.Repairing) || (el.stages === RepairStage.Supply) || windowInnerWidth > 1200) &&
                    <h2 className="repair-list__sub-title">Ремонтируются</h2>
                }
                {currentsBreaks.filter(el => (el.stages === RepairStage.Repairing) || (el.stages === RepairStage.Supply)).map(el =>
                    <BreakElement repair={el} key={el.breakName}/>)}
            </article>
            <article className="repair-list__type-wrapper">
                {(currentsBreaks.find(el => el.stages === RepairStage.RepairCompleted) || windowInnerWidth > 1200) &&
                    <h2 className="repair-list__sub-title">Ремонт завершен</h2>
                }
                {currentsBreaks.filter(el => el.stages === RepairStage.RepairCompleted).map(el => <BreakElement repair={el}
                                                                                                                key={el.breakName}/>)}
            </article>
        </section>
    );
}

export default BreaksList;