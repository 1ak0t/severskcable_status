import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../constants";

function GoodSend() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate(AppRoutes.Root);
        }, 2000)
    }, []);

    return (
        <div className="good-send-page">
            <h1 className="good-send-page__title">Ваши данные успешно отправлены</h1>
        </div>
    );
}

export default GoodSend;