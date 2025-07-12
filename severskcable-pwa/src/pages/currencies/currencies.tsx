import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import Investing_com from "../../components/investing_com/investing_com";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getCurrencies} from "../../store/data-process/selectors";

type apiDataType = {
    Date: string;
    PreviousDate: string;
    PreviousURL: string;
    Timestamp: string;
    Valute: any
}

function CurrenciesPage () {
    const [isInvesting, setIsInvesting] = useState(false);
    const currencies = useAppSelector(getCurrencies);


    return(
        <div className="currencies-page">
            <Helmet>
                <title>Курсы</title>
            </Helmet>
            <h1 className="currencies-page__title">Курсы</h1>
            {currencies.map(currency =>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Курс меди(USD)</th>
                            <th>Курс доллара(руб.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{dayjs(currency.createdAt).format('DD.MM.YYYY')}</td>
                            <td>{currency.cooper}</td>
                            <td>{currency.usd}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            <button className="analytics-page__period-button" onClick={() => setIsInvesting(!isInvesting)}>{isInvesting ? "Скрыть investing.com" : "Показать Investing.com"}</button>
            {isInvesting && <Investing_com />}
            <BottomMenu/>
        </div>
    );
}

export default CurrenciesPage;