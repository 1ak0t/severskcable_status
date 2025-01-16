import './status-page.scss';
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import Machine from "../../components/machine/machine";
import {Helmet} from "react-helmet-async";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {AppRoutes, MachinesStatus, publicVapidKey} from "../../constants";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getBreaks, getMachines} from "../../store/data-process/selectors";
import {getUser} from "../../store/user-process/selectors";
import {setNewBreakFinished} from "../../store/data-process/data-process";
import {urlBase64ToUint8Array} from "../../helpers/helpers";
import {fetchAllData} from "../../store/api-actions";
import {store} from "../../store";

function StatusPage () {
    const [isSubscription, setIsSubscription] = useState(false);
    const machines = useAppSelector(getMachines);
    const breaks = useAppSelector(getBreaks);
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const [isFirstsRender, setIsFirstRender] = useState(true);
    const sortedMachines = [...machines].sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Inspection) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Work) {
            return 1;
        }
        return 0;
    }).sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Warning) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Inspection) {
            return 1;
        }
        return 0;
    }).sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Wrong) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Warning) {
            return 1;
        }
        return 0;
    });

    const send = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw { errorCode: "ServiceWorkerAndPushManagerNotSupported" };
        }

        // Wait for Service Worker to be ready
        const registration = await navigator.serviceWorker.ready;

        // Check for pushManager in registration
        if (!registration.pushManager) {
            throw { errorCode: "PushManagerUnavailable" };
        }

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            setIsSubscription(true);
            throw { errorCode: "ExistingSubscription" };
        }

        // Convert VAPID key for use in subscription
        const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);
        const subscription = await registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
        })


        await fetch(`https://corp.severskcable.ru:4875/users/${user.id}/subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });

    };

    const checkSubscription = async () => {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            setIsSubscription(true);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            checkSubscription().catch(err => console.error(err));
            // @ts-ignore
            navigator.setAppBadge(user.notificationsCount);
        }
    },[]);

    return (
        <div className="status-page">
            <Helmet>
                <title>Статусы оборудования</title>
            </Helmet>
            <h1 className="status-page__title">Статусы оборудования</h1>
            {!isSubscription && <button onClick={async () => {
                await send();
            }}>Подписаться</button>}
            <section className="status-page__machines">
                {sortedMachines.map(machine => {
                    const breaksByMachine = breaks.filter(el => el.machine.id === machine.id);
                    if (breaksByMachine.length > 0 && breaksByMachine.find(el => !el.status)) {
                        return <Machine name={machine.name} status={machine.status} currentRepairs={breaksByMachine}
                                        id={machine.id} key={machine.id}/>;
                    } else {
                        return <Machine name={machine.name} status={machine.status} id={machine.id}
                                        key={machine.id}/>;
                    }

                })}
            </section>
            <Link to={AppRoutes.BreakRegistration} onClick={() => dispatch(setNewBreakFinished())} className="status-page__add-break-button"></Link>
            <BottomMenu/>
        </div>
    );
}

export default StatusPage;