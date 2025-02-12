import {Break, SupplyOrdersType, SupplyStatus} from "../../types/initialState.type";
import classNames from "classnames";
import {MachinesStatus, RepairStage, UserRoles} from "../../constants";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getSupplyOrders} from "../../store/data-process/selectors";
import {getUser} from "../../store/user-process/selectors";
import {updateBreakStageAction, updateSupplyAction} from "../../store/api-actions";
import dayjs from "dayjs";
import SupplyOrder from "../supply-order/supply-order"

type SupplyOrderPropsType = {
    repair: Break;
}

function SuppliesByBreak ({repair}: SupplyOrderPropsType) {
    const supplies = useAppSelector(getSupplyOrders);
    const user = useAppSelector(getUser);
    const [isOpened, setIsOpened] = useState(false);
    const currentSuppliesByBreak = supplies.filter(supply => supply.break.id === repair.id);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if ((currentSuppliesByBreak.length > 0) && (currentSuppliesByBreak.filter(order => order.supplyStatus === SupplyStatus.InStock).length === currentSuppliesByBreak.length)) {
            dispatch(updateBreakStageAction({id: repair.id, stages: RepairStage.Repairing, machine: repair.machine.id}));
        }
    }, [supplies])

    const getToWork = () => {
        currentSuppliesByBreak.filter(order => order.supplyStatus === SupplyStatus.New).map(order => {
            dispatch(updateSupplyAction({id: order.id, supplyStatus: SupplyStatus.Accepted, acceptedDate: dayjs().toString()}))
        });
    }

    return (
        <>
            <div className='supply-element'>
                <div className='supply-element__header' onClick={() => {
                    setIsOpened(!isOpened);
                }}>
                    <div className={classNames(
                        'supply-element__header-machine'
                    )}>
                        <div className='supply-element__machine-wrapper'>
                            <span className="supply-element__title">{repair.machine.name}</span>
                            <span className="supply-element__machine-status">{repair.machine.status}</span>
                        </div>
                    </div>
                    <span><b>Поломка: </b>{repair.breakName}</span>
                    {(currentSuppliesByBreak.find(order => order.supplyStatus === SupplyStatus.New) && (user.role.includes(UserRoles.Supply) || user.role.includes(UserRoles.Admin))) &&
                        <button className='supply-element__header-accept-button' onClick={() => getToWork()}>Взять в работу</button>
                    }
                </div>
                <div className={classNames(
                    "supply-element__stages",
                    {"supply-element__stages__closed": isOpened === false},
                    {"supply-element__stages__opened": isOpened === true}
                )}>
                    {currentSuppliesByBreak.map(supply => (
                        <SupplyOrder supply={supply}/>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SuppliesByBreak;