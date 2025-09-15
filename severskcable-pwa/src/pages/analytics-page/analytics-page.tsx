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
import MachineAnalyticInner from "../../components/machine-analytic-inner/machine-analytic-inner";
import * as XLSX from "xlsx-js-style";
import {ExcelRowType} from "../../types/export.type";

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

    const excelRows: ExcelRowType = [];

    const getDurationsByMachine = (currentMachine: string) => {

        const breaksHoursFirstPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 1).breakHours;
        const breaksHoursSecondPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 2).breakHours;
        const breaksHoursThirdPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 3).breakHours;
        const breaksHoursStopPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 4).breakHours;

        const breaksInPeriod = getBreaksInPeriod(breaks, currentMachine);
        let successDuration = 0;
        breaksInPeriod.filter(el => el.registerDate && el.successDate).map(el => {
            successDuration = successDuration + dayjs(el.successDate).diff(dayjs(el.registerDate), 'minute')
        });
        let repairWaitingDuration = 0;
        breaksInPeriod.filter(el => el.successDate && el.repairingDate).map(el => {
            repairWaitingDuration = repairWaitingDuration + dayjs(el.repairingDate).diff(dayjs(el.successDate), 'minute')
        });
        let repairingDuration = 0;
        breaksInPeriod.filter(el => el.repairingDate && el.repairCompletedDate).map(el => {
            repairingDuration = repairingDuration + dayjs(el.repairCompletedDate).diff(dayjs(el.repairingDate), 'minute')
        });
        let repairAcceptDuration = 0;
        breaksInPeriod.filter(el => el.repairCompletedDate && el.repairEndDate).map(el => {
            repairAcceptDuration = repairAcceptDuration + dayjs(el.repairEndDate).diff(dayjs(el.repairCompletedDate), 'minute')
        });
        const allStagesDuration = successDuration + repairWaitingDuration + repairingDuration + repairAcceptDuration;
        const allStagesDurationByType = breaksHoursFirstPriority + breaksHoursSecondPriority + breaksHoursThirdPriority + breaksHoursStopPriority;

        let machineRow = excelRows.find(row => row.machine === currentMachine);

        if(machineRow) {
            machineRow.breaksHoursFirstPriority = breaksHoursFirstPriority;
            machineRow.breaksHoursFirstPriorityPercent = Math.round(breaksHoursFirstPriority * 100 / hoursInPeriod);
            machineRow.breaksHoursSecondPriority = breaksHoursSecondPriority;
            machineRow.breaksHoursSecondPriorityPercent = Math.round(breaksHoursSecondPriority * 100 / hoursInPeriod);
            machineRow.breaksHoursThirdPriority = breaksHoursThirdPriority;
            machineRow.breaksHoursThirdPriorityPercent = Math.round(breaksHoursThirdPriority * 100 / hoursInPeriod);
            machineRow.breaksHoursStopPriority = breaksHoursStopPriority;
            machineRow.breaksHoursStopPriorityPercent = Math.round(breaksHoursStopPriority * 100 / hoursInPeriod);
            machineRow.allStagesDuration = allStagesDurationByType;
            machineRow.successDurationPercent = Math.round(successDuration * 100 / allStagesDuration);
            machineRow.successDuration = Number((machineRow.successDurationPercent*allStagesDurationByType/100).toFixed(2));
            machineRow.repairWaitingDurationPercent = Math.round(repairWaitingDuration * 100 / allStagesDuration);
            machineRow.repairWaitingDuration = Number((machineRow.repairWaitingDurationPercent*allStagesDurationByType/100).toFixed(2));
            machineRow.repairingDurationPercent = Math.round(repairingDuration * 100 / allStagesDuration);
            machineRow.repairingDuration = Number((machineRow.repairingDurationPercent*allStagesDurationByType/100).toFixed(2));
            machineRow.repairAcceptDurationPercent = Math.round(repairAcceptDuration * 100 / allStagesDuration);
            machineRow.repairAcceptDuration = Number((machineRow.repairAcceptDurationPercent*allStagesDurationByType/100).toFixed(2));
        }
    }

    const handleDownload = () => {
        machines.map(machine => getDurationsByMachine(machine.name));
        // flatten object like this {id: 1, title:'', category: ''};
        const rows = excelRows.map((row) => ({
            machine: row.machine,
            efficiency: row.efficiency,
            hours: hoursInPeriod,
            breaksHoursFirstPriority: row.breaksHoursFirstPriority,
            breaksHoursFirstPriorityPercent: row.breaksHoursFirstPriorityPercent,
            breaksHoursSecondPriority: row.breaksHoursSecondPriority,
            breaksHoursSecondPriorityPercent: row.breaksHoursSecondPriorityPercent,
            breaksHoursThirdPriority: row.breaksHoursThirdPriority,
            breaksHoursThirdPriorityPercent: row.breaksHoursThirdPriorityPercent,
            breaksHoursStopPriority: row.breaksHoursStopPriority,
            breaksHoursStopPriorityPercent: row.breaksHoursStopPriorityPercent,
            allStagesDuration: Number.isNaN(row.allStagesDuration) ? 0 : row.allStagesDuration,
            successDuration: Number.isNaN(row.successDuration) ? 0 : row.successDuration,
            successDurationPercent: Number.isNaN(row.successDurationPercent) ? 0 : row.successDurationPercent,
            repairWaitingDuration: Number.isNaN(row.repairWaitingDuration) ? 0 : row.repairWaitingDuration,
            repairWaitingDurationPercent: Number.isNaN(row.repairWaitingDurationPercent) ? 0 : row.repairWaitingDurationPercent,
            repairingDuration: Number.isNaN(row.repairingDuration) ? 0 : row.repairingDuration,
            repairingDurationPercent: Number.isNaN(row.repairingDurationPercent) ? 0 : row.repairingDurationPercent,
            repairAcceptDuration: Number.isNaN(row.repairAcceptDuration) ? 0 : row.repairAcceptDuration,
            repairAcceptDurationPercent: Number.isNaN(row.repairAcceptDurationPercent) ? 0 : row.repairAcceptDurationPercent,
        }));

        const sumHours = hoursInPeriod*rows.length;
        const sumBreaksHoursFirstPriority = rows.reduce((sum = 0, x) => sum + (x.breaksHoursFirstPriority !== undefined ? x.breaksHoursFirstPriority : 0), 0);
        const sumBreaksHoursSecondPriority = rows.reduce((sum = 0, x) => sum + (x.breaksHoursSecondPriority !== undefined ? x.breaksHoursSecondPriority : 0), 0);
        const sumBreaksHoursThirdPriority = rows.reduce((sum = 0, x) => sum + (x.breaksHoursThirdPriority !== undefined ? x.breaksHoursThirdPriority : 0), 0);
        const sumBreaksHoursStopPriority = rows.reduce((sum = 0, x) => sum + (x.breaksHoursStopPriority !== undefined ? x.breaksHoursStopPriority : 0), 0);
        const sumAllStagesDuration = rows.reduce((sum = 0, x) => sum + (x.allStagesDuration !== undefined ? x.allStagesDuration : 0), 0);
        const sumSuccessDuration = rows.reduce((sum = 0, x) => sum + (x.successDuration !== undefined ? x.successDuration : 0), 0);
        const sumRepairWaitingDuration = rows.reduce((sum = 0, x) => sum + (x.repairWaitingDuration !== undefined ? x.repairWaitingDuration : 0), 0);
        const sumRepairingDuration = rows.reduce((sum = 0, x) => sum + (x.repairingDuration !== undefined ? x.repairingDuration : 0), 0);
        const sumRepairAcceptDuration = rows.reduce((sum = 0, x) => sum + (x.repairAcceptDuration !== undefined ? x.repairAcceptDuration : 0), 0);
        const sumEfficiency = rows.reduce((sum = 0, x) => sum + (x.efficiency !== undefined ? x.efficiency : 0), 0);

        rows.push({
            machine: "Итого по всем линиям",
            efficiency: Number((sumEfficiency/rows.length).toFixed(2)),
            hours: sumHours,
            breaksHoursFirstPriority: sumBreaksHoursFirstPriority,
            breaksHoursFirstPriorityPercent: Number((sumBreaksHoursFirstPriority*100/sumHours).toFixed(2)),
            breaksHoursSecondPriority: sumBreaksHoursSecondPriority,
            breaksHoursSecondPriorityPercent: Number((sumBreaksHoursSecondPriority*100/sumHours).toFixed(2)),
            breaksHoursThirdPriority: sumBreaksHoursThirdPriority,
            breaksHoursThirdPriorityPercent: Number((sumBreaksHoursThirdPriority*100/sumHours).toFixed(2)),
            breaksHoursStopPriority: sumBreaksHoursStopPriority,
            breaksHoursStopPriorityPercent: Number((sumBreaksHoursStopPriority*100/sumHours).toFixed(2)),
            allStagesDuration: sumAllStagesDuration,
            successDuration: sumSuccessDuration,
            successDurationPercent: Number((sumSuccessDuration*100/sumAllStagesDuration).toFixed(2)),
            repairWaitingDuration: sumRepairWaitingDuration,
            repairWaitingDurationPercent: Number((sumRepairWaitingDuration*100/sumAllStagesDuration).toFixed(2)),
            repairingDuration: sumRepairingDuration,
            repairingDurationPercent: Number((sumRepairingDuration*100/sumAllStagesDuration).toFixed(2)),
            repairAcceptDuration: sumRepairAcceptDuration,
            repairAcceptDurationPercent: Number((sumRepairAcceptDuration*100/sumAllStagesDuration).toFixed(2)),
        });

        const firstHeaders = [
            "",
            "",
            "",
            `Процент по типу поломки от ${hoursInPeriod} ч. в периоде`,
            "",
            "",
            "",
            "",
            "",
            `Доля в процентах по этапам, всего 100%`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ];

        const secondHeaders = [
            "Оборудование",
            "Эффективность, %",
            "Время работы в периоде, ч.",
            "Линия стоит, ч.",
            "Линия стоит, %",
            "Работает нештатно, ч.",
            "Работает нештатно, %",
            "Требует внимания, ч.",
            "Требует внимания, %",
            "Общее время ремонта, ч.",
            "Согласование, ч.",
            "Согласование, %",
            "Ожидание ремонта, ч.",
            "Ожидание ремонта, %",
            "Ремонт, ч.",
            "Ремонт, %",
            "Подтверждение ремонта, ч.",
            "Подтверждение ремонта, %"
        ];

        // create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Аналитика");

        // customize header names
        XLSX.utils.sheet_add_aoa(worksheet, [firstHeaders, secondHeaders]);
        XLSX.utils.sheet_add_json(worksheet, rows, {
            skipHeader: true,
            origin: -1,
        });

        worksheet["!merges"] = [
            { s: { c: 3, r: 0 }, e: { c: 8, r: 0 } },
            { s: { c: 9, r: 0 }, e: { c: 17, r: 0 } },
        ];

        worksheet['!cols'] = [
            { wpx: 150 },
            { wpx: 150 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
            { wpx: 180 },
        ]

        const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
        const rowCount = range.e.r;
        const columnCount = range.e.c;

        for (let row = 0; row <= rowCount; row++) {
            for (let col = 0; col <= columnCount; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                // Add center alignment to every cell
                worksheet[cellRef].s = {
                    alignment: { horizontal: "center" },
                    font: {sz: 11}
                };

                if (row === 1 || col === 0) {
                    // Format headers and names
                    worksheet[cellRef].s = {
                        ...worksheet[cellRef].s,
                        font: { bold: true, sz: 13 },
                    };
                }

                if (row === 0) {
                    // Format headers and names
                    worksheet[cellRef].s = {
                        ...worksheet[cellRef].s,
                        font: { bold: true, sz: 15},
                    };
                }

                if (row === 0 && col === 3) {
                    // Format headers and names
                    worksheet[cellRef].s = {
                        ...worksheet[cellRef].s,
                        fill: { fgColor: {rgb: "b9c6ff"} },
                    };
                }

                if (row === 0 && col === 9) {
                    // Format headers and names
                    worksheet[cellRef].s = {
                        ...worksheet[cellRef].s,
                        fill: { fgColor: {rgb: "b9ffe2"} },
                    };
                }
                if (row === 26) {
                    // Format headers and names
                    worksheet[cellRef].s = {
                        ...worksheet[cellRef].s,
                        fill: { fgColor: {rgb: "a6dfa4"} },
                        font: { bold: true, sz: 13 }
                    };
                }
            }
        }

        XLSX.writeFile(workbook, `Аналитика поломок(${getPeriodDayjs(period)[0].format('DD.MM.YYYY').toString()} - ${getPeriodDayjs(period)[1].format('DD.MM.YYYY').toString()}).xlsx`, { compression: true });
    };

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
            <button className="analytics-page__excel-button" onClick={handleDownload}>Скачать Excel</button>
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
                                excelRows={excelRows}
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