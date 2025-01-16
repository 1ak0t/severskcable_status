import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {useAppSelector} from "../../hooks";
import {getBreaks} from "../../store/data-process/selectors";
import {useDispatch} from "react-redux";
import {publicVapidKey, RepairStage} from "../../constants";
import SuppliesByBreak from "../../components/supplies-by-break/supplies-by-break";
import {urlBase64ToUint8Array} from "../../helpers/helpers";
import React, {useEffect, useState} from "react";
import {getUser} from "../../store/user-process/selectors";

function SupplyPage() {
    const [isSubscription, setIsSubscription] = useState(false);
    const breaks = useAppSelector(getBreaks);
    const user = useAppSelector(getUser);
    const dispatch = useDispatch();
    const breaksInSupplyStage = breaks.filter(el => el.stages === RepairStage.Supply);

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
        <div className="supply-page">
            <Helmet>
                <title>Текущие запросы снабжения</title>
            </Helmet>
            <h1 className="supply-page__title">Текущие запросы снабжения</h1>
            {!isSubscription && <button onClick={async () => {
                await send();
            }}>Подписаться</button>}
            {breaksInSupplyStage.length > 0 && breaksInSupplyStage.map(el => <SuppliesByBreak repair={el} />)}
            <BottomMenu />
        </div>
    );
}

export default SupplyPage;