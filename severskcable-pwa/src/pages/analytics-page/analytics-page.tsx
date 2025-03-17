import {Helmet} from "react-helmet-async";
import React, {CSSProperties, useRef, useState} from "react";
import {getBreaks, getMachines} from "../../store/data-process/selectors";
import {useAppSelector} from "../../hooks";
import Calendar from "react-calendar";
import './analytics-page.scss';
import dayjs from "dayjs";
import {Break, MachineType} from "../../types/initialState.type";
import companyLogo from "../../imgs/logo-main.svg";
import {SyncLoader} from "react-spinners";
import classNames from "classnames";
import isBetween from 'dayjs/plugin/isBetween'
import {OptionTypes, Value} from "../../types/types";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import MachineAnalytic from "../../components/machine-analytic/machine-analytic";
import {getPeriodDayjs} from "../../helpers/helpers";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid, Funnel, FunnelChart,
    Label, LabelList, ReferenceLine,
    ResponsiveContainer, Sankey,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {BsXLg} from "react-icons/bs";
import MachineAnalyticInner from "../../components/machine-analytic-inner/machine-analytic-inner";
import {buildCreateSlice} from "@reduxjs/toolkit";

dayjs.extend(isBetween);

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

function AnalyticsPage() {
    const breaks = useAppSelector(getBreaks);
    const machines = useAppSelector(getMachines);
    const [period, setPeriod] = useState<Value>([dayjs().date(1).set("hour", 0).set('minute', 0).set('second', 0).toDate(), dayjs().toDate()]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMachine, setCurrentMachine] = useState<string | null>(null);
    let machineList: OptionTypes[] = [];
    machines.map(machine => machineList.push({label: machine.name, value: machine.name}));

    const getMinDate = (breaks : Break[]) => {
        return dayjs(breaks[0].registerDate).toDate();
    }

    const getMaxDate = () => {
        return dayjs().toDate();
    }

    const calendarOnChange = (value: Value) => {
        setPeriod(value);
        setIsCalendarOpen(false);
    }

    if (breaks.length === 0) {
        return (
            <>
                <img src={companyLogo} className="app__load-img" alt="logo"/>
                <SyncLoader
                    color={"#EA753EFF"}
                    cssOverride={override}
                    size={15}
                    margin={8}
                />
            </>
        );
    }

    const hoursInPeriod = Math.round(dayjs(getPeriodDayjs(period)[1]).diff(dayjs(getPeriodDayjs(period)[0]), 'minutes')/60);

    const getBreaksInPeriod = (breaks: Break[], currentMachine: string, priority?: number) => {
        const breaksInPeriod: Break[] = breaks.filter(el => (
                dayjs(el.registerDate).isBetween(dayjs(getPeriodDayjs(period)[0]).add(7, 'hours'), dayjs(getPeriodDayjs(period)[1]).add(7, 'hours'))
                || dayjs(el.repairEndDate).isBetween(dayjs(getPeriodDayjs(period)[0]).add(7, 'hours'), dayjs(getPeriodDayjs(period)[1]).add(7, 'hours'))
                || (dayjs(el.registerDate).isBefore(dayjs(getPeriodDayjs(period)[0]).add(7, 'hours')) && el.repairEndDate === undefined))
            || (dayjs(el.registerDate).isBefore(dayjs(getPeriodDayjs(period)[0]).add(7, 'hours')) && dayjs(el.repairEndDate).isAfter(dayjs(getPeriodDayjs(period)[1]).add(7, 'hours')))
        );

        return priority ?
            breaksInPeriod.filter(el => el.machine.name === currentMachine).filter(el => el.priority === priority) :
            breaksInPeriod.filter(el => el.machine.name === currentMachine);
    }

    const getBreaksHoursInPeriodByMachine = (breaks: Break[], currentMachine: string, periodDays: Value, priority?: number, byDay?: boolean) => {
        let breaksHoursInPeriod = 0;
        const hoursInPeriodInn = Math.round(dayjs(getPeriodDayjs(periodDays)[1]).diff(dayjs(getPeriodDayjs(periodDays)[0]), 'minutes')/60);
        let endOfCount = dayjs(getPeriodDayjs(periodDays)[0]);

        getBreaksInPeriod(breaks, currentMachine, priority).some(el => {
            if (dayjs(el.registerDate).isBefore(dayjs(getPeriodDayjs(periodDays)[0])) && dayjs(el.repairEndDate).isAfter(dayjs(getPeriodDayjs(periodDays)[1]))) {
                breaksHoursInPeriod = hoursInPeriodInn;
                return true;
            }
            if (dayjs(el.registerDate).isBefore(endOfCount) && el.repairEndDate !== undefined && dayjs(el.repairEndDate).isBetween(endOfCount, getPeriodDayjs(periodDays)[1])) {
                const diff = Math.round(dayjs(el.repairEndDate).diff(dayjs(endOfCount), 'minutes') / 60);
                breaksHoursInPeriod = breaksHoursInPeriod + diff;
                endOfCount = dayjs(el.repairEndDate);
            }
            if (dayjs(el.registerDate).isBefore(endOfCount) && el.repairEndDate !== undefined && dayjs(el.repairEndDate).isAfter(getPeriodDayjs(periodDays)[1])) {
                const diff = Math.round(dayjs(getPeriodDayjs(periodDays)[1]).diff(dayjs(endOfCount), 'minutes') / 60);
                breaksHoursInPeriod = breaksHoursInPeriod + diff;
                endOfCount = dayjs(el.repairEndDate);
            }
            if (dayjs(el.registerDate).isBefore(endOfCount) && el.repairEndDate === undefined) {
                const diff = Math.round(dayjs(getPeriodDayjs(periodDays)[1]).diff(dayjs(endOfCount), 'minutes') / 60);
                if(byDay) {
                    breaksHoursInPeriod = diff;
                    return true;
                } else {
                    breaksHoursInPeriod = breaksHoursInPeriod + diff + 7;
                }
                endOfCount = dayjs(getPeriodDayjs(periodDays)[1]);
            }
            if (dayjs(el.registerDate).isAfter(endOfCount) && el.repairEndDate === undefined) {
                const diff = Math.round(dayjs(getPeriodDayjs(periodDays)[1]).add(-7, 'hours').diff(dayjs(el.registerDate), 'minutes') / 60);
                if (diff >= 0 && byDay) {
                    breaksHoursInPeriod = breaksHoursInPeriod + diff;
                    if (byDay){
                        return true;
                    }
                    endOfCount = dayjs(getPeriodDayjs(periodDays)[1]);
                }
            }
            if (dayjs(el.registerDate).isAfter(endOfCount) && dayjs(el.repairEndDate).isBefore(getPeriodDayjs(periodDays)[1])) {
                const diff = Math.round((dayjs(el.repairEndDate)).diff(dayjs(el.registerDate), 'minutes') / 60);
                breaksHoursInPeriod = breaksHoursInPeriod + diff;
                endOfCount = dayjs(el.repairEndDate);
            }
            if (dayjs(el.registerDate).isAfter(endOfCount) && dayjs(el.repairEndDate).isAfter(getPeriodDayjs(periodDays)[1]) && (dayjs(el.registerDate).isBetween(getPeriodDayjs(periodDays)[0],getPeriodDayjs(periodDays)[1]))) {
                const diff = Math.round((dayjs(getPeriodDayjs(periodDays)[1])).diff(dayjs(el.registerDate), 'minutes') / 60);
                breaksHoursInPeriod = breaksHoursInPeriod + diff;
                endOfCount = dayjs(getPeriodDayjs(periodDays)[1]);
            }
        });

        return {
            machine: currentMachine,
            date: dayjs(getPeriodDayjs(periodDays)[0]).format("DD.MM"),
            breakHours: breaksHoursInPeriod,
        };
    }

    return (
        <div className="analytics-page">
            <Helmet>
                <title>Аналитика</title>
            </Helmet>
            <h1 className="analytics-page__title">Аналитика</h1>
            {getPeriodDayjs(period).length > 0 ?
                <div className="analytics-page__period">
                    {getPeriodDayjs(period)[0].format('DD.MM.YYYY').toString()} - {getPeriodDayjs(period)[1].format('DD.MM.YYYY').toString()}
                </div> : null
            }
            <div className="analytics-page__hours">Часов в периоде: {hoursInPeriod}</div>
            <button className="analytics-page__period-button" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>Изменить период</button>
            <Calendar
                className={classNames(
                    {"react-calendar--inactive": !isCalendarOpen}
                )}
                minDate={getMinDate(breaks)}
                maxDate={getMaxDate()}
                selectRange={true}
                onChange={calendarOnChange}
                value={period}
            />
            <div className="analytics-page__machines">
                {machines.map(machine => {
                    return(
                        <>
                            <MachineAnalytic
                                machine={machine}
                                breaks={breaks}
                                hoursInPeriod={hoursInPeriod}
                                getBreaksHoursInPeriodByMachine={getBreaksHoursInPeriodByMachine}
                                period={period}
                                setCurrentMachine={setCurrentMachine}
                            />
                        </>
                    );
                })}
            </div>
            {currentMachine !== null &&
                <MachineAnalyticInner setCurrentMachine={setCurrentMachine} currentMachine={currentMachine} breaks={breaks} period={period} hoursInPeriod={hoursInPeriod} getBreaksHoursInPeriodByMachine={getBreaksHoursInPeriodByMachine} getBreaksInPeriod={getBreaksInPeriod}/>

            }
            <BottomMenu/>
        </div>
    );
}

export default AnalyticsPage;