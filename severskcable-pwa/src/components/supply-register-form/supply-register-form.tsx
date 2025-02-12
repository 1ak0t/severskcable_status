import {Break, SupplyStatus} from "../../types/initialState.type";
import {BsXLg} from "react-icons/bs";
import React, {useRef, useState} from "react";
import {handleImageUpload} from "../../helpers/helpers";
import SupplyFormElement from "../supply-form-element/supply-form-element";
import {useAppDispatch} from "../../hooks";
import {createNewSuppliesAction, updateSupplyAction} from "../../store/api-actions";
import dayjs from "dayjs";

type SupplyRegisterFormPropsType = {
    repair: Break,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type supplyOrderType = {
    id: number,
    name: string,
    description: string,
    img?: File
}

function SupplyRegisterForm ({repair, setIsOpen}: SupplyRegisterFormPropsType) {
    const [currentSupplyImage, setCurrentSupplyImage] = useState<File>();
    const [currentSupplyDescription, setCurrentSupplyDescription] = useState<string>('');
    const [currentSupplyName, setCurrentSupplyName] = useState<string>('');
    const [supplyOrders, setSupplyOrders] = useState<supplyOrderType[]>([]);
    const [isAddNewOrder, setIsAddNewOrder] = useState<boolean>(true);
    const [emptyError, setEmptyError] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const addOrder = () => {
        if ((currentSupplyDescription !== '') && (currentSupplyName !== '')) {
            setEmptyError(false);
            setSupplyOrders(supplyOrders.concat({
                id: supplyOrders.length + 1,
                name: currentSupplyName,
                description: currentSupplyDescription,
                img: currentSupplyImage
            }));
            setCurrentSupplyImage(undefined);
            setCurrentSupplyDescription('');
            setCurrentSupplyName('');
            if (nameRef.current && descriptionRef.current) {
                nameRef.current.value = '';
                descriptionRef.current.value = '';
            }
            setIsAddNewOrder(false);
        } else {
            setEmptyError(true);
        }
    }

    const sendSupplyOrders = () => {
        if (supplyOrders.length > 0) {
            supplyOrders.map(order => {
                dispatch(createNewSuppliesAction({
                    break: repair,
                    supplyTitle: order.name,
                    supplyDescription: order.description,
                    supplyStatus: SupplyStatus.New,
                    supplyImage: order.img,
                    registerDate: dayjs().toString()
                }));
            })
        }
    }

    return(
        <section className='supply-register-form'>
            <BsXLg color={"565656"} size={"20"} className="supply-register-form__close"
                   onClick={() => setIsOpen(false)}/>
            <h1 className='supply-register-form__title'>Запросить снабжение</h1>
            <span><b>Оборудование:</b> <br/>{repair.machine.name}</span>
            <span><b>Поломка:</b> <br/>{repair.breakName}</span>
            {supplyOrders.map(order => <SupplyFormElement id={order.id} description={order.description} img={order.img}
                                                          name={order.name} key={order.id}/>)}
            {isAddNewOrder &&
                <article className="supply-register-form__new">
                    {emptyError && <span className="supply-register-form__error">Нужно заполнить название и описание</span>}
                    <div>
                        <span>{supplyOrders.length + 1}. </span>
                        <input className="supply-register-form__new-name" ref={nameRef} type="text" placeholder="Название"
                               onChange={(event) => setCurrentSupplyName(event.target.value)}></input>
                    </div>
                    <textarea className="supply-register-form__new-description" ref={descriptionRef} name="" id="" cols={30} rows={3}
                              onChange={(event) => setCurrentSupplyDescription(event.target.value)}
                              placeholder={'Описание'}></textarea>
                    <label className="supply-register-form__photo-input">
                        <span>{currentSupplyImage ? "Изменить фото" : "Прикрепить фото"}</span>
                        <input type="file" accept="image/png, image/jpeg"
                               onChange={(evt) => handleImageUpload(evt, setCurrentSupplyImage)}/>
                    </label>
                    {currentSupplyImage && <img src={URL.createObjectURL(currentSupplyImage)} alt=""/>}
                    <button className="supply-register-form__save-button" onClick={() => addOrder()}>Сохранить</button>
                </article>}
            <button className="supply-register-form__add-button" onClick={() => setIsAddNewOrder(true)}>+ Добавить</button>
            <button className="supply-register-form__send-button" onClick={() => sendSupplyOrders()}>Отправить запрос</button>
        </section>
    );
}

export default SupplyRegisterForm;