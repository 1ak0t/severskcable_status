import {Repair} from "../../types/initialState.type";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useState} from "react";
import {setRepair} from "../../store/actions";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../constants";
import classNames from "classnames";

type RepairFormProps = {
    repair: Repair,
}
function RepairForm({repair}: RepairFormProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentUser = useAppSelector(state => state.currentUser);
    const [comment, setComment] = useState('');
    const currentTime = dayjs();

    const onCommentChange = (com: any) => {
        setComment(com.target.value);
    };

    const onSubmit = () => {
        const newRepair: Repair = {
            id: repair.id,
            breakName: repair.breakName,
            operator: repair.operator,
            breakDate: repair.breakDate,
            executor: currentUser,
            repairDate: currentTime.format('YYYY-MM-DD HH:MM'),
            repairDuration: currentTime.diff(dayjs(repair.breakDate), 'hours'),
            comment: comment,
            priority: repair.priority,
            status: true
        }

        dispatch(setRepair(newRepair));
        navigate(AppRoutes.GoodSend);
    }

    return(
        <>
            <div className="repair-form__result">
                <span>Поломка:</span>
                <span className="repair-form__data">{repair.breakName}</span>
                <span>Зарегистрировал:</span>
                <span className="repair-form__data">{repair.operator}</span>
                <span>Дата поломки:</span>
                <span className="repair-form__data">{repair.breakDate}</span>
                <span>Исполнитель ремонта:</span>
                <span className="repair-form__data">{currentUser}</span>
                <span>Дата завершения ремонта:</span>
                <span className="repair-form__data">{currentTime.format('YYYY-MM-DD HH:MM').toString()}</span>
                <span>Время простоя:</span>
                <span className="repair-form__data">{currentTime.diff(dayjs(repair.breakDate), 'hours')} часов</span>
                <textarea className="repair-form__comment" onChange={onCommentChange} placeholder="Комментарий о проделанной работе (мин 20 символов)" required={true}></textarea>
                <button disabled={comment.length < 20} className={classNames(
                    "repair-form__submit",
                    {"repair-form__submit--inactive": comment.length < 20}
                )} onClick={onSubmit}>Отправить</button>
            </div>
        </>
    );
}

export default RepairForm;