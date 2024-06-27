import {useState} from "react";
import {Link} from "react-router-dom";
import {AppRoutes} from "../../constants";

function BottomMenu () {
    const [isMainButtonClicked, setMainButtonClicked] = useState(false);

    return(
        <>
            {isMainButtonClicked && <div className="sub-menu">
                <Link to={AppRoutes.BreakRegistration} className="sub-menu__button sub-menu__button--work">Завершить ремонт</Link>
                <Link to={AppRoutes.BreakRegistration} className="sub-menu__button sub-menu__button--wrong">Сообщить о поломке</Link>
            </div>}
            <div className="bottom-menu">
                <Link to={AppRoutes.Root} className="bottom-menu__button">Статусы<br></br>оборудования</Link>
                <button className="bottom-menu__main-button" onClick={() => setMainButtonClicked(!isMainButtonClicked)}>Сообщить о поломке/ремонте</button>
                <button className="bottom-menu__button">Уведомления</button>
            </div>
        </>
    );
}

export default BottomMenu;