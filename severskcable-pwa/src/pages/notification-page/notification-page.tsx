import {Helmet} from "react-helmet-async";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getNotifications} from "../../store/data-process/selectors";
import Notification from "../../components/notification/notification";
import {useEffect} from "react";
import {resetNotificationCountAction} from "../../store/api-actions";
import {getUser} from "../../store/user-process/selectors";
import dayjs from "dayjs";
import {UserRoles} from "../../constants";

function NotificationPage() {
    const notifications = useAppSelector(getNotifications);
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    let notificationByUser = notifications.filter(not => !not.roles?.includes(UserRoles.Supply));
    if (user.role.includes(UserRoles.Supply)) {
        notificationByUser = notifications.filter(not => not.roles?.includes(UserRoles.Supply));
    } else if (user.role.includes(UserRoles.CEO) || user.role.includes(UserRoles.Admin)) {
        notificationByUser = notifications;
    }
    const notificationSorted = [...notificationByUser].sort((a, b) => {
        if (dayjs(a.createdAt).unix() < dayjs(b.createdAt).unix()) {
            return 1;
        }

        if (dayjs(a.createdAt).unix() > dayjs(b.createdAt).unix()) {
            return -1;
        }

        return 0;
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(resetNotificationCountAction(user.id));
        }, 3000)
    }, []);

    return (
        <div className="notification-page">
            <Helmet>
                <title>Уведомления</title>
            </Helmet>
            <h1 className="notification-page__title">Уведомления</h1>
            {notificationSorted.slice(0, user.notificationsCount).map(notification => <Notification notification={notification} newItem={true} key={notification.createdAt} />)}
            {notificationSorted.slice(user.notificationsCount).map(notification => <Notification notification={notification} key={notification.createdAt} />)}
            <BottomMenu/>
        </div>
    );
}

export default NotificationPage;