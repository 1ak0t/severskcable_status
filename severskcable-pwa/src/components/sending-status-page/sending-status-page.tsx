import {Link, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getBreakCreatedStatus, getBreakCreatingStatus} from "../../store/data-process/selectors";
import {SyncLoader} from "react-spinners";
import {FcHighPriority, FcOk} from "react-icons/fc";
import {setNewBreakFinished} from "../../store/data-process/data-process";

function SendingStatusPage() {
    const navigate = useNavigate();
    const isCreatingBreak = useAppSelector(getBreakCreatingStatus);
    const isCreatedBreak = useAppSelector(getBreakCreatedStatus);
    const dispatch = useAppDispatch();

    return (
        <>
            {isCreatingBreak &&
                <div className="sending-page">
                    <SyncLoader
                        color={"#EA753EFF"}
                        size={15}
                        margin={8}
                    />
                    <span className="sending-page__status">Регистрируем поломку</span>
                </div>
            }
            {isCreatedBreak &&
                <>
                    <div className="sending-page">
                        <FcOk size={150}/>
                        <span className="sending-page__status">Поломка принята</span>
                    </div>
                    <div className="sending-page__button-wrapper">
                        <Link className="sending-page__button" to={AppRoutes.BreakRegistration}
                              onClick={() => dispatch(setNewBreakFinished())}>Зарегистрировать еще</Link>
                        <Link className="sending-page__button" to={AppRoutes.Root}
                              onClick={() => dispatch(setNewBreakFinished())}>На главную</Link>
                    </div>
                </>
            }
            {!isCreatedBreak && isCreatedBreak !== null &&
                <>
                    <div className="sending-page">
                        <FcHighPriority size={150}/>
                        <span className="sending-page__status">Не получилось отправить</span>
                    </div>
                    <div className="sending-page__button-wrapper">
                        <button className="sending-page__button" onClick={() => dispatch(setNewBreakFinished())}>Попробовать еще раз</button>
                        <Link className="sending-page__button" to={AppRoutes.Root} onClick={() => dispatch(setNewBreakFinished())}>На главную</Link>
                    </div>
                </>
            }
        </>

    );
}

export default SendingStatusPage;