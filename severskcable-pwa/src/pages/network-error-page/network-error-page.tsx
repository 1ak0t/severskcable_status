import {useAppDispatch} from "../../hooks";
import {fetchAllData} from "../../store/api-actions";

function NetworkErrorPage() {
    const dispatch = useAppDispatch();

    return(
        <section>
            <span>Уппс...</span>
            <span>Похоже неполадки с интернетом</span>
            <button onClick={() => dispatch(fetchAllData())}>Попробовать еще</button>
        </section>
    );
}

export default NetworkErrorPage;