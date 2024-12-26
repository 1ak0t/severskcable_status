import {fetchImage, updateSupplyAction} from "../../store/api-actions";
import {SyncLoader} from "react-spinners";
import classNames from "classnames";
import {SupplyOrdersType, SupplyStatus} from "../../types/initialState.type";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getPhotoDownloadingStatus} from "../../store/data-process/selectors";
import dayjs from "dayjs";

type SupplyOrderPropsType = {
    supply: SupplyOrdersType;
}

function SupplyOrder({supply}: SupplyOrderPropsType) {
    const photoDownloadingStatus = useAppSelector(getPhotoDownloadingStatus);
    const [isPhotoGet, setIsPhotoGet] = useState(false);
    const [supplyImageURL, setSupplyImageURL] = useState<string>();
    const [supplyImageVisible, setSupplyImageVisible] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const setPaymentSupplyOrder = (supply: SupplyOrdersType) => {
        dispatch(updateSupplyAction({id: supply.id, supplyStatus: SupplyStatus.Payment, paymentDate: dayjs().toString()}));
    }

    const setDeliverySupplyOrder = (supply: SupplyOrdersType) => {
        dispatch(updateSupplyAction({id: supply.id, supplyStatus: SupplyStatus.Delivery, deliveryDate: dayjs().toString()}));
    }

    const setInStockSupplyOrder = (supply: SupplyOrdersType) => {
        dispatch(updateSupplyAction({id: supply.id, supplyStatus: SupplyStatus.InStock, inStockDate: dayjs().toString()}));
    }

    return (
        <div className="supply-element__stage">
            <h3 className='supply-element__stage-title'>{supply.supplyTitle}</h3>
            <span>{supply.supplyDescription}</span>
            {supply.supplyImage && !photoDownloadingStatus &&
                <span className="supply-element__photo-button" onClick={() => {
                    setIsPhotoGet(true);
                    dispatch(fetchImage({
                        imageName: supply.supplyImage,
                        setImg: setSupplyImageURL,
                        imgURL: supplyImageURL,
                        setImgVisible: setSupplyImageVisible,
                        imgVisible: supplyImageVisible
                    }));
                }
                }>{supplyImageVisible ? 'Скрыть фото' : 'Показать фото'}</span>
            }
            {isPhotoGet && photoDownloadingStatus && !supplyImageURL &&
                <SyncLoader
                    color={"#EA753EFF"}
                    size={5}
                    margin={3}
                />
            }
            {supplyImageURL && supplyImageVisible && supply.supplyImage &&
                <div className="repair-element__row">
                    <img src={supplyImageURL} alt=""/>
                </div>
            }
            <span
                className={classNames(
                    'supply-element__stage-status',
                    {'supply-element__stage-status--not-start': supply.supplyStatus === SupplyStatus.New},
                    {'supply-element__stage-status--in-progress': ((supply.supplyStatus === SupplyStatus.Payment) || (supply.supplyStatus === SupplyStatus.Delivery) || (supply.supplyStatus === SupplyStatus.Accepted))},
                    {'supply-element__stage-status--completed': supply.supplyStatus === SupplyStatus.InStock}
                )}>{supply.supplyStatus}</span>
            <div className={classNames(
                "supply-element__buttons",
                {"supply-element__buttons--inactive": supply.supplyStatus === SupplyStatus.InStock},
            )}>
                <button
                    disabled={!(supply.supplyStatus === SupplyStatus.Accepted)}
                    className={classNames(
                        "supply-element__button",
                        {"supply-element__button--success": ((supply.supplyStatus === SupplyStatus.Payment) || (supply.supplyStatus === SupplyStatus.Delivery) || (supply.supplyStatus === SupplyStatus.InStock))}
                    )}
                    onClick={() => setPaymentSupplyOrder(supply)}
                >Передано в оплату
                </button>
                <button
                    disabled={!(supply.supplyStatus === SupplyStatus.Payment)}
                    className={classNames(
                        "supply-element__button",
                        {"supply-element__button--success": ((supply.supplyStatus === SupplyStatus.Delivery) || (supply.supplyStatus === SupplyStatus.InStock))}
                    )}
                    onClick={() => setDeliverySupplyOrder(supply)}
                >Доставляется
                </button>
                <button
                    disabled={!(supply.supplyStatus === SupplyStatus.Delivery)}
                    className={classNames(
                        "supply-element__button",
                        {"supply-element__button--success": supply.supplyStatus === SupplyStatus.InStock}
                    )}
                    onClick={() => setInStockSupplyOrder(supply)}
                >На складе
                </button>
            </div>
        </div>
    );
}

export default SupplyOrder;