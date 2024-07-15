import {RepairElementType} from "../../types/types";

type RepairElementProps = {
    repair: RepairElementType
}

function RepairElement({repair}: RepairElementProps) {
    return(
        <article className="repair-element">
            <h2 className="repair-element__title">{repair.machine}</h2>
            <span>Поломка:</span>
            <span>{repair.repair.breakName}</span>
            <span>Зарегистрировал:</span>
            <span>{repair.repair.operator}</span>
            <span>Дата:</span>
            <span>{repair.repair.breakDate}</span>
        </article>
    );
}

export default RepairElement;