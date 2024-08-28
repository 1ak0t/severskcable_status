import {RepairElementType} from "../../types/types";
import classNames from "classnames";
import {MachinesStatus, RepairStage} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {deleteRepair, setRepair, setRepairStage} from "../../store/actions";
import {useState} from "react";
import {Repair} from "../../types/initialState.type";
import dayjs from "dayjs";
import {getDurationString} from "../../helpers/helpers";

type RepairElementProps = {
    repair: RepairElementType,
    agreement?: boolean,
}

function BreakElement({repair, agreement}: RepairElementProps) {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.user.name);
    const [comment, setComment] = useState('');
    const currentTime = dayjs();

    const onCommentChange = (com: any) => {
        setComment(com.target.value);
    };

    const onSubmitHeadEngineer = () => {
        const newRepair: Repair = {
            id: repair.repair.id,
            breakName: repair.repair.breakName,
            registerPerson: repair.repair.registerPerson,
            registerDate: repair.repair.registerDate,
            repairEndPerson: currentUser,
            repairEndDate: currentTime.format('YYYY-MM-DD HH:MM'),
            comment: comment,
            priority: repair.repair.priority,
            status: false,
            stages: null
        }

        dispatch(setRepair(newRepair));
        dispatch(setRepairStage({repair: repair.repair.id, stage: RepairStage.RepairCompleted, user: currentUser, date: dayjs().toString()}));
    }

    return(
        <div className={classNames(
            'repair-element',
            {'repair-element--medium-priority': repair.machineStatus === MachinesStatus.Warning},
            {'repair-element--low-priority': repair.machineStatus === MachinesStatus.Inspection}
        )}>
            <h2 className="repair-element__title">{repair.machine}</h2>
            <div className="repair-element__row">
                <span>Поломка:</span>
                <span>{repair.repair.breakName}</span>
            </div>
            {repair.repair.stages !== null &&
                <div className="repair-element__row">
                    <span>Этап ремонта:</span>
                    <span>{repair.repair.stages}</span>
                </div>
            }
            <div className="repair-element__row">
                <span>Зарегистрировал:</span>
                <span>{repair.repair.registerPerson}</span>
            </div>
            <div className="repair-element__row">
                <span>Дата:</span>
                <span>{repair.repair.registerDate}</span>
            </div>
            {repair.repair.status &&
                <>
                    <div className="repair-element__row">
                        <span>Выполнил ремонт:</span>
                        <span>{repair.repair.repairingPerson}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Дата завершения ремонта:</span>
                        <span>{repair.repair.repairEndDate}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Длительность ремонта:</span>
                        <span>{getDurationString(dayjs(repair.repair.registerDate), dayjs(repair.repair.repairEndDate))}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Что проделано:</span>
                        <span>{repair.repair.comment}</span>
                    </div>
                </>
            }
            {(agreement && repair.repair.stages === RepairStage.Register) &&
                <div className="repair-element__button-wrapper">
                    <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(setRepairStage({repair: repair.repair.id, stage: RepairStage.RepairSuccess, user: currentUser, date: dayjs().toString()}))}>Подтвердить</button>
                    <button className="repair-element__button repair-element__button--reject" onClick={() => dispatch(deleteRepair(repair.repair.id))}>Отклонить</button>
                </div>
            }
            {(agreement && repair.repair.stages === RepairStage.RepairSuccess) &&
                <div className="repair-element__button-wrapper">
                    <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(setRepairStage({repair: repair.repair.id, stage: RepairStage.Repairing, user: currentUser, date: dayjs().toString()}))}>Начать ремонт</button>
                </div>
            }
            {(agreement && repair.repair.stages === RepairStage.Repairing) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={onCommentChange} cols={30} rows={10} placeholder="Комментарий о проделанной работе (мин 20 символов)" required={true}></textarea>
                    <button disabled={comment.length < 20} className={classNames(
                        'repair-element__button repair-element__button--success',
                        {'repair-element__button--inactive': comment.length < 20}
                    )} onClick={onSubmitHeadEngineer}>Завершить ремонт</button>
                </div>
            }
            {(agreement && repair.repair.stages === RepairStage.RepairCompleted) &&
                <div className="repair-element__button-wrapper">
                    <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(setRepairStage({repair: repair.repair.id, stage: null, user: currentUser, date: dayjs().toString()}))}>Подтвердить</button>
                    <button className="repair-element__button repair-element__button--reject" onClick={() => dispatch(setRepairStage({repair: repair.repair.id, stage: RepairStage.RepairSuccess, user: currentUser, date: dayjs().toString()}))}>Отклонить</button>
                </div>
            }
        </div>
    );
}

export default BreakElement;