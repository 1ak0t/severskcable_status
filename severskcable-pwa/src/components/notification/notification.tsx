import {NotificationType} from "../../types/initialState.type";
import dayjs from "dayjs";
import {logoutAction} from "../../store/api-actions";
import React, {Fragment} from "react";
import {FcBookmark} from "react-icons/fc";

type NotificationPropsType = {
    notification: NotificationType;
    newItem?: boolean;
}
function Notification({notification, newItem}: NotificationPropsType) {

    const getNewString = (string: string) => {
        const newStringBreakIndex = string.match(/Нов/)?.index;
        const newStringUpdateBreakIndex = string.match(/При/)?.index;

        if (newStringBreakIndex) {
            return `${string.slice(0,newStringBreakIndex)}\n${string.slice(newStringBreakIndex)}`
                .split(/\n/).map(line => <Fragment><span>{line}</span></Fragment>);
        }

        if (newStringUpdateBreakIndex) {
            return `${string.slice(0,newStringUpdateBreakIndex)}\n${string.slice(newStringUpdateBreakIndex)}`
                .split(/\n/).map(line => <Fragment><span>{line}</span></Fragment>);
        }

        return string;
    }

    return(
        <div className="notification">
            <h2 className="notification__title">{notification.title}</h2>
            {getNewString(notification.text)}
            <span className="notification__time">{dayjs(notification.createdAt).format("DD.MM.YYYY HH:mm").toString()}</span>
            {newItem && <FcBookmark className="notification__new"></FcBookmark>}
        </div>
    );
}

export default Notification;