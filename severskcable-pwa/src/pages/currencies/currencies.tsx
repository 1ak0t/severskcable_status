import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import Investing_com from "../../components/investing_com/investing_com";

type apiDataType = {
    Date: string;
    PreviousDate: string;
    PreviousURL: string;
    Timestamp: string;
    Valute: any
}

function CurrenciesPage () {
    const [apiData, setApiData] = useState<apiDataType>();
    const [isInvesting, setIsInvesting] = useState(false);

    useEffect(() => {
        getUSDCurrency();
    }, []);

    const getUSDCurrency = () => {
        fetch("https://www.cbr-xml-daily.ru/daily_json.js")
            .then((res) => res.json())
            .then((data) => setApiData(data));
    }


    return(
        <div className="currencies-page">
            <Helmet>
                <title>Курсы</title>
            </Helmet>
            <h1 className="currencies-page__title">Курсы</h1>
            <p>Актуальный курс доллара ЦБ
                от <b>{apiData ? dayjs(apiData.Date).format("DD.MM.YYYY") : ""}</b> равен <b>{apiData ? apiData.Valute.USD.Value : ""} руб.</b>
            </p>
            <button className="analytics-page__period-button" onClick={() => setIsInvesting(!isInvesting)}>{isInvesting ? "Скрыть investing.com" : "Показать Investing.com"}</button>
            {isInvesting && <Investing_com />}
            <BottomMenu/>
        </div>
    );
}

export default CurrenciesPage;