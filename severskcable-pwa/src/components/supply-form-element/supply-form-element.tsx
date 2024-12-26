import {supplyOrderType} from "../supply-register-form/supply-register-form";
import React from "react";

function SupplyFormElement({id, img, description, name}: supplyOrderType) {
    return (
        <article className="supply-row">
            <span className="supply-row__title">{id}. {name}</span>
            <p className="supply-row__description">{description}</p>
            {img && <img className="supply-row__img" src={URL.createObjectURL(img)} alt=""/>}
        </article>
    );
}

export default SupplyFormElement;